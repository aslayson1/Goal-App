-- Add missing columns to tasks table for daily task functionality
ALTER TABLE tasks 
ADD COLUMN IF NOT EXISTS time_block TEXT,
ADD COLUMN IF NOT EXISTS estimated_minutes INTEGER;
