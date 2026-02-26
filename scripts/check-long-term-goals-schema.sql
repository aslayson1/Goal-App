-- Check the schema of long_term_goals table
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'long_term_goals'
ORDER BY ordinal_position;
