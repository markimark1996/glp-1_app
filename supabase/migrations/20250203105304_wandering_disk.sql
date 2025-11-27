/*
  # Fix Goals Schema

  1. Changes
    - Clean up and consolidate previous migrations
    - Update goal_category enum to match application types
    - Add proper indexes and constraints
    - Add sample data

  2. Security
    - Enable RLS on all tables
    - Add appropriate policies for data access
*/

-- Drop existing types and tables to ensure clean slate
DROP TYPE IF EXISTS goal_category CASCADE;
DROP TYPE IF EXISTS goal_duration CASCADE;
DROP TYPE IF EXISTS goal_status CASCADE;
DROP TYPE IF EXISTS reward_type CASCADE;

DROP TABLE IF EXISTS user_rewards CASCADE;
DROP TABLE IF EXISTS user_achievements CASCADE;
DROP TABLE IF EXISTS rewards CASCADE;
DROP TABLE IF EXISTS achievements CASCADE;
DROP TABLE IF EXISTS goals CASCADE;

-- Create enums
CREATE TYPE goal_category AS ENUM ('nutrition', 'hydration');
CREATE TYPE goal_duration AS ENUM ('daily', 'weekly', 'monthly', 'quarterly');
CREATE TYPE goal_status AS ENUM ('in_progress', 'completed', 'failed');

-- Create goals table
CREATE TABLE goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  category goal_category NOT NULL,
  title text NOT NULL,
  description text,
  target numeric NOT NULL,
  unit text NOT NULL,
  duration goal_duration NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  current_progress numeric DEFAULT 0,
  status goal_status DEFAULT 'in_progress',
  points integer DEFAULT 100,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create achievements table
CREATE TABLE achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  points integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create user achievements table
CREATE TABLE user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  achievement_id uuid REFERENCES achievements NOT NULL,
  unlocked_at timestamptz DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- Create rewards table
CREATE TABLE rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL,
  points_cost integer NOT NULL,
  type text NOT NULL CHECK (type IN ('recipe', 'template', 'badge')),
  created_at timestamptz DEFAULT now()
);

-- Create user rewards table
CREATE TABLE user_rewards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  reward_id uuid REFERENCES rewards NOT NULL,
  claimed_at timestamptz DEFAULT now(),
  UNIQUE(user_id, reward_id)
);

-- Enable Row Level Security
ALTER TABLE goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_rewards ENABLE ROW LEVEL SECURITY;

-- Create policies for goals
CREATE POLICY "Users can view their own goals"
  ON goals FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own goals"
  ON goals FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals"
  ON goals FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals"
  ON goals FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for achievements
CREATE POLICY "Anyone can view achievements"
  ON achievements FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for user achievements
CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock achievements"
  ON user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create policies for rewards
CREATE POLICY "Anyone can view rewards"
  ON rewards FOR SELECT
  TO authenticated
  USING (true);

-- Create policies for user rewards
CREATE POLICY "Users can view their claimed rewards"
  ON user_rewards FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can claim rewards"
  ON user_rewards FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_goals_user_id ON goals(user_id);
CREATE INDEX idx_goals_category ON goals(category);
CREATE INDEX idx_goals_status ON goals(status);
CREATE INDEX idx_user_achievements_user_id ON user_achievements(user_id);
CREATE INDEX idx_user_rewards_user_id ON user_rewards(user_id);

-- Add sample data
INSERT INTO achievements (title, description, image_url, points) VALUES
  ('Early Bird', 'Complete your first goal', 'https://api.dicebear.com/7.x/shapes/svg?seed=achievement1', 50),
  ('Goal Getter', 'Complete 5 goals', 'https://api.dicebear.com/7.x/shapes/svg?seed=achievement2', 100),
  ('Consistency King', 'Complete 10 goals', 'https://api.dicebear.com/7.x/shapes/svg?seed=achievement3', 200);

INSERT INTO rewards (title, description, image_url, points_cost, type) VALUES
  ('Healthy Recipe Pack', 'Unlock 10 premium healthy recipes', 'https://api.dicebear.com/7.x/shapes/svg?seed=reward1', 500, 'recipe'),
  ('Meal Plan Template', 'Premium meal planning template', 'https://api.dicebear.com/7.x/shapes/svg?seed=reward2', 300, 'template'),
  ('Nutrition Expert Badge', 'Show off your nutrition expertise', 'https://api.dicebear.com/7.x/shapes/svg?seed=reward3', 1000, 'badge');

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for goals
CREATE TRIGGER update_goals_updated_at
  BEFORE UPDATE ON goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();