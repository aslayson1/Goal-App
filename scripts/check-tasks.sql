-- Updated to use correct column names from actual database schema
-- Check for recent tasks in the database
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
LIMIT 10;

-- Check specifically for the "Test" task
SELECT 
  COUNT(*) as test_task_count,
  CASE 
    WHEN COUNT(*) > 0
    THEN '✅ Test task found in database!'
    ELSE '❌ Test task not found in database'
  END as test_task_status
FROM tasks 
WHERE title = 'Test';

-- Show total task count
SELECT COUNT(*) as total_tasks FROM tasks;
