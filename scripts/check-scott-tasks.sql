-- Check all tasks for scott@laysongroup.com
SELECT 
  id,
  title,
  task_type,
  completed,
  target_date,
  category_id,
  created_at
FROM tasks
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'scott@laysongroup.com')
ORDER BY task_type, target_date, title;

-- Specifically look for "Buy Car1"
SELECT 
  id,
  title,
  task_type,
  completed,
  target_date,
  category_id,
  user_id,
  created_at
FROM tasks
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'scott@laysongroup.com')
  AND title ILIKE '%Buy Car1%';

-- Count tasks by type and completion status
SELECT 
  task_type,
  completed,
  COUNT(*) as count
FROM tasks
WHERE user_id = (SELECT id FROM auth.users WHERE email = 'scott@laysongroup.com')
GROUP BY task_type, completed
ORDER BY task_type, completed;
