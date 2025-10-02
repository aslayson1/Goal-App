-- Simplified search to only use confirmed existing tables and columns
-- Search for "Testty" in confirmed existing tables only

-- First, show all tables in the database
SELECT 'All tables in database:' as info, table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Search in tasks table (confirmed to exist with these columns)
SELECT 'Searching tasks table:' as info;
SELECT 'tasks' as table_name, id, title, 
       COALESCE(description, 'NULL') as description,
       task_type, target_date::text, created_at::text
FROM tasks 
WHERE title ILIKE '%testty%' 
   OR COALESCE(description, '') ILIKE '%testty%' 
   OR task_type ILIKE '%testty%';

-- Search in categories table (confirmed to exist with these columns)
SELECT 'Searching categories table:' as info;
SELECT 'categories' as table_name, id, name, created_at::text
FROM categories 
WHERE name ILIKE '%testty%';

-- Final summary
SELECT 'Search complete - results above show any Testty occurrences in confirmed tables' as summary;
