-- Delete one of the duplicate "Add 60 Users" tasks from Saturday
-- Keep the first one, delete the second

WITH duplicates AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (PARTITION BY title, target_date ORDER BY id) as rn
  FROM tasks
  WHERE title = 'Add 60 Users' 
    AND target_date = '2026-02-21'
    AND user_id = (SELECT id FROM auth.users WHERE email = 'scott@laysongroupconsulting.com')
)
DELETE FROM tasks
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- Update the remaining Saturday task to show cumulative progress (2/60 from Friday)
UPDATE tasks
SET counter = 2
WHERE title = 'Add 60 Users' 
  AND target_date = '2026-02-21'
  AND user_id = (SELECT id FROM auth.users WHERE email = 'scott@laysongroupconsulting.com');

-- Verify the result
SELECT 
  target_date,
  title,
  counter,
  target_count,
  category_id
FROM tasks
WHERE title = 'Add 60 Users'
  AND target_date >= '2026-02-20'
  AND user_id = (SELECT id FROM auth.users WHERE email = 'scott@laysongroupconsulting.com')
ORDER BY target_date;
