import { NextResponse } from "next/server";
import { getPendingOrders } from "@/lib/db";

function isAuthorized(request: Request): boolean {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) return false;
  const authHeader = request.headers.get("Authorization") || "";
  return authHeader === `Bearer ${secret}`;
}

/**
 * GET /api/admin/orders
 * Returns all pending/in-progress orders awaiting fulfillment.
 * Protected by ADMIN_SECRET bearer token.
 */
export async function GET(request: Request): Promise<NextResponse> {
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
