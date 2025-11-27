-- Drop existing table if it exists
DROP TABLE IF EXISTS meal_preferences;

-- Create meal_preferences table
CREATE TABLE meal_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL UNIQUE,
  diet_type text NOT NULL DEFAULT 'omnivore',
  restrictions text[] DEFAULT ARRAY[]::text[],
  allergies text[] DEFAULT ARRAY[]::text[],
  custom_restrictions text[] DEFAULT ARRAY[]::text[],
  nutritional_preferences jsonb DEFAULT '[]'::jsonb,
  caloric_target integer DEFAULT 2000,
  cooking_time_max integer DEFAULT 60,
  skill_level text DEFAULT 'beginner' CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  servings_default integer DEFAULT 2,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE meal_preferences ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own preferences" ON meal_preferences;
DROP POLICY IF EXISTS "Users can insert their own preferences" ON meal_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON meal_preferences;

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

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_meal_preferences_updated_at ON meal_preferences;

-- Create updated_at trigger
CREATE TRIGGER update_meal_preferences_updated_at
  BEFORE UPDATE ON meal_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Drop existing index if it exists
DROP INDEX IF EXISTS idx_meal_preferences_user_id;

-- Create index for faster lookups
CREATE INDEX idx_meal_preferences_user_id ON meal_preferences(user_id);