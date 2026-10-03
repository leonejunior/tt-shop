// ─────────────────────────────────────────────────────────────────────────────
// Karma's Apothecary — Email Templates
// ─────────────────────────────────────────────────────────────────────────────
//
// Email roles:
//   FROM (all emails):   karmicapothecary@gmail.com  ("Karma's Apothecary")
//   ADMIN inbox:         ADMIN_EMAIL env var          (owner's personal inbox)
//
// Templates in this file:
//   1. generateCustomerConfirmationHTML  → sent to customer on booking payment
//   2. generateAdminBookingAlertHTML     → sent to admin on booking payment
//   3. generateContactAdminAlertHTML     → sent to admin on contact form submit
//   4. generateContactAutoReplyHTML      → sent to customer on contact form submit
//   5. generateReadingDeliveryHTML       → sent to customer when reading is ready
//   6. generateVIPSummaryHTML            → sent to customer after VIP call
//   7. generateVIPReminderHTML           → sent to admin 7 days after VIP booking
//
// ─────────────────────────────────────────────────────────────────────────────

export interface BookingDetails {
  readingName: string;
  price: number;
  name: string;
  email: string;
  question: string;
  preferredFormat?: string;
  deliveryTime: string;
  schedule?: {
    formattedDate?: string;
    formattedTime?: string;
    date?: string;
    time?: string;
  };
  transactionId?: string;
}

// ─── Security ───────────────────────────────────────────────────────────────

/** Escapes user-supplied strings for safe insertion into HTML email bodies. */
export function escapeHtml(unsafe: string | null | undefined): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// ─── Shared styles ───────────────────────────────────────────────────────────

