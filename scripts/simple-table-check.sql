-- Simple query to check the actual table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'tasks' 
ORDER BY ordinal_position;

-- Also check if there are any views or inherited tables
SELECT table_name, table_type
FROM information_schema.tables 
WHERE table_name LIKE '%task%';
