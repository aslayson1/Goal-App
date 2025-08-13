UPDATE auth.users 
SET 
  email_confirmed_at = NOW(),
  confirmed_at = NOW()
WHERE email ILIKE '%scott%' OR email ILIKE '%layson%';

-- Check the result
SELECT 
  email,
  email_confirmed_at,
  confirmed_at,
  created_at
FROM auth.users 
WHERE email ILIKE '%scott%' OR email ILIKE '%layson%';
