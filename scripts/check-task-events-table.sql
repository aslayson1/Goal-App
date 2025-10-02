-- Check the structure of the task_events table to find the "scope" column
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'task_events' 
ORDER BY ordinal_position;

-- Also check constraints on task_events table
SELECT 
    tc.constraint_name, 
    tc.constraint_type, 
    ccu.column_name
FROM information_schema.table_constraints tc
JOIN information_schema.constraint_column_usage ccu 
    ON tc.constraint_name = ccu.constraint_name
WHERE tc.table_name = 'task_events';

-- Check if there are any triggers on task_events
SELECT 
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'task_events';
