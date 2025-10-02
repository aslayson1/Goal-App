-- Comprehensive task debugging script
-- Check current state of all tables and recent activity

-- 1. Check if any tasks exist in database
SELECT 'CURRENT TASKS' as section;
SELECT COUNT(*) as total_tasks FROM tasks;
SELECT * FROM tasks ORDER BY created_at DESC LIMIT 5;

-- 2. Check categories (tasks need valid categories)
SELECT 'CURRENT CATEGORIES' as section;
SELECT COUNT(*) as total_categories FROM categories;
SELECT * FROM categories ORDER BY created_at DESC LIMIT 5;

-- 3. Check for any recent database activity
SELECT 'RECENT ACTIVITY' as section;
SELECT 
  'tasks' as table_name,
  COUNT(*) as records,
  MAX(created_at) as last_created,
  MAX(updated_at) as last_updated
FROM tasks
UNION ALL
SELECT 
  'categories' as table_name,
  COUNT(*) as records,
  MAX(created_at) as last_created,
  MAX(updated_at) as last_updated
FROM categories;

-- 4. Test if we can insert a task right now
INSERT INTO tasks (
  id,
  user_id,
  title,
  task_type,
  target_date,
  completed,
  scope
) VALUES (
  gen_random_uuid(),
  '555fae47-aaeb-4a5c-996d-58d6579ca23c',
  'Debug Test Task',
  'daily',
  CURRENT_DATE,
  false,
  'daily'
);

-- 5. Verify the insert worked
SELECT 'AFTER INSERT TEST' as section;
SELECT COUNT(*) as total_tasks_after_insert FROM tasks;
SELECT * FROM tasks WHERE title = 'Debug Test Task';
