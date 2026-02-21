-- Delete the specific duplicate task by ID
DELETE FROM tasks 
WHERE id = '92e8485f-36ec-4d93-9210-7bfc215ee29f';

-- Show remaining Saturday "Add 60 Users" tasks
SELECT id, title, target_date, counter, completed, category_id, linked_goal_id
FROM tasks 
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users'
  AND target_date = '2026-02-21'
ORDER BY counter DESC;
