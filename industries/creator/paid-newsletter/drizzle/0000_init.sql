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
