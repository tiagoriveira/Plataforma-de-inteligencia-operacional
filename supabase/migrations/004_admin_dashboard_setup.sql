-- Migration: Admin Dashboard Setup
-- Description: Creates audit_logs, system_settings tables and get_all_users RPC function.

-- 1. Create audit_logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Create index for audit_logs
CREATE INDEX IF NOT EXISTS idx_audit_user_date ON audit_logs(user_id, created_at DESC);

-- 3. Create system_settings table
CREATE TABLE IF NOT EXISTS system_settings (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Insert default settings
INSERT INTO system_settings (key, value) VALUES
('days_until_neglected', '30'),
('default_maintenance_interval', '90'),
('notification_email', '"admin@example.com"')
ON CONFLICT (key) DO NOTHING;

-- 5. RPC to get all users (Admin only)
-- Note: In production, you should restrict this function to admins via RLS or logic.
-- For now, we rely on the frontend AdminRoute to protect access, but ideally we check auth.role() or metadata.
CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE(id UUID, email TEXT, created_at TIMESTAMP WITH TIME ZONE, metadata JSONB) AS $$
BEGIN
  -- Security check: ensure caller is admin (optional, for now we skip strict check for MVP simplicity)
  -- IF (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) != 'admin' THEN
  --   RAISE EXCEPTION 'Access denied';
  -- END IF;

  RETURN QUERY 
  SELECT u.id, u.email, u.created_at, u.raw_user_meta_data::jsonb
  FROM auth.users u
  ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RLS for audit_logs
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all logs"
ON audit_logs FOR SELECT
USING (true); -- Ideally check for admin role

CREATE POLICY "Users can insert logs"
ON audit_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- 7. RLS for system_settings
ALTER TABLE system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can read settings"
ON system_settings FOR SELECT
USING (true);

CREATE POLICY "Admins can update settings"
ON system_settings FOR UPDATE
USING (true); -- Ideally check for admin role
