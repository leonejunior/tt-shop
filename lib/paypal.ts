import { READINGS_CATALOG, isValidReadingSlug, ReadingSlug } from "./readings";

interface PayPalTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

interface PayPalOrderResponse {
  id: string;
  status: string;
  links?: { href: string; rel: string; method: string }[];
}

interface PayPalCaptureResponse {
  id: string;
  status: string;
  purchase_units?: {
    reference_id?: string;
    payments?: {
      captures?: {
        id: string;
        status: string;
        amount: {
          value: string;
          currency_code: string;
        };
      }[];
    };
  }[];
}

function getPayPalBaseUrl(): string {
  return process.env.PAYPAL_MODE === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";
}

/**
 * Retrieve OAuth2 access token from PayPal API
 */
export async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal API credentials are not configured on the server.");
  }

  const baseUrl = getPayPalBaseUrl();
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("PayPal token error:", errorText);
    throw new Error(`Failed to authenticate with PayPal: ${response.status}`);
  }

  const data = (await response.json()) as PayPalTokenResponse;
  return data.access_token;
}

/**
 * Create a PayPal order with the server-enforced price from READINGS_CATALOG
 */
export async function createPayPalOrder(readingSlug: string): Promise<string> {
  if (!isValidReadingSlug(readingSlug)) {
    throw new Error(`Invalid reading package selected: "${readingSlug}"`);
  }

  const reading = READINGS_CATALOG[readingSlug];
  const accessToken = await getPayPalAccessToken();
  const baseUrl = getPayPalBaseUrl();

  const orderPayload = {
    intent: "CAPTURE",
    purchase_units: [
      {
        reference_id: reading.slug,
        description: `Karma's Apothecary - ${reading.name}`,
        custom_id: reading.slug,
        amount: {
          currency_code: "USD",
          value: reading.price.toFixed(2),
        },
      },
    ],
  };

  const response = await fetch(`${baseUrl}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(orderPayload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("PayPal create order error:", errorText);
    throw new Error(`PayPal order creation failed: ${response.status}`);
  }

  const order = (await response.json()) as PayPalOrderResponse;
  return order.id;
}

/**
 * Capture an approved PayPal order and verify that the captured amount matches catalog price
 */
export async function captureAndVerifyPayPalOrder(
  orderId: string,
  readingSlug: string,
): Promise<{
  success: boolean;
  transactionId: string;
  orderId: string;
  amount: number;
  currency: string;
}> {
  if (!isValidReadingSlug(readingSlug)) {
    throw new Error(`Invalid reading package: "${readingSlug}"`);
  }

  const expectedReading = READINGS_CATALOG[readingSlug];
  const accessToken = await getPayPalAccessToken();
  const baseUrl = getPayPalBaseUrl();

  const response = await fetch(`${baseUrl}/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("PayPal capture error:", errorText);
    throw new Error(`PayPal payment capture failed: ${response.statusText}`);
  }

  const captureData = (await response.json()) as PayPalCaptureResponse;

  if (captureData.status !== "COMPLETED") {
    throw new Error(
      `Payment status is "${captureData.status}", expected "COMPLETED"`,
    );
  }

  const capture = captureData.purchase_units?.[0]?.payments?.captures?.[0];
  if (!capture || capture.status !== "COMPLETED") {
    throw new Error("No successful payment capture found in PayPal response");
  }

  const capturedAmount = parseFloat(capture.amount.value);
  const expectedAmount = expectedReading.price;

  // Strict verification: price must match the official server catalog
  if (Math.abs(capturedAmount - expectedAmount) > 0.01) {
    console.error(
      `Price mismatch! Captured: ${capturedAmount}, Expected: ${expectedAmount}`,
    );
    throw new Error(
      `Security violation: Captured amount ($${capturedAmount}) does not match catalog price ($${expectedAmount})`,
    );
  }

  if (capture.amount.currency_code !== "USD") {
    throw new Error(
      `Security violation: Currency "${capture.amount.currency_code}" is not supported (USD required)`,
    );
  }

  return {
    success: true,
    transactionId: capture.id,
    orderId: captureData.id,
    amount: capturedAmount,
    currency: capture.amount.currency_code,
  };
}
