-- Create database schema for goal tracker
-- This script creates all necessary tables for persisting user data

-- Enable RLS
ALTER DATABASE postgres SET row_security = on;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Goals table (12-week goals)
CREATE TABLE IF NOT EXISTS goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_count INTEGER DEFAULT 1,
  weekly_target INTEGER DEFAULT 1,
  current_progress INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Long-term goals table (1-year and 5-year goals)
CREATE TABLE IF NOT EXISTS long_term_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  goal_type TEXT CHECK (goal_type IN ('1_year', '5_year')) NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table (daily and weekly tasks)
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES goals(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  task_type TEXT CHECK (task_type IN ('daily', 'weekly')) NOT NULL,
  target_date DATE NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Activity log table
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security policies
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE long_term_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Categories policies
CREATE POLICY "Users can view own categories" ON categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own categories" ON categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categories" ON categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own categories" ON categories FOR DELETE USING (auth.uid() = user_id);

-- Goals policies
CREATE POLICY "Users can view own goals" ON goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own goals" ON goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own goals" ON goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own goals" ON goals FOR DELETE USING (auth.uid() = user_id);

-- Long-term goals policies
CREATE POLICY "Users can view own long-term goals" ON long_term_goals FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own long-term goals" ON long_term_goals FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own long-term goals" ON long_term_goals FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own long-term goals" ON long_term_goals FOR DELETE USING (auth.uid() = user_id);

-- Tasks policies
CREATE POLICY "Users can view own tasks" ON tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks" ON tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks" ON tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks" ON tasks FOR DELETE USING (auth.uid() = user_id);

-- Activity log policies
CREATE POLICY "Users can view own activity" ON activity_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own activity" ON activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_categories_user_id ON categories(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_category_id ON goals(category_id);
CREATE INDEX IF NOT EXISTS idx_long_term_goals_user_id ON long_term_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_goal_id ON tasks(goal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_target_date ON tasks(target_date);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON activity_log(user_id);
