-- Test direct task insertion to verify database works
-- Adding all required fields and better error handling
INSERT INTO tasks (
  id,
  user_id,
  title,
  task_type,
  target_date,
  completed,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  (SELECT id FROM auth.users LIMIT 1),
  'Test Task Direct Insert',
  'daily',
  CURRENT_DATE,
  false,
  NOW(),
  NOW()
);

-- Verify the insert worked
SELECT COUNT(*) as total_tasks_after_insert FROM tasks;
SELECT * FROM tasks ORDER BY created_at DESC LIMIT 5;

-- Also check if there are any constraints or triggers
SELECT conname, contype FROM pg_constraint WHERE conrelid = 'tasks'::regclass;
