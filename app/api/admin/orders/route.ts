import { NextResponse } from "next/server";
import { getPendingOrders } from "@/lib/db";
import { getClientIp, checkRateLimit, constantTimeEqual } from "@/lib/rate-limit";

function isAuthorized(request: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const authHeader = request.headers.get("Authorization") || "";
  return constantTimeEqual(authHeader, `Bearer ${secret}`);
}

/**
 * GET /api/admin/orders
 * Returns all pending/in-progress orders awaiting fulfillment.
 * Protected by ADMIN_SECRET bearer token and IP rate limiting.
 */
export async function GET(request: Request): Promise<NextResponse> {
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
    const orders = await getPendingOrders();
    return NextResponse.json({ orders });
  } catch (error) {
    console.error("admin/orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
