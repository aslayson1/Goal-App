-- Step 1: Show current state
SELECT '=== BEFORE FIX ===' as status;

SELECT 
  id,
  title,
  target_date,
  completed,
  counter,
  target_count,
  linked_goal_id
FROM tasks
WHERE user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
  AND title = 'Add 60 Users'
  AND task_type = 'daily'
ORDER BY target_date, counter DESC;

-- Step 2: Delete all Saturday Add 60 Users tasks EXCEPT the one with counter=4
DELETE FROM tasks
WHERE user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
  AND title = 'Add 60 Users'
  AND target_date = '2026-02-21'
  AND task_type = 'daily'
  AND counter != 4;

SELECT '=== DELETED DUPLICATES ===' as status;

-- Step 3: Update goal progress to 4
UPDATE goals
SET current_progress = 4
WHERE user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
  AND title = 'Add 60 Users';

SELECT '=== UPDATED GOAL PROGRESS ===' as status;

-- Step 4: Verify the fix
SELECT '=== AFTER FIX - TASKS ===' as status;

SELECT 
  id,
  title,
  target_date,
  completed,
  counter,
  target_count,
  linked_goal_id
FROM tasks
WHERE user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
  AND title = 'Add 60 Users'
  AND task_type = 'daily'
ORDER BY target_date, counter DESC;

SELECT '=== AFTER FIX - GOAL ===' as status;

SELECT 
  id,
  title,
  current_progress,
  target_count
FROM goals
WHERE user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
  AND title = 'Add 60 Users';
