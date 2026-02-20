-- Add company_logo_url field to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS company_logo_url TEXT;

-- No RLS policy needed since profiles table already has RLS policies for update/select
