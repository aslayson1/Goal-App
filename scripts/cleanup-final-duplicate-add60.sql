-- Delete duplicate "Add 60 Users" tasks on Saturday (2026-02-21)
-- Keep only the one linked to the Upside goal (most complete)
-- This removes the Uncategorized duplicate

DELETE FROM tasks
WHERE user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
  AND title = 'Add 60 Users'
  AND target_date = '2026-02-21'
  AND category_id IS NULL;

-- Verify the cleanup
SELECT id, title, target_date, category_id, counter, target_count
FROM tasks
WHERE user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
  AND title = 'Add 60 Users'
  AND target_date IN ('2026-02-20', '2026-02-21')
ORDER BY target_date;
