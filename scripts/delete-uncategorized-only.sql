-- Delete ONLY the Uncategorized "Add 60 Users" task with counter=0 on Saturday
-- This is the final duplicate that needs to be removed

-- Show what we're deleting first
SELECT 'BEFORE - Tasks to delete:' as status;
SELECT id, title, target_date, counter, completed, category_id
FROM tasks
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users'
  AND target_date = '2026-02-21'
  AND counter = 0
  AND category_id IS NULL;

-- Delete the uncategorized duplicate
DELETE FROM tasks
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users'
  AND target_date = '2026-02-21'
  AND counter = 0
  AND category_id IS NULL;

-- Verify deletion
SELECT 'AFTER - Remaining Saturday tasks:' as status;
SELECT id, title, target_date, counter, completed, category_id
FROM tasks
WHERE user_id = '9bf8fc31-7ff4-4a1d-8621-b7e36a44a2e5'
  AND title = 'Add 60 Users'
  AND target_date = '2026-02-21';
