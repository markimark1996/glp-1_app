/*
  # Update recipe_favorites table to use UUID foreign keys

  ## Changes
  - Drop the existing recipe_favorites table
  - Recreate with proper UUID foreign key to recipes table
  - Maintain user_id foreign key to auth.users
  - Keep all RLS policies

  ## Security
  - RLS enabled
  - Same policies as before (users can only manage their own favorites)
*/

-- Drop the old recipe_favorites table
DROP TABLE IF EXISTS recipe_favorites CASCADE;

-- Recreate with UUID foreign key to recipes
CREATE TABLE recipe_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE recipe_favorites ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own favorites"
  ON recipe_favorites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own favorites"
  ON recipe_favorites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own favorites"
  ON recipe_favorites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes
CREATE UNIQUE INDEX recipe_favorites_user_recipe_unique 
  ON recipe_favorites(user_id, recipe_id);

CREATE INDEX recipe_favorites_user_id_idx 
  ON recipe_favorites(user_id);

CREATE INDEX recipe_favorites_recipe_id_idx 
  ON recipe_favorites(recipe_id);
