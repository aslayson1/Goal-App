-- Check for the most recent tasks with only basic columns
SELECT 
  id,
  title,
  target_date,
  completed_at, -- using completed_at instead of completed
  created_at,
  user_id
FROM tasks 
ORDER BY created_at DESC 
LIMIT 5;

-- Check total task count
SELECT COUNT(*) as total_tasks FROM tasks;

-- Check for any tasks created in the last hour
SELECT 
  COUNT(*) as recent_tasks
FROM tasks 
WHERE created_at > NOW() - INTERVAL '1 hour';
