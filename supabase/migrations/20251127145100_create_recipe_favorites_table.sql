/*
  # Create recipe_favorites table

  1. New Tables
    - `recipe_favorites`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `recipe_id` (text, stores the recipe ID from sample data)
      - `created_at` (timestamp with time zone)
  
  2. Security
    - Enable RLS on `recipe_favorites` table
    - Add policy for authenticated users to read their own favorites
    - Add policy for authenticated users to insert their own favorites
    - Add policy for authenticated users to delete their own favorites
  
  3. Indexes
    - Add unique index on user_id and recipe_id to prevent duplicates
    - Add index on user_id for faster queries
*/

-- Create recipe_favorites table
CREATE TABLE IF NOT EXISTS recipe_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipe_id text NOT NULL,
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
CREATE UNIQUE INDEX IF NOT EXISTS recipe_favorites_user_recipe_unique 
  ON recipe_favorites(user_id, recipe_id);

CREATE INDEX IF NOT EXISTS recipe_favorites_user_id_idx 
  ON recipe_favorites(user_id);
