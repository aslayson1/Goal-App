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
    id,
    title,
    task_type,
    target_date,
    user_id,
    category_id,
    created_at
FROM tasks 
ORDER BY created_at DESC 
LIMIT 10;

-- Check if there are any tasks at all
SELECT COUNT(*) as total_tasks FROM tasks;
