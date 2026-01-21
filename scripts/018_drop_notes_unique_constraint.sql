-- Drop the unique constraint on notes table to allow multiple notes per category per user
ALTER TABLE notes DROP CONSTRAINT IF EXISTS notes_user_id_category_name_key;

-- Verify the constraint was dropped
SELECT constraint_name 
FROM information_schema.table_constraints 
WHERE table_name = 'notes' AND constraint_type = 'UNIQUE';
