-- Create comprehensive database schema for goal tracker app
-- This script creates all necessary tables to support the full application

-- Enable Row Level Security
ALTER DATABASE postgres SET row_security = on;

-- Create users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Create goals table (12-week goals)
CREATE TABLE IF NOT EXISTS public.goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_count INTEGER NOT NULL DEFAULT 1,
  current_count INTEGER NOT NULL DEFAULT 0,
  weekly_target DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create long_term_goals table (1-year and 5-year goals)
CREATE TABLE IF NOT EXISTS public.long_term_goals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  timeframe TEXT CHECK (timeframe IN ('1-year', '5-year')) NOT NULL,
  status TEXT CHECK (status IN ('in-progress', 'completed', 'on-hold')) DEFAULT 'in-progress',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create milestones table for long-term goals
CREATE TABLE IF NOT EXISTS public.milestones (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  goal_id UUID REFERENCES public.long_term_goals(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  target_date DATE,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create tasks table (both weekly and daily tasks)
CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  task_type TEXT CHECK (task_type IN ('daily', 'weekly')) NOT NULL,
  target_date DATE, -- For weekly tasks, this is the week start date
  day_of_week TEXT, -- For daily tasks: Monday, Tuesday, etc.
  time_block TEXT, -- For daily tasks: "6:00 AM", etc.
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
  estimated_hours INTEGER, -- For weekly tasks
  estimated_minutes INTEGER, -- For daily tasks
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create progress_tracking table for analytics
CREATE TABLE IF NOT EXISTS public.progress_tracking (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  goals_completed INTEGER DEFAULT 0,
  tasks_completed INTEGER DEFAULT 0,
  total_goals INTEGER DEFAULT 0,
  total_tasks INTEGER DEFAULT 0,
  overall_progress DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create activity_log table for tracking user actions
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  action_type TEXT NOT NULL, -- 'goal_created', 'task_completed', etc.
  entity_type TEXT NOT NULL, -- 'goal', 'task', 'milestone'
  entity_id UUID,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories for new users
INSERT INTO public.categories (user_id, name, color) 
SELECT 
  auth.uid(),
  category_name,
  category_color
FROM (VALUES 
  ('Layson Group', 'bg-sky-100 text-sky-800 border-sky-200'),
  ('Upside', 'bg-violet-100 text-violet-800 border-violet-200'),
  ('Poplar Title', 'bg-purple-100 text-purple-800 border-purple-200'),
  ('Relationships/Family', 'bg-pink-100 text-pink-800 border-pink-200'),
  ('Physical/Nutrition/Health', 'bg-lime-100 text-lime-800 border-lime-200'),
  ('Spiritual/Contribution', 'bg-emerald-100 text-emerald-800 border-emerald-200'),
  ('Intellect/Education', 'bg-amber-100 text-amber-800 border-amber-200'),
  ('Lifestyle/Adventure', 'bg-orange-100 text-orange-800 border-orange-200'),
  ('Personal Finance/Material', 'bg-teal-100 text-teal-800 border-teal-200')
) AS default_categories(category_name, category_color)
WHERE auth.uid() IS NOT NULL
ON CONFLICT (user_id, name) DO NOTHING;

-- Row Level Security Policies

-- Users can only see their own data
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

-- Categories policies
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own categories" ON public.categories FOR ALL USING (auth.uid() = user_id);

-- Goals policies
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own goals" ON public.goals FOR ALL USING (auth.uid() = user_id);

-- Long-term goals policies
ALTER TABLE public.long_term_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own long-term goals" ON public.long_term_goals FOR ALL USING (auth.uid() = user_id);

-- Milestones policies
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own milestones" ON public.milestones FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.long_term_goals 
    WHERE id = milestones.goal_id AND user_id = auth.uid()
  )
);

-- Tasks policies
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own tasks" ON public.tasks FOR ALL USING (auth.uid() = user_id);

-- Progress tracking policies
ALTER TABLE public.progress_tracking ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own progress" ON public.progress_tracking FOR ALL USING (auth.uid() = user_id);

-- Activity log policies
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own activity" ON public.activity_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can insert activity" ON public.activity_log FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_category_id ON public.goals(category_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_goal_id ON public.tasks(goal_id);
CREATE INDEX IF NOT EXISTS idx_tasks_target_date ON public.tasks(target_date);
CREATE INDEX IF NOT EXISTS idx_long_term_goals_user_id ON public.long_term_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_milestones_goal_id ON public.milestones(goal_id);
CREATE INDEX IF NOT EXISTS idx_progress_tracking_user_date ON public.progress_tracking(user_id, date);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON public.activity_log(user_id);

-- Create functions for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_long_term_goals_updated_at BEFORE UPDATE ON public.long_term_goals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_milestones_updated_at BEFORE UPDATE ON public.milestones FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
