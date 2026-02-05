import { useState, useEffect } from "react";
import { useApp } from "@/contexts/AppContext";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { User, Target, Wallet, Sun, Moon, LogOut, Save, Loader2 } from "lucide-react";
import { getCurrencySymbol } from "@/lib/currency";

const Settings = () => {
  const { profile, updateProfile, theme, toggleTheme } = useApp();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    calorieGoal: "0",
    budgetGoal: "0",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (profile) {
      setFormData({
        fullName: profile.full_name || "",
        email: "",
        calorieGoal: profile.calorie_goal?.toString() || "0",
        budgetGoal: profile.budget_goal?.toString() || "0",
      });
    }
    // Get email from supabase session
    supabase.auth.getUser().then(({ data }) => {
      if (data.user?.email) {
        setFormData((prev) => ({ ...prev, email: data.user!.email! }));
      }
    });
  }, [profile]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const handleSave = async () => {
    setLoading(true);
    
    const { error } = await updateProfile({
      full_name: formData.fullName,
      calorie_goal: parseInt(formData.calorieGoal) || 0,
      budget_goal: parseFloat(formData.budgetGoal) || 0,
    });

    setLoading(false);
    
    if (error) {
      toast({
        title: "Error",
        description: "Failed to save settings.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated.",
      });
    }
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
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              className="bg-secondary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              className="bg-secondary/50"
              disabled
            />
            <p className="text-xs text-muted-foreground">Email cannot be changed</p>
          </div>
        </div>
      </div>

      {/* XP & Level */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-neon-purple flex items-center justify-center text-xl">
            🏆
          </div>
          <h3 className="font-semibold">Gamification</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-secondary/30 text-center">
            <p className="text-3xl font-bold">{profile?.xp_points || 0}</p>
            <p className="text-sm text-muted-foreground">XP Points</p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/30 text-center">
            <p className="text-3xl font-bold">Level {profile?.level || 1}</p>
            <p className="text-sm text-muted-foreground">Current Level</p>
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
              value={formData.calorieGoal}
              onChange={(e) => setFormData({ ...formData, calorieGoal: e.target.value })}
              className="bg-secondary/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="budgetGoal">Monthly Budget Goal ({getCurrencySymbol()})</Label>
            <Input
              id="budgetGoal"
              type="number"
              value={formData.budgetGoal}
              onChange={(e) => setFormData({ ...formData, budgetGoal: e.target.value })}
              className="bg-secondary/50"
            />
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg bg-neon-orange flex items-center justify-center">
            {theme === "dark" ? <Moon className="h-5 w-5 text-primary-foreground" /> : <Sun className="h-5 w-5 text-primary-foreground" />}
          </div>
          <h3 className="font-semibold">Appearance</h3>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Dark Mode</p>
            <p className="text-sm text-muted-foreground">Toggle between light and dark theme</p>
          </div>
          <Switch checked={theme === "dark"} onCheckedChange={toggleTheme} />
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Button onClick={handleSave} className="flex-1 bg-gradient-primary" disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
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
