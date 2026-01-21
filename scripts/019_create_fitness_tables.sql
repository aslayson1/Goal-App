-- Create fitness_logs table to track daily workouts
CREATE TABLE IF NOT EXISTS fitness_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  agent_id UUID REFERENCES agents(id),
  logged_date DATE NOT NULL,
  workout_type VARCHAR(50), -- e.g., "cardio", "strength", "yoga", "general"
  duration_minutes INTEGER,
  intensity VARCHAR(20), -- "light", "moderate", "high"
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, agent_id, logged_date)
);

-- Create fitness_streaks table to track current streaks
CREATE TABLE IF NOT EXISTS fitness_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  agent_id UUID REFERENCES agents(id),
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_workout_date DATE,
  total_workouts INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, agent_id)
);

-- Create fitness_challenges table for team challenges
CREATE TABLE IF NOT EXISTS fitness_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  goal_type VARCHAR(50), -- "days_worked_out", "total_minutes", "streak"
  goal_target INTEGER,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on fitness tables
ALTER TABLE fitness_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE fitness_challenges ENABLE ROW LEVEL SECURITY;

-- RLS policies for fitness_logs
CREATE POLICY "Users can view their own fitness logs" ON fitness_logs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fitness logs" ON fitness_logs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fitness logs" ON fitness_logs
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fitness logs" ON fitness_logs
  FOR DELETE USING (auth.uid() = user_id);

-- RLS policies for fitness_streaks
CREATE POLICY "Users can view their own streaks" ON fitness_streaks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streaks" ON fitness_streaks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks" ON fitness_streaks
  FOR UPDATE USING (auth.uid() = user_id);

-- RLS policies for fitness_challenges (read-only for users)
CREATE POLICY "Users can view fitness challenges" ON fitness_challenges
  FOR SELECT USING (true);

-- Create indexes
CREATE INDEX idx_fitness_logs_user_date ON fitness_logs(user_id, logged_date);
CREATE INDEX idx_fitness_logs_agent_date ON fitness_logs(agent_id, logged_date);
CREATE INDEX idx_fitness_streaks_user ON fitness_streaks(user_id);
