-- STEP 1: Show current state BEFORE cleanup
SELECT 'BEFORE CLEANUP - Saturday Add 60 Users tasks:' as status;
SELECT id, title, target_date, completed, counter, linked_goal_id
FROM tasks
WHERE user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
  AND title = 'Add 60 Users'
  AND target_date = '2026-02-21'
ORDER BY counter DESC;

SELECT 'BEFORE CLEANUP - Goal progress:' as status;
SELECT id, title, current_progress, target_units
FROM goals
WHERE user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
  AND title = 'Add 60 Users';

-- STEP 2: Delete ALL Saturday "Add 60 Users" tasks with counter=0
DELETE FROM tasks
WHERE user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
  AND title = 'Add 60 Users'
  AND target_date = '2026-02-21'
  AND counter = 0;

-- STEP 3: Update goal progress to 4 (the correct maximum counter value)
UPDATE goals
SET current_progress = 4
WHERE user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
  AND title = 'Add 60 Users';

-- STEP 4: Show state AFTER cleanup for verification
SELECT 'AFTER CLEANUP - Saturday Add 60 Users tasks:' as status;
SELECT id, title, target_date, completed, counter, linked_goal_id
FROM tasks
WHERE user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
  AND title = 'Add 60 Users'
  AND target_date = '2026-02-21'
ORDER BY counter DESC;

SELECT 'AFTER CLEANUP - Goal progress:' as status;
SELECT id, title, current_progress, target_units
FROM goals
WHERE user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
  AND title = 'Add 60 Users';

SELECT 'CLEANUP COMPLETE - Should see 1 Saturday task with counter=4, goal at 4/60' as final_status;
