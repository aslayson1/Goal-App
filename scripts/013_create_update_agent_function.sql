-- Create a PostgreSQL function to update agents with email
-- This bypasses Supabase's schema cache issue

CREATE OR REPLACE FUNCTION update_agent_with_email(
  p_agent_id UUID,
  p_name TEXT,
  p_role TEXT,
  p_description TEXT,
  p_email TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE agents
  SET 
    name = p_name,
    role = p_role,
    description = p_description,
    email = p_email,
    updated_at = NOW()
  WHERE id = p_agent_id;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION update_agent_with_email TO authenticated;
