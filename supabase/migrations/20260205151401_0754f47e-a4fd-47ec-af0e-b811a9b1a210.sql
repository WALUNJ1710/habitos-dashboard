-- Add onboarding_completed field to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS onboarding_completed boolean DEFAULT false;

-- Update existing profiles that have full_name set to mark as completed
UPDATE public.profiles SET onboarding_completed = true WHERE full_name IS NOT NULL;