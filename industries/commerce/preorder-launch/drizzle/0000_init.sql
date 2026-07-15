-- Users table
create table if not exists users (
  id text primary key,
  username text not null,
  display_name text,
  email text,
  avatar_url text,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

-- Email verification codes
create table if not exists verification_codes (
  id text primary key,
  email text not null,
  code text not null,
  purpose text not null default 'login',
  expires_at timestamp not null,
  used text not null default 'false',
  created_at timestamp not null default now()
);
create index if not exists verification_codes_email_idx on verification_codes(email);
create index if not exists verification_codes_email_purpose_idx on verification_codes(email, purpose);

-- Payment checkout requests
create table if not exists payment_checkout_requests (
  id text primary key,
  app_user_id text not null references users(id),
  external_buyer_user_id text not null,
  product_id text not null,
  checkout_status text not null,
  payment_link_url text,
  success_url text not null,
  cancel_url text not null,
  last_transaction_id text,
  last_error text,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

-- Payment webhook events
create table if not exists payment_webhook_events (
  id text primary key,
  event_type text not null,
  transaction_id text,
  signature text,
  payload_json text not null,
  processing_status text not null,
  error_message text,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

-- Payment entitlements
create table if not exists payment_entitlements (
  id text primary key,
  app_user_id text not null references users(id),
  product_id text not null,
  entitlement_status text not null,
  access_label text not null,
  source text not null,
  last_transaction_id text,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

-- Payment fulfillment records
create table if not exists payment_fulfillments (
  id text primary key,
  app_user_id text not null references users(id),
  product_id text not null,
  transaction_id text not null,
  business_entity text not null,
  business_record_id text not null,
  fulfillment_status text not null,
  fulfillment_source text not null,
  summary_label text not null,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

-- Launch offers
create table if not exists launch_offers (
  id text primary key,
  name text not null,
  price_label text not null,
  launch_state text not null,
  timeline_label text not null,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

-- Preorders
create table if not exists preorders (
  id text primary key,
  offer_id text not null,
  customer_email text not null,
  status text not null,
  reservation_label text not null,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

-- Shipment updates
create table if not exists shipment_updates (
  id text primary key,
  offer_id text not null,
  update_title text not null,
  delivery_state text not null,
  audience_label text not null,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);
