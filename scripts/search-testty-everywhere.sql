-- Creating safer search that checks actual table structure first
-- First, let's see what columns actually exist in each table
SELECT 'tasks_columns' as info, column_name 
FROM information_schema.columns 
WHERE table_name = 'tasks' AND table_schema = 'public';

SELECT 'goals_columns' as info, column_name 
FROM information_schema.columns 
WHERE table_name = 'goals' AND table_schema = 'public';

SELECT 'categories_columns' as info, column_name 
FROM information_schema.columns 
WHERE table_name = 'categories' AND table_schema = 'public';

-- Now search for "Testty" using only basic columns that should exist
-- Search tasks table (using only id and title to be safe)
SELECT 'tasks' as table_name, id, title
FROM tasks 
WHERE title ILIKE '%Testty%';

-- Search goals table (using only id and title to be safe)  
SELECT 'goals' as table_name, id, title
FROM goals 
WHERE title ILIKE '%Testty%';

-- Search categories table (using only id and name)
SELECT 'categories' as table_name, id, name
FROM categories 
WHERE name ILIKE '%Testty%';
