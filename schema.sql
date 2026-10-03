-- Initial database schema for tt-shop

-- 1. Customers / Buyers
CREATE TABLE IF NOT EXISTS customers (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  social_handle TEXT,
  notes TEXT,
  total_orders INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);

-- 2. Readings Catalog
CREATE TABLE IF NOT EXISTS readings (
  slug TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price REAL NOT NULL,
  format TEXT NOT NULL,
  delivery_time TEXT NOT NULL,
  description TEXT,
  active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL
);

-- Seed initial catalog
INSERT OR REPLACE INTO readings (slug, name, price, format, delivery_time, description, active, created_at)
VALUES 
  ('the-glimpse', 'The Glimpse', 11.11, 'Voice Note', '24-48 hours', '2 questions, 5-card pull', 1, datetime('now')),
  ('heart-compass', 'The Heart Compass', 22.22, 'Voice Note', '24 hours', '3-4 love questions, 5-7 cards', 1, datetime('now')),
  ('deep-dive', 'The Deep Dive', 44.44, 'Video Call or Written Report', '48 hours', '4-6 questions, 10-12 cards across 2-3 spreads', 1, datetime('now')),
  ('vip-session', 'The VIP Session', 77.77, 'Video Call Only', 'Scheduled', 'Unlimited questions, live 60-90 min session', 1, datetime('now'));

-- 3. Orders / Bookings
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  customer_id TEXT NOT NULL,
  reading_slug TEXT NOT NULL,
  reading_name TEXT NOT NULL,
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'confirmed',
  preferred_format TEXT,
  client_question TEXT NOT NULL,
  delivery_time TEXT NOT NULL,
  scheduled_date TEXT,
  scheduled_time TEXT,
  reader_notes TEXT,
  fulfillment_url TEXT,
  meeting_link TEXT,
  fulfilled_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  FOREIGN KEY (customer_id) REFERENCES customers(id),
  FOREIGN KEY (reading_slug) REFERENCES readings(slug)
);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);

-- 4. Payments
CREATE TABLE IF NOT EXISTS payments (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL,
  provider TEXT NOT NULL DEFAULT 'paypal',
  provider_order_id TEXT,
  provider_capture_id TEXT UNIQUE,
  amount REAL NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'COMPLETED',
  raw_details TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
CREATE INDEX IF NOT EXISTS idx_payments_order_id ON payments(order_id);
CREATE INDEX IF NOT EXISTS idx_payments_capture_id ON payments(provider_capture_id);

-- 5. Contact Form Submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread',
  created_at TEXT NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_contact_created_at ON contact_submissions(created_at);

-- 6. Email Audit & Delivery Logs
CREATE TABLE IF NOT EXISTS email_logs (
  id TEXT PRIMARY KEY,
  order_id TEXT,
  recipient TEXT NOT NULL,
  type TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL,
  error_message TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(id)
);
CREATE INDEX IF NOT EXISTS idx_email_logs_order_id ON email_logs(order_id);

-- 7. Edge Distributed Rate Limiting
CREATE TABLE IF NOT EXISTS rate_limits (
  key TEXT PRIMARY KEY,
  count INTEGER NOT NULL DEFAULT 1,
  reset_at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS idx_rate_limits_reset ON rate_limits(reset_at);
