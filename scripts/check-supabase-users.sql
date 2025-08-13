-- Check all users in Supabase auth system
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at
FROM auth.users 
ORDER BY created_at DESC;

-- Check for Scott specifically
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at,
  CASE 
    WHEN email_confirmed_at IS NOT NULL THEN 'Confirmed'
    ELSE 'Not Confirmed'
  END as confirmation_status
FROM auth.users 
WHERE email ILIKE '%scott%' OR email ILIKE '%layson%';

-- Count total users
SELECT COUNT(*) as total_users FROM auth.users;
