-- Update Sunday's "Add 60 Users" task to show cumulative counter of 5
-- (carrying forward Saturday's progress of 5/60)

UPDATE tasks
SET counter = 5
WHERE user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
  AND title = 'Add 60 Users'
  AND target_date = '2026-02-22'
  AND task_type = 'daily'
  AND counter = 0;

-- Verify the update
SELECT 
  id,
  title,
  target_date,
  counter,
  target_count,
  completed,
  category_id
FROM tasks
WHERE user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
  AND title = 'Add 60 Users'
  AND target_date >= '2026-02-21'
ORDER BY target_date;
