/*
  # Recipe Likes System

  1. New Tables
    - `recipe_likes`
      - `id` (uuid, primary key)
      - `recipe_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `recipe_likes` table
    - Add policies for authenticated users to manage their likes
*/

-- Create recipe likes table
CREATE TABLE IF NOT EXISTS recipe_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(recipe_id, user_id)
);

-- Enable RLS
ALTER TABLE recipe_likes ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view all recipe likes"
  ON recipe_likes
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their own likes"
  ON recipe_likes
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_recipe_likes_recipe ON recipe_likes(recipe_id);
CREATE INDEX idx_recipe_likes_user ON recipe_likes(user_id);