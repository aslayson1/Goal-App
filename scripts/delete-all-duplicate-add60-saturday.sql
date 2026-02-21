-- Delete all duplicate "Add 60 Users" tasks from Saturday 2026-02-21 EXCEPT the one with counter: 2
-- Keep the task with counter=2 as the primary one

DELETE FROM tasks
WHERE user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
  AND target_date = '2026-02-21'
  AND title = 'Add 60 Users'
  AND task_type = 'daily'
  AND completed = false
  AND id NOT IN (
    -- Keep only the task with counter = 2
    SELECT id FROM tasks
    WHERE user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
      AND target_date = '2026-02-21'
      AND title = 'Add 60 Users'
      AND counter = 2
      AND task_type = 'daily'
    LIMIT 1
  );

-- Verify the cleanup
SELECT id, title, target_date, completed, counter
FROM tasks
WHERE user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
  AND target_date = '2026-02-21'
  AND title = 'Add 60 Users'
ORDER BY counter DESC;
