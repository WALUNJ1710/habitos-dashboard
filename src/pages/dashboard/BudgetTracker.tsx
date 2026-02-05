 import { useUserProfile } from "@/components/dashboard/DashboardLayout";
 import { formatCurrency, getCurrencySymbol } from "@/lib/currency";
 import { useState } from "react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Textarea } from "@/components/ui/textarea";
 import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
 } from "@/components/ui/select";
 import { Calendar } from "@/components/ui/calendar";
 import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
 import { format } from "date-fns";
 import { CalendarIcon, Wallet, TrendingUp, TrendingDown, Plus, CreditCard, Smartphone, Banknote, Building } from "lucide-react";
 import {
   PieChart,
   Pie,
   Cell,
   BarChart,
   Bar,
   XAxis,
   YAxis,
   CartesianGrid,
   Tooltip,
   ResponsiveContainer,
   Legend,
 } from "recharts";
 import { cn } from "@/lib/utils";
 
 interface Expense {
   id: string;
   amount: number;
   category: string;
   paymentMethod: string;
   date: Date;
   notes: string;
 }
 
 const categories = ["Food", "Travel", "Bills", "Shopping", "Health", "Entertainment", "Other"];
 const paymentMethods = [
   { value: "credit", label: "Credit Card", icon: CreditCard },
   { value: "debit", label: "Debit Card", icon: CreditCard },
   { value: "upi", label: "UPI", icon: Smartphone },
   { value: "cash", label: "Cash", icon: Banknote },
   { value: "netbanking", label: "Net Banking", icon: Building },
 ];
 
 // Empty initial data - user will add their expenses
 const initialExpenses: Expense[] = [];
 
 const categoryColors: Record<string, string> = {
   Food: "hsl(24, 95%, 53%)",
   Travel: "hsl(186, 100%, 50%)",
   Bills: "hsl(262, 83%, 58%)",
   Shopping: "hsl(330, 81%, 60%)",
   Health: "hsl(142, 76%, 45%)",
   Entertainment: "hsl(217, 91%, 60%)",
   Other: "hsl(215, 20%, 65%)",
 };
 
 const BudgetTracker = () => {
   const { profile } = useUserProfile();
   const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
   const [newExpense, setNewExpense] = useState({
     amount: "",
     category: "Food",
     paymentMethod: "upi",
     date: new Date(),
     notes: "",
   });
 
   const totalBudget = profile.budgetGoal || 0;
   const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
   const remaining = totalBudget - totalSpent;
 
   const addExpense = () => {
     if (!newExpense.amount) return;
     setExpenses([...expenses, {
       id: Date.now().toString(),
       amount: parseFloat(newExpense.amount),
       category: newExpense.category,
       paymentMethod: newExpense.paymentMethod,
       date: newExpense.date,
       notes: newExpense.notes,
     }]);
     setNewExpense({ amount: "", category: "Food", paymentMethod: "upi", date: new Date(), notes: "" });
   };
 
   // Pie chart data
   const pieData = categories.map((cat) => ({
     name: cat,
     value: expenses.filter((e) => e.category === cat).reduce((sum, e) => sum + e.amount, 0),
   })).filter((d) => d.value > 0);
 
   // Bar chart data (daily expenses for last 7 days)
   const barData = Array.from({ length: 7 }, (_, i) => {
     const date = new Date();
     date.setDate(date.getDate() - (6 - i));
     const dayExpenses = expenses.filter((e) => 
       e.date.toDateString() === date.toDateString()
     ).reduce((sum, e) => sum + e.amount, 0);
     return {
       day: format(date, "EEE"),
       amount: dayExpenses,
     };
   });
 
   return (
     <div className="space-y-6 animate-fade-in">
       <div>
         <h1 className="text-3xl font-bold">Budget Tracker</h1>
         <p className="text-muted-foreground mt-1">Manage your finances like a pro</p>
       </div>
 
       {/* Summary Cards */}
       <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
         <div className="glass-card rounded-xl p-5 glow-blue">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
               <Wallet className="h-5 w-5 text-primary-foreground" />
             </div>
             <p className="text-sm text-muted-foreground">Total Budget</p>
           </div>
           <p className="text-3xl font-bold">{formatCurrency(totalBudget)}</p>
           <p className="text-sm text-muted-foreground">Monthly</p>
         </div>
         <div className="glass-card rounded-xl p-5">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-10 h-10 rounded-lg bg-neon-orange flex items-center justify-center">
               <TrendingDown className="h-5 w-5 text-primary-foreground" />
             </div>
             <p className="text-sm text-muted-foreground">Money Spent</p>
           </div>
           <p className="text-3xl font-bold">{formatCurrency(totalSpent)}</p>
           <p className="text-sm text-muted-foreground">{totalBudget > 0 ? ((totalSpent / totalBudget) * 100).toFixed(0) : 0}% of budget</p>
         </div>
         <div className={cn(
           "glass-card rounded-xl p-5",
           remaining > 0 ? "glow-cyan" : ""
         )}>
           <div className="flex items-center gap-3 mb-3">
             <div className={cn(
               "w-10 h-10 rounded-lg flex items-center justify-center",
               remaining > 0 ? "bg-neon-green" : "bg-destructive"
             )}>
               <TrendingUp className="h-5 w-5 text-primary-foreground" />
             </div>
             <p className="text-sm text-muted-foreground">Remaining</p>
           </div>
           <p className={cn("text-3xl font-bold", remaining > 0 ? "text-success" : "text-destructive")}>
             {formatCurrency(remaining)}
           </p>
           <p className="text-sm text-muted-foreground">{remaining > 0 ? "Keep it up!" : "Over budget!"}</p>
         </div>
       </div>
 
       {/* Add Expense Form */}
       <div className="glass-card rounded-xl p-6">
         <h3 className="font-semibold mb-4">Add Expense</h3>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
           <div className="space-y-2">
             <Label>Amount ({getCurrencySymbol()})</Label>
             <Input
               type="number"
               placeholder="0.00"
               value={newExpense.amount}
               onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
               className="bg-secondary/50"
             />
           </div>
           <div className="space-y-2">
             <Label>Category</Label>
             <Select value={newExpense.category} onValueChange={(v) => setNewExpense({ ...newExpense, category: v })}>
               <SelectTrigger className="bg-secondary/50">
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 {categories.map((cat) => (
                   <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
           <div className="space-y-2">
             <Label>Payment Method</Label>
             <Select value={newExpense.paymentMethod} onValueChange={(v) => setNewExpense({ ...newExpense, paymentMethod: v })}>
               <SelectTrigger className="bg-secondary/50">
                 <SelectValue />
               </SelectTrigger>
               <SelectContent>
                 {paymentMethods.map((pm) => (
                   <SelectItem key={pm.value} value={pm.value}>{pm.label}</SelectItem>
                 ))}
               </SelectContent>
             </Select>
           </div>
           <div className="space-y-2">
             <Label>Date</Label>
             <Popover>
               <PopoverTrigger asChild>
                 <Button variant="outline" className="w-full justify-start bg-secondary/50">
                   <CalendarIcon className="mr-2 h-4 w-4" />
                   {format(newExpense.date, "PPP")}
                 </Button>
               </PopoverTrigger>
               <PopoverContent className="w-auto p-0" align="start">
                 <Calendar
                   mode="single"
                   selected={newExpense.date}
                   onSelect={(d) => d && setNewExpense({ ...newExpense, date: d })}
                   initialFocus
                   className="pointer-events-auto"
                 />
               </PopoverContent>
             </Popover>
           </div>
           <div className="space-y-2">
             <Label>Notes</Label>
             <Input
               placeholder="Description"
               value={newExpense.notes}
               onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
               className="bg-secondary/50"
             />
           </div>
           <div className="flex items-end">
             <Button onClick={addExpense} className="w-full bg-gradient-primary">
               <Plus className="mr-2 h-4 w-4" /> Add
             </Button>
           </div>
         </div>
       </div>
 
       {/* Charts */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
         {/* Pie Chart */}
         <div className="glass-card rounded-xl p-6">
           <h3 className="font-semibold mb-4">Spending by Category</h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={pieData}
                   cx="50%"
                   cy="50%"
                   innerRadius={60}
                   outerRadius={100}
                   paddingAngle={5}
                   dataKey="value"
                 >
                   {pieData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={categoryColors[entry.name]} />
                   ))}
                 </Pie>
                 <Tooltip
                   contentStyle={{
                     backgroundColor: "hsl(222, 47%, 14%)",
                     border: "1px solid hsl(217, 33%, 22%)",
                     borderRadius: "8px",
                   }}
                   formatter={(value: number) => [formatCurrency(value), "Amount"]}
                 />
                 <Legend />
               </PieChart>
             </ResponsiveContainer>
           </div>
         </div>
 
         {/* Bar Chart */}
         <div className="glass-card rounded-xl p-6">
           <h3 className="font-semibold mb-4">Daily Expenses (Last 7 Days)</h3>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={barData}>
                 <CartesianGrid strokeDasharray="3 3" stroke="hsl(217, 33%, 22%)" />
                 <XAxis dataKey="day" stroke="hsl(215, 20%, 65%)" fontSize={12} />
                 <YAxis stroke="hsl(215, 20%, 65%)" fontSize={12} />
                 <Tooltip
                   contentStyle={{
                     backgroundColor: "hsl(222, 47%, 14%)",
                     border: "1px solid hsl(217, 33%, 22%)",
                     borderRadius: "8px",
                   }}
                   formatter={(value: number) => [formatCurrency(value), "Spent"]}
                 />
                 <Bar dataKey="amount" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
           </div>
         </div>
       </div>
 
       {/* Recent Transactions */}
       <div className="glass-card rounded-xl p-6">
         <h3 className="font-semibold mb-4">Recent Transactions</h3>
         <div className="space-y-3 max-h-64 overflow-y-auto">
           {expenses.slice().reverse().map((expense) => {
             const pm = paymentMethods.find((p) => p.value === expense.paymentMethod);
             const Icon = pm?.icon || CreditCard;
             return (
               <div key={expense.id} className="flex items-center justify-between p-4 rounded-lg bg-secondary/30">
                 <div className="flex items-center gap-4">
                   <div
                     className="w-10 h-10 rounded-lg flex items-center justify-center"
                     style={{ backgroundColor: categoryColors[expense.category] + "30" }}
                   >
                     <Icon className="h-5 w-5" style={{ color: categoryColors[expense.category] }} />
                   </div>
                   <div>
                     <p className="font-medium">{expense.notes || expense.category}</p>
                     <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                       <span>{expense.category}</span>
                       <span>•</span>
                       <span>{pm?.label}</span>
                       <span>•</span>
                       <span>{format(expense.date, "MMM d")}</span>
                     </div>
                   </div>
                 </div>
               <p className="text-lg font-semibold text-destructive">-{formatCurrency(expense.amount)}</p>
               </div>
             );
           })}
         </div>
       </div>
     </div>
   );
 };
 
 export default BudgetTracker;