const BASE_STYLES = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #1a1a2e;
    background-color: #faf9f8;
    margin: 0;
    padding: 0;
  }
  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  .card {
    background: #ffffff;
    border-radius: 20px;
    border: 1px solid #e5e7eb;
    overflow: hidden;
    box-shadow: 0 4px 16px rgba(94, 58, 107, 0.08);
  }
  .header {
    background: linear-gradient(135deg, #5e3a6b 0%, #3d2550 100%);
    padding: 36px 28px;
    text-align: center;
  }
  .header-emoji { font-size: 36px; line-height: 1; margin-bottom: 12px; }
  .header h1 { color: #ffffff; margin: 0; font-size: 26px; font-weight: 700; letter-spacing: -0.3px; }
  .header p  { color: rgba(255,255,255,0.82); margin: 8px 0 0; font-size: 15px; }
  .content { padding: 32px 28px; }
  .greeting { font-size: 17px; font-weight: 600; color: #1a1a2e; margin-bottom: 12px; }
  .text     { color: #4b5563; font-size: 15px; margin-bottom: 20px; line-height: 1.7; }
  .details-box {
    background: #f9f5ff;
    border-left: 4px solid #5e3a6b;
    padding: 20px 22px;
    border-radius: 12px;
    margin: 24px 0;
  }
  .details-row {
    display: flex;
    justify-content: space-between;
    padding: 7px 0;
    font-size: 14px;
    border-bottom: 1px solid #ede9f6;
  }
  .details-row:last-child { border-bottom: none; }
  .details-label { font-weight: 600; color: #374151; }
  .details-value { color: #4b5563; text-align: right; word-break: break-word; max-width: 58%; }
  .divider { border: none; border-top: 1px solid #e5e7eb; margin: 20px 0; }
  .info-box {
    background: #f3f4f6;
    border-radius: 12px;
    padding: 18px 20px;
    margin: 20px 0;
  }
  .info-box h3 { margin: 0 0 10px; font-size: 15px; color: #1f2937; font-weight: 700; }
  .info-box p  { margin: 6px 0; font-size: 14px; color: #4b5563; }
  .question-box {
    background: #f9f5ff;
    border-radius: 10px;
    padding: 14px 16px;
    margin: 18px 0;
    border-left: 3px solid #5e3a6b;
  }
  .question-box strong { color: #5e3a6b; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
  .question-box p { margin: 8px 0 0; font-size: 14px; color: #4b5563; font-style: italic; line-height: 1.6; }
  .cta-btn {
    display: inline-block;
    background: linear-gradient(135deg, #5e3a6b 0%, #3d2550 100%);
    color: #ffffff !important;
    padding: 14px 28px;
    border-radius: 9999px;
    text-decoration: none;
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.2px;
    margin: 8px 4px;
  }
  .cta-btn-outline {
    display: inline-block;
    background: transparent;
    color: #5e3a6b !important;
    padding: 12px 24px;
    border-radius: 9999px;
    text-decoration: none;
    font-size: 14px;
    font-weight: 600;
    border: 2px solid #5e3a6b;
    margin: 8px 4px;
  }
  .sign-off { color: #5e3a6b; font-weight: 600; margin-top: 24px; font-size: 15px; }
  .footer {
    padding: 20px 28px;
    text-align: center;
    border-top: 1px solid #e5e7eb;
    font-size: 12px;
    color: #9ca3af;
  }
  .footer a { color: #5e3a6b; text-decoration: none; }
  @media (max-width: 480px) {
    .content { padding: 24px 18px; }
    .header { padding: 28px 18px; }
    .details-row { flex-direction: column; gap: 2px; }
    .details-value { text-align: left; max-width: 100%; }
    .cta-btn, .cta-btn-outline { display: block; text-align: center; }
  }
`;

function htmlWrapper(title: string, body: string, year: number): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(title)}</title>
<style>${BASE_STYLES}</style>
</head>
<body>
<div class="container">
<div class="card">
${body}
<div class="footer">
  <p>For entertainment &amp; spiritual guidance purposes only.<br>Not a substitute for professional medical, legal, or financial advice.</p>
  <p>© ${year} Karma's Apothecary</p>
</div>
</div>
</div>
</body>
</html>`;
}

// ─────────────────────────────────────────────────────────────────────────────
// 1. Customer Booking Confirmation
// Sent to: customer email
// Trigger: successful PayPal payment capture
// Subject: "Your {Reading Name} is Confirmed! ✨"
// ─────────────────────────────────────────────────────────────────────────────

export function generateCustomerConfirmationHTML(booking: BookingDetails): string {
  const year = new Date().getFullYear();
  const isVip = booking.readingName.toLowerCase().includes("vip");
  const isDeepDiveVideo =
    booking.readingName.toLowerCase().includes("deep dive") &&
    booking.preferredFormat === "video";
  const needsScheduling = isVip || isDeepDiveVideo;
  const isScheduled = !!booking.schedule;
  const calendlyUrl = process.env.CALENDLY_URL || "https://calendly.com/karmicapothecary/new-meeting";

  const safe = {
    name:          escapeHtml(booking.name),
    readingName:   escapeHtml(booking.readingName),
    question:      escapeHtml(booking.question),
    txnId:         escapeHtml(booking.transactionId),
    deliveryTime:  escapeHtml(booking.deliveryTime),
    date:          escapeHtml(booking.schedule?.formattedDate ?? booking.schedule?.date),
    time:          escapeHtml(booking.schedule?.formattedTime ?? booking.schedule?.time),
    format:        escapeHtml(booking.preferredFormat),
  };

  const formatLabel =
    safe.format === "video" ? "Video Call (Live Conversation)" :
    safe.format === "voice" ? "Voice Note (Recorded)" :
    safe.format || "";

  const scheduleSection = isScheduled
    ? `<div class="details-row"><span class="details-label">📅 Date</span><span class="details-value">${safe.date}</span></div>
       <div class="details-row"><span class="details-label">⏰ Time</span><span class="details-value">${safe.time} EST</span></div>`
    : `<div class="details-row"><span class="details-label">⏱️ Delivery</span><span class="details-value">Within ${safe.deliveryTime}</span></div>`;

  const formatRow = safe.format
    ? `<div class="details-row"><span class="details-label">🎙️ Format</span><span class="details-value">${formatLabel}</span></div>`
    : "";

  const txnRow = booking.transactionId
    ? `<div class="details-row"><span class="details-label">🆔 Transaction</span><span class="details-value" style="font-size:12px;">${safe.txnId}</span></div>`
    : "";

  // "What happens next" varies by type
  let nextSteps: string;
  if (needsScheduling) {
    const sessionLabel = isVip ? "VIP Session" : "Deep Dive Video Call";
    nextSteps = `
      <div class="info-box">
        <h3>🌟 What happens next?</h3>
        <p>📅 <strong>Schedule your ${sessionLabel} below</strong> — pick a date and time that works for you.</p>
        <p>📝 Come prepared with your questions. We'll cover everything in our live call.</p>
        <p>🔗 A Google Meet link will be in your Calendly calendar invite automatically.</p>
        <p>⚡ If you need to reschedule, please do so at least 12 hours in advance via Calendly.</p>
      </div>
      <div style="text-align:center; margin: 24px 0;">
        <a href="${escapeHtml(calendlyUrl)}" class="cta-btn">📅 Schedule Your ${sessionLabel}</a>
      </div>`;
  } else if (isScheduled) {
    nextSteps = `
      <div class="info-box">
        <h3>📬 What happens next?</h3>
        <p>🔗 A Google Meet link will be sent to this email 24 hours before your session.</p>
        <p>📝 Please have your questions ready and find a quiet, comfortable space.</p>
        <p>⏰ To reschedule, simply reply to this email at least 12 hours in advance.</p>
      </div>`;
  } else {
    nextSteps = `
      <div class="info-box">
        <h3>📬 What happens next?</h3>
        <p>🎧 I'll begin working on your reading shortly and deliver it within <strong>${safe.deliveryTime}</strong>.</p>
        <p>📝 Your reading will be delivered ${safe.format === "video" ? "as a recorded video" : "as a private voice note"} to this email.</p>
        <p>💬 If you have any follow-up questions, simply reply to this email.</p>
      </div>`;
  }

  const body = `
<div class="header">
  <div class="header-emoji">✨</div>
  <h1>Booking Confirmed!</h1>
  <p>Your reading is on its way</p>
</div>
<div class="content">
  <p class="greeting">Hi ${safe.name},</p>
  <p class="text">
    Thank you for booking a reading with me. Your <strong>${safe.readingName}</strong> is confirmed
    and I'm honoured to be part of your journey. 🌙
  </p>

  <div class="details-box">
    <div class="details-row"><span class="details-label">📖 Reading</span><span class="details-value">${safe.readingName}</span></div>
    <div class="details-row"><span class="details-label">💰 Amount Paid</span><span class="details-value">$${booking.price.toFixed(2)} USD</span></div>
    ${scheduleSection}
    ${formatRow}
    ${txnRow}
  </div>

  <div class="question-box">
    <strong>❓ Your Question</strong>
    <p>"${safe.question}"</p>
  </div>

  ${nextSteps}

  <hr class="divider">
  <p class="text" style="text-align:center; font-size:14px;">
    If you have any questions before your reading, just reply to this email. I'm here for you. 🤍
  </p>
  <p class="sign-off" style="text-align:center;">With love,<br>Karma ✨</p>
</div>`;

  return htmlWrapper(`Your ${booking.readingName} is Confirmed`, body, year);
}

// ─────────────────────────────────────────────────────────────────────────────
// 2. Admin Booking Alert
// Sent to: ADMIN_EMAIL (owner inbox)
// Trigger: successful PayPal payment capture
// Subject: "🔮 New Booking: {Reading} from {Client Name}"
// ─────────────────────────────────────────────────────────────────────────────

export function generateAdminBookingAlertHTML(booking: BookingDetails): string {
  const year = new Date().getFullYear();
  const isVip = booking.readingName.toLowerCase().includes("vip");
  const isScheduled = !!booking.schedule;
  const calendlyUrl = process.env.CALENDLY_URL || "https://calendly.com/karmicapothecary/new-meeting";

  const safe = {
    name:        escapeHtml(booking.name),
    email:       escapeHtml(booking.email),
    readingName: escapeHtml(booking.readingName),
    question:    escapeHtml(booking.question),
    txnId:       escapeHtml(booking.transactionId),
    deliveryTime:escapeHtml(booking.deliveryTime),
    date:        escapeHtml(booking.schedule?.formattedDate ?? booking.schedule?.date),
    time:        escapeHtml(booking.schedule?.formattedTime ?? booking.schedule?.time),
    format:      escapeHtml(booking.preferredFormat),
  };

  const scheduleSection = isScheduled
    ? `<div class="details-row"><span class="details-label">📅 Schedule</span><span class="details-value">${safe.date} at ${safe.time} EST</span></div>`
    : `<div class="details-row"><span class="details-label">⏱️ Deliver by</span><span class="details-value">Within ${safe.deliveryTime}</span></div>`;

  const vipAction = isVip ? `
    <div class="info-box" style="background:#fef3c7; border-left:4px solid #d97706;">
      <h3 style="color:#92400e;">⚡ Action Required — VIP Booking</h3>
      <p style="color:#78350f;">The client has been emailed a Calendly link to schedule their session.<br>
      Make sure your Calendly is up to date: <a href="${escapeHtml(calendlyUrl)}" style="color:#5e3a6b;">${escapeHtml(calendlyUrl)}</a></p>
    </div>` : "";

  const body = `
<div class="header">
  <div class="header-emoji">🎉</div>
  <h1>New Booking!</h1>
  <p>${new Date().toLocaleString("en-US", { timeZone: "UTC", dateStyle: "full", timeStyle: "short" })} UTC</p>
</div>
<div class="content">
  <div class="details-box">
    <div class="details-row"><span class="details-label">📖 Reading</span><span class="details-value">${safe.readingName}</span></div>
    <div class="details-row"><span class="details-label">👤 Client</span><span class="details-value">${safe.name}</span></div>
    <div class="details-row"><span class="details-label">📧 Email</span><span class="details-value">${safe.email}</span></div>
    <div class="details-row"><span class="details-label">💰 Amount</span><span class="details-value">$${booking.price.toFixed(2)} USD</span></div>
    ${scheduleSection}
    ${safe.format ? `<div class="details-row"><span class="details-label">🎙️ Format</span><span class="details-value">${safe.format}</span></div>` : ""}
    <div class="details-row"><span class="details-label">🆔 PayPal Capture</span><span class="details-value" style="font-size:12px;">${safe.txnId || "—"}</span></div>
  </div>

  <div class="question-box">
    <strong>❓ Client's Question</strong>
    <p>"${safe.question}"</p>
  </div>

  ${vipAction}

  <div class="info-box">
    <h3>✅ Payment Status</h3>
    <p>Payment has been captured &amp; verified via PayPal.<br>
    <a href="https://www.paypal.com/activities" style="color:#5e3a6b;">View in PayPal Dashboard →</a></p>
  </div>

  <div style="text-align:center; margin-top:24px;">
    <a href="mailto:${escapeHtml(booking.email)}?subject=Re:%20Your%20${encodeURIComponent(booking.readingName)}%20Reading%20✨"
       class="cta-btn">Reply to Client</a>
  </div>
</div>`;

  return htmlWrapper("New Booking Alert", body, year);
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. Contact Form Admin Alert
// Sent to: ADMIN_EMAIL
// Trigger: contact form submission
// Subject: "📬 New Message from {Name}"
// ─────────────────────────────────────────────────────────────────────────────

export function generateContactAdminAlertHTML(formData: { name: string; email: string; message: string }): string {
  const year = new Date().getFullYear();
  const safe = {
    name:    escapeHtml(formData.name),
    email:   escapeHtml(formData.email),
    message: escapeHtml(formData.message),
  };

  const body = `
<div class="header">
  <div class="header-emoji">📬</div>
  <h1>New Message</h1>
  <p>${new Date().toLocaleString("en-US", { timeZone: "UTC", dateStyle: "full", timeStyle: "short" })} UTC</p>
</div>
<div class="content">
  <div class="details-box">
    <div class="details-row"><span class="details-label">👤 Name</span><span class="details-value">${safe.name}</span></div>
    <div class="details-row"><span class="details-label">📧 Email</span><span class="details-value">${safe.email}</span></div>
  </div>
  <div class="question-box">
    <strong>💬 Message</strong>
    <p style="white-space:pre-wrap; font-style:normal;">${safe.message}</p>
  </div>
  <div style="text-align:center; margin-top:24px;">
    <a href="mailto:${escapeHtml(formData.email)}?subject=Re:%20Your%20message%20to%20Karma's%20Apothecary"
       class="cta-btn">Reply to ${safe.name}</a>
  </div>
</div>`;

  return htmlWrapper("New Contact Form Message", body, year);
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. Contact Form Auto-Reply
// Sent to: the person who submitted the form
// Trigger: contact form submission
// Subject: "Thank You for Reaching Out ✨"
// ─────────────────────────────────────────────────────────────────────────────

export function generateContactAutoReplyHTML(name: string): string {
  const year = new Date().getFullYear();
  const safeName = escapeHtml(name);

  const body = `
<div class="header">
  <div class="header-emoji">🌙</div>
  <h1>Thank You for Reaching Out!</h1>
</div>
<div class="content">
  <p class="greeting">Hi ${safeName},</p>
  <p class="text">
    Your message has landed safely with me. ✨<br>
    I'll read it and get back to you within <strong>24–48 hours</strong>.
  </p>
  <div class="info-box">
    <h3>⚡ Need a faster response?</h3>
    <p>DM me on Instagram or TikTok for quicker replies — I check those more often throughout the day.</p>
  </div>
  <p class="text" style="margin-top:24px;">
    Until then, trust the energy. Whatever you're navigating, clarity is coming. 🔮
  </p>
  <p class="sign-off">With love,<br>Karma ✨</p>
</div>`;

  return htmlWrapper("Thank You for Reaching Out", body, year);
}

// ─────────────────────────────────────────────────────────────────────────────
// 5. Reading Delivery Email
// Sent to: customer email
// Trigger: admin marks order as fulfilled from admin panel
// Subject: "Your {Reading Name} is Ready! 🎴"
// ─────────────────────────────────────────────────────────────────────────────

export function generateReadingDeliveryHTML(data: {
  clientName: string;
  readingName: string;
  deliveryUrl?: string;     // Google Drive / Dropbox link to voice note or report
  readerNotes?: string;     // Optional personal message from Karma
  isVoiceNote?: boolean;
}): string {
  const year = new Date().getFullYear();
  const safe = {
    name:        escapeHtml(data.clientName),
    readingName: escapeHtml(data.readingName),
    notes:       escapeHtml(data.readerNotes),
    url:         data.deliveryUrl ? escapeHtml(data.deliveryUrl) : null,
  };

  const deliveryButton = safe.url ? `
    <div style="text-align:center; margin: 28px 0;">
      <a href="${safe.url}" class="cta-btn">
        ${data.isVoiceNote ? "🎧 Listen to Your Reading" : "📄 View Your Reading"}
      </a>
      <p style="font-size:12px; color:#9ca3af; margin-top:10px;">
        Link expires after 30 days — download your reading to keep it safe.
      </p>
    </div>` : "";

  const notesSection = safe.notes ? `
    <div class="info-box">
      <h3>💌 A note from Karma</h3>
      <p style="font-style:italic;">${safe.notes}</p>
    </div>` : "";

  const body = `
<div class="header">
  <div class="header-emoji">🎴</div>
  <h1>Your Reading is Ready!</h1>
  <p>${safe.readingName}</p>
</div>
<div class="content">
  <p class="greeting">Hi ${safe.name},</p>
  <p class="text">
    Your <strong>${safe.readingName}</strong> is complete and ready for you. 🌟<br>
    I've poured my energy into this reading — I hope the messages land with clarity and comfort.
  </p>

  ${deliveryButton}

  ${notesSection}

  <div class="info-box">
    <h3>📬 What now?</h3>
    <p>🔉 Find a quiet moment and comfortable space before you listen or read.</p>
    <p>📥 Download or save your reading — links can expire.</p>
    <p>💬 If anything resonates or you have follow-up questions, simply reply to this email.</p>
  </div>

  <hr class="divider">
  <p class="text" style="text-align:center; font-size:14px;">
    Thank you for trusting me with your energy. The cards have spoken — now it's time to receive. 🤍
  </p>
  <p class="sign-off" style="text-align:center;">With love,<br>Karma ✨</p>
</div>`;

  return htmlWrapper(`Your ${data.readingName} is Ready`, body, year);
}

// ─────────────────────────────────────────────────────────────────────────────
// 6. VIP Session Written Summary
// Sent to: customer email (VIP only)
// Trigger: admin sends from admin panel after completing the live call
// Subject: "Your VIP Session Summary ✨"
// ─────────────────────────────────────────────────────────────────────────────

export function generateVIPSummaryHTML(data: {
  clientName: string;
  summaryText: string;   // The written summary Karma types in the admin panel
  keyThemes?: string[];  // Optional bullet themes Karma highlights
}): string {
  const year = new Date().getFullYear();
  const safe = {
    name:    escapeHtml(data.clientName),
    summary: escapeHtml(data.summaryText),
  };

  const themesSection = (data.keyThemes && data.keyThemes.length > 0) ? `
    <div class="info-box">
      <h3>🌟 Key Themes from Your Session</h3>
      ${data.keyThemes.map(t => `<p>• ${escapeHtml(t)}</p>`).join("")}
    </div>` : "";

  const body = `
<div class="header">
  <div class="header-emoji">🔮</div>
  <h1>Your VIP Session Summary</h1>
</div>
<div class="content">
  <p class="greeting">Hi ${safe.name},</p>
  <p class="text">
    It was such a pleasure sitting with your energy today. Here is your written summary from our
    VIP session — a record of the key messages and guidance the cards revealed for you. 🌙
  </p>

  ${themesSection}

  <div class="question-box" style="border-radius:12px; padding:20px;">
    <strong style="font-size:14px;">📝 Your Session Summary</strong>
    <p style="font-style:normal; white-space:pre-wrap; margin-top:12px;">${safe.summary}</p>
  </div>

  <div class="info-box">
    <h3>💬 Remember</h3>
    <p>📧 If anything comes up after sitting with this, reply to this email — I'm here.</p>
    <p>⏰ Your 1-week check-in is coming. I'll reach out to see how things are unfolding for you.</p>
  </div>

  <hr class="divider">
  <p class="text" style="text-align:center; font-size:14px;">
    Thank you for trusting me fully. You deserve every bit of the clarity you're stepping into. 🤍
  </p>
  <p class="sign-off" style="text-align:center;">With so much love,<br>Karma ✨</p>
</div>`;

  return htmlWrapper("Your VIP Session Summary", body, year);
}

// ─────────────────────────────────────────────────────────────────────────────
// 7. VIP 7-Day Follow-up Reminder (admin only)
// Sent to: ADMIN_EMAIL
// Trigger: 7 days after a VIP booking (automated / cron)
// Subject: "⏰ 7-Day Check-In Reminder: {Client Name}"
// ─────────────────────────────────────────────────────────────────────────────

export function generateVIPReminderHTML(data: {
  clientName: string;
  clientEmail: string;
  readingName: string;
  orderId: string;
  bookedAt: string;
}): string {
  const year = new Date().getFullYear();
  const safe = {
    name:        escapeHtml(data.clientName),
    email:       escapeHtml(data.clientEmail),
    readingName: escapeHtml(data.readingName),
    orderId:     escapeHtml(data.orderId),
    bookedAt:    escapeHtml(data.bookedAt),
  };

  const body = `
<div class="header">
  <div class="header-emoji">⏰</div>
  <h1>7-Day Check-In Reminder</h1>
  <p>It's time to follow up with your VIP client</p>
</div>
<div class="content">
  <p class="text">
    It's been 7 days since <strong>${safe.name}</strong>'s VIP session.<br>
    Your package includes a <strong>1-week follow-up check-in</strong> — time to reach out! 🌟
  </p>
  <div class="details-box">
    <div class="details-row"><span class="details-label">👤 Client</span><span class="details-value">${safe.name}</span></div>
    <div class="details-row"><span class="details-label">📧 Email</span><span class="details-value">${safe.email}</span></div>
    <div class="details-row"><span class="details-label">📖 Reading</span><span class="details-value">${safe.readingName}</span></div>
    <div class="details-row"><span class="details-label">📅 Booked</span><span class="details-value">${safe.bookedAt}</span></div>
    <div class="details-row"><span class="details-label">🆔 Order</span><span class="details-value" style="font-size:12px;">${safe.orderId}</span></div>
  </div>
  <div class="info-box" style="background:#f0fdf4; border-left:4px solid #16a34a;">
    <h3 style="color:#15803d;">💚 Suggested check-in message</h3>
    <p style="font-style:italic; color:#166534;">"Hey ${safe.name}! It's been a week since our session 🌙 I just wanted to check in and see how things are unfolding for you. Have any of the messages from the cards started to show up in your life? I'm here if you want to chat. — Karma ✨"</p>
  </div>
  <div style="text-align:center; margin-top:24px;">
    <a href="mailto:${escapeHtml(data.clientEmail)}?subject=Checking%20in%20on%20you%20✨"
       class="cta-btn">Send Check-In Email</a>
  </div>
</div>`;

  return htmlWrapper("VIP 7-Day Check-In Reminder", body, year);
}

// ─────────────────────────────────────────────────────────────────────────────
// Backwards compatibility aliases (used by existing routes)
// ─────────────────────────────────────────────────────────────────────────────

/** @deprecated Use generateCustomerConfirmationHTML */
export const generateCustomerEmailHTML = generateCustomerConfirmationHTML;

/** @deprecated Use generateAdminBookingAlertHTML */
export const generateAdminEmailHTML = generateAdminBookingAlertHTML;

// ─────────────────────────────────────────────────────────────────────────────
// sendEmail — Mailjet transport
// ─────────────────────────────────────────────────────────────────────────────

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}): Promise<{ success: boolean }> {
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
