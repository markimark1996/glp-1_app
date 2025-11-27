/*
  # Add Meal Preferences Table

  1. New Tables
    - `meal_preferences`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `diet_type` (text)
      - `restrictions` (text[])
      - `allergies` (text[])
      - `custom_restrictions` (text[])
      - `nutritional_preferences` (jsonb)
      - `caloric_target` (integer)
      - `cooking_time_max` (integer)
      - `skill_level` (text)
      - `servings_default` (integer)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS
    - Add policies for authenticated users
*/

-- Create meal_preferences table
CREATE TABLE IF NOT EXISTS meal_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  diet_type text NOT NULL,
  restrictions text[] DEFAULT '{}',
  allergies text[] DEFAULT '{}',
  custom_restrictions text[] DEFAULT '{}',
  nutritional_preferences jsonb DEFAULT '[]',
  caloric_target integer,
  cooking_time_max integer,
  skill_level text CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  servings_default integer DEFAULT 2,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE meal_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own preferences"
  ON meal_preferences
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON meal_preferences
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON meal_preferences
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER update_meal_preferences_updated_at
  BEFORE UPDATE ON meal_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster lookups
CREATE INDEX idx_meal_preferences_user_id ON meal_preferences(user_id);