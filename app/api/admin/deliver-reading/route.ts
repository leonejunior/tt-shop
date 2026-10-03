import { NextResponse } from "next/server";
import {
  sendEmail,
  generateReadingDeliveryHTML,
} from "@/lib/email";
import {
  getOrderById,
  updateOrderStatus,
  logEmailAudit,
} from "@/lib/db";
import { getClientIp, checkRateLimit, constantTimeEqual } from "@/lib/rate-limit";

/** Validate the admin secret from the Authorization header */
function isAuthorized(request: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const authHeader = request.headers.get("Authorization") || "";
  return constantTimeEqual(authHeader, `Bearer ${secret}`);
}

/**
 * POST /api/admin/deliver-reading
 * Body: { orderId, deliveryUrl, readerNotes?, isVoiceNote? }
 *
 * Marks the order as fulfilled in D1 and sends the client their delivery email.
 * Protected by ADMIN_SECRET bearer token.
 */
export async function POST(request: Request): Promise<NextResponse> {
  const ip = getClientIp(request);
  const rateCheck = await checkRateLimit("admin-auth", ip, {
    limit: 15,
    windowSeconds: 300,
  });

  if (!rateCheck.success) {
    return NextResponse.json(
      { error: "Too many authentication attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rateCheck.resetInSeconds) } },
    );
  }

  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      orderId?: string;
      deliveryUrl?: string;
      readerNotes?: string;
      isVoiceNote?: boolean;
    };

    const { orderId, deliveryUrl, readerNotes, isVoiceNote } = body;

    if (!orderId) {
      return NextResponse.json({ error: "orderId is required" }, { status: 400 });
    }

    // Validate delivery URL if provided
    if (deliveryUrl && !/^https?:\/\//i.test(deliveryUrl.trim())) {
      return NextResponse.json(
        { error: "Delivery URL must be a valid HTTP or HTTPS web address." },
        { status: 400 },
      );
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "fulfilled") {
      return NextResponse.json(
        { error: "Order is already marked as fulfilled" },
        { status: 409 },
      );
    }

    // Mark as fulfilled in D1
    await updateOrderStatus({
      orderId,
      status: "fulfilled",
      fulfillmentUrl: deliveryUrl,
      readerNotes,
    });

    // Send delivery email to client
    const subject = `Your ${order.reading_name} is Ready! 🎴`;
    const html = generateReadingDeliveryHTML({
      clientName: order.customer_name,
      readingName: order.reading_name,
      deliveryUrl,
      readerNotes,
      isVoiceNote: isVoiceNote ?? true,
    });

    try {
      await sendEmail({ to: order.customer_email, subject, html });
      await logEmailAudit({
        orderId,
        recipient: order.customer_email,
        type: "reading_delivery",
        subject,
        status: "sent",
      });
    } catch (emailErr) {
      await logEmailAudit({
        orderId,
        recipient: order.customer_email,
        type: "reading_delivery",
        subject,
        status: "failed",
        errorMessage: emailErr instanceof Error ? emailErr.message : "Unknown error",
      });
      return NextResponse.json(
        { error: "Order marked fulfilled but delivery email failed. Check email logs." },
        { status: 207 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `Reading delivered and order ${orderId} marked as fulfilled.`,
    });
  } catch (error) {
    console.error("deliver-reading error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
