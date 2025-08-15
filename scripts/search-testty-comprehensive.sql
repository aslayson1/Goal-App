-- Creating a safe search that only queries tables that actually exist
-- Dynamic search for "Testty" across all accessible tables in the database

-- First, show all tables in the database
SELECT 'All tables in database:' as info, table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Search in tasks table (we know this exists)
SELECT 'Searching tasks table:' as info;
SELECT 'tasks' as table_name, id, title, 
       COALESCE(description, 'NULL') as description,
       task_type, target_date::text, created_at::text
FROM tasks 
WHERE title ILIKE '%testty%' 
   OR COALESCE(description, '') ILIKE '%testty%' 
   OR task_type ILIKE '%testty%'
   OR target_date::text ILIKE '%testty%'
   OR created_at::text ILIKE '%testty%';

-- Search in categories table (we know this exists)
SELECT 'Searching categories table:' as info;
SELECT 'categories' as table_name, id, name, created_at::text
FROM categories 
WHERE name ILIKE '%testty%' 
   OR created_at::text ILIKE '%testty%';

-- Try to search other tables only if they exist (using conditional logic)
DO $$
BEGIN
    -- Check if goals table exists and search it
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'goals' AND table_schema = 'public') THEN
        RAISE NOTICE 'Goals table exists, searching...';
        PERFORM * FROM goals WHERE title ILIKE '%testty%' OR created_at::text ILIKE '%testty%';
    END IF;
    
    -- Check if long_term_goals table exists and search it
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'long_term_goals' AND table_schema = 'public') THEN
        RAISE NOTICE 'Long term goals table exists, searching...';
        PERFORM * FROM long_term_goals WHERE title ILIKE '%testty%' OR created_at::text ILIKE '%testty%';
    END IF;
    
    -- Check if activity_log table exists and search it
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'activity_log' AND table_schema = 'public') THEN
        RAISE NOTICE 'Activity log table exists, searching...';
        PERFORM * FROM activity_log WHERE details ILIKE '%testty%' OR created_at::text ILIKE '%testty%';
    END IF;
END $$;

-- Final summary
SELECT 'Search complete - check results above for any Testty occurrences' as summary;
