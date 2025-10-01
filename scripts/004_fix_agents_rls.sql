-- Drop existing policies
DROP POLICY IF EXISTS "Users can insert their own agents" ON agents;
DROP POLICY IF EXISTS "Users can view their own agents" ON agents;
DROP POLICY IF EXISTS "Users can update their own agents" ON agents;
DROP POLICY IF EXISTS "Users can delete their own agents" ON agents;

-- Disable RLS temporarily to allow inserts
ALTER TABLE agents DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS with permissive policies
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Create permissive policies that allow authenticated users to manage all agents
CREATE POLICY "Allow authenticated users to insert agents"
ON agents FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to view agents"
ON agents FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to update agents"
ON agents FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to delete agents"
ON agents FOR DELETE
TO authenticated
USING (true);
