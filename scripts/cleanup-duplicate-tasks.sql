-- Clean up duplicate tasks (keeping only the most recent one for each title)
DELETE FROM tasks
WHERE id IN (
  SELECT id
  FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY title, user_id ORDER BY created_at DESC) as rn
    FROM tasks
    WHERE task_type = 'daily'
  ) t
  WHERE rn > 1
);

-- Show remaining tasks with their target dates
SELECT 
  title,
  target_date,
  CASE EXTRACT(DOW FROM target_date)
    WHEN 0 THEN 'Sunday'
    WHEN 1 THEN 'Monday'
    WHEN 2 THEN 'Tuesday'
    WHEN 3 THEN 'Wednesday'
    WHEN 4 THEN 'Thursday'
    WHEN 5 THEN 'Friday'
    WHEN 6 THEN 'Saturday'
  END as day_of_week,
  completed,
  created_at
FROM tasks
WHERE task_type = 'daily'
  AND user_id = (SELECT id FROM auth.users WHERE email = 'scott@laysongroup.com')
ORDER BY target_date, created_at DESC;
