-- Add Scott Layson as the Owner agent
-- This ensures the Owner can use the agent dropdown to view team members' dashboards

INSERT INTO agents (id, user_id, name, role, description, created_at, updated_at)
VALUES (
  gen_random_uuid(),
  '665f0fa8-9656-4777-8289-cd7ab8969fde', -- Scott's user_id (same as Ryan and Sarah)
  'Scott Layson',
  'Owner',
  'Team Owner and Manager',
  NOW(),
  NOW()
)
ON CONFLICT (id) DO NOTHING;
