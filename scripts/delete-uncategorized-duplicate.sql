-- Delete the Uncategorized "Add 60 Users" duplicate on Saturday
-- Keep only the Upside-categorized one with counter: 2

DELETE FROM tasks
WHERE 
  title = 'Add 60 Users'
  AND target_date = '2026-02-21'
  AND completed = false
  AND counter = 0
  AND (category_id IS NULL OR category_id NOT IN (
    SELECT id FROM categories WHERE name = 'Upside'
  ));

-- Verify the deletion
SELECT id, title, target_date, counter, category_id, completed
FROM tasks
WHERE title = 'Add 60 Users' AND target_date = '2026-02-21'
ORDER BY counter DESC;
