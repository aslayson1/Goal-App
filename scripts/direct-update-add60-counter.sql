-- Direct update: Set the Add 60 Users daily task counter to 7 on 2026-02-26
UPDATE tasks
SET counter = 7
WHERE linked_goal_id = 'a9f3bb18-41d9-4c75-aa4e-c1d68264f77a'
  AND target_date = '2026-02-26'
  AND title = 'Add 60 Users';

-- Verify it was updated
SELECT id, title, target_date, counter, target_count FROM tasks
WHERE linked_goal_id = 'a9f3bb18-41d9-4c75-aa4e-c1d68264f77a'
  AND target_date = '2026-02-26';
