import { NextResponse } from "next/server";
import { createPayPalOrder } from "@/lib/paypal";

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
