-- Search for "Testty" across all tables in the database
-- Check tasks table
SELECT 'tasks' as table_name, id, title, description, task_type, created_at
FROM tasks 
WHERE title ILIKE '%Testty%' OR description ILIKE '%Testty%';

-- Check goals table
SELECT 'goals' as table_name, id, title, description, created_at
FROM goals 
WHERE title ILIKE '%Testty%' OR description ILIKE '%Testty%';

-- Check long_term_goals table
SELECT 'long_term_goals' as table_name, id, title, description, created_at
FROM long_term_goals 
WHERE title ILIKE '%Testty%' OR description ILIKE '%Testty%';

-- Check categories table
SELECT 'categories' as table_name, id, name, created_at
FROM categories 
WHERE name ILIKE '%Testty%';

-- Check activity_log table
SELECT 'activity_log' as table_name, id, action_type, entity_type, details, created_at
FROM activity_log 
WHERE details::text ILIKE '%Testty%';
