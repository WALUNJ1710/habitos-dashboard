 import { useState } from "react";
 import { Checkbox } from "@/components/ui/checkbox";
 import { Badge } from "@/components/ui/badge";
 import { Flame, Award, Calendar, TrendingUp } from "lucide-react";
 import { cn } from "@/lib/utils";
 
 interface Habit {
   id: string;
   name: string;
   completed: boolean;
   streak: number;
   longestStreak: number;
 }
 
 const initialHabits: Habit[] = [
   { id: "1", name: "Morning meditation", completed: true, streak: 15, longestStreak: 30 },
   { id: "2", name: "Exercise", completed: true, streak: 15, longestStreak: 45 },
   { id: "3", name: "Read 30 minutes", completed: false, streak: 8, longestStreak: 21 },
   { id: "4", name: "Drink 8 glasses of water", completed: true, streak: 15, longestStreak: 60 },
   { id: "5", name: "No social media before noon", completed: false, streak: 3, longestStreak: 14 },
   { id: "6", name: "Journal before bed", completed: true, streak: 15, longestStreak: 30 },
 ];
 
 // Generate calendar heatmap data
 const generateHeatmapData = () => {
   const data = [];
   const today = new Date();
   for (let i = 0; i < 91; i++) {
     const date = new Date(today);
     date.setDate(date.getDate() - (90 - i));
     data.push({
       date,
       value: Math.random() > 0.3 ? Math.floor(Math.random() * 6) : 0,
     });
   }
   return data;
 };
 
 const heatmapData = generateHeatmapData();
 
 const getHeatmapColor = (value: number) => {
   if (value === 0) return "bg-secondary/50";
   if (value <= 1) return "bg-neon-green/20";
   if (value <= 2) return "bg-neon-green/40";
   if (value <= 3) return "bg-neon-green/60";
   if (value <= 4) return "bg-neon-green/80";
   return "bg-neon-green";
 };
 
 const StreakTracker = () => {
   const [habits, setHabits] = useState<Habit[]>(initialHabits);
 
   const toggleHabit = (id: string) => {
     setHabits(habits.map((h) =>
       h.id === id ? { ...h, completed: !h.completed } : h
     ));
   };
 
   const totalStreak = Math.max(...habits.map((h) => h.streak));
   const completedToday = habits.filter((h) => h.completed).length;
 
   return (
     <div className="space-y-6 animate-fade-in">
       <div>
         <h1 className="text-3xl font-bold">Streak Tracker</h1>
         <p className="text-muted-foreground mt-1">Build lasting habits, one day at a time</p>
       </div>
 
       {/* Stats */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="glass-card rounded-xl p-5 flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-neon-orange flex items-center justify-center animate-pulse-glow">
             <Flame className="h-6 w-6 text-primary-foreground" />
           </div>
           <div>
             <p className="text-sm text-muted-foreground">Current Streak</p>
             <p className="text-2xl font-bold">{totalStreak} days 🔥</p>
           </div>
         </div>
         <div className="glass-card rounded-xl p-5 flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-neon-purple flex items-center justify-center">
             <Award className="h-6 w-6 text-primary-foreground" />
           </div>
           <div>
             <p className="text-sm text-muted-foreground">Longest Streak</p>
             <p className="text-2xl font-bold">60 days</p>
           </div>
         </div>
         <div className="glass-card rounded-xl p-5 flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-neon-green flex items-center justify-center">
             <Calendar className="h-6 w-6 text-primary-foreground" />
           </div>
           <div>
             <p className="text-sm text-muted-foreground">Completed Today</p>
             <p className="text-2xl font-bold">{completedToday}/{habits.length}</p>
           </div>
         </div>
         <div className="glass-card rounded-xl p-5 flex items-center gap-4">
           <div className="w-12 h-12 rounded-xl bg-neon-cyan flex items-center justify-center">
             <TrendingUp className="h-6 w-6 text-primary-foreground" />
           </div>
           <div>
             <p className="text-sm text-muted-foreground">Completion Rate</p>
             <p className="text-2xl font-bold">87%</p>
           </div>
         </div>
       </div>
 
       {/* Daily Habits */}
       <div className="glass-card rounded-xl p-6">
         <h3 className="font-semibold mb-4">Today's Habits</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           {habits.map((habit) => (
             <div
               key={habit.id}
               className={cn(
                 "flex items-center gap-4 p-4 rounded-lg bg-secondary/30 transition-all hover:bg-secondary/50",
                 habit.completed && "border-l-4 border-neon-green"
               )}
             >
               <Checkbox
                 checked={habit.completed}
                 onCheckedChange={() => toggleHabit(habit.id)}
                 className="h-5 w-5"
               />
               <div className="flex-1">
                 <p className={cn("font-medium", habit.completed && "text-success")}>
                   {habit.name}
                 </p>
                 <div className="flex items-center gap-2 mt-1">
                   <Badge variant="outline" className="bg-neon-orange/10 text-neon-orange border-neon-orange/30">
                     🔥 {habit.streak} days
                   </Badge>
                   <span className="text-xs text-muted-foreground">
                     Best: {habit.longestStreak} days
                   </span>
                 </div>
               </div>
             </div>
           ))}
         </div>
       </div>
 
       {/* Calendar Heatmap */}
       <div className="glass-card rounded-xl p-6">
         <div className="flex items-center justify-between mb-4">
           <h3 className="font-semibold">Activity Heatmap</h3>
           <div className="flex items-center gap-2 text-xs text-muted-foreground">
             <span>Less</span>
             <div className="flex gap-1">
               <div className="w-3 h-3 rounded-sm bg-secondary/50" />
               <div className="w-3 h-3 rounded-sm bg-neon-green/20" />
               <div className="w-3 h-3 rounded-sm bg-neon-green/40" />
               <div className="w-3 h-3 rounded-sm bg-neon-green/60" />
               <div className="w-3 h-3 rounded-sm bg-neon-green" />
             </div>
             <span>More</span>
           </div>
         </div>
         <div className="flex flex-wrap gap-1">
           {heatmapData.map((day, i) => (
             <div
               key={i}
               className={cn(
                 "w-3 h-3 rounded-sm transition-all hover:scale-125 cursor-pointer",
                 getHeatmapColor(day.value)
               )}
               title={`${day.date.toDateString()}: ${day.value} habits completed`}
             />
           ))}
         </div>
       </div>
 
       {/* Badges */}
       <div className="glass-card rounded-xl p-6">
         <h3 className="font-semibold mb-4">Achievements</h3>
         <div className="flex flex-wrap gap-4">
           <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
             <div className="w-10 h-10 rounded-full bg-neon-orange flex items-center justify-center">
               🔥
             </div>
             <div>
               <p className="font-medium">7 Day Streak</p>
               <p className="text-xs text-muted-foreground">Completed</p>
             </div>
           </div>
           <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30">
             <div className="w-10 h-10 rounded-full bg-neon-purple flex items-center justify-center">
               ⚡
             </div>
             <div>
               <p className="font-medium">30 Day Warrior</p>
               <p className="text-xs text-muted-foreground">Completed</p>
             </div>
           </div>
           <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 opacity-50">
             <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
               🏆
             </div>
             <div>
               <p className="font-medium">100 Day Legend</p>
               <p className="text-xs text-muted-foreground">40/100 days</p>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 };
 
 export default StreakTracker;