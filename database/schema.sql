-- Create the products table
CREATE TABLE products (
  sku TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);

-- Insert initial product data
INSERT INTO products (sku, name, price)
VALUES
  ('ipd', 'Super iPad', 549.99),
  ('mbp', 'MacBook Pro', 1399.99),
  ('atv', 'Apple TV', 109.50),
  ('vga', 'VGA adapter', 30.00);

-- Create the pricing_rules table
CREATE TABLE pricing_rules (
  id SERIAL PRIMARY KEY,
  sku TEXT NOT NULL,
  type TEXT NOT NULL,
  parameters JSONB NOT NULL,
  FOREIGN KEY (sku) REFERENCES products (sku)
);

-- Insert initial pricing rule data
INSERT INTO pricing_rules (sku, type, parameters)
VALUES
  ('atv', 'quantity_discount', '{"quantity_threshold": 3, "discounted_quantity": 2}'),
  ('ipd', 'quantity_discount', '{"quantity_threshold": 4, "discounted_price": 499.99}'),
  ('mbp', 'bundle', '{"bundle_item_sku": "vga", "bundle_item_quantity": 1}');