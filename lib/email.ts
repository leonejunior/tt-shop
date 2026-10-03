interface BookingDetails {
  readingName: string;
  price: number;
  name: string;
  email: string;
  question: string;
  preferredFormat?: string;
  deliveryTime: string;
  schedule?: {
    formattedDate: string;
    formattedTime: string;
  };
  transactionId?: string;
}

export function escapeHtml(unsafe: string | null | undefined): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Generate HTML email template for customer
export function generateCustomerEmailHTML(booking: BookingDetails): string {
  const currentYear = new Date().getFullYear();
  const isScheduled =
    booking.schedule !== undefined && booking.schedule !== null;

  const safeName = escapeHtml(booking.name);
  const safeReadingName = escapeHtml(booking.readingName);
  const safeQuestion = escapeHtml(booking.question);
  const safeTransactionId = escapeHtml(booking.transactionId);
  const safeDeliveryTime = escapeHtml(booking.deliveryTime);
  const safeFormattedDate = escapeHtml(booking.schedule?.formattedDate);
  const safeFormattedTime = escapeHtml(booking.schedule?.formattedTime);
  const safePreferredFormat = escapeHtml(booking.preferredFormat);

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Your Reading Confirmation</title>
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
.greeting {
  font-size: 18px;
  font-weight: 500;
  margin-bottom: 16px;
}
.message {
  color: #4b5563;
  margin-bottom: 24px;
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
  min-width: 120px;
}
.details-value {
  color: #4b5563;
  text-align: right;
  max-width: 60%;
  word-break: break-word;
}
.divider {
  border-top: 1px solid #e5e7eb;
  margin: 16px 0;
}
.total {
  font-weight: 700;
  font-size: 16px;
}
.total .details-value {
  color: #5e3a6b;
  font-size: 18px;
}
.next-steps {
  background: #f3f4f6;
  padding: 20px;
  border-radius: 12px;
  margin: 24px 0;
}
.next-steps h3 {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 12px;
  color: #1f2937;
}
.next-steps p {
  margin: 8px 0;
  font-size: 14px;
  color: #4b5563;
}
.question-box {
  background: #f9f5ff;
  padding: 12px;
  border-radius: 8px;
  margin-top: 8px;
}
.footer {
  padding: 24px;
  text-align: center;
  border-top: 1px solid #e5e7eb;
  font-size: 12px;
  color: #9ca3af;
}
.footer a {
  color: #5e3a6b;
  text-decoration: none;
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
  .details-label {
    min-width: auto;
  }
}
</style>
</head>
<body>
<div class="container">
<div class="card">
<div class="header">
<h1>✨ Booking Confirmed! ✨</h1>
<p>Your reading is on its way</p>
</div>

<div class="content">
<div class="greeting">
Hi ${safeName},
</div>

<div class="message">
Thank you for booking a reading with me. Your ${safeReadingName} is confirmed and I'm honored to be part of your journey.
</div>

<div class="details">
<div class="details-row">
<span class="details-label">📖 Reading:</span>
<span class="details-value">${safeReadingName}</span>
</div>
<div class="details-row">
<span class="details-label">💰 Amount Paid:</span>
<span class="details-value">$${booking.price.toFixed(2)}</span>
</div>
${
  booking.transactionId
    ? `
<div class="details-row">
<span class="details-label">🆔 Transaction ID:</span>
<span class="details-value">${safeTransactionId}</span>
</div>
`
    : ""
}
${
  isScheduled
    ? `
<div class="details-row">
<span class="details-label">📅 Date:</span>
<span class="details-value">${safeFormattedDate}</span>
</div>
<div class="details-row">
<span class="details-label">⏰ Time:</span>
<span class="details-value">${safeFormattedTime} EST</span>
</div>
`
    : `
<div class="details-row">
<span class="details-label">⏱️ Delivery:</span>
<span class="details-value">Within ${safeDeliveryTime}</span>
</div>
`
}
<div class="divider"></div>
<div class="details-row total">
<span class="details-label">Total:</span>
<span class="details-value">$${booking.price.toFixed(2)}</span>
</div>
</div>

<div class="next-steps">
<h3>📬 What happens next?</h3>
${
  isScheduled
    ? `
<p>🔗 A Google Meet link will be sent to this email 24 hours before your session.</p>
<p>📝 Please have your questions ready and find a quiet space.</p>
<p>⏰ If you need to reschedule, reply to this email at least 12 hours in advance.</p>
`
    : `
<p>🎧 I'll begin working on your reading shortly and will send it to this email within ${safeDeliveryTime}.</p>
<p>📝 Your reading will be delivered as a private voice note or written report.</p>
<p>💬 If you have any follow-up questions, simply reply to this email.</p>
`
}
</div>

<div class="question-box">
<strong>❓ Your Question:</strong>
<p style="margin-top: 8px; font-size: 14px; color: #4b5563;">"${safeQuestion}"</p>
</div>

${
  booking.preferredFormat
    ? `
<div style="margin-top: 16px;">
<div class="details-row">
<span class="details-label">🎙️ Preferred Format:</span>
<span class="details-value">${safePreferredFormat === "video" ? "Video Call (Live Conversation)" : "Voice Note (Recorded)"}</span>
</div>
</div>
`
    : ""
}

<div style="text-align: center; margin-top: 32px;">
<p style="color: #6b7280; font-size: 14px;">
If you have any questions, just reply to this email. I'm here for you. 🤍
</p>
<p style="color: #5e3a6b; font-weight: 500; margin-top: 16px;">
With love,<br>Karma ✨
</p>
</div>
</div>

<div class="footer">
<p>For entertainment purposes only. This reading is not a substitute for professional medical, legal, or financial advice.</p>
<p>© ${currentYear} Karma's Apothecary</p>
</div>
</div>
</div>
</body>
</html>
`;
}

// Generate HTML email template for admin
export function generateAdminEmailHTML(booking: BookingDetails): string {
  const isScheduled =
    booking.schedule !== undefined && booking.schedule !== null;

  const safeName = escapeHtml(booking.name);
  const safeReadingName = escapeHtml(booking.readingName);
  const safeEmail = escapeHtml(booking.email);
  const safeQuestion = escapeHtml(booking.question);
  const safeTransactionId = escapeHtml(booking.transactionId);
  const safeDeliveryTime = escapeHtml(booking.deliveryTime);
  const safeFormattedDate = escapeHtml(booking.schedule?.formattedDate);
  const safeFormattedTime = escapeHtml(booking.schedule?.formattedTime);
  const safePreferredFormat = escapeHtml(booking.preferredFormat);

  return `
<!DOCTYPE html>
<html>
<head>
<style>
body { 
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  line-height: 1.6; 
  color: #333; 
  background-color: #faf9f8;
  margin: 0;
  padding: 0;
}
.container { 
  max-width: 600px; 
  margin: 0 auto; 
  padding: 20px; 
}
.header { 
  background: linear-gradient(135deg, #5e3a6b 0%, #4b3b6e 100%);
  color: white; 
  padding: 20px; 
  text-align: center; 
  border-radius: 12px; 
}
.details { 
  background: #f9f5ff; 
  padding: 20px; 
  border-radius: 12px; 
  margin: 20px 0; 
}
.row { 
  display: flex; 
  justify-content: space-between; 
  margin-bottom: 12px;
  padding: 8px 0;
  border-bottom: 1px solid #e9e9ef;
}
.row:last-child {
  border-bottom: none;
}
.label { 
  font-weight: bold; 
  color: #4b3b6e;
  min-width: 120px;
}
.value {
  color: #4b5563;
  text-align: right;
  max-width: 60%;
  word-break: break-word;
}
.question-box { 
  background: white; 
  padding: 15px; 
  border-radius: 8px; 
  margin-top: 10px; 
  border-left: 3px solid #5e3a6b;
}
.question-box strong {
  color: #5e3a6b;
}
.question-box p {
  margin-top: 8px;
  color: #4b5563;
  line-height: 1.5;
}
.note {
  margin-top: 20px;
  padding: 12px;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 13px;
  color: #6b7280;
  text-align: center;
}
@media (max-width: 480px) {
  .row {
    flex-direction: column;
    gap: 4px;
  }
  .value {
    text-align: left;
    max-width: 100%;
  }
  .label {
    min-width: auto;
  }
}
</style>
</head>
<body>
<div class="container">
<div class="header">
<h1>🎉 New Booking Alert! 🎉</h1>
<p>${new Date().toLocaleString()}</p>
</div>
<div class="details">
<div class="row">
<span class="label">Reading:</span>
<span class="value">${safeReadingName}</span>
</div>
<div class="row">
<span class="label">Client:</span>
<span class="value">${safeName}</span>
</div>
<div class="row">
<span class="label">Email:</span>
<span class="value">${safeEmail}</span>
</div>
<div class="row">
<span class="label">Amount:</span>
<span class="value">$${booking.price.toFixed(2)}</span>
</div>
<div class="row">
<span class="label">Transaction ID:</span>
<span class="value">${safeTransactionId || "N/A"}</span>
</div>
${
  isScheduled
    ? `
<div class="row">
<span class="label">Schedule:</span>
<span class="value">${safeFormattedDate} at ${safeFormattedTime} EST</span>
</div>
`
    : `
<div class="row">
<span class="label">Delivery:</span>
<span class="value">Within ${safeDeliveryTime}</span>
</div>
`
}
${
  booking.preferredFormat
    ? `
<div class="row">
<span class="label">Format:</span>
<span class="value">${safePreferredFormat === "video" ? "Video Call" : "Voice Note"}</span>
</div>
`
    : ""
}
<div class="question-box">
<strong>❓ Client's Question:</strong>
<p>"${safeQuestion}"</p>
</div>
</div>
<div class="note">
✓ Payment has been processed via PayPal. Check PayPal dashboard for full details.
</div>
</div>
</body>
</html>
`;
}

// Send email function
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const credentials = btoa(
    `${process.env.MAILJET_API_KEY}:${process.env.MAILJET_SECRET_KEY}`,
  );

  const response = await fetch("https://api.mailjet.com/v3.1/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify({
      Messages: [
        {
          From: {
            Email: "karmicapothecary@gmail.com",
            Name: "Karma's Apothecary",
          },
          To: [{ Email: to }],
          Subject: subject,
          HTMLPart: html,
        },
      ],
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Email failed: ${error}`);
  }

  return { success: true };
}
