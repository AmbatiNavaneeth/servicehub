/*
# Create ServiceHub tables (coupons, services, bookings)

## Purpose
Provisions the database schema for the ServiceHub Django REST API backend.
These tables mirror the existing Django models in backend/api/models.py so the
Django ORM can read/write them when connected to Supabase Postgres.

## New Tables

1. `services`
   - `id` bigserial primary key (matches Django BigAutoField)
   - `slug` text, unique, not null — URL-safe service identifier
   - `title` text, not null — display name
   - `image` text, not null — image URL
   - `price` numeric(10,2), not null — service price

2. `coupons`
   - `id` bigserial primary key
   - `code` text, unique, not null — coupon code (e.g. WELCOME50)
   - `type` text, not null — 'percentage' or 'flat'
   - `value` numeric(10,2), not null — discount value (percentage or flat amount)
   - `min_order` numeric(10,2), not null default 0 — minimum order amount
   - `max_discount` numeric(10,2), nullable — cap on percentage discounts
   - `description` text, not null — human-readable description
   - `active` boolean, not null default true — whether coupon is usable

3. `bookings`
   - `id` bigserial primary key
   - `booking_id` text, unique, not null — human-facing booking reference
   - `service_id` text, not null — reference to service
   - `service_title` text, not null — snapshot of service title
   - `service_image` text, not null — snapshot of service image URL
   - `service_price` numeric(10,2), not null — snapshot of service price
   - `date` text, not null — booking date (stored as text per Django model)
   - `time_slot` text, not null — selected time slot
   - `address` text, not null — service address
   - `contact_number` text, not null — customer contact
   - `instructions` text, not null default '' — optional instructions
   - `status` text, not null default 'upcoming' — upcoming/completed/cancelled
   - `payment_status` text, not null default 'pending' — paid/pending/refunded
   - `coupon_code` text, not null default '' — applied coupon if any
   - `discount_amount` numeric(10,2), not null default 0
   - `final_price` numeric(10,2), not null default 0
   - `created_at` timestamptz, not null default now()

## Security (RLS)
This is a single-tenant application with no sign-in requirement (the Django API
uses AllowAny permissions). All tables use `TO anon, authenticated` with
`USING (true)` / `WITH CHECK (true)` so the backend service role and anon key
can perform full CRUD. The data is intentionally public/shared.

## Notes
1. Column names use snake_case which Django ORM maps automatically.
2. BigSerial PKs match Django's BigAutoField for seamless ORM compatibility.
3. Decimal columns use numeric(10,2) to match Django's max_digits=10, decimal_places=2.
*/

CREATE TABLE IF NOT EXISTS services (
  id bigserial PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  image text NOT NULL,
  price numeric(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS coupons (
  id bigserial PRIMARY KEY,
  code text UNIQUE NOT NULL,
  type text NOT NULL,
  value numeric(10,2) NOT NULL,
  min_order numeric(10,2) NOT NULL DEFAULT 0,
  max_discount numeric(10,2),
  description text NOT NULL,
  active boolean NOT NULL DEFAULT true
);

CREATE TABLE IF NOT EXISTS bookings (
  id bigserial PRIMARY KEY,
  booking_id text UNIQUE NOT NULL,
  service_id text NOT NULL,
  service_title text NOT NULL,
  service_image text NOT NULL,
  service_price numeric(10,2) NOT NULL,
  date text NOT NULL,
  time_slot text NOT NULL,
  address text NOT NULL,
  contact_number text NOT NULL,
  instructions text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'upcoming',
  payment_status text NOT NULL DEFAULT 'pending',
  coupon_code text NOT NULL DEFAULT '',
  discount_amount numeric(10,2) NOT NULL DEFAULT 0,
  final_price numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_crud_services" ON services;
CREATE POLICY "anon_crud_services" ON services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_services" ON services FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_services" ON services FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_services" ON services FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_crud_coupons" ON coupons;
CREATE POLICY "anon_select_coupons" ON coupons FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_coupons" ON coupons FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_coupons" ON coupons FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_coupons" ON coupons FOR DELETE TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_crud_bookings" ON bookings;
CREATE POLICY "anon_select_bookings" ON bookings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "anon_insert_bookings" ON bookings FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "anon_update_bookings" ON bookings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "anon_delete_bookings" ON bookings FOR DELETE TO anon, authenticated USING (true);
