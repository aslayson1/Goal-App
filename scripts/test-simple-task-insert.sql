-- Test simple task insertion to verify database works
INSERT INTO tasks (
  user_id,
  title,
  task_type,
  target_date,
  completed
) VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'Test Task Simple',
  'daily',
  CURRENT_DATE,
  false
);

-- Verify the task was inserted
SELECT COUNT(*) as task_count FROM tasks;
SELECT * FROM tasks ORDER BY created_at DESC LIMIT 1;
