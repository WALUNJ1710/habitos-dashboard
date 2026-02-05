import { useApp } from "@/contexts/AppContext";
import { useCalories } from "@/hooks/useCalories";
import { CalorieSummary } from "@/components/calories/CalorieSummary";
import { MealLogger } from "@/components/calories/MealLogger";
import { FoodSearch } from "@/components/calories/FoodSearch";
import { ExerciseLogger } from "@/components/calories/ExerciseLogger";
import { GoalModeSelector } from "@/components/calories/GoalModeSelector";
import { WeeklyCalorieTrend } from "@/components/calories/WeeklyCalorieTrend";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { FoodItem } from "@/hooks/useCalories";
import { Database } from "@/integrations/supabase/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type MealType = Database["public"]["Enums"]["meal_type"];

const CalorieManager = () => {
  const { user } = useApp();
  const {
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
  } = useCalories(user);

  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [addToMealType, setAddToMealType] = useState<MealType>("breakfast");
  const [quantity, setQuantity] = useState("1");

  const handleFoodSelect = (food: FoodItem) => {
    setSelectedFood(food);
  };

  const handleAddToMeal = async () => {
    if (!selectedFood) return;
    await addMealWithItems(addToMealType, [{ foodId: selectedFood.id, quantity: parseFloat(quantity) || 1 }]);
    setSelectedFood(null);
    setQuantity("1");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Calorie Manager</h1>
        <p className="text-muted-foreground mt-1">Track your nutrition and exercise</p>
      </div>

      {/* Summary Cards */}
      <CalorieSummary
        goal={calorieGoal}
        consumed={totalConsumed}
        burned={totalBurned}
        macros={macros}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Meal Logging */}
        <div className="lg:col-span-2 space-y-6">
          <MealLogger
            meals={todayMeals}
            mealItems={todayMealItems}
            foodItems={foodItems}
            favoriteFoods={favoriteFoods}
            onAddMeal={addMealWithItems}
            onRemoveItem={removeMealItem}
          />

          {/* Weekly Trend */}
          <WeeklyCalorieTrend data={weeklyData} goal={calorieGoal} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Exercise Logger */}
          <ExerciseLogger
            exercises={todayExercises}
            totalBurned={totalBurned}
            onAddExercise={addExercise}
            onRemoveExercise={removeExercise}
          />

          {/* Food Search */}
          <FoodSearch
            foodItems={foodItems}
            onAddFood={addFoodItem}
            onToggleFavorite={toggleFavorite}
            onSelectFood={handleFoodSelect}
          />

          {/* Goal Settings */}
          <GoalModeSelector goal={calorieGoal} onUpdateGoal={updateGoal} />
        </div>
      </div>

      {/* Add to Meal Dialog */}
      <Dialog open={!!selectedFood} onOpenChange={() => setSelectedFood(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add {selectedFood?.name} to Meal</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Meal</label>
              <Select value={addToMealType} onValueChange={(v) => setAddToMealType(v as MealType)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="breakfast">Breakfast</SelectItem>
                  <SelectItem value="lunch">Lunch</SelectItem>
                  <SelectItem value="dinner">Dinner</SelectItem>
                  <SelectItem value="snack">Snacks</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium">Quantity</label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                min="0.1"
                step="0.1"
                className="mt-1"
              />
            </div>
            <div className="p-3 rounded-lg bg-secondary/30">
              <p className="text-sm text-muted-foreground">
                {selectedFood?.calories} kcal × {quantity} ={" "}
                <span className="font-bold text-foreground">
                  {Math.round((selectedFood?.calories || 0) * (parseFloat(quantity) || 1))} kcal
                </span>
              </p>
            </div>
            <Button onClick={handleAddToMeal} className="w-full bg-gradient-primary">
              Add to {addToMealType.charAt(0).toUpperCase() + addToMealType.slice(1)}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CalorieManager;
