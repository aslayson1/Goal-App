-- Sync the "Add 60 Users" daily task counter to match the linked goal's current_progress
-- This is a direct database fix while we debug the UI sync logic

UPDATE tasks
SET counter = (
  SELECT COALESCE(lg.current_progress, 0)
  FROM long_term_goals lg
  WHERE lg.id = tasks.linked_goal_id
    AND lg.title = 'Add 60 Users'
)
WHERE title = 'Add 60 Users'
  AND target_count = 60
  AND target_date = '2026-02-26'
  AND user_id = (SELECT id FROM profiles WHERE email = 'scott@laysongroup.com');

-- Verify the update
SELECT 
  id,
  title,
  target_date,
  counter,
  target_count,
  linked_goal_id,
  (SELECT current_progress FROM long_term_goals WHERE id = tasks.linked_goal_id) as goal_progress
FROM tasks
WHERE title = 'Add 60 Users'
  AND target_date = '2026-02-26'
  AND user_id = (SELECT id FROM profiles WHERE email = 'scott@laysongroup.com');
