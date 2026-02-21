-- Update Saturday's "Add 60 Users" task counter to 2 to show cumulative progress
UPDATE tasks 
SET counter = 2
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users'
  AND target_date = '2026-02-21'
  AND task_type = 'daily'
  AND counter = 0
LIMIT 1;
