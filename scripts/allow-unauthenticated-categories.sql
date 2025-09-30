-- Allow unauthenticated access to categories table
-- This is needed because the app doesn't have authentication set up yet

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Users can view own categories" ON categories;
DROP POLICY IF EXISTS "Users can insert own categories" ON categories;
DROP POLICY IF EXISTS "Users can update own categories" ON categories;
DROP POLICY IF EXISTS "Users can delete own categories" ON categories;

-- Create permissive policies that allow all operations
-- These can be tightened later when authentication is properly implemented

CREATE POLICY "Allow all to view categories"
ON categories FOR SELECT
USING (true);

CREATE POLICY "Allow all to insert categories"
ON categories FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow all to update categories"
ON categories FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow all to delete categories"
ON categories FOR DELETE
USING (true);
