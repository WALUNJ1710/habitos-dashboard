import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FoodItem, Meal, MealItem } from "@/hooks/useCalories";
import { Utensils, Coffee, Sun, Moon, Cookie, Trash2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Database } from "@/integrations/supabase/types";

type MealType = Database["public"]["Enums"]["meal_type"];

interface MealLoggerProps {
  meals: Meal[];
  mealItems: MealItem[];
  foodItems: FoodItem[];
  favoriteFoods: FoodItem[];
  onAddMeal: (mealType: MealType, items: { foodId: string; quantity: number }[]) => Promise<{ error?: Error | null }>;
  onRemoveItem: (mealItemId: string) => void;
}

const mealTypes = [
  { value: "breakfast", label: "Breakfast", icon: Coffee, color: "bg-neon-orange" },
  { value: "lunch", label: "Lunch", icon: Sun, color: "bg-neon-cyan" },
  { value: "dinner", label: "Dinner", icon: Moon, color: "bg-neon-purple" },
  { value: "snack", label: "Snacks", icon: Cookie, color: "bg-neon-green" },
] as const;

export const MealLogger = ({
  meals,
  mealItems,
  foodItems,
  favoriteFoods,
  onAddMeal,
  onRemoveItem,
}: MealLoggerProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealType>("breakfast");
  const [selectedFood, setSelectedFood] = useState("");
  const [quantity, setQuantity] = useState("1");

  const getMealItems = (mealType: MealType) => {
    const meal = meals.find((m) => m.meal_type === mealType);
    if (!meal) return [];
    return mealItems.filter((item) => item.meal_id === meal.id);
  };

  const getMealCalories = (mealType: MealType) => {
    return getMealItems(mealType).reduce((sum, item) => {
      return sum + (item.food_item?.calories || 0) * (item.quantity || 1);
    }, 0);
  };

  const handleAddFood = async () => {
    if (!selectedFood) return;

    await onAddMeal(selectedMealType, [{ foodId: selectedFood, quantity: parseFloat(quantity) || 1 }]);
    setSelectedFood("");
    setQuantity("1");
    setShowAddDialog(false);
  };

  const openAddDialog = (mealType: MealType) => {
    setSelectedMealType(mealType);
    setShowAddDialog(true);
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Today's Meals</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mealTypes.map((meal) => {
          const items = getMealItems(meal.value);
          const calories = getMealCalories(meal.value);

          return (
            <div key={meal.value} className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", meal.color)}>
                    <meal.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{meal.label}</p>
                    <p className="text-sm text-muted-foreground">{calories} kcal</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" onClick={() => openAddDialog(meal.value)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2 max-h-32 overflow-y-auto">
                {items.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-2">No items added</p>
                ) : (
                  items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-2 rounded bg-secondary/30 text-sm"
                    >
                      <div>
                        <span className="font-medium">{item.food_item?.name}</span>
                        {(item.quantity || 1) > 1 && (
                          <span className="text-muted-foreground"> x{item.quantity}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">
                          {(item.food_item?.calories || 0) * (item.quantity || 1)} kcal
                        </span>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-destructive hover:text-destructive/80"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Favorites Quick Add */}
      {favoriteFoods.length > 0 && (
        <div className="glass-card rounded-xl p-4">
          <h4 className="font-medium mb-3">⭐ Quick Add Favorites</h4>
          <div className="flex flex-wrap gap-2">
            {favoriteFoods.slice(0, 6).map((food) => (
              <Button
                key={food.id}
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedFood(food.id);
                  setShowAddDialog(true);
                }}
                className="text-xs"
              >
                {food.name} ({food.calories} kcal)
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Add Food Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Food to {mealTypes.find((m) => m.value === selectedMealType)?.label}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Select Food</label>
              <Select value={selectedFood} onValueChange={setSelectedFood}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Choose a food..." />
                </SelectTrigger>
                <SelectContent>
                  {foodItems.map((food) => (
                    <SelectItem key={food.id} value={food.id}>
                      {food.name} ({food.calories} kcal)
                    </SelectItem>
                  ))}
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
            <Button onClick={handleAddFood} disabled={!selectedFood} className="w-full bg-gradient-primary">
              Add to {mealTypes.find((m) => m.value === selectedMealType)?.label}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
