-- Comprehensive search for "Testty" across all tables and columns in the database

-- First, let's see all tables in the database
SELECT 'All tables in database:' as info;
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Search in tasks table (all text columns)
SELECT 'Searching tasks table:' as info;
SELECT 'tasks' as table_name, id, title, description, task_type, target_date::text, created_at::text
FROM tasks 
WHERE title ILIKE '%testty%' 
   OR description ILIKE '%testty%' 
   OR task_type ILIKE '%testty%'
   OR target_date::text ILIKE '%testty%'
   OR created_at::text ILIKE '%testty%';

-- Search in categories table
SELECT 'Searching categories table:' as info;
SELECT 'categories' as table_name, id, name, created_at::text
FROM categories 
WHERE name ILIKE '%testty%' 
   OR created_at::text ILIKE '%testty%';

-- Search in goals table (if it exists)
SELECT 'Searching goals table:' as info;
SELECT 'goals' as table_name, id, title, created_at::text
FROM goals 
WHERE title ILIKE '%testty%' 
   OR created_at::text ILIKE '%testty%';

-- Search in long_term_goals table (if it exists)
SELECT 'Searching long_term_goals table:' as info;
SELECT 'long_term_goals' as table_name, id, title, created_at::text
FROM long_term_goals 
WHERE title ILIKE '%testty%' 
   OR created_at::text ILIKE '%testty%';

-- Search in activity_log table (if it exists)
SELECT 'Searching activity_log table:' as info;
SELECT 'activity_log' as table_name, id, action_type, entity_type, details, created_at::text
FROM activity_log 
WHERE action_type ILIKE '%testty%' 
   OR entity_type ILIKE '%testty%' 
   OR details ILIKE '%testty%'
   OR created_at::text ILIKE '%testty%';

-- Final summary
SELECT 'Search complete - any results above show where Testty was found' as summary;
