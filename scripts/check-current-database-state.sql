-- Check current state of all tables
SELECT 'Categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'Goals' as table_name, COUNT(*) as count FROM goals  
UNION ALL
SELECT 'Tasks' as table_name, COUNT(*) as count FROM tasks
UNION ALL
SELECT 'Long Term Goals' as table_name, COUNT(*) as count FROM long_term_goals;

-- Check actual table structures first
SELECT 'CATEGORIES TABLE STRUCTURE:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'categories' 
ORDER BY ordinal_position;

SELECT 'GOALS TABLE STRUCTURE:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'goals' 
ORDER BY ordinal_position;

SELECT 'TASKS TABLE STRUCTURE:' as info;
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
ORDER BY ordinal_position;

-- Show sample data from each table (using only basic columns)
SELECT 'CATEGORIES DATA:' as info;
SELECT name, created_at FROM categories ORDER BY created_at DESC LIMIT 3;

SELECT 'GOALS DATA:' as info;
SELECT title, target_count, current_progress, created_at FROM goals ORDER BY created_at DESC LIMIT 3;

SELECT 'TASKS DATA:' as info;
SELECT title, task_type, target_date, completed, created_at FROM tasks ORDER BY created_at DESC LIMIT 3;
