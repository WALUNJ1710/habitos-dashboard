import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FoodItem } from "@/hooks/useCalories";
import { Search, Plus, Star, StarOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface FoodSearchProps {
  foodItems: FoodItem[];
  onAddFood: (food: Omit<FoodItem, "id" | "user_id" | "is_global">) => Promise<{ data?: FoodItem; error?: Error | null }>;
  onToggleFavorite: (foodId: string, isFavorite: boolean) => void;
  onSelectFood: (food: FoodItem) => void;
}

export const FoodSearch = ({ foodItems, onAddFood, onToggleFavorite, onSelectFood }: FoodSearchProps) => {
  const [search, setSearch] = useState("");
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newFood, setNewFood] = useState({
    name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    serving_size: "",
  });

  const filteredFoods = foodItems.filter((food) =>
    food.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddFood = async () => {
    if (!newFood.name || !newFood.calories) return;

    await onAddFood({
      name: newFood.name,
      calories: parseInt(newFood.calories),
      protein: parseFloat(newFood.protein) || null,
      carbs: parseFloat(newFood.carbs) || null,
      fat: parseFloat(newFood.fat) || null,
      serving_size: newFood.serving_size || null,
      is_favorite: false,
    });

    setNewFood({ name: "", calories: "", protein: "", carbs: "", fat: "", serving_size: "" });
    setShowAddDialog(false);
  };

  return (
    <div className="glass-card rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Food Database</h3>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gradient-primary">
              <Plus className="h-4 w-4 mr-1" /> Add Food
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Food</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Food Name *</Label>
                <Input
                  value={newFood.name}
                  onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
                  placeholder="e.g., Chicken Breast"
                  className="mt-1"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Calories *</Label>
                  <Input
                    type="number"
                    value={newFood.calories}
                    onChange={(e) => setNewFood({ ...newFood, calories: e.target.value })}
                    placeholder="kcal"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Serving Size</Label>
                  <Input
                    value={newFood.serving_size}
                    onChange={(e) => setNewFood({ ...newFood, serving_size: e.target.value })}
                    placeholder="e.g., 100g"
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label>Protein (g)</Label>
                  <Input
                    type="number"
                    value={newFood.protein}
                    onChange={(e) => setNewFood({ ...newFood, protein: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Carbs (g)</Label>
                  <Input
                    type="number"
                    value={newFood.carbs}
                    onChange={(e) => setNewFood({ ...newFood, carbs: e.target.value })}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Fat (g)</Label>
                  <Input
                    type="number"
                    value={newFood.fat}
                    onChange={(e) => setNewFood({ ...newFood, fat: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <Button onClick={handleAddFood} className="w-full bg-gradient-primary">
                Add Food
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search foods..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 bg-secondary/50"
        />
      </div>

      <ScrollArea className="h-64">
        <div className="space-y-2">
          {filteredFoods.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              {search ? "No foods found" : "No foods in database"}
            </p>
          ) : (
            filteredFoods.map((food) => (
              <div
                key={food.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <button
                  onClick={() => onSelectFood(food)}
                  className="flex-1 text-left"
                >
                  <p className="font-medium">{food.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {food.calories} kcal • P: {food.protein || 0}g • C: {food.carbs || 0}g • F: {food.fat || 0}g
                    {food.serving_size && ` • ${food.serving_size}`}
                  </p>
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onToggleFavorite(food.id, !food.is_favorite)}
                    className={cn(
                      "p-2 rounded-lg transition-colors",
                      food.is_favorite ? "text-warning" : "text-muted-foreground hover:text-warning"
                    )}
                  >
                    {food.is_favorite ? <Star className="h-4 w-4 fill-current" /> : <StarOff className="h-4 w-4" />}
                  </button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onSelectFood(food)}
                    className="text-primary"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
