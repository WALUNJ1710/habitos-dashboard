import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { format, subDays } from "date-fns";
import { Database } from "@/integrations/supabase/types";

type MealType = Database["public"]["Enums"]["meal_type"];
type GoalMode = Database["public"]["Enums"]["goal_mode"];

export interface FoodItem {
  id: string;
  name: string;
  calories: number;
  protein: number | null;
  carbs: number | null;
  fat: number | null;
  serving_size: string | null;
  is_favorite: boolean | null;
  is_global: boolean | null;
  user_id: string | null;
}

export interface Meal {
  id: string;
  user_id: string;
  meal_type: MealType;
  meal_date: string;
  notes: string | null;
  created_at: string | null;
}

export interface MealItem {
  id: string;
  meal_id: string;
  food_item_id: string;
  quantity: number | null;
  user_id: string;
  food_item?: FoodItem;
}

export interface ExerciseLog {
  id: string;
  user_id: string;
  exercise_name: string;
  calories_burned: number;
  duration_minutes: number | null;
  log_date: string;
  notes: string | null;
}

export interface CalorieGoal {
  id: string;
  user_id: string;
  daily_target: number | null;
  protein_target: number | null;
  carbs_target: number | null;
  fat_target: number | null;
  goal_mode: GoalMode | null;
}

