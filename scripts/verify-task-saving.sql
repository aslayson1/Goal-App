-- Check if tasks table exists and has the correct structure
SELECT 
    column_name, 
    data_type, 
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'tasks' 
ORDER BY ordinal_position;

-- Check current tasks in database
SELECT 
    t.id,
    t.title,
    t.task_type,
    t.target_date,
    t.user_id,
    t.category_id,
    c.name as category_name,
    t.completed,
    t.created_at
FROM tasks t
LEFT JOIN categories c ON t.category_id = c.id
ORDER BY t.created_at DESC 
LIMIT 10;

-- Check if there are any tasks at all
SELECT COUNT(*) as total_tasks FROM tasks;

-- Check categories for reference
SELECT 
    id,
    name,
    user_id,
    created_at
FROM categories 
ORDER BY created_at DESC;

-- Check for any constraint violations or issues
SELECT 
    t.id,
    t.title,
    t.category_id,
    c.name as category_name,
    CASE 
        WHEN t.category_id IS NULL THEN 'Missing category_id'
        WHEN c.id IS NULL THEN 'Invalid category_id reference'
        ELSE 'OK'
    END as status
FROM tasks t
LEFT JOIN categories c ON t.category_id = c.id
WHERE t.category_id IS NULL OR c.id IS NULL;
