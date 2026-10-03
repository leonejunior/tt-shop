import { NextResponse } from "next/server";
import {
  sendEmail,
  generateVIPSummaryHTML,
} from "@/lib/email";
import {
  getOrderById,
  updateOrderStatus,
  logEmailAudit,
} from "@/lib/db";

function isAuthorized(request: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const authHeader = request.headers.get("Authorization") || "";
  return authHeader === `Bearer ${secret}`;
}

/**
 * POST /api/admin/send-vip-summary
 * Body: { orderId, summaryText, keyThemes? }
 *
 * Sends the post-call written summary to the VIP client and marks the order fulfilled.
 * Protected by ADMIN_SECRET bearer token.
 */
export async function POST(request: Request): Promise<NextResponse> {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      orderId?: string;
      summaryText?: string;
      keyThemes?: string[];
    };

    const { orderId, summaryText, keyThemes } = body;

    if (!orderId || !summaryText?.trim()) {
      return NextResponse.json(
        { error: "orderId and summaryText are required" },
        { status: 400 },
      );
    }

    const order = await getOrderById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Mark order as fulfilled
    await updateOrderStatus({ orderId, status: "fulfilled" });

    const subject = `Your VIP Session Summary ✨`;
    const html = generateVIPSummaryHTML({
      clientName: order.customer_name,
      summaryText: summaryText.trim(),
      keyThemes,
    });

    try {
      await sendEmail({ to: order.customer_email, subject, html });
      await logEmailAudit({
        orderId,
        recipient: order.customer_email,
        type: "vip_summary",
        subject,
        status: "sent",
      });
    } catch (emailErr) {
      await logEmailAudit({
        orderId,
        recipient: order.customer_email,
        type: "vip_summary",
        subject,
        status: "failed",
        errorMessage: emailErr instanceof Error ? emailErr.message : "Unknown error",
      });
      return NextResponse.json(
        { error: "Order marked fulfilled but summary email failed. Check email logs." },
        { status: 207 },
      );
    }

    return NextResponse.json({
      success: true,
      message: `VIP summary sent to ${order.customer_email} and order ${orderId} marked fulfilled.`,
    });
  } catch (error) {
    console.error("send-vip-summary error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
