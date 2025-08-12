-- Add description column to tasks table
ALTER TABLE tasks 
ADD COLUMN description TEXT;

-- Add a comment to document the column
COMMENT ON COLUMN tasks.description IS 'Optional description for the task providing additional details';
