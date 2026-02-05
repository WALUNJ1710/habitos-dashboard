 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { supabase } from "@/integrations/supabase/client";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Switch } from "@/components/ui/switch";
 import { useToast } from "@/hooks/use-toast";
 import { User, Target, Wallet, Sun, Moon, LogOut, Save } from "lucide-react";
 
 const Settings = () => {
   const [profile, setProfile] = useState({
     fullName: "John Doe",
     email: "john@example.com",
     calorieGoal: "2200",
     budgetGoal: "2000",
   });
   const [darkMode, setDarkMode] = useState(true);
   const [loading, setLoading] = useState(false);
   const { toast } = useToast();
   const navigate = useNavigate();
 
   const handleSignOut = async () => {
     await supabase.auth.signOut();
     navigate("/auth");
   };
 
   const handleSave = () => {
     setLoading(true);
     setTimeout(() => {
       setLoading(false);
       toast({
         title: "Settings saved",
         description: "Your preferences have been updated.",
       });
     }, 1000);
   };
 
   return (
     <div className="space-y-6 animate-fade-in max-w-2xl">
       <div>
         <h1 className="text-3xl font-bold">Settings</h1>
         <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
       </div>
 
       {/* Profile Section */}
       <div className="glass-card rounded-xl p-6">
         <div className="flex items-center gap-3 mb-6">
           <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
             <User className="h-5 w-5 text-primary-foreground" />
           </div>
           <h3 className="font-semibold">Profile Information</h3>
         </div>
         <div className="space-y-4">
           <div className="space-y-2">
             <Label htmlFor="fullName">Full Name</Label>
             <Input
               id="fullName"
               value={profile.fullName}
               onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
               className="bg-secondary/50"
             />
           </div>
           <div className="space-y-2">
             <Label htmlFor="email">Email</Label>
             <Input
               id="email"
               type="email"
               value={profile.email}
               onChange={(e) => setProfile({ ...profile, email: e.target.value })}
               className="bg-secondary/50"
               disabled
             />
             <p className="text-xs text-muted-foreground">Email cannot be changed</p>
           </div>
         </div>
       </div>
 
       {/* Goals Section */}
       <div className="glass-card rounded-xl p-6">
         <div className="flex items-center gap-3 mb-6">
           <div className="w-10 h-10 rounded-lg bg-neon-cyan flex items-center justify-center">
             <Target className="h-5 w-5 text-primary-foreground" />
           </div>
           <h3 className="font-semibold">Goals</h3>
         </div>
         <div className="space-y-4">
           <div className="space-y-2">
             <Label htmlFor="calorieGoal">Daily Calorie Goal</Label>
             <Input
               id="calorieGoal"
               type="number"
               value={profile.calorieGoal}
               onChange={(e) => setProfile({ ...profile, calorieGoal: e.target.value })}
               className="bg-secondary/50"
             />
           </div>
           <div className="space-y-2">
             <Label htmlFor="budgetGoal">Monthly Budget Goal ($)</Label>
             <Input
               id="budgetGoal"
               type="number"
               value={profile.budgetGoal}
               onChange={(e) => setProfile({ ...profile, budgetGoal: e.target.value })}
               className="bg-secondary/50"
             />
           </div>
         </div>
       </div>
 
       {/* Appearance */}
       <div className="glass-card rounded-xl p-6">
         <div className="flex items-center gap-3 mb-6">
           <div className="w-10 h-10 rounded-lg bg-neon-purple flex items-center justify-center">
             {darkMode ? <Moon className="h-5 w-5 text-primary-foreground" /> : <Sun className="h-5 w-5 text-primary-foreground" />}
           </div>
           <h3 className="font-semibold">Appearance</h3>
         </div>
         <div className="flex items-center justify-between">
           <div>
             <p className="font-medium">Dark Mode</p>
             <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
           </div>
           <Switch checked={darkMode} onCheckedChange={setDarkMode} />
         </div>
       </div>
 
       {/* Actions */}
       <div className="flex flex-col sm:flex-row gap-4">
         <Button onClick={handleSave} className="flex-1 bg-gradient-primary" disabled={loading}>
           <Save className="mr-2 h-4 w-4" />
           {loading ? "Saving..." : "Save Changes"}
         </Button>
         <Button variant="outline" onClick={handleSignOut} className="flex-1 border-destructive/50 text-destructive hover:bg-destructive/10">
           <LogOut className="mr-2 h-4 w-4" />
           Sign Out
         </Button>
       </div>
     </div>
   );
 };
 
 export default Settings;