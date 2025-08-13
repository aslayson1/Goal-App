-- Check Scott Layson's email confirmation status
SELECT 
    id,
    email,
    email_confirmed_at,
    created_at,
    CASE 
        WHEN email_confirmed_at IS NULL THEN 'NOT CONFIRMED'
        ELSE 'CONFIRMED'
    END as confirmation_status
FROM auth.users 
WHERE email ILIKE '%scott%' OR email ILIKE '%layson%'
ORDER BY created_at DESC;

-- Also check total user count
SELECT COUNT(*) as total_users FROM auth.users;
