-- Add email column to agents table (simplified version)
ALTER TABLE agents ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE agents ADD COLUMN IF NOT EXISTS auth_user_id UUID;

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_agents_email ON agents(email);
CREATE INDEX IF NOT EXISTS idx_agents_auth_user_id ON agents(auth_user_id);

-- Add unique constraints
ALTER TABLE agents ADD CONSTRAINT agents_email_unique UNIQUE (email);
ALTER TABLE agents ADD CONSTRAINT agents_auth_user_id_unique UNIQUE (auth_user_id);
