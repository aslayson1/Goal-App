-- Show current state of Add 60 Users tasks
SELECT 
  id,
  title,
  target_date,
  completed,
  counter,
  linked_goal_id,
  created_at
FROM tasks
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users'
ORDER BY target_date, counter DESC;

-- Show current goal progress
SELECT id, title, current_progress, target_count
FROM goals
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users';

-- Delete ALL Add 60 Users tasks on Saturday EXCEPT the one with highest counter
DELETE FROM tasks
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users'
  AND target_date = '2026-02-21'
  AND id NOT IN (
    SELECT id FROM tasks
    WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
      AND title = 'Add 60 Users'
      AND target_date = '2026-02-21'
    ORDER BY counter DESC
    LIMIT 1
  );

-- Update goal progress to 4
UPDATE goals
SET current_progress = 4
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users';

-- Verify the fix
SELECT 
  id,
  title,
  target_date,
  completed,
  counter,
  linked_goal_id
FROM tasks
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users'
ORDER BY target_date, counter DESC;

-- Verify goal progress
SELECT id, title, current_progress, target_count
FROM goals
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users';
