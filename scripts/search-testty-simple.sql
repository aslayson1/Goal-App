-- Search for "Testty" in tasks table (title field)
SELECT 'tasks' as table_name, id, title, task_type, target_date, created_at
FROM tasks 
WHERE title ILIKE '%Testty%';

-- Search for "Testty" in categories table (name field)  
SELECT 'categories' as table_name, id, name, created_at
FROM categories
WHERE name ILIKE '%Testty%';
