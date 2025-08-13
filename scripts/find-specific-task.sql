-- Look for the specific task that was just created
SELECT * FROM tasks WHERE id = '18efb067-cdbe-4147-a0b8-59892ecf33d1';

-- Look for any tasks with that user_id
SELECT * FROM tasks WHERE user_id = '8e13f687-5273-4e9b-989f-01f887680df0';

-- Check if there are ANY tasks in the table at all
SELECT COUNT(*) as total_tasks FROM tasks;

-- Show table structure to make sure we're querying the right columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'tasks' 
ORDER BY ordinal_position;
