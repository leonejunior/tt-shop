import { NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypal";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    // Rate limit: 10 order initialization attempts per 10 minutes per IP
    const rateCheck = await checkRateLimit("paypal-create", ip, {
      limit: 10,
      windowSeconds: 600,
    });

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: `Too many payment requests. Please wait ${rateCheck.resetInSeconds} seconds before trying again.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.resetInSeconds),
          },
        },
      );
    }

    const body = (await request.json()) as { readingSlug?: string };
    const { readingSlug } = body;

    if (!readingSlug) {
      return NextResponse.json(
        { error: "Missing required parameter: readingSlug" },
        { status: 400 },
      );
    }

    const orderId = await createPayPalOrder(readingSlug);
    return NextResponse.json({ orderId });
  } catch (error) {
    console.error("Create PayPal order error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
