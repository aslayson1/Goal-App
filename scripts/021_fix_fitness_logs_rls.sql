-- Allow authenticated users to view all fitness logs (needed for leaderboard)
-- This enables the leaderboard to count workouts across all users

-- First, drop the restrictive policy if it exists
DROP POLICY IF EXISTS "Users can view their own fitness logs" ON fitness_logs;

-- Create a new policy that allows viewing all fitness logs for authenticated users
CREATE POLICY "Authenticated users can view all fitness logs"
ON fitness_logs
FOR SELECT
TO authenticated
USING (true);

-- Keep the insert/update/delete policies restricted to own records
-- (these should already exist, but ensure they're correct)
DROP POLICY IF EXISTS "Users can insert their own fitness logs" ON fitness_logs;
CREATE POLICY "Users can insert their own fitness logs"
ON fitness_logs
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own fitness logs" ON fitness_logs;
CREATE POLICY "Users can update their own fitness logs"
ON fitness_logs
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own fitness logs" ON fitness_logs;
CREATE POLICY "Users can delete their own fitness logs"
ON fitness_logs
FOR DELETE
TO authenticated
USING (auth.uid() = user_id);
