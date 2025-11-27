/*
  # Product Database Schema

  1. New Tables
    - `scanned_products`
      - Product information from scans
      - Includes all nutritional and dietary information
    - `product_certifications`
      - Many-to-many relationship for product certifications
    - `product_allergens`
      - Many-to-many relationship for allergens
    - `scan_history`
      - Record of all product scans
      - Includes scan quality metrics

  2. Security
    - Enable RLS on all tables
    - Policies for user access control
*/

-- Product Categories enum
CREATE TYPE product_category AS ENUM (
  'dairy',
  'produce',
  'meat',
  'grains',
  'snacks',
  'beverages',
  'pantry',
  'frozen',
  'other'
);

-- Scanned Products Table
CREATE TABLE IF NOT EXISTS scanned_products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  barcode text UNIQUE,
  name text NOT NULL,
  brand text NOT NULL,
  manufacturer text,
  category product_category NOT NULL DEFAULT 'other',
  weight_value decimal,
  weight_unit text,
  serving_size text,
  calories integer,
  protein decimal,
  carbs decimal,
  fat decimal,
  fiber decimal,
  sugar decimal,
  ingredients text[],
  is_vegan boolean DEFAULT false,
  is_vegetarian boolean DEFAULT false,
  is_gluten_free boolean DEFAULT false,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users NOT NULL
);

-- Product Certifications Table
CREATE TABLE IF NOT EXISTS product_certifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES scanned_products ON DELETE CASCADE,
  certification text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, certification)
);

-- Product Allergens Table
CREATE TABLE IF NOT EXISTS product_allergens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES scanned_products ON DELETE CASCADE,
  allergen text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, allergen)
);

-- Scan History Table
CREATE TABLE IF NOT EXISTS scan_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  product_id uuid REFERENCES scanned_products,
  scan_quality decimal CHECK (scan_quality BETWEEN 0 AND 1),
  lighting_condition text,
  scan_duration integer, -- in milliseconds
  successful boolean DEFAULT true,
  error_message text,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE scanned_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_certifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_allergens ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for scanned_products
CREATE POLICY "Users can view all products"
  ON scanned_products
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can insert their own products"
  ON scanned_products
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own products"
  ON scanned_products
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by)
  WITH CHECK (auth.uid() = created_by);

-- RLS Policies for product_certifications
CREATE POLICY "Users can view all certifications"
  ON product_certifications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage certifications for their products"
  ON product_certifications
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM scanned_products
      WHERE id = product_id AND created_by = auth.uid()
    )
  );

-- RLS Policies for product_allergens
CREATE POLICY "Users can view all allergens"
  ON product_allergens
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage allergens for their products"
  ON product_allergens
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM scanned_products
      WHERE id = product_id AND created_by = auth.uid()
    )
  );

-- RLS Policies for scan_history
CREATE POLICY "Users can view their own scan history"
  ON scan_history
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scan history"
  ON scan_history
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Indexes for better query performance
CREATE INDEX idx_products_barcode ON scanned_products(barcode);
CREATE INDEX idx_products_brand ON scanned_products(brand);
CREATE INDEX idx_products_category ON scanned_products(category);
CREATE INDEX idx_scan_history_user ON scan_history(user_id);
CREATE INDEX idx_scan_history_product ON scan_history(product_id);

-- Updated trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Add trigger to scanned_products
CREATE TRIGGER update_scanned_products_updated_at
  BEFORE UPDATE ON scanned_products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();