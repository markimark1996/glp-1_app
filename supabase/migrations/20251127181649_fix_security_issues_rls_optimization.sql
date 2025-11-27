/*
  # Fix Database Security Issues - Part 2: RLS Policy Optimization

  ## Changes Made
  
  1. **Optimize RLS Policies**
     - Replace `auth.uid()` with `(select auth.uid())` in all policies
     - This prevents re-evaluation of auth functions for each row
     - Significantly improves query performance at scale
  
  2. **Tables Updated**
     - meal_plans (4 policies)
     - weekly_meal_plans (1 policy)
     - grocery_lists (1 policy)
     - grocery_list_items (1 policy)
     - chat_messages (4 policies)
     - scanned_products (2 policies)
     - product_certifications (1 policy)
     - product_allergens (1 policy)
     - scan_history (2 policies)
     - recipe_favorites (3 policies)
     - goals (4 policies)
     - user_achievements (2 policies)
     - user_rewards (2 policies)
     - meal_preferences (3 policies)

  ## Security Notes
  - All policies maintain the same security requirements
  - Only the performance optimization pattern is changed
  - User isolation and access control remain unchanged
*/

-- Drop and recreate meal_plans policies
DROP POLICY IF EXISTS "Users can view their own meal plans" ON public.meal_plans;
DROP POLICY IF EXISTS "Users can create meal plans" ON public.meal_plans;
DROP POLICY IF EXISTS "Users can update their own meal plans" ON public.meal_plans;
DROP POLICY IF EXISTS "Users can delete their own meal plans" ON public.meal_plans;

CREATE POLICY "Users can view their own meal plans"
  ON public.meal_plans FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create meal plans"
  ON public.meal_plans FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own meal plans"
  ON public.meal_plans FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete their own meal plans"
  ON public.meal_plans FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Drop and recreate weekly_meal_plans policies
DROP POLICY IF EXISTS "Users can manage their meal plans" ON public.weekly_meal_plans;

CREATE POLICY "Users can manage their meal plans"
  ON public.weekly_meal_plans FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- Drop and recreate grocery_lists policies
DROP POLICY IF EXISTS "Users can manage their grocery lists" ON public.grocery_lists;

CREATE POLICY "Users can manage their grocery lists"
  ON public.grocery_lists FOR ALL
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- Drop and recreate grocery_list_items policies
DROP POLICY IF EXISTS "Users can manage their grocery list items" ON public.grocery_list_items;

CREATE POLICY "Users can manage their grocery list items"
  ON public.grocery_list_items FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.grocery_lists
      WHERE grocery_lists.id = grocery_list_items.grocery_list_id
      AND grocery_lists.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.grocery_lists
      WHERE grocery_lists.id = grocery_list_items.grocery_list_id
      AND grocery_lists.user_id = (select auth.uid())
    )
  );

-- Drop and recreate chat_messages policies
DROP POLICY IF EXISTS "Users can view their own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can create chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can update their own chat messages" ON public.chat_messages;
DROP POLICY IF EXISTS "Users can delete their own chat messages" ON public.chat_messages;

CREATE POLICY "Users can view their own chat messages"
  ON public.chat_messages FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create chat messages"
  ON public.chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own chat messages"
  ON public.chat_messages FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete their own chat messages"
  ON public.chat_messages FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Drop and recreate scanned_products policies
DROP POLICY IF EXISTS "Users can insert their own products" ON public.scanned_products;
DROP POLICY IF EXISTS "Users can update their own products" ON public.scanned_products;

CREATE POLICY "Users can insert their own products"
  ON public.scanned_products FOR INSERT
  TO authenticated
  WITH CHECK (created_by = (select auth.uid()));

CREATE POLICY "Users can update their own products"
  ON public.scanned_products FOR UPDATE
  TO authenticated
  USING (created_by = (select auth.uid()))
  WITH CHECK (created_by = (select auth.uid()));

-- Drop and recreate product_certifications policies
DROP POLICY IF EXISTS "Users can manage certifications for their products" ON public.product_certifications;

CREATE POLICY "Users can manage certifications for their products"
  ON public.product_certifications FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.scanned_products
      WHERE scanned_products.id = product_certifications.product_id
      AND scanned_products.created_by = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.scanned_products
      WHERE scanned_products.id = product_certifications.product_id
      AND scanned_products.created_by = (select auth.uid())
    )
  );

-- Drop and recreate product_allergens policies
DROP POLICY IF EXISTS "Users can manage allergens for their products" ON public.product_allergens;

CREATE POLICY "Users can manage allergens for their products"
  ON public.product_allergens FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.scanned_products
      WHERE scanned_products.id = product_allergens.product_id
      AND scanned_products.created_by = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.scanned_products
      WHERE scanned_products.id = product_allergens.product_id
      AND scanned_products.created_by = (select auth.uid())
    )
  );

-- Drop and recreate scan_history policies
DROP POLICY IF EXISTS "Users can view their own scan history" ON public.scan_history;
DROP POLICY IF EXISTS "Users can insert their own scan history" ON public.scan_history;

CREATE POLICY "Users can view their own scan history"
  ON public.scan_history FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert their own scan history"
  ON public.scan_history FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- Drop and recreate recipe_favorites policies
DROP POLICY IF EXISTS "Users can read own favorites" ON public.recipe_favorites;
DROP POLICY IF EXISTS "Users can insert own favorites" ON public.recipe_favorites;
DROP POLICY IF EXISTS "Users can delete own favorites" ON public.recipe_favorites;

CREATE POLICY "Users can read own favorites"
  ON public.recipe_favorites FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own favorites"
  ON public.recipe_favorites FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete own favorites"
  ON public.recipe_favorites FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Drop and recreate goals policies
DROP POLICY IF EXISTS "Users can view their own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can create their own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can update their own goals" ON public.goals;
DROP POLICY IF EXISTS "Users can delete their own goals" ON public.goals;

CREATE POLICY "Users can view their own goals"
  ON public.goals FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can create their own goals"
  ON public.goals FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own goals"
  ON public.goals FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can delete their own goals"
  ON public.goals FOR DELETE
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Drop and recreate user_achievements policies
DROP POLICY IF EXISTS "Users can view their own achievements" ON public.user_achievements;
DROP POLICY IF EXISTS "Users can unlock achievements" ON public.user_achievements;

CREATE POLICY "Users can view their own achievements"
  ON public.user_achievements FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can unlock achievements"
  ON public.user_achievements FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- Drop and recreate user_rewards policies
DROP POLICY IF EXISTS "Users can view their claimed rewards" ON public.user_rewards;
DROP POLICY IF EXISTS "Users can claim rewards" ON public.user_rewards;

CREATE POLICY "Users can view their claimed rewards"
  ON public.user_rewards FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can claim rewards"
  ON public.user_rewards FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- Drop and recreate meal_preferences policies
DROP POLICY IF EXISTS "Users can view their own preferences" ON public.meal_preferences;
DROP POLICY IF EXISTS "Users can insert their own preferences" ON public.meal_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences" ON public.meal_preferences;

CREATE POLICY "Users can view their own preferences"
  ON public.meal_preferences FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert their own preferences"
  ON public.meal_preferences FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update their own preferences"
  ON public.meal_preferences FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));
