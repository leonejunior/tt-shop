import { NextResponse } from "next/server";

/**
 * Direct unverified calls to /api/payment-success are rejected.
 * All payments must be captured and verified server-side via /api/paypal/capture-order.
 */
export async function POST() {
  return NextResponse.json(
    {
      error:
        "Direct submission to this endpoint is disabled for security. Payments must be verified via /api/paypal/capture-order.",
    },
    { status: 403 },
  );
}
