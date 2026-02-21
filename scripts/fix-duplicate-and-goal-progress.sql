-- Delete the duplicate "Add 60 Users" task on Saturday with counter=0
DELETE FROM tasks
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users'
  AND target_date = '2026-02-21'
  AND counter = 0
  AND task_type = 'daily';

-- Update the goal's current_progress to 4 (the max counter value, not the sum)
UPDATE goals
SET current_progress = 4
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users'
  AND current_progress = 6;

-- Verify the changes
SELECT title, target_date, counter, completed 
FROM tasks 
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users'
  AND target_date IN ('2026-02-20', '2026-02-21')
ORDER BY target_date;

SELECT title, current_progress, target_count
FROM goals
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users';
