-- Check if Scott Layson's account exists in Supabase auth
-- This will show all users in the auth.users table
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at
FROM auth.users 
WHERE email ILIKE '%scott%' OR email ILIKE '%layson%'
ORDER BY created_at DESC;

-- Also check total user count
SELECT COUNT(*) as total_users FROM auth.users;
