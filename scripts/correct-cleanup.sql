-- STEP 1: Show current state BEFORE cleanup
SELECT 'BEFORE CLEANUP - Saturday Tasks:' as step;
SELECT id, title, target_date, counter, completed, category_id, linked_goal_id
FROM tasks
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users'
  AND target_date = '2026-02-21'
ORDER BY counter DESC;

SELECT 'BEFORE CLEANUP - Goal Progress:' as step;
SELECT id, title, current_progress, target_count
FROM goals
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users';

-- STEP 2: Delete duplicate Saturday tasks with counter=0
DELETE FROM tasks
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users'
  AND target_date = '2026-02-21'
  AND counter = 0;

-- STEP 3: Update goal progress to 4 (the correct cumulative total)
UPDATE goals
SET current_progress = 4
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users';

-- STEP 4: Show final state AFTER cleanup
SELECT 'AFTER CLEANUP - Saturday Tasks:' as step;
SELECT id, title, target_date, counter, completed, category_id, linked_goal_id
FROM tasks
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users'
  AND target_date = '2026-02-21'
ORDER BY counter DESC;

SELECT 'AFTER CLEANUP - Goal Progress:' as step;
SELECT id, title, current_progress, target_count
FROM goals
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users';

SELECT 'VERIFICATION - Should see exactly 1 Saturday task with counter=4, and goal progress=4' as final_check;
