-- Query to check all agents and their email addresses
SELECT 
    id,
    name,
    role,
    email,
    auth_user_id,
    created_at,
    updated_at
FROM agents
ORDER BY created_at DESC;

-- Check specifically for sarah@laysongroup.com
SELECT 
    CASE 
        WHEN EXISTS (SELECT 1 FROM agents WHERE email = 'sarah@laysongroup.com') 
        THEN 'Email found in database'
        ELSE 'Email NOT found in database'
    END as result;
