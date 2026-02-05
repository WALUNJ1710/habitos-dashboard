-- =============================================
-- HABITOS: Complete Database Schema
-- =============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- ENUMS
-- =============================================

CREATE TYPE public.task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TYPE public.task_status AS ENUM ('todo', 'in_progress', 'done');
CREATE TYPE public.recurrence_type AS ENUM ('daily', 'weekly', 'monthly', 'custom');
CREATE TYPE public.mood_type AS ENUM ('great', 'good', 'okay', 'bad', 'terrible');
CREATE TYPE public.meal_type AS ENUM ('breakfast', 'lunch', 'dinner', 'snack');
CREATE TYPE public.goal_mode AS ENUM ('cutting', 'bulking', 'maintenance');
CREATE TYPE public.transaction_type AS ENUM ('income', 'expense');
CREATE TYPE public.payment_mode AS ENUM ('cash', 'upi', 'card', 'bank_transfer');
CREATE TYPE public.streak_level AS ENUM ('bronze', 'silver', 'gold', 'diamond');

-- =============================================
-- USER PROFILES & SETTINGS
-- =============================================

CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  weight DECIMAL(5,2),
  height DECIMAL(5,2),
  goal_weight DECIMAL(5,2),
  calorie_goal INTEGER DEFAULT 2000,
  budget_goal DECIMAL(12,2) DEFAULT 0,
  currency TEXT DEFAULT 'INR',
  theme TEXT DEFAULT 'dark',
  xp_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  notifications_enabled BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- GAMIFICATION
-- =============================================

CREATE TABLE public.gamification_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level INTEGER NOT NULL UNIQUE,
  name TEXT NOT NULL,
  xp_required INTEGER NOT NULL,
  badge_emoji TEXT
);

CREATE TABLE public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  badge_name TEXT NOT NULL,
  badge_emoji TEXT,
  earned_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, badge_name)
);

-- =============================================
-- TASKS & TO-DO
-- =============================================

CREATE TABLE public.task_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#6366f1',
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  priority task_priority DEFAULT 'medium',
  status task_status DEFAULT 'todo',
  category_id UUID REFERENCES public.task_categories(id) ON DELETE SET NULL,
  goal_id UUID REFERENCES public.goals(id) ON DELETE SET NULL,
  due_date DATE,
  due_time TIME,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_type recurrence_type,
  recurrence_interval INTEGER,
  tags TEXT[],
  notes TEXT,
  time_spent_minutes INTEGER DEFAULT 0,
  is_focus_task BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.task_time_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ,
  duration_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- HABITS & STREAKS
-- =============================================

CREATE TABLE public.habits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#10b981',
  frequency TEXT DEFAULT 'daily',
  target_count INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.habit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL,
  completed_count INTEGER DEFAULT 1,
  skipped BOOLEAN DEFAULT false,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(habit_id, log_date)
);

CREATE TABLE public.habit_streaks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  habit_id UUID REFERENCES public.habits(id) ON DELETE CASCADE NOT NULL UNIQUE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  streak_level streak_level DEFAULT 'bronze',
  streak_freezes_available INTEGER DEFAULT 1,
  last_freeze_used TIMESTAMPTZ,
  last_completed_date DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- HEALTH TRACKING
-- =============================================

CREATE TABLE public.health_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL,
  weight DECIMAL(5,2),
  water_intake_ml INTEGER DEFAULT 0,
  sleep_hours DECIMAL(3,1),
  steps INTEGER DEFAULT 0,
  mood mood_type,
  heart_rate INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, log_date)
);

