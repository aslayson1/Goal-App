INSERT INTO tasks (
  user_id,
  title,
  task_type,
  target_date,
  completed
) VALUES (
  (SELECT auth.uid()),
  'Test Task Minimal',
  'daily',
  CURRENT_DATE,
  false
);

-- Check if it worked
SELECT COUNT(*) as task_count FROM tasks;
SELECT * FROM tasks ORDER BY created_at DESC LIMIT 1;
