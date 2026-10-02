import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Generate HTML email template for admin contact form
function generateContactEmailHTML(formData: ContactFormData): string {
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Contact Form Submission</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a2e;
      background-color: #faf9f8;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .card {
      background: #ffffff;
      border-radius: 24px;
      border: 1px solid #e5e7eb;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #5e3a6b 0%, #4b3b6e 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .header p {
      color: rgba(255, 255, 255, 0.9);
      margin: 8px 0 0;
      font-size: 16px;
    }
    .content {
      padding: 32px 24px;
    }
    .details {
      background: #f9f5ff;
      border-left: 4px solid #5e3a6b;
      padding: 20px;
      border-radius: 12px;
      margin: 24px 0;
    }
    .details-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 12px;
      font-size: 14px;
    }
    .details-label {
      font-weight: 500;
      color: #374151;
    }
    .details-value {
      color: #4b5563;
      text-align: right;
      max-width: 60%;
      word-break: break-word;
    }
    .message-box {
      background: white;
      padding: 16px;
      border-radius: 8px;
      margin-top: 12px;
      border-left: 3px solid #5e3a6b;
    }
    .message-box p {
      margin: 8px 0;
      color: #4b5563;
    }
    .footer {
      padding: 24px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #9ca3af;
    }
    @media (max-width: 480px) {
      .details-row {
        flex-direction: column;
        gap: 4px;
      }
      .details-value {
        text-align: left;
        max-width: 100%;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <h1>📬 New Contact Form Submission</h1>
        <p>${new Date().toLocaleString()}</p>
      </div>
      
      <div class="content">
        <div class="details">
          <div class="details-row">
            <span class="details-label">👤 Name:</span>
            <span class="details-value">${formData.name}</span>
          </div>
          <div class="details-row">
            <span class="details-label">📧 Email:</span>
            <span class="details-value">${formData.email}</span>
          </div>
          <div class="details-row">
            <span class="details-label">📅 Submitted:</span>
            <span class="details-value">${new Date().toLocaleString()}</span>
          </div>
        </div>
        
        <div class="message-box">
          <strong>💬 Message:</strong>
          <p>${formData.message.replace(/\n/g, "<br>")}</p>
        </div>
        
        <div style="text-align: center; margin-top: 32px;">
          <p style="color: #6b7280; font-size: 14px;">
            Reply directly to this email to respond to ${formData.name}.
          </p>
        </div>
      </div>
      
      <div class="footer">
        <p>© ${currentYear} Karma's Apothecary</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

// Generate auto-reply email for customer
function generateAutoReplyHTML(name: string): string {
  const currentYear = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Contacting Me</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a2e;
      background-color: #faf9f8;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    .card {
      background: #ffffff;
      border-radius: 24px;
      border: 1px solid #e5e7eb;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
    }
    .header {
      background: linear-gradient(135deg, #5e3a6b 0%, #4b3b6e 100%);
      padding: 32px 24px;
      text-align: center;
    }
    .header h1 {
      color: #ffffff;
      margin: 0;
      font-size: 28px;
      font-weight: 600;
    }
    .content {
      padding: 32px 24px;
    }
    .message {
      color: #4b5563;
      margin-bottom: 24px;
    }
    .footer {
      padding: 24px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
      font-size: 12px;
      color: #9ca3af;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="header">
        <h1>✨ Thank You for Reaching Out! ✨</h1>
      </div>
      
      <div class="content">
        <div class="message">
          <p>Hi ${name},</p>
          <p>Thank you for contacting me. I've received your message and will get back to you within 24-48 hours.</p>
          <p>If your matter is urgent, please feel free to DM me on Instagram or TikTok for a faster response.</p>
          <p>I look forward to connecting with you soon!</p>
          <p style="margin-top: 24px;">
            With love,<br>
            Karma ✨
          </p>
        </div>
      </div>
      
      <div class="footer">
        <p>© ${currentYear} Karma's Apothecary</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

export async function POST(request: Request) {
  try {
    const { name, email, message } = await request.json();

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const formData = { name, email, message };

    // Send email to admin
    const adminHtml = generateContactEmailHTML(formData);
    await sendEmail({
      to: process.env.ADMIN_EMAIL || "your-email@gmail.com",
      subject: `📬 New Contact Form Message from ${name}`,
      html: adminHtml,
    });

    // Send auto-reply to customer
    const autoReplyHtml = generateAutoReplyHTML(name);
    await sendEmail({
      to: email,
      subject: "Thank You for Contacting Karma's Apothecary ✨",
      html: autoReplyHtml,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form email sending error:", error);
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 },
    );
  }
}
