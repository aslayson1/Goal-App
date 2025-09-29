-- Create achievements table for tracking user accomplishments
CREATE TABLE IF NOT EXISTS achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  badge_type VARCHAR(50) NOT NULL, -- 'streak', 'goals', 'tasks', 'categories', 'special'
  badge_level VARCHAR(20) NOT NULL, -- 'bronze', 'silver', 'gold', 'platinum', 'diamond'
  requirement_value INTEGER NOT NULL, -- The threshold to unlock this achievement
  icon VARCHAR(100), -- Icon name for the badge
  color VARCHAR(100), -- Color class for the badge
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create user_achievements table for tracking which users have earned which achievements
CREATE TABLE IF NOT EXISTS user_achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  achievement_id UUID NOT NULL REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  progress_value INTEGER DEFAULT 0, -- Current progress towards this achievement
  UNIQUE(user_id, achievement_id)
);

-- Insert default achievements
INSERT INTO achievements (title, description, badge_type, badge_level, requirement_value, icon, color) VALUES
-- Streak achievements
('First Steps', 'Complete your first goal or task', 'streak', 'bronze', 1, 'target', 'bg-amber-500/20 text-amber-400 border-amber-500/30'),
('Getting Consistent', 'Maintain a 3-day streak', 'streak', 'bronze', 3, 'flame', 'bg-orange-500/20 text-orange-400 border-orange-500/30'),
('Week Warrior', 'Maintain a 7-day streak', 'streak', 'silver', 7, 'flame', 'bg-blue-500/20 text-blue-400 border-blue-500/30'),
('Dedication Master', 'Maintain a 14-day streak', 'streak', 'gold', 14, 'flame', 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'),
('Unstoppable Force', 'Maintain a 30-day streak', 'streak', 'platinum', 30, 'flame', 'bg-purple-500/20 text-purple-400 border-purple-500/30'),

-- Goal achievements
('Goal Setter', 'Create your first goal', 'goals', 'bronze', 1, 'plus-circle', 'bg-green-500/20 text-green-400 border-green-500/30'),
('Goal Achiever', 'Complete your first goal', 'goals', 'bronze', 1, 'check-circle', 'bg-green-500/20 text-green-400 border-green-500/30'),
('Goal Crusher', 'Complete 5 goals', 'goals', 'silver', 5, 'target', 'bg-blue-500/20 text-blue-400 border-blue-500/30'),
('Goal Master', 'Complete 10 goals', 'goals', 'gold', 10, 'trophy', 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'),
('Goal Legend', 'Complete 25 goals', 'goals', 'platinum', 25, 'crown', 'bg-purple-500/20 text-purple-400 border-purple-500/30'),

-- Task achievements
('Task Starter', 'Complete your first task', 'tasks', 'bronze', 1, 'check', 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'),
('Task Runner', 'Complete 10 tasks', 'tasks', 'silver', 10, 'list-checks', 'bg-blue-500/20 text-blue-400 border-blue-500/30'),
('Task Master', 'Complete 25 tasks', 'tasks', 'gold', 25, 'clipboard-check', 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'),
('Task Legend', 'Complete 50 tasks', 'tasks', 'platinum', 50, 'award', 'bg-purple-500/20 text-purple-400 border-purple-500/30'),

-- Category achievements
('Organizer', 'Create your first category', 'categories', 'bronze', 1, 'folder-plus', 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'),
('Category Master', 'Create 5 categories', 'categories', 'silver', 5, 'folders', 'bg-blue-500/20 text-blue-400 border-blue-500/30'),

-- Special achievements
('Perfectionist', 'Achieve 100% progress on a goal', 'special', 'gold', 100, 'star', 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'),
('Speed Demon', 'Complete a goal in the same day you created it', 'special', 'silver', 1, 'zap', 'bg-orange-500/20 text-orange-400 border-orange-500/30'),
('Overachiever', 'Exceed your weekly target on a goal', 'special', 'gold', 1, 'trending-up', 'bg-green-500/20 text-green-400 border-green-500/30');

-- Enable Row Level Security
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for achievements (read-only for all authenticated users)
CREATE POLICY "Anyone can view achievements" ON achievements FOR SELECT USING (auth.role() = 'authenticated');

-- Create policies for user_achievements
CREATE POLICY "Users can view their own achievements" ON user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own achievements" ON user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own achievements" ON user_achievements FOR UPDATE USING (auth.uid() = user_id);
