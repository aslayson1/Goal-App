-- Add unique constraint on user_id for fitness_streaks table to enable upsert operations

-- First, delete any duplicate user_id entries (keep the one with highest streak)
DELETE FROM fitness_streaks a
USING fitness_streaks b
WHERE a.user_id = b.user_id 
  AND a.id < b.id;

-- Add unique constraint on user_id
ALTER TABLE fitness_streaks 
ADD CONSTRAINT fitness_streaks_user_id_unique UNIQUE (user_id);
