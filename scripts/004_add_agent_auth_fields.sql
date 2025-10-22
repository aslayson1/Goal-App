-- Add email and auth_user_id fields to agents table
ALTER TABLE agents 
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;

-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_agents_auth_user_id ON agents(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_agents_email ON agents(email);
