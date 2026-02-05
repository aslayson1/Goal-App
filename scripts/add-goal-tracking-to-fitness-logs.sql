-- Add goal_id and amount columns to fitness_logs table to track specific goals and quantities
ALTER TABLE fitness_logs
ADD COLUMN IF NOT EXISTS goal_id UUID REFERENCES goals(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS amount INTEGER DEFAULT 0;

-- Create an index on goal_id for better query performance
CREATE INDEX IF NOT EXISTS idx_fitness_logs_goal_id ON fitness_logs(goal_id);
CREATE INDEX IF NOT EXISTS idx_fitness_logs_user_goal ON fitness_logs(user_id, goal_id);
