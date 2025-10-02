-- Enable Row Level Security on agents table
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own agents" ON agents;
DROP POLICY IF EXISTS "Users can insert own agents" ON agents;
DROP POLICY IF EXISTS "Users can update own agents" ON agents;
DROP POLICY IF EXISTS "Users can delete own agents" ON agents;

-- Create policy for SELECT - users can view their own agents
CREATE POLICY "Users can view own agents"
  ON agents
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for INSERT - users can insert their own agents
CREATE POLICY "Users can insert own agents"
  ON agents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy for UPDATE - users can update their own agents
CREATE POLICY "Users can update own agents"
  ON agents
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy for DELETE - users can delete their own agents
CREATE POLICY "Users can delete own agents"
  ON agents
  FOR DELETE
  USING (auth.uid() = user_id);
