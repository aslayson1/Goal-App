-- Look for the specific Test4 task that was just created
SELECT * FROM tasks 
WHERE id = 'fd694a4c-3494-40c4-b0bc-92077c4e6bff';

-- Look for all tasks with this user_id
SELECT * FROM tasks 
WHERE user_id = '8e13f687-5273-4e9b-989f-01f887680df0';

-- Check if there are any tasks at all in the table
SELECT COUNT(*) as total_tasks FROM tasks;
