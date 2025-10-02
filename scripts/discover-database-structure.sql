-- Discover the actual database structure and data

-- First, show all tables in the database
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Show column structure for categories table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'categories' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show column structure for goals table  
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'goals' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show column structure for tasks table
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'tasks' AND table_schema = 'public'
ORDER BY ordinal_position;

-- Count records in each table
SELECT 'categories' as table_name, COUNT(*) as record_count FROM categories
UNION ALL
SELECT 'goals' as table_name, COUNT(*) as record_count FROM goals  
UNION ALL
SELECT 'tasks' as table_name, COUNT(*) as record_count FROM tasks;

-- Show sample data from categories (using only basic columns)
SELECT * FROM categories ORDER BY created_at DESC LIMIT 3;

-- Show sample data from goals (using only basic columns)
SELECT * FROM goals ORDER BY created_at DESC LIMIT 3;

-- Show sample data from tasks (using only basic columns)
SELECT * FROM tasks ORDER BY created_at DESC LIMIT 3;
