-- Delete all duplicate "Add 60 Users" tasks from Saturday 2026-02-21
-- Keep only the one with counter=2

DELETE FROM tasks
WHERE 
  user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
  AND target_date = '2026-02-21'
  AND title = 'Add 60 Users'
  AND completed = false
  AND counter = 0;

-- Verify the result
SELECT id, title, target_date, counter, completed
FROM tasks
WHERE 
  user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
  AND target_date = '2026-02-21'
  AND title = 'Add 60 Users'
ORDER BY counter DESC;
