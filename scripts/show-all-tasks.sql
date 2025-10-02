-- Updated table name from task_events to tasks
SELECT 
  id,
  title,
  description,
  task_type,
  target_date,
  completed,
  created_at,
  user_id,
  category_id,
  goal_id
FROM tasks 
ORDER BY created_at DESC;
