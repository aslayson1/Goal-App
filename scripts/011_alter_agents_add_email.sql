-- Add email and auth_user_id columns to the existing agents table
ALTER TABLE agents ADD COLUMN email TEXT;
ALTER TABLE agents ADD COLUMN auth_user_id UUID;

-- Make email unique (separate command to avoid conflicts)
ALTER TABLE agents ADD CONSTRAINT agents_email_unique UNIQUE (email);
ALTER TABLE agents ADD CONSTRAINT agents_auth_user_id_unique UNIQUE (auth_user_id);

-- Add indexes
CREATE INDEX idx_agents_email ON agents(email);
CREATE INDEX idx_agents_auth_user_id ON agents(auth_user_id);

-- Verify the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'agents' 
ORDER BY ordinal_position;
