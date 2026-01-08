-- Add numeric goal support to goals table
-- Allows storing target_number and daily/weekly prorated amounts

-- Add columns to goals table if they don't exist
ALTER TABLE goals ADD COLUMN IF NOT EXISTS target_number INTEGER;
ALTER TABLE goals ADD COLUMN IF NOT EXISTS daily_target DECIMAL(10, 2);
ALTER TABLE goals ADD COLUMN IF NOT EXISTS weekly_target DECIMAL(10, 2);
ALTER TABLE goals ADD COLUMN IF NOT EXISTS current_count INTEGER DEFAULT 0;

-- Add linked_goal_id to tasks table to track which goal a task belongs to
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS linked_goal_id UUID REFERENCES goals(id) ON DELETE CASCADE;
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS counter INTEGER DEFAULT 0;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_tasks_linked_goal_id ON tasks(linked_goal_id);
CREATE INDEX IF NOT EXISTS idx_goals_target_number ON goals(target_number) WHERE target_number IS NOT NULL;
