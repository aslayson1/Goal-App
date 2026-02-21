-- First, delete all "Add 60 Users" tasks on Saturday 2026-02-21
DELETE FROM tasks
WHERE user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
  AND title = 'Add 60 Users'
  AND target_date = '2026-02-21'
  AND task_type = 'daily';

-- Now insert a fresh "Add 60 Users" task for Saturday with counter: 2
INSERT INTO tasks (
  id,
  user_id,
  goal_id,
  category_id,
  title,
  task_type,
  target_date,
  completed,
  completed_at,
  created_at,
  updated_at,
  description,
  linked_goal_id,
  counter,
  target_count,
  daily_target
) VALUES (
  gen_random_uuid(),
  '665f0fa8-9656-4777-8289-cd7ab8969fde',
  NULL,
  '83c441a2-65ca-4b91-89aa-56e8015956ef',
  'Add 60 Users',
  'daily',
  '2026-02-21',
  FALSE,
  NULL,
  NOW(),
  NOW(),
  'Daily target: 1',
  'a9f3bb18-41d9-4c75-aa4e-c1d68264f77a',
  2,
  60,
  1
);
