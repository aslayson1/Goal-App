-- Find the actual "Add 60 Users" goal and check its current_progress
SELECT 
  id,
  title,
  current_progress,
  target_count,
  user_id
FROM long_term_goals
WHERE title = 'Add 60 Users'
LIMIT 1;

-- Also check the daily task that links to it
SELECT 
  t.id,
  t.title,
  t.counter,
  t.target_count,
  t.linked_goal_id,
  t.target_date,
  lg.id as goal_id,
  lg.current_progress
FROM tasks t
LEFT JOIN long_term_goals lg ON t.linked_goal_id = lg.id
WHERE t.title = 'Add 60 Users'
  AND t.target_date = '2026-02-26'
ORDER BY t.created_at DESC
LIMIT 5;
