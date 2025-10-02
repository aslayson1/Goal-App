-- Fix Row Level Security policies for categories table
-- This script drops and recreates the RLS policies to resolve conflicts

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own categories" ON categories;
DROP POLICY IF EXISTS "Users can insert own categories" ON categories;
DROP POLICY IF EXISTS "Users can update own categories" ON categories;
DROP POLICY IF EXISTS "Users can delete own categories" ON categories;

-- Ensure RLS is enabled
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Recreate policies with proper permissions
CREATE POLICY "Users can view own categories" 
  ON categories 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own categories" 
  ON categories 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own categories" 
  ON categories 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own categories" 
  ON categories 
  FOR DELETE 
  USING (auth.uid() = user_id);
