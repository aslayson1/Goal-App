-- Export all data from Supabase database
-- Run this script to get a complete backup of your data

-- Export categories
SELECT 'CATEGORIES:' as table_name;
SELECT * FROM categories ORDER BY created_at;

-- Export goals  
SELECT 'GOALS:' as table_name;
SELECT * FROM goals ORDER BY created_at;

-- Export long_term_goals
SELECT 'LONG_TERM_GOALS:' as table_name;
SELECT * FROM long_term_goals ORDER BY created_at;

-- Export tasks
SELECT 'TASKS:' as table_name;
SELECT * FROM tasks ORDER BY created_at;

-- Export activity_log
SELECT 'ACTIVITY_LOG:' as table_name;
SELECT * FROM activity_log ORDER BY created_at;
