import { NextResponse } from "next/server";
import { getOrderByTransactionId } from "@/lib/db";
import { getClientIp, checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  try {
    const ip = getClientIp(request);

    // Rate limit: 20 lookup attempts per 10 minutes per IP
    const rateCheck = await checkRateLimit("order-lookup", ip, {
      limit: 20,
      windowSeconds: 600,
    });

    if (!rateCheck.success) {
      return NextResponse.json(
        {
          error: `Too many lookup requests. Please wait ${rateCheck.resetInSeconds} seconds before trying again.`,
        },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateCheck.resetInSeconds),
          },
        },
      );
    }

    const { searchParams } = new URL(request.url);
    const txn = searchParams.get("txn");

    if (!txn) {
      return NextResponse.json(
        { error: "Missing required parameter: txn" },
        { status: 400 },
      );
    }

    const order = await getOrderByTransactionId(txn);

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      order: {
        id: order.id,
        reading: order.reading_slug,
        readingName: order.reading_name,
        price: order.amount,
        name: order.customer_name,
        email: order.customer_email,
        question: order.client_question,
        preferredFormat: order.preferred_format,
        deliveryTime: order.delivery_time,
        schedule: order.scheduled_date
          ? {
              formattedDate: order.scheduled_date,
              formattedTime: order.scheduled_time || "",
            }
          : undefined,
        paymentDate: order.created_at,
        status: order.status,
        paymentMethod: "paypal",
        transactionId: txn,
      },
    });
  } catch (error) {
    console.error("Order lookup error:", error);
    return NextResponse.json(
      { error: "Failed to look up order" },
      { status: 500 },
    );
  }
}
