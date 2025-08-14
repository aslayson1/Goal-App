-- Check current state of all tables
SELECT 'Categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Goals' as table_name, COUNT(*) as count FROM goals  
UNION ALL
SELECT 'Tasks' as table_name, COUNT(*) as count FROM tasks
UNION ALL
SELECT 'Long Term Goals' as table_name, COUNT(*) as count FROM long_term_goals;

-- Show sample data from each table
SELECT 'CATEGORIES:' as info;
SELECT name, color, created_at FROM categories ORDER BY created_at DESC LIMIT 3;

SELECT 'GOALS:' as info;
SELECT title, target_count, current_progress, created_at FROM goals ORDER BY created_at DESC LIMIT 3;

SELECT 'TASKS:' as info;
SELECT title, task_type, target_date, completed, created_at FROM tasks ORDER BY created_at DESC LIMIT 3;
