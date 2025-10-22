-- Add sort_order column to tasks table for drag-and-drop ordering
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_sort_order ON tasks(sort_order);

-- Initialize sort_order for existing tasks based on created_at
UPDATE tasks 
SET sort_order = subquery.row_num
FROM (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY user_id, task_type, category_id, target_date 
      ORDER BY created_at
    ) as row_num
  FROM tasks
) AS subquery
WHERE tasks.id = subquery.id;
