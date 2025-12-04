-- Migration: Add user_id and RLS
-- Description: Adds user_id column to assets and events, enables RLS, and sets up policies.

-- 1. Add user_id column to assets
ALTER TABLE assets 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Add user_id column to events
ALTER TABLE events 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_assets_user_id ON assets(user_id);
CREATE INDEX IF NOT EXISTS idx_events_user_id ON events(user_id);

-- 4. Enable RLS on assets
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;

-- 5. Create RLS policies for assets

-- Policy: Users can only view their own assets
CREATE POLICY "Users can view own assets" 
ON assets FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own assets
CREATE POLICY "Users can insert own assets" 
ON assets FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own assets
CREATE POLICY "Users can update own assets" 
ON assets FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy: Users can delete their own assets
CREATE POLICY "Users can delete own assets" 
ON assets FOR DELETE 
USING (auth.uid() = user_id);

-- 6. Enable RLS on events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 7. Create RLS policies for events

-- Policy: Users can only view events for their own assets (or events they created, but usually asset ownership implies event visibility)
-- Simpler approach: Users can view events where user_id matches.
CREATE POLICY "Users can view own events" 
ON events FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own events
CREATE POLICY "Users can insert own events" 
ON events FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own events (if allowed, usually events are immutable but just in case)
CREATE POLICY "Users can update own events" 
ON events FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy: Users can delete their own events
CREATE POLICY "Users can delete own events" 
ON events FOR DELETE 
USING (auth.uid() = user_id);

-- 8. Backfill existing data (Optional: assign to a specific user if needed, or leave null)
-- For now, we assume new data will have user_id. Existing data might be hidden if user_id is null.
-- If you want to make existing data visible to a specific user, you would run:
-- UPDATE assets SET user_id = 'SPECIFIC_USER_UUID' WHERE user_id IS NULL;
-- UPDATE events SET user_id = 'SPECIFIC_USER_UUID' WHERE user_id IS NULL;
