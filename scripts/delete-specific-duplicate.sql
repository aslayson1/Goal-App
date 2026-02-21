-- Delete the specific duplicate "Add 60 Users" task on Saturday with counter=0
-- Based on the debug logs, this is task ID: 482d503d-2a8b-42d2-af08-76cbba54d51a

-- First, show what we're about to delete
SELECT id, title, target_date, counter, completed
FROM tasks
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users'
  AND target_date = '2026-02-21'
  AND completed = false
  AND counter = 0;

-- Delete the duplicate task
DELETE FROM tasks
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users'
  AND target_date = '2026-02-21'
  AND completed = false
  AND counter = 0;

-- Update the goal's current_progress to 4 (the correct value from Saturday's task with counter=4)
UPDATE goals
SET current_progress = 4
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users'
  AND target_count = 60;

-- Verify the results
SELECT id, title, target_date, counter, completed
FROM tasks
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users'
  AND target_date = '2026-02-21'
ORDER BY counter DESC;

SELECT title, current_progress, target_count
FROM goals
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users';
