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
   BarChart,
   Bar,
   RadarChart,
   PolarGrid,
   PolarAngleAxis,
   PolarRadiusAxis,
   Radar,
 } from "recharts";
 import { TrendingUp, Calendar, Target, Award } from "lucide-react";
 
 const weeklyData = [
   { week: "Week 1", productivity: 75, calories: 85, spending: 60, streak: 100 },
   { week: "Week 2", productivity: 82, calories: 78, spending: 70, streak: 100 },
   { week: "Week 3", productivity: 68, calories: 92, spending: 55, streak: 85 },
   { week: "Week 4", productivity: 90, calories: 88, spending: 80, streak: 100 },
 ];
 
 const performanceData = [
   { subject: "Tasks", A: 85, fullMark: 100 },
   { subject: "Health", A: 78, fullMark: 100 },
   { subject: "Fitness", A: 82, fullMark: 100 },
   { subject: "Finance", A: 70, fullMark: 100 },
   { subject: "Habits", A: 92, fullMark: 100 },
 ];
 
 const streakData = [
   { month: "Jan", streak: 15 },
   { month: "Feb", streak: 22 },
   { month: "Mar", streak: 18 },
   { month: "Apr", streak: 25 },
   { month: "May", streak: 30 },
   { month: "Jun", streak: 28 },
 ];
 
 const Reports = () => {
   return (
     <div className="space-y-6 animate-fade-in">
       <div>
         <h1 className="text-3xl font-bold">Reports & Analytics</h1>
         <p className="text-muted-foreground mt-1">Track your overall performance</p>
       </div>
 
       {/* Summary Stats */}
       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
         <div className="glass-card rounded-xl p-5">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 rounded-lg bg-neon-green flex items-center justify-center">
               <TrendingUp className="h-5 w-5 text-primary-foreground" />
             </div>
             <p className="text-sm text-muted-foreground">Avg Productivity</p>
           </div>
           <p className="text-3xl font-bold">79%</p>
           <p className="text-sm text-success">+12% from last month</p>
         </div>
         <div className="glass-card rounded-xl p-5">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 rounded-lg bg-neon-cyan flex items-center justify-center">
               <Target className="h-5 w-5 text-primary-foreground" />
             </div>
             <p className="text-sm text-muted-foreground">Goals Met</p>
           </div>
           <p className="text-3xl font-bold">24/30</p>
           <p className="text-sm text-muted-foreground">This month</p>
         </div>
         <div className="glass-card rounded-xl p-5">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 rounded-lg bg-neon-orange flex items-center justify-center">
               <Calendar className="h-5 w-5 text-primary-foreground" />
             </div>
             <p className="text-sm text-muted-foreground">Active Days</p>
           </div>
           <p className="text-3xl font-bold">28</p>
           <p className="text-sm text-muted-foreground">Out of 30</p>
         </div>
         <div className="glass-card rounded-xl p-5">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 rounded-lg bg-neon-purple flex items-center justify-center">
               <Award className="h-5 w-5 text-primary-foreground" />
             </div>
             <p className="text-sm text-muted-foreground">Overall Score</p>
           </div>
           <p className="text-3xl font-bold">A-</p>
           <p className="text-sm text-success">Great performance!</p>
         </div>
       </div>
 
       {/* Combined Graph */}
       <div className="glass-card rounded-xl p-6">
         <h3 className="font-semibold mb-6">Productivity vs Calories vs Spending</h3>
         <div className="h-80">
           <ResponsiveContainer width="100%" height="100%">
             <LineChart data={weeklyData}>
               <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 22%)" />
               <XAxis dataKey="week" stroke="hsl(215, 20%, 65%)" fontSize={12} />
               <YAxis stroke="hsl(215, 20%, 65%)" fontSize={12} />
               <Tooltip
                 contentStyle={{
                   backgroundColor: "hsl(222, 47%, 14%)",
                   border: "1px solid hsl(217, 33%, 22%)",
                   borderRadius: "8px",
                 }}
               />
               <Line type="monotone" dataKey="productivity" stroke="hsl(217, 91%, 60%)" strokeWidth={2} name="Productivity %" />
               <Line type="monotone" dataKey="calories" stroke="hsl(186, 100%, 50%)" strokeWidth={2} name="Calorie Goals %" />
               <Line type="monotone" dataKey="spending" stroke="hsl(262, 83%, 58%)" strokeWidth={2} name="Budget Adherence %" />
             </LineChart>
           </ResponsiveContainer>
         </div>
         <div className="flex items-center justify-center gap-6 mt-4">
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-primary" />
             <span className="text-sm text-muted-foreground">Productivity</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-neon-cyan" />
             <span className="text-sm text-muted-foreground">Calorie Goals</span>
           </div>
           <div className="flex items-center gap-2">
             <div className="w-3 h-3 rounded-full bg-neon-purple" />
             <span className="text-sm text-muted-foreground">Budget</span>
           </div>
         </div>
       </div>
 
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Radar Chart */}
         <div className="glass-card rounded-xl p-6">
           <h3 className="font-semibold mb-6">Performance Breakdown</h3>
           <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
               <RadarChart data={performanceData}>
                 <PolarGrid stroke="hsl(217, 33%, 22%)" />
                 <PolarAngleAxis dataKey="subject" stroke="hsl(215, 20%, 65%)" fontSize={12} />
                 <PolarRadiusAxis stroke="hsl(215, 20%, 65%)" fontSize={10} />
                 <Radar
                   name="Performance"
                   dataKey="A"
                   stroke="hsl(217, 91%, 60%)"
                   fill="hsl(217, 91%, 60%)"
                   fillOpacity={0.3}
                 />
               </RadarChart>
             </ResponsiveContainer>
           </div>
         </div>
 
         {/* Streak Consistency */}
         <div className="glass-card rounded-xl p-6">
           <h3 className="font-semibold mb-6">Streak Consistency</h3>
           <div className="h-72">
             <ResponsiveContainer width="100%" height="100%">
               <AreaChart data={streakData}>
                 <defs>
                   <linearGradient id="colorStreak" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="hsl(24, 95%, 53%)" stopOpacity={0.4} />
                     <stop offset="95%" stopColor="hsl(24, 95%, 53%)" stopOpacity={0} />
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 22%)" />
                 <XAxis dataKey="month" stroke="hsl(215, 20%, 65%)" fontSize={12} />
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
                   dataKey="streak"
                   stroke="hsl(24, 95%, 53%)"
                   fillOpacity={1}
                   fill="url(#colorStreak)"
                   strokeWidth={2}
                 />
               </AreaChart>
             </ResponsiveContainer>
           </div>
         </div>
       </div>
 
       {/* Weekly Summary */}
       <div className="glass-card rounded-xl p-6">
         <h3 className="font-semibold mb-6">Weekly Performance Summary</h3>
         <div className="h-64">
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={weeklyData}>
               <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 22%)" />
               <XAxis dataKey="week" stroke="hsl(215, 20%, 65%)" fontSize={12} />
               <YAxis stroke="hsl(215, 20%, 65%)" fontSize={12} />
               <Tooltip
                 contentStyle={{
                   backgroundColor: "hsl(222, 47%, 14%)",
                   border: "1px solid hsl(217, 33%, 22%)",
                   borderRadius: "8px",
                 }}
               />
               <Bar dataKey="productivity" fill="hsl(217, 91%, 60%)" name="Productivity" radius={[4, 4, 0, 0]} />
               <Bar dataKey="streak" fill="hsl(24, 95%, 53%)" name="Streak" radius={[4, 4, 0, 0]} />
             </BarChart>
           </ResponsiveContainer>
         </div>
       </div>
     </div>
   );
 };
 
 export default Reports;