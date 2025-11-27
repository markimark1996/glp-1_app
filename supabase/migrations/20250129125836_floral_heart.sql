/*
  # Meal Planning Schema

  1. New Tables
    - `meal_preferences`
      - User dietary preferences and requirements
    - `meal_plans`
      - Weekly meal plans for users
    - `meal_plan_items`
      - Individual meals within a plan
    - `recipes`
      - Recipe database with detailed information
    - `recipe_ingredients`
      - Ingredients for each recipe
    - `recipe_instructions`
      - Step-by-step cooking instructions
    - `recipe_tags`
      - Tags for filtering recipes (e.g., difficulty, time)
    - `grocery_lists`
      - Auto-generated shopping lists
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Meal Preferences
CREATE TABLE meal_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  caloric_target integer,
  cooking_time_max integer, -- in minutes
  skill_level text CHECK (skill_level IN ('beginner', 'intermediate', 'advanced')),
  servings_default integer DEFAULT 2,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Recipes
CREATE TABLE recipes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  prep_time integer, -- in minutes
  cook_time integer, -- in minutes
  servings integer,
  difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')),
  calories_per_serving integer,
  protein_per_serving integer,
  carbs_per_serving integer,
  fat_per_serving integer,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Recipe Ingredients
CREATE TABLE recipe_ingredients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes NOT NULL,
  name text NOT NULL,
  amount decimal NOT NULL,
  unit text NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Recipe Instructions
CREATE TABLE recipe_instructions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes NOT NULL,
  step_number integer NOT NULL,
  instruction text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Recipe Tags
CREATE TABLE recipe_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id uuid REFERENCES recipes NOT NULL,
  tag text NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(recipe_id, tag)
);

-- Weekly Meal Plans
CREATE TABLE weekly_meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  week_start_date date NOT NULL,
  name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Meal Plan Items
CREATE TABLE meal_plan_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id uuid REFERENCES weekly_meal_plans NOT NULL,
  recipe_id uuid REFERENCES recipes NOT NULL,
  day_of_week integer CHECK (day_of_week BETWEEN 0 AND 6),
  meal_type meal_type NOT NULL,
  servings integer NOT NULL,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Grocery Lists
CREATE TABLE grocery_lists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_plan_id uuid REFERENCES weekly_meal_plans NOT NULL,
  user_id uuid REFERENCES auth.users NOT NULL,
  name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Grocery List Items
CREATE TABLE grocery_list_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grocery_list_id uuid REFERENCES grocery_lists NOT NULL,
  ingredient_name text NOT NULL,
  amount decimal NOT NULL,
  unit text NOT NULL,
  category text NOT NULL,
  checked boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE meal_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_instructions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plan_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE grocery_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE grocery_list_items ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view all recipes"
  ON recipes FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage their meal preferences"
  ON meal_preferences
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their meal plans"
  ON weekly_meal_plans
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their meal plan items"
  ON meal_plan_items
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM weekly_meal_plans
    WHERE id = meal_plan_id AND user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM weekly_meal_plans
    WHERE id = meal_plan_id AND user_id = auth.uid()
  ));

CREATE POLICY "Users can manage their grocery lists"
  ON grocery_lists
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage their grocery list items"
  ON grocery_list_items
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM grocery_lists
    WHERE id = grocery_list_id AND user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM grocery_lists
    WHERE id = grocery_list_id AND user_id = auth.uid()
  ));

-- Indexes for better performance
CREATE INDEX idx_recipe_tags_tag ON recipe_tags(tag);
CREATE INDEX idx_meal_plan_items_day ON meal_plan_items(day_of_week);
CREATE INDEX idx_grocery_items_category ON grocery_list_items(category);