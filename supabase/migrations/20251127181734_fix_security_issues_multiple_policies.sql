/*
  # Fix Database Security Issues - Part 4: Multiple Permissive Policies

  ## Changes Made
  
  1. **Consolidate Multiple Permissive Policies**
     - Merge overlapping SELECT policies on product_allergens
     - Merge overlapping SELECT policies on product_certifications
     - Use OR conditions to combine both user ownership and public read access
  
  2. **Tables Fixed**
     - product_allergens: Combined "Users can manage allergens" and "Users can view all allergens"
     - product_certifications: Combined "Users can manage certifications" and "Users can view all certifications"

  ## Security Notes
  - Maintains both user ownership rights and public read access
  - Simplifies policy evaluation
  - Improves performance by reducing policy count
*/

-- Fix product_allergens policies
-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage allergens for their products" ON public.product_allergens;
DROP POLICY IF EXISTS "Users can view all allergens" ON public.product_allergens;

-- Create consolidated SELECT policy
CREATE POLICY "Users can view allergens"
  ON public.product_allergens FOR SELECT
  TO authenticated
  USING (
    -- Allow viewing all allergens OR owned products
    true
  );

-- Separate policies for modifications (only for owned products)
CREATE POLICY "Users can insert allergens for their products"
  ON public.product_allergens FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.scanned_products
      WHERE scanned_products.id = product_allergens.product_id
      AND scanned_products.created_by = (select auth.uid())
    )
  );

CREATE POLICY "Users can update allergens for their products"
  ON public.product_allergens FOR UPDATE
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

CREATE POLICY "Users can delete allergens for their products"
  ON public.product_allergens FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.scanned_products
      WHERE scanned_products.id = product_allergens.product_id
      AND scanned_products.created_by = (select auth.uid())
    )
  );

-- Fix product_certifications policies
-- Drop existing policies
DROP POLICY IF EXISTS "Users can manage certifications for their products" ON public.product_certifications;
DROP POLICY IF EXISTS "Users can view all certifications" ON public.product_certifications;

-- Create consolidated SELECT policy
CREATE POLICY "Users can view certifications"
  ON public.product_certifications FOR SELECT
  TO authenticated
  USING (
    -- Allow viewing all certifications OR owned products
    true
  );

-- Separate policies for modifications (only for owned products)
CREATE POLICY "Users can insert certifications for their products"
  ON public.product_certifications FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.scanned_products
      WHERE scanned_products.id = product_certifications.product_id
      AND scanned_products.created_by = (select auth.uid())
    )
  );

CREATE POLICY "Users can update certifications for their products"
  ON public.product_certifications FOR UPDATE
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

CREATE POLICY "Users can delete certifications for their products"
  ON public.product_certifications FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.scanned_products
      WHERE scanned_products.id = product_certifications.product_id
      AND scanned_products.created_by = (select auth.uid())
    )
  );
