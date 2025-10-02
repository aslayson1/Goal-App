-- Find information about the scope column in tasks table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'tasks' 
    AND column_name = 'scope';

-- Check if there are any check constraints on the scope column
SELECT 
    tc.constraint_name,
    cc.check_clause
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc 
    ON tc.constraint_name = cc.constraint_name
WHERE tc.table_name = 'tasks' 
    AND cc.check_clause LIKE '%scope%';

-- Look for any existing tasks to see what scope values are used
SELECT DISTINCT scope, COUNT(*) as count
FROM tasks 
GROUP BY scope;

-- Show the full table structure to understand all columns
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'tasks' 
ORDER BY ordinal_position;
