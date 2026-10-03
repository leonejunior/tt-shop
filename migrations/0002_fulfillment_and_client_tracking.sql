-- Additional fulfillment & relationship tracking migration for tt-shop

-- Add fulfillment and reader management fields to orders
ALTER TABLE orders ADD COLUMN reader_notes TEXT;
ALTER TABLE orders ADD COLUMN fulfillment_url TEXT;
ALTER TABLE orders ADD COLUMN meeting_link TEXT;
ALTER TABLE orders ADD COLUMN fulfilled_at TEXT;

-- Add client relationship and social handle tracking to customers
ALTER TABLE customers ADD COLUMN social_handle TEXT;
ALTER TABLE customers ADD COLUMN notes TEXT;
