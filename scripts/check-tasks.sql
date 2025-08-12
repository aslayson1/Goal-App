-- Check for recent tasks in the database
SELECT 
  id,
  title,
  task_type,
  target_date,
  completed,
  created_at
FROM tasks 
ORDER BY created_at DESC 
LIMIT 10;

-- Check specifically for the "Test" task
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM tasks WHERE title = 'Test') 
    THEN '✅ Test task found in database!'
    ELSE '❌ Test task not found in database'
  END as test_task_status;
