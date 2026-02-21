-- Clean up duplicate "Add 60 Users" tasks for Saturday (2026-02-21)
-- Keep only one instance of each duplicate task
WITH duplicates_to_delete AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY user_id, title, target_date 
      ORDER BY created_at ASC
    ) as rn
  FROM tasks
  WHERE title = 'Add 60 Users'
    AND target_date = '2026-02-21'
    AND completed = false
    AND user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
)
DELETE FROM tasks
WHERE id IN (
  SELECT id FROM duplicates_to_delete WHERE rn > 1
);

-- Verify the cleanup
SELECT 
  id,
  title,
  target_date,
  completed,
  counter,
  target_count,
  created_at
FROM tasks
WHERE title = 'Add 60 Users'
  AND user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
ORDER BY target_date, created_at;
