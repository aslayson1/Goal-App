-- First, find Sarah's auth user by email
SELECT 
  id,
  email,
  raw_user_meta_data,
  raw_user_meta_data->>'name' as current_name
FROM auth.users
WHERE email ILIKE '%sarah%layson%';

-- If the above returns a user, copy the ID and run this update:
-- Replace 'USER_ID_HERE' with the actual ID from the query above
UPDATE auth.users
SET raw_user_meta_data = jsonb_set(
  COALESCE(raw_user_meta_data, '{}'::jsonb),
  '{name}',
  '"Sarah Layson"'
)
WHERE id = '21ef6093-e944-4bbf-aba3-cbe018d6951f';

-- Verify the update
SELECT 
  id,
  email,
  raw_user_meta_data->>'name' as name
FROM auth.users
WHERE id = '21ef6093-e944-4bbf-aba3-cbe018d6951f';
