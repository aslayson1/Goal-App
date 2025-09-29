-- Check if the task "Buy Car1" exists in the database and if it's completed
SELECT 
    id,
    title,
    description,
    task_type,
    target_date,
    completed,
    completed_at,
    created_at,
    updated_at,
    user_id,
    category_id,
    goal_id
FROM tasks 
WHERE title = 'Buy Car1'
ORDER BY created_at DESC;

-- Alternative: Use LIKE for partial matching in case of slight variations
SELECT 
    id,
    title,
    completed,
    task_type,
    created_at
FROM tasks 
WHERE LOWER(title) LIKE '%buy car1%'
ORDER BY created_at DESC;

-- Show all tasks for context
SELECT 
    title,
    task_type,
    completed,
    created_at
FROM tasks 
ORDER BY created_at DESC
LIMIT 20;

-- Total task count
SELECT COUNT(*) as total_tasks FROM tasks;
