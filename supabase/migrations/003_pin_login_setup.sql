-- Migration: PIN Login Setup
-- Description: Creates RPC function to validate user PIN stored in metadata.

-- Function to validate PIN for the current authenticated user
CREATE OR REPLACE FUNCTION verify_my_pin(pin_input TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  stored_pin TEXT;
BEGIN
  -- Get the PIN from the current user's metadata
  SELECT raw_user_meta_data->>'pin' INTO stored_pin
  FROM auth.users
  WHERE id = auth.uid();
  
  -- Return true if PIN matches, false otherwise
  -- If no PIN is set, return false (or true if we want to force setup? Let's say false)
  RETURN stored_pin IS NOT NULL AND stored_pin = pin_input;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
