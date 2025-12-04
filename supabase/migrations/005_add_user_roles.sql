-- Migration: Add user roles
-- Description: Adds role field to users and creates helper functions

-- 1. Add role enum type
CREATE TYPE user_role AS ENUM ('admin', 'operator');

-- 2. Create function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS TEXT AS $$
BEGIN
  RETURN (
    SELECT raw_user_meta_data->>'role'
    FROM auth.users
    WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT raw_user_meta_data->>'role' = 'admin'
    FROM auth.users
    WHERE id = user_id
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Set default role for existing users
-- WARNING: Review this before running in production
UPDATE auth.users
SET raw_user_meta_data = 
  CASE 
    WHEN email = 'tiagosantosr59@gmail.com' THEN 
      jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"admin"')
    ELSE 
      jsonb_set(COALESCE(raw_user_meta_data, '{}'::jsonb), '{role}', '"operator"')
  END
WHERE raw_user_meta_data->>'role' IS NULL;

-- 5. Create index for performance
CREATE INDEX IF NOT EXISTS idx_users_role ON auth.users ((raw_user_meta_data->>'role'));
