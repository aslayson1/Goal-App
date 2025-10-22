-- Add email and auth_user_id columns to agents table
-- Run this in your Supabase SQL Editor

ALTER TABLE agents 
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_agents_email ON agents(email);
CREATE INDEX IF NOT EXISTS idx_agents_auth_user_id ON agents(auth_user_id);
