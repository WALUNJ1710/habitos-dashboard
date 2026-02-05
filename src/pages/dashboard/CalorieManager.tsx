 import { useState } from "react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import { Progress } from "@/components/ui/progress";
 import { Utensils, Dumbbell, Target, Plus, Trash2 } from "lucide-react";
 import { cn } from "@/lib/utils";
 
 interface FoodEntry {
   id: string;
   name: string;
   calories: number;
   meal: string;
 }
 
 interface ActivityEntry {
   id: string;
   name: string;
   calories: number;
   type: string;
 }
 
 const initialFoods: FoodEntry[] = [
   { id: "1", name: "Oatmeal with berries", calories: 350, meal: "Breakfast" },
   { id: "2", name: "Grilled chicken salad", calories: 450, meal: "Lunch" },
   { id: "3", name: "Protein shake", calories: 200, meal: "Snacks" },
   { id: "4", name: "Salmon with vegetables", calories: 550, meal: "Dinner" },
 ];
 
 const initialActivities: ActivityEntry[] = [
   { id: "1", name: "Morning run", calories: 300, type: "Running" },
   { id: "2", name: "Weight training", calories: 200, type: "Gym" },
 ];
 
 const CalorieManager = () => {
   const [foods, setFoods] = useState<FoodEntry[]>(initialFoods);
   const [activities, setActivities] = useState<ActivityEntry[]>(initialActivities);
   const [newFood, setNewFood] = useState({ name: "", calories: "", meal: "Breakfast" });
   const [newActivity, setNewActivity] = useState({ name: "", calories: "", type: "Walking" });
   const calorieGoal = 2200;
 
   const totalConsumed = foods.reduce((sum, f) => sum + f.calories, 0);
   const totalBurned = activities.reduce((sum, a) => sum + a.calories, 0);
   const remaining = calorieGoal - totalConsumed + totalBurned;
   const progress = Math.min((totalConsumed / calorieGoal) * 100, 100);
 
   const addFood = () => {
     if (!newFood.name || !newFood.calories) return;
     setFoods([...foods, {
       id: Date.now().toString(),
       name: newFood.name,
       calories: parseInt(newFood.calories),
       meal: newFood.meal,
     }]);
     setNewFood({ name: "", calories: "", meal: "Breakfast" });
   };
 
   const addActivity = () => {
     if (!newActivity.name || !newActivity.calories) return;
     setActivities([...activities, {
       id: Date.now().toString(),
       name: newActivity.name,
       calories: parseInt(newActivity.calories),
       type: newActivity.type,
     }]);
     setNewActivity({ name: "", calories: "", type: "Walking" });
   };
 
   const getMealColor = (meal: string) => {
     switch (meal) {
       case "Breakfast": return "bg-neon-orange/20 text-neon-orange";
       case "Lunch": return "bg-neon-cyan/20 text-neon-cyan";
       case "Dinner": return "bg-neon-purple/20 text-neon-purple";
       case "Snacks": return "bg-neon-green/20 text-neon-green";
       default: return "bg-secondary";
     }
   };
 
   return (
     <div className="space-y-6 animate-fade-in">
       <div>
         <h1 className="text-3xl font-bold">Calorie Manager</h1>
         <p className="text-muted-foreground mt-1">Track your nutrition and exercise</p>
       </div>
 
       {/* Summary Cards */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="glass-card rounded-xl p-5">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 rounded-lg bg-neon-orange flex items-center justify-center">
               <Utensils className="h-5 w-5 text-primary-foreground" />
             </div>
             <p className="text-sm text-muted-foreground">Consumed</p>
           </div>
           <p className="text-3xl font-bold">{totalConsumed.toLocaleString()}</p>
           <p className="text-sm text-muted-foreground">calories</p>
         </div>
         <div className="glass-card rounded-xl p-5">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 rounded-lg bg-neon-pink flex items-center justify-center">
               <Dumbbell className="h-5 w-5 text-primary-foreground" />
             </div>
             <p className="text-sm text-muted-foreground">Burned</p>
           </div>
           <p className="text-3xl font-bold">{totalBurned.toLocaleString()}</p>
           <p className="text-sm text-muted-foreground">calories</p>
         </div>
         <div className="glass-card rounded-xl p-5">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 rounded-lg bg-neon-cyan flex items-center justify-center">
               <Target className="h-5 w-5 text-primary-foreground" />
             </div>
             <p className="text-sm text-muted-foreground">Daily Goal</p>
           </div>
           <p className="text-3xl font-bold">{calorieGoal.toLocaleString()}</p>
           <p className="text-sm text-muted-foreground">calories</p>
         </div>
         <div className={cn(
           "glass-card rounded-xl p-5",
           remaining > 0 ? "border-l-4 border-neon-green" : "border-l-4 border-destructive"
         )}>
           <p className="text-sm text-muted-foreground mb-3">Remaining</p>
           <p className={cn("text-3xl font-bold", remaining > 0 ? "text-success" : "text-destructive")}>
             {remaining.toLocaleString()}
           </p>
           <p className="text-sm text-muted-foreground">calories</p>
         </div>
       </div>
 
       {/* Progress Bar */}
       <div className="glass-card rounded-xl p-6">
         <div className="flex items-center justify-between mb-4">
           <h3 className="font-semibold">Daily Progress</h3>
           <span className="text-sm text-muted-foreground">{progress.toFixed(0)}%</span>
         </div>
         <Progress value={progress} className="h-4" />
         <p className="text-sm text-muted-foreground mt-2">
           {totalConsumed} / {calorieGoal} calories consumed
         </p>
       </div>
 
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Food Entries */}
         <div className="glass-card rounded-xl p-6">
           <h3 className="font-semibold mb-4">Calories Consumed</h3>
           
           {/* Add Food Form */}
           <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
             <Input
               placeholder="Food name"
               value={newFood.name}
               onChange={(e) => setNewFood({ ...newFood, name: e.target.value })}
               className="bg-secondary/50"
             />
             <Input
               type="number"
               placeholder="Calories"
               value={newFood.calories}
               onChange={(e) => setNewFood({ ...newFood, calories: e.target.value })}
               className="bg-secondary/50"
             />
             <Select value={newFood.meal} onValueChange={(v) => setNewFood({ ...newFood, meal: v })}>
               <SelectTrigger className="bg-secondary/50">
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="Breakfast">Breakfast</SelectItem>
                 <SelectItem value="Lunch">Lunch</SelectItem>
                 <SelectItem value="Dinner">Dinner</SelectItem>
                 <SelectItem value="Snacks">Snacks</SelectItem>
               </SelectContent>
             </Select>
             <Button onClick={addFood} className="bg-gradient-primary">
               <Plus className="h-4 w-4" />
             </Button>
           </div>
 
           {/* Food List */}
           <div className="space-y-3 max-h-64 overflow-y-auto">
             {foods.map((food) => (
               <div key={food.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                 <div className="flex items-center gap-3">
                   <span className={cn("px-2 py-1 rounded text-xs font-medium", getMealColor(food.meal))}>
                     {food.meal}
                   </span>
                   <span className="font-medium">{food.name}</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <span className="text-muted-foreground">{food.calories} cal</span>
                   <Button
                     size="icon"
                     variant="ghost"
                     onClick={() => setFoods(foods.filter((f) => f.id !== food.id))}
                     className="h-8 w-8 text-destructive hover:text-destructive"
                   >
                     <Trash2 className="h-4 w-4" />
                   </Button>
                 </div>
               </div>
             ))}
           </div>
         </div>
 
         {/* Activity Entries */}
         <div className="glass-card rounded-xl p-6">
           <h3 className="font-semibold mb-4">Calories Burned</h3>
           
           {/* Add Activity Form */}
           <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">
             <Input
               placeholder="Activity name"
               value={newActivity.name}
               onChange={(e) => setNewActivity({ ...newActivity, name: e.target.value })}
               className="bg-secondary/50"
             />
             <Input
               type="number"
               placeholder="Calories"
               value={newActivity.calories}
               onChange={(e) => setNewActivity({ ...newActivity, calories: e.target.value })}
               className="bg-secondary/50"
             />
             <Select value={newActivity.type} onValueChange={(v) => setNewActivity({ ...newActivity, type: v })}>
               <SelectTrigger className="bg-secondary/50">
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="Walking">Walking</SelectItem>
                 <SelectItem value="Running">Running</SelectItem>
                 <SelectItem value="Gym">Gym</SelectItem>
                 <SelectItem value="Swimming">Swimming</SelectItem>
                 <SelectItem value="Cycling">Cycling</SelectItem>
               </SelectContent>
             </Select>
             <Button onClick={addActivity} className="bg-gradient-primary">
               <Plus className="h-4 w-4" />
             </Button>
           </div>
 
           {/* Activity List */}
           <div className="space-y-3 max-h-64 overflow-y-auto">
             {activities.map((activity) => (
               <div key={activity.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
                 <div className="flex items-center gap-3">
                   <span className="px-2 py-1 rounded text-xs font-medium bg-neon-pink/20 text-neon-pink">
                     {activity.type}
                   </span>
                   <span className="font-medium">{activity.name}</span>
                 </div>
                 <div className="flex items-center gap-3">
                   <span className="text-success">-{activity.calories} cal</span>
                   <Button
                     size="icon"
                     variant="ghost"
                     onClick={() => setActivities(activities.filter((a) => a.id !== activity.id))}
                     className="h-8 w-8 text-destructive hover:text-destructive"
                   >
                     <Trash2 className="h-4 w-4" />
                   </Button>
                 </div>
               </div>
             ))}
           </div>
         </div>
       </div>
     </div>
   );
 };
 
 export default CalorieManager;