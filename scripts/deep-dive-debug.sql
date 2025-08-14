-- Deep dive debugging script to understand task persistence issue

-- 1. Check current tasks in database
SELECT 
    'Current tasks in database:' as debug_section,
    COUNT(*) as total_tasks
FROM tasks;

-- 2. Show actual task data structure
SELECT 
    'Sample task data:' as debug_section,
    id, user_id, title, description, task_type, target_date, completed, category_id, goal_id, created_at
FROM tasks 
ORDER BY created_at DESC 
LIMIT 5;

-- 3. Check if there are any constraints or triggers affecting tasks
SELECT 
    'Task table constraints:' as debug_section,
    constraint_name, constraint_type
FROM information_schema.table_constraints 
WHERE table_name = 'tasks';

-- 4. Check categories for reference
SELECT 
    'Categories available:' as debug_section,
    COUNT(*) as total_categories,
    string_agg(name, ', ') as category_names
FROM categories;

-- 5. Check goals for reference  
SELECT 
    'Goals available:' as debug_section,
    COUNT(*) as total_goals
FROM goals;
