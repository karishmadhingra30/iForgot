-- Test User Setup for Local Development
-- This script creates a dummy test user in the Supabase auth.users table
-- to satisfy foreign key constraints during local testing.

-- WARNING: Only run this in your LOCAL/DEVELOPMENT Supabase instance!
-- DO NOT run this in production.

-- Insert test user with the UUID used throughout the codebase
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  recovery_sent_at,
  last_sign_in_at,
  raw_app_meta_data,
  raw_user_meta_data,
  created_at,
  updated_at,
  confirmation_token,
  email_change,
  email_change_token_new,
  recovery_token
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  '00000000-0000-0000-0000-000000000001',  -- This is the UUID used in the app
  'authenticated',
  'authenticated',
  'demo@test.com',
  '$2a$10$dummyencryptedpasswordhash1234567890',  -- Dummy encrypted password
  NOW(),
  NOW(),
  NOW(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Test User"}',
  NOW(),
  NOW(),
  '',
  '',
  '',
  ''
)
ON CONFLICT (id) DO NOTHING;  -- Skip if user already exists

-- Verify the user was created
SELECT id, email, created_at FROM auth.users WHERE id = '00000000-0000-0000-0000-000000000001';
