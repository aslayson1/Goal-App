-- Add email and auth_user_id fields to agents table
-- Version 2: Simplified without foreign key constraint to auth schema

ALTER TABLE agents 
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;

-- Add indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_agents_auth_user_id ON agents(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_agents_email ON agents(email);

-- Add comment to document the relationship
COMMENT ON COLUMN agents.auth_user_id IS 'References auth.users(id) - Supabase Auth user ID for agent login';
