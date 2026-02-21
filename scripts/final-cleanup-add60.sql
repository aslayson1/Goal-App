-- Delete all "Add 60 Users" tasks from Saturday except the one with the highest ID (most recent)
-- This ensures we keep one task and remove all duplicates

DELETE FROM tasks
WHERE user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
  AND title = 'Add 60 Users'
  AND target_date = '2026-02-21'
  AND id NOT IN (
    SELECT id FROM tasks
    WHERE user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
      AND title = 'Add 60 Users'
      AND target_date = '2026-02-21'
    ORDER BY created_at DESC
    LIMIT 1
  );

-- Update the remaining Saturday "Add 60 Users" task to have counter of 2
-- This shows cumulative progress from Friday
UPDATE tasks
SET counter = 2
WHERE user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
  AND title = 'Add 60 Users'
  AND target_date = '2026-02-21';
