import { getCloudflareContext } from "@opennextjs/cloudflare";

export interface CustomerRecord {
  id: string;
  email: string;
  name: string;
  total_orders: number;
  created_at: string;
  updated_at: string;
}

export interface OrderRecord {
  id: string;
  customer_id: string;
  reading_slug: string;
  reading_name: string;
  amount: number;
  currency: string;
  status: string;
  preferred_format?: string | null;
  client_question: string;
  delivery_time: string;
  scheduled_date?: string | null;
  scheduled_time?: string | null;
  created_at: string;
  updated_at: string;
}

export interface PaymentRecord {
  id: string;
  order_id: string;
  provider: string;
  provider_order_id?: string | null;
  provider_capture_id: string;
  amount: number;
  currency: string;
  status: string;
  raw_details?: string | null;
  created_at: string;
}

export interface ContactRecord {
  id: string;
  name: string;
  email: string;
  message: string;
  status: string;
  created_at: string;
}

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Access the Cloudflare D1 Database binding
 */
export async function getDb(): Promise<D1Database | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return ((env as Record<string, unknown>)?.DB as D1Database | undefined) ?? null;
  } catch {
    // If running in local Node or build time without worker runtime
    return null;
  }
}

/**
 * Upsert customer record
 */
export async function upsertCustomer(
  db: D1Database,
  email: string,
  name: string,
): Promise<string> {
  const existing = await db
    .prepare("SELECT id FROM customers WHERE email = ?")
    .bind(email.toLowerCase())
    .first<{ id: string }>();

  const now = new Date().toISOString();

  if (existing?.id) {
    await db
      .prepare(
        "UPDATE customers SET name = ?, total_orders = total_orders + 1, updated_at = ? WHERE id = ?",
      )
      .bind(name, now, existing.id)
      .run();
    return existing.id;
  }

  const customerId = generateId("cust");
  await db
    .prepare(
      "INSERT INTO customers (id, email, name, total_orders, created_at, updated_at) VALUES (?, ?, ?, 1, ?, ?)",
    )
    .bind(customerId, email.toLowerCase(), name, now, now)
    .run();

  return customerId;
}

/**
 * Store confirmed order and payment transaction in D1 database
 */
