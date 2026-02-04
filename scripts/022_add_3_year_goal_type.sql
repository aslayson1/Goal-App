-- Add 3_year to the allowed goal_type values for long_term_goals table

-- Drop the existing check constraint
ALTER TABLE long_term_goals DROP CONSTRAINT IF EXISTS long_term_goals_goal_type_check;

-- Add the new check constraint with 3_year included
ALTER TABLE long_term_goals ADD CONSTRAINT long_term_goals_goal_type_check 
  CHECK (goal_type IN ('1_year', '3_year', '5_year'));
