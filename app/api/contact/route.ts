import { NextResponse } from "next/server";
import { sendEmail, escapeHtml } from "@/lib/email";
import { storeContactSubmission, logEmailAudit } from "@/lib/db";

interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

// Generate HTML email template for admin contact form
function generateContactEmailHTML(formData: ContactFormData): string {
  const currentYear = new Date().getFullYear();
  const safeName = escapeHtml(formData.name);
  const safeEmail = escapeHtml(formData.email);
  const safeMessage = escapeHtml(formData.message);

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
            <span class="details-value">${safeName}</span>
          </div>
          <div class="details-row">
            <span class="details-label">📧 Email:</span>
            <span class="details-value">${safeEmail}</span>
          </div>
          <div class="details-row">
            <span class="details-label">📅 Submitted:</span>
            <span class="details-value">${new Date().toLocaleString()}</span>
          </div>
        </div>
        
        <div class="message-box">
          <strong>💬 Message:</strong>
          <p style="white-space: pre-wrap;">${safeMessage}</p>
        </div>
        
        <div style="margin-top: 24px; text-align: center;">
          <a href="mailto:${encodeURIComponent(formData.email)}?subject=Re:%20Your%20message%20to%20Karma's%20Apothecary" 
             style="display: inline-block; background: #5e3a6b; color: white; padding: 10px 20px; border-radius: 9999px; text-decoration: none; font-size: 14px; font-weight: 500;">
            Reply to ${safeName}
          </a>
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

// Generate auto-reply HTML email for customer
function generateAutoReplyHTML(name: string): string {
  const currentYear = new Date().getFullYear();
  const safeName = escapeHtml(name);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Thank You for Contacting Karma's Apothecary</title>
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
          <p>Hi ${safeName},</p>
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
    const { name, email, message } = (await request.json()) as {
      name?: string;
      email?: string;
      message?: string;
    };

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const cleanName = String(name).trim();
    const cleanEmail = String(email).trim();
    const cleanMessage = String(message).trim();

    // 1. Always persist to Cloudflare D1 first so messages are never lost
    await storeContactSubmission({
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
    });

    const formData = { name: cleanName, email: cleanEmail, message: cleanMessage };

    // 2. Send email to admin & log
    const adminEmail = process.env.ADMIN_EMAIL || "1sierra.duck@gmail.com";
    const adminSubject = `📬 New Contact Form Message from ${cleanName}`;
    try {
      const adminHtml = generateContactEmailHTML(formData);
      await sendEmail({
        to: adminEmail,
        subject: adminSubject,
        html: adminHtml,
      });

      await logEmailAudit({
        recipient: adminEmail,
        type: "contact_form",
        subject: adminSubject,
        status: "sent",
      });
    } catch (adminErr) {
      console.error("Failed to notify admin of contact submission:", adminErr);
      await logEmailAudit({
        recipient: adminEmail,
        type: "contact_form",
        subject: adminSubject,
        status: "failed",
        errorMessage: adminErr instanceof Error ? adminErr.message : "Unknown error",
      });
    }

    // 3. Send auto-reply to customer & log
    const autoReplySubject = "Thank You for Contacting Karma's Apothecary ✨";
    try {
      const autoReplyHtml = generateAutoReplyHTML(cleanName);
      await sendEmail({
        to: cleanEmail,
        subject: autoReplySubject,
        html: autoReplyHtml,
      });

      await logEmailAudit({
        recipient: cleanEmail,
        type: "contact_form",
        subject: autoReplySubject,
        status: "sent",
      });
    } catch (custErr) {
      console.error("Failed to send auto-reply to customer:", custErr);
      await logEmailAudit({
        recipient: cleanEmail,
        type: "contact_form",
        subject: autoReplySubject,
        status: "failed",
        errorMessage: custErr instanceof Error ? custErr.message : "Unknown error",
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 },
    );
  }
}