export async function storeConfirmedOrder({
  email,
  name,
  readingSlug,
  readingName,
  amount,
  currency = "USD",
  preferredFormat,
  question,
  deliveryTime,
  scheduledDate,
  scheduledTime,
  providerOrderId,
  providerCaptureId,
  rawDetails,
}: {
  email: string;
  name: string;
  readingSlug: string;
  readingName: string;
  amount: number;
  currency?: string;
  preferredFormat?: string;
  question: string;
  deliveryTime: string;
  scheduledDate?: string;
  scheduledTime?: string;
  providerOrderId?: string;
  providerCaptureId: string;
  rawDetails?: string;
}): Promise<{ orderId: string; customerId: string }> {
  const db = await getDb();
  if (!db) {
    console.warn("D1 Database not available; skipping persistent storage.");
    return { orderId: generateId("ord"), customerId: generateId("cust") };
  }

  const now = new Date().toISOString();
  const customerId = await upsertCustomer(db, email, name);
  const orderId = generateId("ord");
  const paymentId = generateId("pay");

  await db.batch([
    db
      .prepare(
        `INSERT INTO orders (
          id, customer_id, reading_slug, reading_name, amount, currency,
          status, preferred_format, client_question, delivery_time,
          scheduled_date, scheduled_time, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, 'confirmed', ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        orderId,
        customerId,
        readingSlug,
        readingName,
        amount,
        currency,
        preferredFormat || null,
        question,
        deliveryTime,
        scheduledDate || null,
        scheduledTime || null,
        now,
        now,
      ),
    db
      .prepare(
        `INSERT INTO payments (
          id, order_id, provider, provider_order_id, provider_capture_id,
          amount, currency, status, raw_details, created_at
        ) VALUES (?, ?, 'paypal', ?, ?, ?, ?, 'COMPLETED', ?, ?)`,
      )
      .bind(
        paymentId,
        orderId,
        providerOrderId || null,
        providerCaptureId,
        amount,
        currency,
        rawDetails || null,
        now,
      ),
  ]);

  return { orderId, customerId };
}

/**
 * Log email audit trail to ensure delivery status is tracked
 */
export async function logEmailAudit({
  orderId,
  recipient,
  type,
  subject,
  status,
  errorMessage,
}: {
  orderId?: string;
  recipient: string;
  type: "customer_confirmation" | "admin_notification" | "contact_form";
  subject: string;
  status: "sent" | "failed";
  errorMessage?: string;
}): Promise<void> {
  const db = await getDb();
  if (!db) return;

  const id = generateId("eml");
  const now = new Date().toISOString();

  try {
    await db
      .prepare(
        `INSERT INTO email_logs (
          id, order_id, recipient, type, subject, status, error_message, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      )
      .bind(
        id,
        orderId || null,
        recipient,
        type,
        subject,
        status,
        errorMessage || null,
        now,
      )
      .run();
  } catch (err) {
    console.error("Failed to log email audit:", err);
  }
}

/**
 * Store contact form submission into database
 */
export async function storeContactSubmission({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}): Promise<string> {
  const db = await getDb();
  const id = generateId("cnt");
  const now = new Date().toISOString();

  if (db) {
    try {
      await db
        .prepare(
          "INSERT INTO contact_submissions (id, name, email, message, status, created_at) VALUES (?, ?, ?, ?, 'unread', ?)",
        )
        .bind(id, name, email, message, now)
        .run();
    } catch (err) {
      console.error("Failed to store contact submission:", err);
    }
  }

  return id;
}

/**
 * Look up an order by its PayPal transaction / capture ID
 */
export async function getOrderByTransactionId(
  transactionId: string,
): Promise<(OrderRecord & { customer_name: string; customer_email: string }) | null> {
  const db = await getDb();
  if (!db) return null;

  const row = await db
    .prepare(
      `SELECT o.*, c.name as customer_name, c.email as customer_email
       FROM payments p
       JOIN orders o ON p.order_id = o.id
       JOIN customers c ON o.customer_id = c.id
       WHERE p.provider_capture_id = ?`,
    )
    .bind(transactionId)
    .first<OrderRecord & { customer_name: string; customer_email: string }>();

  return row ?? null;
}

/**
 * Get all active/pending orders awaiting fulfillment, sorted by created_at ASC (oldest/most urgent first)
 */
export async function getPendingOrders(): Promise<
  (OrderRecord & { customer_name: string; customer_email: string; transaction_id: string })[]
> {
  const db = await getDb();
  if (!db) return [];

  const { results } = await db
    .prepare(
      `SELECT o.*, c.name as customer_name, c.email as customer_email, p.provider_capture_id as transaction_id
       FROM orders o
       JOIN customers c ON o.customer_id = c.id
       LEFT JOIN payments p ON p.order_id = o.id
       WHERE o.status IN ('confirmed', 'in_progress')
       ORDER BY o.created_at ASC`,
    )
    .all<OrderRecord & { customer_name: string; customer_email: string; transaction_id: string }>();

  return results || [];
}

/**
 * Retrieve the full question and reading history for a customer
 */
export async function getCustomerOrderHistory(
  email: string,
): Promise<(OrderRecord & { transaction_id: string })[]> {
  const db = await getDb();
  if (!db) return [];

  const { results } = await db
    .prepare(
      `SELECT o.*, p.provider_capture_id as transaction_id
       FROM orders o
       JOIN customers c ON o.customer_id = c.id
       LEFT JOIN payments p ON p.order_id = o.id
       WHERE c.email = ?
       ORDER BY o.created_at DESC`,
    )
    .bind(email.toLowerCase())
    .all<OrderRecord & { transaction_id: string }>();

  return results || [];
}

/**
 * Update order fulfillment status, reader private notes, or delivery URLs
 */
export async function updateOrderStatus({
  orderId,
  status,
  readerNotes,
  fulfillmentUrl,
  meetingLink,
}: {
  orderId: string;
  status?: "confirmed" | "in_progress" | "fulfilled" | "cancelled" | "refunded";
  readerNotes?: string;
  fulfillmentUrl?: string;
  meetingLink?: string;
}): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  const now = new Date().toISOString();
  const isFulfilled = status === "fulfilled";

  await db
    .prepare(
      `UPDATE orders
       SET status = COALESCE(?, status),
           reader_notes = COALESCE(?, reader_notes),
           fulfillment_url = COALESCE(?, fulfillment_url),
           meeting_link = COALESCE(?, meeting_link),
           fulfilled_at = CASE WHEN ? = 1 THEN ? ELSE fulfilled_at END,
           updated_at = ?
       WHERE id = ?`,
    )
    .bind(
      status || null,
      readerNotes || null,
      fulfillmentUrl || null,
      meetingLink || null,
      isFulfilled ? 1 : 0,
      now,
      now,
      orderId,
    )
    .run();

  return true;
}
