-- Delete the specific duplicate "Add 60 Users" task with ID e30f398f-28aa-4e30-aed8-eb729e1e58a8
-- This is the Uncategorized duplicate with counter=0 on Saturday

-- Show before deletion
SELECT 'BEFORE - Task to delete:' as status;
SELECT id, title, target_date, counter, completed, category_id
FROM tasks 
WHERE id = 'e30f398f-28aa-4e30-aed8-eb729e1e58a8'::uuid;

-- Delete the specific task
DELETE FROM tasks 
WHERE id = 'e30f398f-28aa-4e30-aed8-eb729e1e58a8'::uuid;

-- Show after deletion - all remaining Saturday "Add 60 Users" tasks
SELECT 'AFTER - Remaining Saturday Add 60 Users tasks:' as status;
SELECT id, title, target_date, counter, completed, category_id
FROM tasks 
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'::uuid
  AND title = 'Add 60 Users'
  AND target_date = '2026-02-21'
ORDER BY counter DESC;
