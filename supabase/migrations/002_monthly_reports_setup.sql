-- Migration: Monthly Reports Setup
-- Description: Creates table for storing report metadata and sets up storage bucket.

-- 1. Create monthly_reports table
CREATE TABLE IF NOT EXISTS monthly_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  report_month DATE NOT NULL,
  pdf_url VARCHAR(500),
  email_sent BOOLEAN DEFAULT FALSE,
  generated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, report_month)
);

-- 2. Create index
CREATE INDEX IF NOT EXISTS idx_reports_user_month ON monthly_reports(user_id, report_month DESC);

-- 3. Create storage bucket for reports (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('monthly-reports', 'monthly-reports', true)
ON CONFLICT (id) DO NOTHING;

-- 4. RLS for storage bucket
CREATE POLICY "Admin can upload reports"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'monthly-reports' AND auth.role() = 'service_role');

CREATE POLICY "Users can view their reports"
ON storage.objects FOR SELECT
USING (bucket_id = 'monthly-reports' AND auth.role() = 'authenticated');
