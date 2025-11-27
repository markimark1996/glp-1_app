/*
  # Drop old recipe tables

  This migration drops the existing recipe-related tables to prepare for the new structure.
*/

-- Drop old tables in correct order (children first)
DROP TABLE IF EXISTS recipe_tags CASCADE;
DROP TABLE IF EXISTS recipe_instructions CASCADE;
DROP TABLE IF EXISTS recipe_ingredients CASCADE;
DROP TABLE IF EXISTS recipe_likes CASCADE;
DROP TABLE IF EXISTS meal_plan_items CASCADE;
DROP TABLE IF EXISTS recipes CASCADE;
