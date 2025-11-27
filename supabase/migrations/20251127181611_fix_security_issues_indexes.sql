/*
  # Fix Database Security Issues - Part 1: Indexes

  ## Changes Made
  
  1. **Add Indexes for Foreign Keys**
     - `chat_messages.user_id` - Index for user's chat messages lookup
     - `grocery_list_items.grocery_list_id` - Index for items in a grocery list
     - `grocery_lists.meal_plan_id` - Index for grocery lists by meal plan
     - `grocery_lists.user_id` - Index for user's grocery lists
     - `recipe_equipment.recipe_id` - Index for recipe equipment lookup
     - `recipe_tips.recipe_id` - Index for recipe tips lookup
     - `recipe_variations.recipe_id` - Index for recipe variations lookup
     - `scanned_products.created_by` - Index for products by creator
     - `user_achievements.achievement_id` - Index for achievement lookup
     - `user_rewards.reward_id` - Index for reward lookup
     - `weekly_meal_plans.user_id` - Index for user's weekly meal plans

  2. **Performance Improvements**
     - All foreign key columns now have covering indexes
     - Improves query performance for JOIN operations
     - Reduces table scan overhead
*/

-- Add index for chat_messages.user_id
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id 
  ON public.chat_messages(user_id);

-- Add index for grocery_list_items.grocery_list_id
CREATE INDEX IF NOT EXISTS idx_grocery_list_items_grocery_list_id 
  ON public.grocery_list_items(grocery_list_id);

-- Add index for grocery_lists.meal_plan_id
CREATE INDEX IF NOT EXISTS idx_grocery_lists_meal_plan_id 
  ON public.grocery_lists(meal_plan_id);

-- Add index for grocery_lists.user_id
CREATE INDEX IF NOT EXISTS idx_grocery_lists_user_id 
  ON public.grocery_lists(user_id);

-- Add index for recipe_equipment.recipe_id
CREATE INDEX IF NOT EXISTS idx_recipe_equipment_recipe_id 
  ON public.recipe_equipment(recipe_id);

-- Add index for recipe_tips.recipe_id
CREATE INDEX IF NOT EXISTS idx_recipe_tips_recipe_id 
  ON public.recipe_tips(recipe_id);

-- Add index for recipe_variations.recipe_id
CREATE INDEX IF NOT EXISTS idx_recipe_variations_recipe_id 
  ON public.recipe_variations(recipe_id);

-- Add index for scanned_products.created_by
CREATE INDEX IF NOT EXISTS idx_scanned_products_created_by 
  ON public.scanned_products(created_by);

-- Add index for user_achievements.achievement_id
CREATE INDEX IF NOT EXISTS idx_user_achievements_achievement_id 
  ON public.user_achievements(achievement_id);

-- Add index for user_rewards.reward_id
CREATE INDEX IF NOT EXISTS idx_user_rewards_reward_id 
  ON public.user_rewards(reward_id);

-- Add index for weekly_meal_plans.user_id
CREATE INDEX IF NOT EXISTS idx_weekly_meal_plans_user_id 
  ON public.weekly_meal_plans(user_id);
