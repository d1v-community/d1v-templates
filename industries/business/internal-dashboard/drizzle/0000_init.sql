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

-- KPI snapshots
create table if not exists kpi_snapshots (
  id text primary key,
  metric_name text not null,
  metric_value text not null,
  status text not null,
  owner_label text not null,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

-- Ops tasks
create table if not exists ops_tasks (
  id text primary key,
  title text not null,
  owner_label text not null,
  status text not null,
  priority_label text not null,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

-- Audit events
create table if not exists audit_events (
  id text primary key,
  event_title text not null,
  event_type text not null,
  actor_label text not null,
  context_label text not null,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);
