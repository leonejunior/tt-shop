import { NextResponse } from "next/server";
import { captureAndVerifyPayPalOrder } from "@/lib/paypal";
import {
  sendEmail,
  generateCustomerEmailHTML,
  generateAdminEmailHTML,
} from "@/lib/email";
import { READINGS_CATALOG, isValidReadingSlug } from "@/lib/readings";
import { storeConfirmedOrder, logEmailAudit } from "@/lib/db";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  try {
    const ip = getClientIp(request);

    // Rate limit: 10 capture attempts per 10 minutes per IP
    const rateCheck = await checkRateLimit("paypal-capture", ip, {
      limit: 10,
      windowSeconds: 600,
    });

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: `Too many payment capture attempts. Please wait ${rateCheck.resetInSeconds} seconds before trying again.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.resetInSeconds),
          },
        },
      );
    }

    const { orderId, readingSlug, bookingDetails } = (await request.json()) as {
      orderId?: string;
      readingSlug?: string;
      bookingDetails?: any;
    };

    if (!orderId || !readingSlug || !bookingDetails) {
      return NextResponse.json(
        {
          error:
            "Missing required payment details (orderId, readingSlug, or bookingDetails)",
        },
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

    // 1. Capture & cryptographically verify against PayPal API
    const captureResult = await captureAndVerifyPayPalOrder(
      orderId,
      readingSlug,
    );

    const clientName = (bookingDetails.name || "").trim() || "Valued Client";
    const clientEmail = (bookingDetails.email || "").trim();
    const clientQuestion = (bookingDetails.question || "").trim();

    // 2. Persist to Cloudflare D1 Database (Customer, Order, Payment records)
    let savedOrderInfo: { orderId: string; customerId: string } | null = null;
    try {
      savedOrderInfo = await storeConfirmedOrder({
        email: clientEmail,
        name: clientName,
        readingSlug: catalogItem.slug,
        readingName: catalogItem.name,
        amount: captureResult.amount,
        currency: captureResult.currency,
        preferredFormat: bookingDetails.preferredFormat,
        question: clientQuestion,
        deliveryTime: catalogItem.deliveryTime,
        scheduledDate: bookingDetails.schedule?.date || bookingDetails.schedule?.formattedDate,
        scheduledTime: bookingDetails.schedule?.time || bookingDetails.schedule?.formattedTime,
        providerOrderId: orderId,
        providerCaptureId: captureResult.transactionId,
        rawDetails: JSON.stringify(captureResult),
      });
    } catch (dbErr) {
      console.error("D1 database storage error (proceeding to notify):", dbErr);
    }

    // 3. Prepare strictly verified email payload
    const emailData = {
      readingName: catalogItem.name,
      price: catalogItem.price,
      name: clientName,
      email: clientEmail,
      question: clientQuestion,
      preferredFormat: bookingDetails.preferredFormat,
      deliveryTime: catalogItem.deliveryTime,
      schedule: bookingDetails.schedule,
      transactionId: captureResult.transactionId,
    };

    // 4. Send customer confirmation email & log to DB
    if (emailData.email) {
      const customerSubject = `Your ${catalogItem.name} is Confirmed! ✨`;
      try {
        const customerHtml = generateCustomerEmailHTML(emailData);
        await sendEmail({
          to: emailData.email,
          subject: customerSubject,
          html: customerHtml,
        });

        await logEmailAudit({
          orderId: savedOrderInfo?.orderId,
          recipient: emailData.email,
          type: "customer_confirmation",
          subject: customerSubject,
          status: "sent",
        });
      } catch (emailErr) {
        console.error("Failed to send customer confirmation email:", emailErr);
        await logEmailAudit({
          orderId: savedOrderInfo?.orderId,
          recipient: emailData.email,
          type: "customer_confirmation",
          subject: customerSubject,
          status: "failed",
          errorMessage: emailErr instanceof Error ? emailErr.message : "Unknown error",
        });
      }
    }

    // 5. Send admin notification email & log to DB
    const adminEmail = process.env.ADMIN_EMAIL || "1sierra.duck@gmail.com";
    const adminSubject = `🔮 New Booking: ${catalogItem.name} from ${emailData.name}`;
    try {
      const adminHtml = generateAdminEmailHTML(emailData);
      await sendEmail({
        to: adminEmail,
        subject: adminSubject,
        html: adminHtml,
      });

      await logEmailAudit({
        orderId: savedOrderInfo?.orderId,
        recipient: adminEmail,
        type: "admin_notification",
        subject: adminSubject,
        status: "sent",
      });
    } catch (adminEmailErr) {
      console.error("Failed to send admin notification email:", adminEmailErr);
      await logEmailAudit({
        orderId: savedOrderInfo?.orderId,
        recipient: adminEmail,
        type: "admin_notification",
        subject: adminSubject,
        status: "failed",
        errorMessage: adminEmailErr instanceof Error ? adminEmailErr.message : "Unknown error",
      });
    }

    return NextResponse.json({
      success: true,
      transactionId: captureResult.transactionId,
      orderId: savedOrderInfo?.orderId,
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
