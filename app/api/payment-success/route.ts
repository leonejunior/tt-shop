import { NextResponse } from "next/server";
import {
  sendEmail,
  generateCustomerEmailHTML,
  generateAdminEmailHTML,
} from "@/lib/email";

interface BookingDetails {
  reading: string;
  readingName: string;
  price: number;
  name: string;
  email: string;
  question: string;
  preferredFormat: string;
  deliveryTime: string;
  schedule?: {
    date: string;
    time: string;
    formattedDate: string;
    formattedTime: string;
  };
  transactionId?: string;
}

export async function POST(request: Request) {
  try {
    const { transactionId, bookingDetails } = await request.json();

    const {
      readingName,
      price,
      name,
      email,
      question,
      preferredFormat,
      deliveryTime,
      schedule,
    } = bookingDetails;

    const emailData = {
      readingName,
      price,
      name,
      email,
      question,
      preferredFormat,
      deliveryTime,
      schedule,
      transactionId,
    };

    const customerHtml = generateCustomerEmailHTML(emailData);
    await sendEmail({
      to: email,
      subject: `Your ${readingName} is Confirmed! ✨`,
      html: customerHtml,
    });

    const adminHtml = generateAdminEmailHTML(emailData);
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "your-email@gmail.com",
      subject: `🔮 New Booking: ${readingName} from ${name}`,
      html: adminHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send confirmation email" },
      { status: 500 },
    );
  }
}
