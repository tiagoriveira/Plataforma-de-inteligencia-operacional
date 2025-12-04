-- Migration: Protect get_all_users function
-- Description: Adds admin role verification to get_all_users RPC

DROP FUNCTION IF EXISTS get_all_users();

CREATE OR REPLACE FUNCTION get_all_users()
RETURNS TABLE(id UUID, email TEXT, created_at TIMESTAMP WITH TIME ZONE, metadata JSONB) AS $$
BEGIN
  -- Security check: ensure caller is admin
  IF (SELECT raw_user_meta_data->>'role' FROM auth.users WHERE id = auth.uid()) != 'admin' THEN
    RAISE EXCEPTION 'Access denied: Admin role required';
  END IF;

  RETURN QUERY 
  SELECT u.id, u.email, u.created_at, u.raw_user_meta_data::jsonb
  FROM auth.users u
  ORDER BY u.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
