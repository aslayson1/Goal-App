-- Delete the specific duplicate task and verify it's gone
-- Task ID: e30f398f-28aa-4e30-aed8-eb729e1e58a8

-- Show task before deletion
SELECT 'BEFORE - Task to delete:' as status;
SELECT id, title, target_date, counter, completed, category_id, linked_goal_id
FROM tasks 
WHERE id = 'e30f398f-28aa-4e30-aed8-eb729e1e58a8';

-- Delete the duplicate
DELETE FROM tasks 
WHERE id = 'e30f398f-28aa-4e30-aed8-eb729e1e58a8';

-- Show all remaining Saturday Add 60 Users tasks
SELECT 'AFTER - All Saturday Add 60 Users tasks:' as status;
SELECT id, title, target_date, counter, completed, category_id, linked_goal_id
FROM tasks 
WHERE user_id = '665f0fa8-9656-4777-8289-cd7ab8969fde'
  AND title = 'Add 60 Users'
  AND target_date = '2026-02-21'
  AND task_type = 'daily'
ORDER BY counter DESC;
