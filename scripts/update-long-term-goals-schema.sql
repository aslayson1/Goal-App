-- Add numeric goal fields to long_term_goals table
ALTER TABLE long_term_goals 
ADD COLUMN IF NOT EXISTS target_count INTEGER,
ADD COLUMN IF NOT EXISTS daily_target DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS weekly_target DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS current_progress INTEGER DEFAULT 0;

-- Add fields to tasks table to link and track numeric goals
ALTER TABLE tasks
ADD COLUMN IF NOT EXISTS linked_goal_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS counter INTEGER DEFAULT 0;
