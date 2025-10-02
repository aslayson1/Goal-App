SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'task_events'
ORDER BY ordinal_position;

-- Also check what data is in task_events table
SELECT COUNT(*) as total_task_events FROM task_events;

-- Show sample data if any exists
SELECT * FROM task_events LIMIT 5;
