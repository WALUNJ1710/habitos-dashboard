 import { useState } from "react";
 import { useUserProfile } from "@/components/dashboard/DashboardLayout";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Scale, Ruler, Target, TrendingDown, Activity } from "lucide-react";
 import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
   ReferenceLine,
 } from "recharts";
 
 const HealthTracker = () => {
   const { profile, setProfile } = useUserProfile();
   const [weight, setWeight] = useState(profile.weight?.toString() || "0");
   const [height, setHeight] = useState(profile.height?.toString() || "0");
   const [goalWeight, setGoalWeight] = useState(profile.goalWeight?.toString() || "0");
 
   // Empty weight history - will be populated as user logs data
   const weightHistory: { date: string; weight: number }[] = [];
 
   const currentWeight = parseFloat(weight) || 0;
   const heightInM = (parseFloat(height) || 176) / 100;
   const bmi = currentWeight / (heightInM * heightInM);
   const goalWeightNum = parseFloat(goalWeight) || 70;
   const weightToLose = currentWeight - goalWeightNum;
 
   const getBmiCategory = (bmi: number) => {
     if (bmi < 18.5) return { label: "Underweight", color: "text-warning" };
     if (bmi < 25) return { label: "Normal", color: "text-success" };
     if (bmi < 30) return { label: "Overweight", color: "text-warning" };
     return { label: "Obese", color: "text-destructive" };
   };
 
   const bmiCategory = getBmiCategory(bmi);
 
   return (
     <div className="space-y-6 animate-fade-in">
       <div>
         <h1 className="text-3xl font-bold">Health Tracker</h1>
         <p className="text-muted-foreground mt-1">Monitor your weight and BMI progress</p>
       </div>
 
       {/* Stats */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="glass-card rounded-xl p-5">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 rounded-lg bg-neon-purple flex items-center justify-center">
               <Scale className="h-5 w-5 text-primary-foreground" />
             </div>
             <p className="text-sm text-muted-foreground">Current Weight</p>
           </div>
           <p className="text-3xl font-bold">{currentWeight} kg</p>
         </div>
         <div className="glass-card rounded-xl p-5">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 rounded-lg bg-neon-cyan flex items-center justify-center">
               <Ruler className="h-5 w-5 text-primary-foreground" />
             </div>
             <p className="text-sm text-muted-foreground">Height</p>
           </div>
           <p className="text-3xl font-bold">{height} cm</p>
         </div>
         <div className="glass-card rounded-xl p-5">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 rounded-lg bg-neon-green flex items-center justify-center">
               <Activity className="h-5 w-5 text-primary-foreground" />
             </div>
             <p className="text-sm text-muted-foreground">BMI</p>
           </div>
           <p className="text-3xl font-bold">{bmi.toFixed(1)}</p>
           <p className={`text-sm ${bmiCategory.color}`}>{bmiCategory.label}</p>
         </div>
         <div className="glass-card rounded-xl p-5">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 rounded-lg bg-neon-orange flex items-center justify-center">
               <Target className="h-5 w-5 text-primary-foreground" />
             </div>
             <p className="text-sm text-muted-foreground">Goal Weight</p>
           </div>
           <p className="text-3xl font-bold">{goalWeight} kg</p>
           <p className="text-sm text-muted-foreground">{weightToLose.toFixed(1)} kg to go</p>
         </div>
       </div>
 
       {/* Input Form */}
       <div className="glass-card rounded-xl p-6">
         <h3 className="font-semibold mb-4">Update Measurements</h3>
         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
           <div className="space-y-2">
             <Label htmlFor="weight">Weight (kg)</Label>
             <Input
               id="weight"
               type="number"
               step="0.1"
               value={weight}
               onChange={(e) => setWeight(e.target.value)}
               className="bg-secondary/50"
             />
           </div>
           <div className="space-y-2">
             <Label htmlFor="height">Height (cm)</Label>
             <Input
               id="height"
               type="number"
               value={height}
               onChange={(e) => setHeight(e.target.value)}
               className="bg-secondary/50"
             />
           </div>
           <div className="space-y-2">
             <Label htmlFor="goal">Goal Weight (kg)</Label>
             <Input
               id="goal"
               type="number"
               step="0.1"
               value={goalWeight}
               onChange={(e) => setGoalWeight(e.target.value)}
               className="bg-secondary/50"
             />
           </div>
           <div className="flex items-end">
             <Button 
               className="w-full bg-gradient-primary"
               onClick={() => {
                 setProfile({
                   ...profile,
                   weight: parseFloat(weight) || 0,
                   height: parseFloat(height) || 0,
                   goalWeight: parseFloat(goalWeight) || 0,
                 });
               }}
             >
               Save
             </Button>
           </div>
         </div>
       </div>
 
       {/* Weight History Chart */}
       <div className="glass-card rounded-xl p-6">
         <div className="flex items-center justify-between mb-6">
           <div>
             <h3 className="font-semibold">Weight History</h3>
             <p className="text-sm text-muted-foreground">Your progress over time</p>
           </div>
           {weightHistory.length > 1 && (
             <div className="flex items-center gap-2 text-success">
               <TrendingDown className="h-5 w-5" />
               <span className="font-medium">
                 {(weightHistory[0]?.weight - weightHistory[weightHistory.length - 1]?.weight).toFixed(1)} kg
               </span>
             </div>
           )}
         </div>
         {weightHistory.length > 0 ? (
           <div className="h-80">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={weightHistory}>
                 <defs>
                   <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0.3} />
                     <stop offset="95%" stopColor="hsl(262, 83%, 58%)" stopOpacity={0} />
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 22%)" />
                 <XAxis dataKey="date" stroke="hsl(215, 20%, 65%)" fontSize={12} />
                 <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="hsl(215, 20%, 65%)" fontSize={12} />
                 <Tooltip
                   contentStyle={{
                     backgroundColor: "hsl(222, 47%, 14%)",
                     border: "1px solid hsl(217, 33%, 22%)",
                     borderRadius: "8px",
                   }}
                 />
                 <ReferenceLine
                   y={goalWeightNum}
                   stroke="hsl(142, 76%, 45%)"
                   strokeDasharray="5 5"
                   label={{ value: "Goal", fill: "hsl(142, 76%, 45%)", fontSize: 12 }}
                 />
                 <Line
                   type="monotone"
                   dataKey="weight"
                   stroke="hsl(262, 83%, 58%)"
                   strokeWidth={3}
                   dot={{ fill: "hsl(262, 83%, 58%)", strokeWidth: 2 }}
                   activeDot={{ r: 6, fill: "hsl(262, 83%, 58%)" }}
                 />
               </LineChart>
             </ResponsiveContainer>
           </div>
         ) : (
           <div className="h-80 flex items-center justify-center text-muted-foreground">
             <p>No weight history yet. Start logging your weight to see progress!</p>
           </div>
         )}
       </div>
 
       {/* BMI Scale */}
       <div className="glass-card rounded-xl p-6">
         <h3 className="font-semibold mb-4">BMI Scale</h3>
         <div className="relative h-8 rounded-full overflow-hidden">
           <div className="absolute inset-0 flex">
             <div className="flex-1 bg-blue-500" title="Underweight" />
             <div className="flex-1 bg-green-500" title="Normal" />
             <div className="flex-1 bg-yellow-500" title="Overweight" />
             <div className="flex-1 bg-red-500" title="Obese" />
           </div>
           <div
             className="absolute top-0 w-1 h-full bg-foreground"
             style={{ left: `${Math.min(Math.max((bmi - 15) / 25 * 100, 0), 100)}%` }}
           />
         </div>
         <div className="flex justify-between mt-2 text-xs text-muted-foreground">
           <span>15</span>
           <span>18.5</span>
           <span>25</span>
           <span>30</span>
           <span>40</span>
         </div>
         <div className="flex justify-between mt-1 text-xs">
           <span className="text-blue-400">Underweight</span>
           <span className="text-green-400">Normal</span>
           <span className="text-yellow-400">Overweight</span>
           <span className="text-red-400">Obese</span>
         </div>
       </div>
     </div>
   );
 };
 
 export default HealthTracker;