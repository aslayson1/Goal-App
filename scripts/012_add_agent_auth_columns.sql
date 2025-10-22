-- Add email and auth_user_id columns to agents table
ALTER TABLE agents ADD COLUMN email TEXT;
ALTER TABLE agents ADD COLUMN auth_user_id UUID;

-- Add unique constraints
ALTER TABLE agents ADD CONSTRAINT agents_email_unique UNIQUE (email);
ALTER TABLE agents ADD CONSTRAINT agents_auth_user_id_unique UNIQUE (auth_user_id);

-- Add indexes for performance
CREATE INDEX idx_agents_email ON agents(email);
CREATE INDEX idx_agents_auth_user_id ON agents(auth_user_id);

-- Verify columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'agents' 
AND column_name IN ('email', 'auth_user_id');
