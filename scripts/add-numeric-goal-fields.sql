-- Add counter field to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS counter INTEGER DEFAULT 0;

-- Add linked_goal_id field to tasks table to link tasks to long-term goals
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS linked_goal_id UUID REFERENCES long_term_goals(id) ON DELETE CASCADE;

-- Add target_count, daily_target, weekly_target, and current_progress to long_term_goals table
ALTER TABLE long_term_goals ADD COLUMN IF NOT EXISTS target_count INTEGER;
ALTER TABLE long_term_goals ADD COLUMN IF NOT EXISTS daily_target DECIMAL(10, 2);
ALTER TABLE long_term_goals ADD COLUMN IF NOT EXISTS weekly_target DECIMAL(10, 2);
ALTER TABLE long_term_goals ADD COLUMN IF NOT EXISTS current_progress INTEGER DEFAULT 0;
