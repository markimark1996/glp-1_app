/*
  # Fix recipe_favorites table to support string recipe IDs
  
  1. Changes
    - Change recipe_id column from uuid to text to support both integer and string IDs
    - This allows the table to work with sample data recipes (integer IDs) and future UUID-based recipes
  
  2. Security
    - Maintain existing RLS policies
    - No changes to authentication or authorization
*/

-- Drop the foreign key constraint if it exists
ALTER TABLE recipe_favorites 
DROP CONSTRAINT IF EXISTS recipe_favorites_recipe_id_fkey;

-- Change recipe_id type from uuid to text
ALTER TABLE recipe_favorites 
ALTER COLUMN recipe_id TYPE text USING recipe_id::text;