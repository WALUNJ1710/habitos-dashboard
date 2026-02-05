 import { StatCard } from "@/components/dashboard/StatCard";
 import { useUserProfile } from "@/components/dashboard/DashboardLayout";
 import { formatCurrency, getCurrencySymbol } from "@/lib/currency";
 import {
   CheckCircle2,
   Flame,
   Scale,
   Activity,
   Utensils,
   Dumbbell,
   Target,
   Wallet,
   TrendingUp,
 } from "lucide-react";
 import {
   LineChart,
   Line,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
   AreaChart,
   Area,
 } from "recharts";
 
 // Empty weekly data - will be populated as user logs activities
 const weeklyData = [
   { day: "Mon", tasks: 0, calories: 0, spending: 0 },
   { day: "Tue", tasks: 0, calories: 0, spending: 0 },
   { day: "Wed", tasks: 0, calories: 0, spending: 0 },
   { day: "Thu", tasks: 0, calories: 0, spending: 0 },
   { day: "Fri", tasks: 0, calories: 0, spending: 0 },
   { day: "Sat", tasks: 0, calories: 0, spending: 0 },
   { day: "Sun", tasks: 0, calories: 0, spending: 0 },
 ];
 
 const DashboardOverview = () => {
   const { profile } = useUserProfile();
 
   return (
     <div className="space-y-6 animate-fade-in">
       <div>
         <h1 className="text-3xl font-bold">Dashboard</h1>
         <p className="text-muted-foreground mt-1">
           Welcome back{profile.fullName ? `, ${profile.fullName}` : ""}! Here's your daily overview.
         </p>
       </div>
 
       {/* Stats Grid */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
         <StatCard
           title="Tasks Completed"
           value="0/0"
           subtitle="Today's progress"
           icon={CheckCircle2}
           iconClassName="bg-gradient-primary"
         />
         <StatCard
           title="Current Streak"
           value="0 🔥"
           subtitle="Days in a row"
           icon={Flame}
           iconClassName="bg-neon-orange"
         />
         <StatCard
           title="Weight"
           value={profile.weight ? `${profile.weight} kg` : "-- kg"}
           subtitle={profile.weight && profile.height ? `BMI: ${(profile.weight / Math.pow(profile.height / 100, 2)).toFixed(1)}` : "Set your measurements"}
           icon={Scale}
           iconClassName="bg-neon-purple"
         />
         <StatCard
           title="Daily Activity"
           value="--"
           subtitle="0 steps"
           icon={Activity}
           iconClassName="bg-neon-green"
         />
       </div>
 
       {/* Second Row */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
         <StatCard
           title="Calories Consumed"
           value="0"
           subtitle={`of ${profile.calorieGoal || 0} goal`}
           icon={Utensils}
           iconClassName="bg-neon-cyan"
         />
         <StatCard
           title="Calories Burned"
           value="0"
           subtitle="Today's workout"
           icon={Dumbbell}
           iconClassName="bg-neon-pink"
         />
         <StatCard
           title="Remaining"
           value={`${profile.calorieGoal || 0} cal`}
           subtitle="Stay on track!"
           icon={Target}
           iconClassName="bg-gradient-success"
         />
         <StatCard
           title="Money Spent"
           value={formatCurrency(0)}
           subtitle={`of ${formatCurrency(profile.budgetGoal || 0)} monthly budget`}
           icon={Wallet}
           iconClassName="bg-warning"
         />
       </div>
 
       {/* Charts */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         <div className="glass-card rounded-xl p-6">
           <div className="flex items-center justify-between mb-6">
             <div>
               <h3 className="text-lg font-semibold">Weekly Progress</h3>
               <p className="text-sm text-muted-foreground">Tasks completed this week</p>
             </div>
             <TrendingUp className="h-5 w-5 text-success" />
           </div>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={weeklyData}>
                 <defs>
                   <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0.3} />
                     <stop offset="95%" stopColor="hsl(217, 91%, 60%)" stopOpacity={0} />
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 22%)" />
                 <XAxis dataKey="day" stroke="hsl(215, 20%, 65%)" fontSize={12} />
                 <YAxis stroke="hsl(215, 20%, 65%)" fontSize={12} />
                 <Tooltip
                   contentStyle={{
                     backgroundColor: "hsl(222, 47%, 14%)",
                     border: "1px solid hsl(217, 33%, 22%)",
                     borderRadius: "8px",
                   }}
                 />
                 <Area
                   type="monotone"
                   dataKey="tasks"
                   stroke="hsl(217, 91%, 60%)"
                   fillOpacity={1}
                   fill="url(#colorTasks)"
                   strokeWidth={2}
                 />
               </AreaChart>
             </ResponsiveContainer>
           </div>
         </div>
 
         <div className="glass-card rounded-xl p-6">
           <div className="flex items-center justify-between mb-6">
             <div>
               <h3 className="text-lg font-semibold">Calories vs Spending</h3>
               <p className="text-sm text-muted-foreground">Weekly comparison</p>
             </div>
           </div>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <LineChart data={weeklyData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 22%)" />
                 <XAxis dataKey="day" stroke="hsl(215, 20%, 65%)" fontSize={12} />
                 <YAxis yAxisId="left" stroke="hsl(215, 20%, 65%)" fontSize={12} />
                 <YAxis yAxisId="right" orientation="right" stroke="hsl(215, 20%, 65%)" fontSize={12} />
                 <Tooltip
                   contentStyle={{
                     backgroundColor: "hsl(222, 47%, 14%)",
                     border: "1px solid hsl(217, 33%, 22%)",
                     borderRadius: "8px",
                   }}
                 />
                 <Line
                   yAxisId="left"
                   type="monotone"
                   dataKey="calories"
                   stroke="hsl(186, 100%, 50%)"
                   strokeWidth={2}
                   dot={false}
                 />
                 <Line
                   yAxisId="right"
                   type="monotone"
                   dataKey="spending"
                   stroke="hsl(262, 83%, 58%)"
                   strokeWidth={2}
                   dot={false}
                 />
               </LineChart>
             </ResponsiveContainer>
           </div>
           <div className="flex items-center justify-center gap-6 mt-4">
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-neon-cyan" />
               <span className="text-sm text-muted-foreground">Calories</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-neon-purple" />
               <span className="text-sm text-muted-foreground">Spending ({getCurrencySymbol()})</span>
             </div>
           </div>
         </div>
       </div>
     </div>
   );
 };
 
 export default DashboardOverview;