CREATE TABLE public.medicine_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  medicine_name TEXT NOT NULL,
  dosage TEXT,
  reminder_times TIME[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.medicine_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reminder_id UUID REFERENCES public.medicine_reminders(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  taken_at TIMESTAMPTZ DEFAULT now(),
  log_date DATE NOT NULL
);

-- =============================================
-- CALORIE & NUTRITION
-- =============================================

CREATE TABLE public.food_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  calories INTEGER NOT NULL,
  protein DECIMAL(6,2) DEFAULT 0,
  carbs DECIMAL(6,2) DEFAULT 0,
  fat DECIMAL(6,2) DEFAULT 0,
  serving_size TEXT,
  is_favorite BOOLEAN DEFAULT false,
  is_global BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  meal_type meal_type NOT NULL,
  meal_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.meal_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  meal_id UUID REFERENCES public.meals(id) ON DELETE CASCADE NOT NULL,
  food_item_id UUID REFERENCES public.food_items(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  quantity DECIMAL(6,2) DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.calorie_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  daily_target INTEGER DEFAULT 2000,
  protein_target INTEGER DEFAULT 50,
  carbs_target INTEGER DEFAULT 250,
  fat_target INTEGER DEFAULT 65,
  goal_mode goal_mode DEFAULT 'maintenance',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  exercise_name TEXT NOT NULL,
  calories_burned INTEGER NOT NULL,
  duration_minutes INTEGER,
  log_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- BUDGET & FINANCE
-- =============================================

CREATE TABLE public.budget_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type transaction_type NOT NULL,
  icon TEXT,
  color TEXT DEFAULT '#6366f1',
  budget_limit DECIMAL(12,2),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type transaction_type NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  category_id UUID REFERENCES public.budget_categories(id) ON DELETE SET NULL,
  description TEXT,
  payment_mode payment_mode DEFAULT 'cash',
  transaction_date DATE NOT NULL,
  is_recurring BOOLEAN DEFAULT false,
  recurrence_type recurrence_type,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.savings_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  target_amount DECIMAL(12,2) NOT NULL,
  current_amount DECIMAL(12,2) DEFAULT 0,
  target_date DATE,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- NOTIFICATIONS
-- =============================================

CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- =============================================
-- HELPER FUNCTIONS
-- =============================================

CREATE OR REPLACE FUNCTION public.is_task_owner(task_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.tasks
    WHERE id = task_uuid AND user_id = auth.uid()
  )
$$;

CREATE OR REPLACE FUNCTION public.is_habit_owner(habit_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.habits
    WHERE id = habit_uuid AND user_id = auth.uid()
  )
$$;

CREATE OR REPLACE FUNCTION public.is_meal_owner(meal_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.meals
    WHERE id = meal_uuid AND user_id = auth.uid()
  )
$$;

CREATE OR REPLACE FUNCTION public.award_xp(user_uuid UUID, xp_amount INTEGER)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  new_xp INTEGER;
  new_level INTEGER;
BEGIN
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
$$;

-- =============================================
-- TRIGGERS FOR UPDATED_AT
-- =============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_goals_updated_at BEFORE UPDATE ON public.goals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_habits_updated_at BEFORE UPDATE ON public.habits
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_habit_streaks_updated_at BEFORE UPDATE ON public.habit_streaks
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_health_logs_updated_at BEFORE UPDATE ON public.health_logs
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_calorie_goals_updated_at BEFORE UPDATE ON public.calorie_goals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_savings_goals_updated_at BEFORE UPDATE ON public.savings_goals
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================
-- TRIGGER: Create profile on user signup
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  
  -- Create default calorie goals
  INSERT INTO public.calorie_goals (user_id)
  VALUES (NEW.id);
  
  -- Create default budget categories
  INSERT INTO public.budget_categories (user_id, name, type, icon, color) VALUES
    (NEW.id, 'Salary', 'income', '💰', '#10b981'),
    (NEW.id, 'Food', 'expense', '🍔', '#f59e0b'),
    (NEW.id, 'Transport', 'expense', '🚗', '#3b82f6'),
    (NEW.id, 'Shopping', 'expense', '🛒', '#ec4899'),
    (NEW.id, 'Bills', 'expense', '📄', '#ef4444'),
    (NEW.id, 'Entertainment', 'expense', '🎮', '#8b5cf6');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- TRIGGER: Award XP on task completion
-- =============================================

CREATE OR REPLACE FUNCTION public.handle_task_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'done' AND (OLD.status IS NULL OR OLD.status != 'done') THEN
    PERFORM public.award_xp(NEW.user_id, 10);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_task_completed
AFTER INSERT OR UPDATE ON public.tasks
FOR EACH ROW EXECUTE FUNCTION public.handle_task_completion();

-- =============================================
-- ROW LEVEL SECURITY
-- =============================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Gamification Levels (public read)
ALTER TABLE public.gamification_levels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view levels" ON public.gamification_levels FOR SELECT USING (true);

-- User Badges
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own badges" ON public.user_badges FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own badges" ON public.user_badges FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Task Categories
ALTER TABLE public.task_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own categories" ON public.task_categories FOR ALL USING (auth.uid() = user_id);

-- Goals
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own goals" ON public.goals FOR ALL USING (auth.uid() = user_id);

-- Tasks
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own tasks" ON public.tasks FOR ALL USING (auth.uid() = user_id);

-- Subtasks
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own subtasks" ON public.subtasks FOR ALL USING (auth.uid() = user_id);

-- Task Time Logs
ALTER TABLE public.task_time_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own time logs" ON public.task_time_logs FOR ALL USING (auth.uid() = user_id);

-- Habits
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own habits" ON public.habits FOR ALL USING (auth.uid() = user_id);

-- Habit Logs
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own habit logs" ON public.habit_logs FOR ALL USING (auth.uid() = user_id);

-- Habit Streaks
ALTER TABLE public.habit_streaks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own streaks" ON public.habit_streaks FOR ALL USING (auth.uid() = user_id);

-- Health Logs
ALTER TABLE public.health_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own health logs" ON public.health_logs FOR ALL USING (auth.uid() = user_id);

-- Medicine Reminders
ALTER TABLE public.medicine_reminders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own reminders" ON public.medicine_reminders FOR ALL USING (auth.uid() = user_id);

-- Medicine Logs
ALTER TABLE public.medicine_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own medicine logs" ON public.medicine_logs FOR ALL USING (auth.uid() = user_id);

-- Food Items
ALTER TABLE public.food_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own and global foods" ON public.food_items FOR SELECT USING (auth.uid() = user_id OR is_global = true);
CREATE POLICY "Users can insert own foods" ON public.food_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own foods" ON public.food_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own foods" ON public.food_items FOR DELETE USING (auth.uid() = user_id);

-- Meals
ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own meals" ON public.meals FOR ALL USING (auth.uid() = user_id);

-- Meal Items
ALTER TABLE public.meal_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own meal items" ON public.meal_items FOR ALL USING (auth.uid() = user_id);

-- Calorie Goals
ALTER TABLE public.calorie_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own calorie goals" ON public.calorie_goals FOR ALL USING (auth.uid() = user_id);

-- Exercise Logs
ALTER TABLE public.exercise_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own exercise logs" ON public.exercise_logs FOR ALL USING (auth.uid() = user_id);

-- Budget Categories
ALTER TABLE public.budget_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own budget categories" ON public.budget_categories FOR ALL USING (auth.uid() = user_id);

-- Transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own transactions" ON public.transactions FOR ALL USING (auth.uid() = user_id);

-- Savings Goals
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own savings goals" ON public.savings_goals FOR ALL USING (auth.uid() = user_id);

-- Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can CRUD own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- =============================================
-- SEED DATA: Gamification Levels
-- =============================================

INSERT INTO public.gamification_levels (level, name, xp_required, badge_emoji) VALUES
  (1, 'Beginner', 0, '🌱'),
  (2, 'Novice', 100, '🌿'),
  (3, 'Apprentice', 300, '🌳'),
  (4, 'Skilled', 600, '⭐'),
  (5, 'Expert', 1000, '🌟'),
  (6, 'Master', 1500, '💫'),
  (7, 'Champion', 2500, '🏆'),
  (8, 'Legend', 4000, '👑'),
  (9, 'Mythic', 6000, '🔥'),
  (10, 'Transcendent', 10000, '💎');