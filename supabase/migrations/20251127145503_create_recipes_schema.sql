/*
  # Create Recipe Schema

  ## Overview
  This migration creates comprehensive tables to store recipe data including ingredients, 
  instructions, dietary information, nutrition facts, and more.

  ## New Tables
  
  ### 1. `recipes` (main recipe table)
  - `id` (uuid, primary key)
  - `name` (text) - Recipe name
  - `description` (text) - Recipe description
  - `prep_time` (integer) - Preparation time in minutes
  - `cook_time` (integer) - Cooking time in minutes
  - `servings` (numeric) - Number of servings
  - `image_url` (text) - Recipe image URL
  - `likes` (integer) - Number of likes, default 0
  - `difficulty` (text) - beginner/intermediate/advanced
  - `cuisine` (text) - Cuisine type
  - `health_score` (integer) - Health score 0-100
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### 2. `recipe_ingredients` (ingredients for each recipe)
  - Stores ingredient details with pricing information

  ### 3. `recipe_instructions` (step-by-step instructions)
  - Sequential cooking instructions

  ### 4. `recipe_dietary_info` (dietary flags)
  - Boolean flags for dietary preferences

  ### 5. `recipe_nutrition` (nutritional information)
  - Nutritional values per serving

  ### 6. `recipe_equipment`, `recipe_tips`, `recipe_variations`
  - Additional recipe metadata

  ## Security
  - Enable RLS on all tables
  - Allow public read access (recipes are public content)
  - Only authenticated users can insert/update/delete
*/

-- Create main recipes table
CREATE TABLE recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  prep_time integer NOT NULL,
  cook_time integer NOT NULL,
  servings numeric NOT NULL,
  image_url text NOT NULL,
  likes integer DEFAULT 0,
  difficulty text NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  cuisine text NOT NULL,
  health_score integer DEFAULT 50 CHECK (health_score >= 0 AND health_score <= 100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create recipe ingredients table
CREATE TABLE recipe_ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  name text NOT NULL,
  amount numeric NOT NULL,
  unit text NOT NULL,
  notes text,
  product_name text,
  price numeric,
  promoted numeric,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create recipe instructions table
CREATE TABLE recipe_instructions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  step_number integer NOT NULL,
  text text NOT NULL,
  image_url text,
  created_at timestamptz DEFAULT now()
);

-- Create dietary info table
CREATE TABLE recipe_dietary_info (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE UNIQUE,
  vegetarian boolean DEFAULT false,
  vegan boolean DEFAULT false,
  gluten_free boolean DEFAULT false,
  dairy_free boolean DEFAULT false,
  pescetarian boolean DEFAULT false,
  high_protein boolean DEFAULT false,
  high_fibre boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Create nutrition table
CREATE TABLE recipe_nutrition (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE UNIQUE,
  calories numeric NOT NULL,
  protein numeric NOT NULL,
  carbs numeric NOT NULL,
  fat numeric NOT NULL,
  fiber numeric NOT NULL,
  sugar numeric NOT NULL,
  salt numeric,
  created_at timestamptz DEFAULT now()
);

-- Create equipment table
CREATE TABLE recipe_equipment (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  equipment text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create tips table
CREATE TABLE recipe_tips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  tip text NOT NULL,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create variations table
CREATE TABLE recipe_variations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid NOT NULL REFERENCES recipes(id) ON DELETE CASCADE,
  variation text NOT NULL,
  order_index integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX recipes_name_idx ON recipes(name);
CREATE INDEX recipes_cuisine_idx ON recipes(cuisine);
CREATE INDEX recipes_difficulty_idx ON recipes(difficulty);
CREATE INDEX recipes_health_score_idx ON recipes(health_score);
CREATE INDEX recipe_ingredients_recipe_id_idx ON recipe_ingredients(recipe_id);
CREATE INDEX recipe_instructions_recipe_id_idx ON recipe_instructions(recipe_id);
CREATE INDEX recipe_dietary_info_recipe_id_idx ON recipe_dietary_info(recipe_id);
CREATE INDEX recipe_nutrition_recipe_id_idx ON recipe_nutrition(recipe_id);

-- Enable RLS on all tables
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_dietary_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_nutrition ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_tips ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_variations ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Public can read recipes"
  ON recipes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can read recipe ingredients"
  ON recipe_ingredients FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can read recipe instructions"
  ON recipe_instructions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can read recipe dietary info"
  ON recipe_dietary_info FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can read recipe nutrition"
  ON recipe_nutrition FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can read recipe equipment"
  ON recipe_equipment FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can read recipe tips"
  ON recipe_tips FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public can read recipe variations"
  ON recipe_variations FOR SELECT
  TO public
  USING (true);

-- Create policies for authenticated users to manage recipes
CREATE POLICY "Authenticated users can insert recipes"
  ON recipes FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update recipes"
  ON recipes FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete recipes"
  ON recipes FOR DELETE
  TO authenticated
  USING (true);
