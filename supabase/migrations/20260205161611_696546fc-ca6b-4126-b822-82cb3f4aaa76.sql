-- Fix 1: Update award_xp to verify caller matches the user being awarded XP
CREATE OR REPLACE FUNCTION public.award_xp(user_uuid uuid, xp_amount integer)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
DECLARE
  new_xp INTEGER;
  new_level INTEGER;
BEGIN
  -- Security check: Only allow awarding XP to the authenticated user
  -- or allow trigger functions to call this (auth.uid() will be null in trigger context)
  IF auth.uid() IS NOT NULL AND auth.uid() != user_uuid THEN
    RAISE EXCEPTION 'Cannot award XP to another user';
  END IF;

  UPDATE public.profiles
  SET xp_points = xp_points + xp_amount,
      updated_at = now()
  WHERE user_id = user_uuid
  RETURNING xp_points INTO new_xp;
  
  -- Calculate new level based on XP
  SELECT COALESCE(MAX(level), 1) INTO new_level
  FROM public.gamification_levels
  WHERE xp_required <= new_xp;
  
  UPDATE public.profiles
  SET level = new_level
  WHERE user_id = user_uuid;
END;
$function$;

-- Fix 2: Update update_updated_at_column to have immutable search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

-- Fix 3: Restrict gamification_levels to authenticated users only
DROP POLICY IF EXISTS "Anyone can view levels" ON public.gamification_levels;
CREATE POLICY "Authenticated users can view levels" 
ON public.gamification_levels 
FOR SELECT 
USING (auth.uid() IS NOT NULL);