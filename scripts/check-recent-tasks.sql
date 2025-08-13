-- Check for the most recent tasks to see if they're being saved
SELECT 
  id,
  title,
  task_type,
  target_date,
  completed,
  created_at,
  user_id,
  goal_id,
  category_id
FROM tasks 
ORDER BY created_at DESC 
LIMIT 5;

-- Check total task count
SELECT COUNT(*) as total_tasks FROM tasks;

-- Check for any tasks created in the last hour
SELECT 
  COUNT(*) as recent_tasks,
  CASE 
    WHEN COUNT(*) > 0
    THEN '✅ Recent tasks found in database!'
    ELSE '❌ No recent tasks found in database'
  END as recent_task_status
FROM tasks 
WHERE created_at > NOW() - INTERVAL '1 hour';
