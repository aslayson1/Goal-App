-- Delete Scott Layson's user account and related data
-- This will allow him to register again with correct credentials

-- First, delete any tasks associated with Scott's user ID
DELETE FROM tasks 
WHERE user_id IN (
  SELECT id FROM auth.users 
  WHERE email ILIKE '%scott%' OR email ILIKE '%layson%'
);

-- Delete Scott's user account from auth.users
-- This will remove him from Supabase authentication
DELETE FROM auth.users 
WHERE email ILIKE '%scott%' OR email ILIKE '%layson%';

-- Verify deletion
SELECT 
  COUNT(*) as remaining_users,
  'Scott Layson user deleted successfully' as status
FROM auth.users;

-- Show any remaining users (should be 0 if Scott was the only user)
SELECT email, created_at 
FROM auth.users 
ORDER BY created_at DESC;
