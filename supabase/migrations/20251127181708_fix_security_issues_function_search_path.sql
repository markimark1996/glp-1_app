/*
  # Fix Database Security Issues - Part 3: Function Search Path

  ## Changes Made
  
  1. **Fix Function Search Paths**
     - Set search_path to 'public' for all trigger functions
     - Prevents potential security issues from mutable search paths
     - Functions updated:
       - update_updated_at_column
       - update_chat_messages_updated_at
       - update_goals_updated_at

  ## Security Notes
  - Setting explicit search_path prevents schema injection attacks
  - Uses SECURITY DEFINER pattern safely
  - All functions maintain their original behavior
*/

-- Fix update_updated_at_column function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix update_chat_messages_updated_at function
CREATE OR REPLACE FUNCTION public.update_chat_messages_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Fix update_goals_updated_at function
CREATE OR REPLACE FUNCTION public.update_goals_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;
