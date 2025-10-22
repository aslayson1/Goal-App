-- Update Sarah Layson's auth user metadata to include her name
-- This will fix the profile initials and greeting

UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{name}',
  '"Sarah Layson"'
)
WHERE email = 'sarah@laysongroup.com';

-- Verify the update
SELECT 
  id,
  email,
  raw_user_meta_data->>'name' as name
FROM auth.users
WHERE email = 'sarah@laysongroup.com';
