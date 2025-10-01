-- Enable RLS on agents table (if not already enabled)
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;

-- Policy: Allow users to insert their own agents
CREATE POLICY "Users can insert their own agents"
ON agents
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Policy: Allow users to view their own agents
CREATE POLICY "Users can view their own agents"
ON agents
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Policy: Allow users to update their own agents
CREATE POLICY "Users can update their own agents"
ON agents
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Policy: Allow users to delete their own agents
CREATE POLICY "Users can delete their own agents"
ON agents
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
