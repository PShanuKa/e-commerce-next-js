-- ============================================================
-- ShopLK E-Commerce Database Schema
-- Run this once to initialize the database tables
-- ============================================================

-- Users (customers + admin)
CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  email       VARCHAR(200) UNIQUE NOT NULL,
  phone       VARCHAR(20),
  password_hash TEXT NOT NULL,
  role        VARCHAR(20) NOT NULL DEFAULT 'customer', -- 'customer' | 'admin'
  avatar_url  TEXT,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(120) NOT NULL,
  slug        VARCHAR(120) UNIQUE NOT NULL,
  image_url   TEXT,
  parent_id   INT REFERENCES categories(id) ON DELETE SET NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id              SERIAL PRIMARY KEY,
  name            VARCHAR(300) NOT NULL,
  slug            VARCHAR(300) UNIQUE NOT NULL,
  description     TEXT,
  price           NUMERIC(12, 2) NOT NULL,
  original_price  NUMERIC(12, 2),
  stock_qty       INT NOT NULL DEFAULT 0,
  category_id     INT REFERENCES categories(id) ON DELETE SET NULL,
  brand           VARCHAR(100),
  badge           VARCHAR(50),
  is_active       BOOLEAN DEFAULT TRUE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Product Images
CREATE TABLE IF NOT EXISTS product_images (
  id          SERIAL PRIMARY KEY,
  product_id  INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,
  sort_order  INT DEFAULT 0
);

-- Cart Items
CREATE TABLE IF NOT EXISTS cart_items (
  id          SERIAL PRIMARY KEY,
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id  INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  quantity    INT NOT NULL DEFAULT 1,
  variant     VARCHAR(100),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Addresses
CREATE TABLE IF NOT EXISTS addresses (
  id            SERIAL PRIMARY KEY,
  user_id       INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name          VARCHAR(120) NOT NULL,
  phone         VARCHAR(20) NOT NULL,
  address_line1 VARCHAR(255) NOT NULL,
  address_line2 VARCHAR(255),
  city          VARCHAR(100) NOT NULL,
  postal_code   VARCHAR(20),
  province      VARCHAR(100),
  is_default    BOOLEAN DEFAULT FALSE,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id                SERIAL PRIMARY KEY,
  user_id           INT NOT NULL REFERENCES users(id) ON DELETE SET NULL,
  address_id        INT REFERENCES addresses(id) ON DELETE SET NULL,
  status            VARCHAR(30) NOT NULL DEFAULT 'pending',
                    -- pending | processing | shipped | delivered | cancelled
  total             NUMERIC(14, 2) NOT NULL,
  delivery_fee      NUMERIC(10, 2) NOT NULL DEFAULT 0,
  coupon_discount   NUMERIC(10, 2) DEFAULT 0,
  payment_method    VARCHAR(30) DEFAULT 'cod',
  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- Order Items
CREATE TABLE IF NOT EXISTS order_items (
  id          SERIAL PRIMARY KEY,
  order_id    INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  INT REFERENCES products(id) ON DELETE SET NULL,
  name        VARCHAR(300) NOT NULL,
  price       NUMERIC(12, 2) NOT NULL,
  quantity    INT NOT NULL,
  image_url   TEXT,
  variant     VARCHAR(100)
);

-- Wishlist
CREATE TABLE IF NOT EXISTS wishlist (
  id          SERIAL PRIMARY KEY,
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id  INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Reviews
CREATE TABLE IF NOT EXISTS reviews (
  id          SERIAL PRIMARY KEY,
  user_id     INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  product_id  INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_cart_user ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_product ON reviews(product_id);

-- Insert default admin user (password: Admin@1234)
INSERT INTO users (name, email, phone, password_hash, role)
VALUES (
  'Admin',
  'admin@shoplk.lk',
  '+94771234567',
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
  'admin'
) ON CONFLICT (email) DO NOTHING;

-- Insert sample categories
INSERT INTO categories (name, slug, image_url) VALUES
  ('Electronics', 'electronics', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=200'),
  ('Fashion', 'fashion', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=200'),
  ('Home & Garden', 'home-garden', 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200'),
  ('Sports', 'sports', 'https://images.unsplash.com/photo-1517344368193-41552b6ad3f5?w=200'),
  ('Books', 'books', 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=200'),
  ('Beauty', 'beauty', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200')
ON CONFLICT (slug) DO NOTHING;
