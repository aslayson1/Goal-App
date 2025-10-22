-- Diagnostic script to identify which Scott Layson user has all the data
-- This will help you safely identify which user to keep

-- 1. Show all Scott Layson users in auth.users
SELECT 
  id as user_id,
  email,
  created_at,
  last_sign_in_at,
  raw_user_meta_data->>'name' as name
FROM auth.users
WHERE email ILIKE '%scott%layson%'
ORDER BY created_at;

-- 2. Count categories owned by each Scott Layson user
SELECT 
  u.email,
  u.id as user_id,
  COUNT(c.id) as category_count
FROM auth.users u
LEFT JOIN categories c ON c.user_id = u.id
WHERE u.email ILIKE '%scott%layson%'
GROUP BY u.id, u.email
ORDER BY category_count DESC;

-- 3. Count goals owned by each Scott Layson user
SELECT 
  u.email,
  u.id as user_id,
  COUNT(g.id) as goal_count
FROM auth.users u
LEFT JOIN goals g ON g.user_id = u.id
WHERE u.email ILIKE '%scott%layson%'
GROUP BY u.id, u.email
ORDER BY goal_count DESC;

-- 4. Count tasks owned by each Scott Layson user
SELECT 
  u.email,
  u.id as user_id,
  COUNT(t.id) as task_count
FROM auth.users u
LEFT JOIN tasks t ON t.user_id = u.id
WHERE u.email ILIKE '%scott%layson%'
GROUP BY u.id, u.email
ORDER BY task_count DESC;

-- 5. Count agents owned by each Scott Layson user
SELECT 
  u.email,
  u.id as user_id,
  COUNT(a.id) as agent_count
FROM auth.users u
LEFT JOIN agents a ON a.user_id = u.id
WHERE u.email ILIKE '%scott%layson%'
GROUP BY u.id, u.email
ORDER BY agent_count DESC;

-- 6. Summary: Total records for each Scott Layson user
SELECT 
  u.email,
  u.id as user_id,
  u.created_at,
  u.last_sign_in_at,
  COUNT(DISTINCT c.id) as categories,
  COUNT(DISTINCT g.id) as goals,
  COUNT(DISTINCT t.id) as tasks,
  COUNT(DISTINCT a.id) as agents,
  (COUNT(DISTINCT c.id) + COUNT(DISTINCT g.id) + COUNT(DISTINCT t.id) + COUNT(DISTINCT a.id)) as total_records
FROM auth.users u
LEFT JOIN categories c ON c.user_id = u.id
LEFT JOIN goals g ON g.user_id = u.id
LEFT JOIN tasks t ON t.user_id = u.id
LEFT JOIN agents a ON a.user_id = u.id
WHERE u.email ILIKE '%scott%layson%'
GROUP BY u.id, u.email, u.created_at, u.last_sign_in_at
ORDER BY total_records DESC;
