-- Delete all tasks with target_date before today (Sept 30, 2025)
-- This will remove all the old test tasks that have incorrect dates
DELETE FROM tasks 
WHERE target_date < '2025-09-30' 
AND user_id = (SELECT id FROM auth.users LIMIT 1);

-- Show remaining tasks
SELECT 
  title,
  task_type,
  target_date,
  TO_CHAR(target_date, 'Day') as day_of_week,
  completed,
  created_at
FROM tasks
WHERE user_id = (SELECT id FROM auth.users LIMIT 1)
ORDER BY target_date, created_at;
