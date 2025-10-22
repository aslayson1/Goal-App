-- Add email and auth_user_id columns to existing agents table
ALTER TABLE public.agents 
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS auth_user_id UUID UNIQUE;

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_agents_email ON public.agents(email);
CREATE INDEX IF NOT EXISTS idx_agents_auth_user_id ON public.agents(auth_user_id);

-- Add comment to document the columns
COMMENT ON COLUMN public.agents.email IS 'Agent login email address';
COMMENT ON COLUMN public.agents.auth_user_id IS 'Reference to Supabase Auth user ID';
