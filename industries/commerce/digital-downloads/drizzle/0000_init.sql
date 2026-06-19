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

-- Products
create table if not exists download_products (
  id text primary key,
  name text not null,
  category_label text not null,
  status text not null,
  delivery_label text not null,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

-- Orders
create table if not exists download_orders (
  id text primary key,
  product_id text not null,
  buyer_email text not null,
  status text not null,
  fulfillment_label text not null,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

-- Entitlements
create table if not exists download_entitlements (
  id text primary key,
  product_id text not null,
  buyer_email text not null,
  access_state text not null,
  download_label text not null,
  created_at timestamp not null default now(),
  updated_at timestamp not null default now()
);

-- UGC tables
create table if not exists ugc_reviews (
  id text primary key,
  app_user_id text not null references users(id),
  author_name text not null,
  author_initials text not null,
  context_kind text not null,
  context_slug text not null,
  rating integer not null,
  body text not null,
  created_at timestamp not null default now()
);
create index if not exists ugc_reviews_context_idx on ugc_reviews(context_kind, context_slug);;

-- UGC tables
create table if not exists ugc_questions (
  id text primary key,
  course_slug text not null,
  lesson_id text,
  asker_name text not null,
  asker_initials text not null,
  body text not null,
  answer_count integer not null default 0,
  created_at timestamp not null default now()
);
create index if not exists ugc_questions_course_idx on ugc_questions(course_slug);;

-- UGC tables
create table if not exists ugc_answers (
  id text primary key,
  question_id text not null references ugc_questions(id) on delete cascade,
  author_name text not null,
  author_initials text not null,
  body text not null,
  upvotes integer not null default 0,
  is_accepted text not null default 'false',
  created_at timestamp not null default now()
);
create index if not exists ugc_answers_question_idx on ugc_answers(question_id);;
