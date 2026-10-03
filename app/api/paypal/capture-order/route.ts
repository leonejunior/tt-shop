import { NextResponse } from "next/server";
import { captureAndVerifyPayPalOrder } from "@/lib/paypal";
import {
  sendEmail,
  generateCustomerEmailHTML,
  generateAdminEmailHTML,
} from "@/lib/email";
import { READINGS_CATALOG, isValidReadingSlug } from "@/lib/readings";

export async function POST(request: Request) {
  try {
    const { orderId, readingSlug, bookingDetails } = await request.json();

    if (!orderId || !readingSlug || !bookingDetails) {
      return NextResponse.json(
        { error: "Missing required payment details (orderId, readingSlug, or bookingDetails)" },
        { status: 400 },
      );
    }

    if (!isValidReadingSlug(readingSlug)) {
      return NextResponse.json(
        { error: `Invalid reading slug: "${readingSlug}"` },
        { status: 400 },
      );
    }

    const catalogItem = READINGS_CATALOG[readingSlug];

    // Capture & cryptographically verify against PayPal API
    const captureResult = await captureAndVerifyPayPalOrder(
      orderId,
      readingSlug,
    );

    // Prepare strictly verified email payload using server prices & PayPal capture ID
    const emailData = {
      readingName: catalogItem.name,
      price: catalogItem.price,
      name: (bookingDetails.name || "").trim() || "Valued Client",
      email: (bookingDetails.email || "").trim(),
      question: (bookingDetails.question || "").trim(),
      preferredFormat: bookingDetails.preferredFormat,
      deliveryTime: catalogItem.deliveryTime,
      schedule: bookingDetails.schedule,
      transactionId: captureResult.transactionId,
    };

    // Send customer confirmation email
    if (emailData.email) {
      try {
        const customerHtml = generateCustomerEmailHTML(emailData);
        await sendEmail({
          to: emailData.email,
          subject: `Your ${catalogItem.name} is Confirmed! ✨`,
          html: customerHtml,
        });
      } catch (emailErr) {
        console.error("Failed to send customer confirmation email:", emailErr);
      }
    }

    // Send admin notification
    try {
      const adminHtml = generateAdminEmailHTML(emailData);
      await sendEmail({
        to: process.env.ADMIN_EMAIL || "1sierra.duck@gmail.com",
        subject: `🔮 New Booking: ${catalogItem.name} from ${emailData.name}`,
        html: adminHtml,
      });
    } catch (adminEmailErr) {
      console.error("Failed to send admin notification email:", adminEmailErr);
    }

    return NextResponse.json({
      success: true,
      transactionId: captureResult.transactionId,
      amount: captureResult.amount,
      reading: catalogItem.name,
    });
  } catch (error) {
    console.error("Capture PayPal order error:", error);
    const message =
      error instanceof Error ? error.message : "Payment capture failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
