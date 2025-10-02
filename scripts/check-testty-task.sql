-- Check if the task "Testty" exists in the database
SELECT 
    id,
    title,
    description,
    task_type,
    target_date,
    completed,
    created_at,
    user_id,
    category_id,
    goal_id
FROM tasks 
WHERE LOWER(title) LIKE '%testty%' 
   OR LOWER(description) LIKE '%testty%'
ORDER BY created_at DESC;

-- Also check total task count for context
SELECT COUNT(*) as total_tasks FROM tasks;
