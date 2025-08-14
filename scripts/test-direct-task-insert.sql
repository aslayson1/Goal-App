-- Test direct task insertion to verify database works
INSERT INTO tasks (
  user_id,
  title,
  task_type,
  target_date,
  completed
) VALUES (
  (SELECT id FROM auth.users LIMIT 1),
  'Test Task Direct Insert',
  'daily',
  CURRENT_DATE,
  false
);

-- Verify the insert worked
SELECT COUNT(*) as total_tasks_after_insert FROM tasks;
SELECT * FROM tasks ORDER BY created_at DESC LIMIT 5;
