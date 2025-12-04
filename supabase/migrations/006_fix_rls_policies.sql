-- Migration: Fix RLS policies with role verification
-- Description: Updates RLS policies to check user roles

-- 1. Drop old insecure policies
DROP POLICY IF EXISTS "Admins can view all logs" ON audit_logs;
DROP POLICY IF EXISTS "Everyone can read settings" ON system_settings;
DROP POLICY IF EXISTS "Admins can update settings" ON system_settings;

-- 2. Create new secure policies for audit_logs
CREATE POLICY "Admins can view all logs"
ON audit_logs FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

CREATE POLICY "Users can view own logs"
ON audit_logs FOR SELECT
USING (auth.uid() = user_id);

-- 3. Create new secure policies for system_settings
CREATE POLICY "Everyone can read settings"
ON system_settings FOR SELECT
USING (true);

CREATE POLICY "Only admins can update settings"
ON system_settings FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

CREATE POLICY "Only admins can insert settings"
ON system_settings FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  )
);

CREATE POLICY "Only admins can delete settings"
ON system_settings FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'role' = 'admin'
  )
);