export const useCalories = (user: User | null) => {
  const [calorieGoal, setCalorieGoal] = useState<CalorieGoal | null>(null);
  const [todayMeals, setTodayMeals] = useState<Meal[]>([]);
  const [todayMealItems, setTodayMealItems] = useState<MealItem[]>([]);
  const [todayExercises, setTodayExercises] = useState<ExerciseLog[]>([]);
  const [weeklyData, setWeeklyData] = useState<{ date: string; consumed: number; burned: number }[]>([]);
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [favoriteFoods, setFavoriteFoods] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState(true);

  const today = format(new Date(), "yyyy-MM-dd");

  const fetchData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch calorie goal
      const { data: goalData } = await supabase
        .from("calorie_goals")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      setCalorieGoal(goalData as CalorieGoal | null);

      // Fetch today's meals
      const { data: mealsData } = await supabase
        .from("meals")
        .select("*")
        .eq("user_id", user.id)
        .eq("meal_date", today);

      setTodayMeals((mealsData || []) as Meal[]);

      // Fetch meal items with food details for today
      if (mealsData && mealsData.length > 0) {
        const mealIds = mealsData.map((m) => m.id);
        const { data: itemsData } = await supabase
          .from("meal_items")
          .select("*, food_items(*)")
          .in("meal_id", mealIds);

        const formattedItems = (itemsData || []).map((item: any) => ({
          ...item,
          food_item: item.food_items,
        }));
        setTodayMealItems(formattedItems as MealItem[]);
      } else {
        setTodayMealItems([]);
      }

      // Fetch today's exercises
      const { data: exerciseData } = await supabase
        .from("exercise_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("log_date", today);

      setTodayExercises((exerciseData || []) as ExerciseLog[]);

      // Fetch food items (user's + global)
      const { data: foods } = await supabase
        .from("food_items")
        .select("*")
        .or(`user_id.eq.${user.id},is_global.eq.true`)
        .order("name");

      setFoodItems((foods || []) as FoodItem[]);

      // Fetch favorites
      const { data: favorites } = await supabase
        .from("food_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_favorite", true);

      setFavoriteFoods((favorites || []) as FoodItem[]);

      // Fetch weekly data for trends
      await fetchWeeklyData();
    } catch (error) {
      console.error("Error fetching calorie data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWeeklyData = async () => {
    if (!user) return;

    const weekData: { date: string; consumed: number; burned: number }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = format(subDays(new Date(), i), "yyyy-MM-dd");

      // Get meals for this date
      const { data: meals } = await supabase
        .from("meals")
        .select("id")
        .eq("user_id", user.id)
        .eq("meal_date", date);

      let consumed = 0;
      if (meals && meals.length > 0) {
        const mealIds = meals.map((m) => m.id);
        const { data: items } = await supabase
          .from("meal_items")
          .select("quantity, food_items(calories)")
          .in("meal_id", mealIds);

        consumed = (items || []).reduce((sum: number, item: any) => {
          return sum + (item.food_items?.calories || 0) * (item.quantity || 1);
        }, 0);
      }

      // Get exercises for this date
      const { data: exercises } = await supabase
        .from("exercise_logs")
        .select("calories_burned")
        .eq("user_id", user.id)
        .eq("log_date", date);

      const burned = (exercises || []).reduce((sum, e) => sum + e.calories_burned, 0);

      weekData.push({ date, consumed, burned });
    }

    setWeeklyData(weekData);
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // Calculate totals
  const totalConsumed = todayMealItems.reduce((sum, item) => {
    return sum + (item.food_item?.calories || 0) * (item.quantity || 1);
  }, 0);

  const totalBurned = todayExercises.reduce((sum, e) => sum + e.calories_burned, 0);

  const macros = todayMealItems.reduce(
    (acc, item) => {
      const qty = item.quantity || 1;
      return {
        protein: acc.protein + (item.food_item?.protein || 0) * qty,
        carbs: acc.carbs + (item.food_item?.carbs || 0) * qty,
        fat: acc.fat + (item.food_item?.fat || 0) * qty,
      };
    },
    { protein: 0, carbs: 0, fat: 0 }
  );

  // CRUD operations
  const updateGoal = async (updates: Partial<CalorieGoal>) => {
    if (!user) return { error: new Error("Not authenticated") };

    if (calorieGoal) {
      const { error } = await supabase
        .from("calorie_goals")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", calorieGoal.id);

      if (!error) await fetchData();
      return { error };
    } else {
      const { error } = await supabase.from("calorie_goals").insert({
        user_id: user.id,
        ...updates,
      });

      if (!error) await fetchData();
      return { error };
    }
  };

  const addFoodItem = async (food: Omit<FoodItem, "id" | "user_id" | "is_global">) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { data, error } = await supabase
      .from("food_items")
      .insert({
        user_id: user.id,
        name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        serving_size: food.serving_size,
        is_favorite: food.is_favorite || false,
        is_global: false,
      })
      .select()
      .single();

    if (!error) await fetchData();
    return { data, error };
  };

  const toggleFavorite = async (foodId: string, isFavorite: boolean) => {
    if (!user) return;

    await supabase
      .from("food_items")
      .update({ is_favorite: isFavorite })
      .eq("id", foodId)
      .eq("user_id", user.id);

    await fetchData();
  };

  const addMealWithItems = async (
    mealType: MealType,
    foodItems: { foodId: string; quantity: number }[]
  ) => {
    if (!user) return { error: new Error("Not authenticated") };

    // Check if meal already exists for this type today
    let mealId: string;
    const existingMeal = todayMeals.find((m) => m.meal_type === mealType);

    if (existingMeal) {
      mealId = existingMeal.id;
    } else {
      const { data: mealData, error: mealError } = await supabase
        .from("meals")
        .insert({
          user_id: user.id,
          meal_type: mealType,
          meal_date: today,
        })
        .select()
        .single();

      if (mealError) return { error: mealError };
      mealId = mealData.id;
    }

    // Add food items
    const itemsToInsert = foodItems.map((item) => ({
      user_id: user.id,
      meal_id: mealId,
      food_item_id: item.foodId,
      quantity: item.quantity,
    }));

    const { error } = await supabase.from("meal_items").insert(itemsToInsert);

    if (!error) await fetchData();
    return { error };
  };

  const removeMealItem = async (mealItemId: string) => {
    if (!user) return;

    await supabase.from("meal_items").delete().eq("id", mealItemId);
    await fetchData();
  };

  const addExercise = async (exercise: Omit<ExerciseLog, "id" | "user_id" | "created_at">) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { error } = await supabase.from("exercise_logs").insert({
      user_id: user.id,
      ...exercise,
    });

    if (!error) await fetchData();
    return { error };
  };

  const removeExercise = async (exerciseId: string) => {
    if (!user) return;

    await supabase.from("exercise_logs").delete().eq("id", exerciseId);
    await fetchData();
  };

  return {
    calorieGoal,
    todayMeals,
    todayMealItems,
    todayExercises,
    weeklyData,
    foodItems,
    favoriteFoods,
    loading,
    totalConsumed,
    totalBurned,
    macros,
    updateGoal,
    addFoodItem,
    toggleFavorite,
    addMealWithItems,
    removeMealItem,
    addExercise,
    removeExercise,
    refetch: fetchData,
  };
};
