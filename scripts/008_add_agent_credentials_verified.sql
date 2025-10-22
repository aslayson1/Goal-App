-- First, verify the agents table exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'agents') THEN
        RAISE EXCEPTION 'agents table does not exist in public schema';
    END IF;
END $$;

-- Add email column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'agents' 
                   AND column_name = 'email') THEN
        ALTER TABLE agents ADD COLUMN email TEXT UNIQUE;
    END IF;
END $$;

-- Add auth_user_id column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.columns 
                   WHERE table_schema = 'public' 
                   AND table_name = 'agents' 
                   AND column_name = 'auth_user_id') THEN
        ALTER TABLE agents ADD COLUMN auth_user_id UUID UNIQUE;
    END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_agents_email ON agents(email);
CREATE INDEX IF NOT EXISTS idx_agents_auth_user_id ON agents(auth_user_id);
