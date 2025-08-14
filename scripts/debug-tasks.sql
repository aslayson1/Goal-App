-- Check if tasks are being saved to the database
SELECT 
  id,
  title,
  task_type,
  target_date,
  category_id,
  user_id,
  completed,
  created_at
FROM tasks 
ORDER BY created_at DESC 
LIMIT 10;

-- Also check categories for reference
SELECT 
  id,
  name,
  user_id,
  created_at
FROM categories 
ORDER BY created_at DESC 
LIMIT 5;
