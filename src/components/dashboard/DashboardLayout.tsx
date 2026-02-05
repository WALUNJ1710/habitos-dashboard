import { useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { AppSidebar } from "./AppSidebar";
import { TopNav } from "./TopNav";
import { SidebarProvider } from "@/components/ui/sidebar";
import { OnboardingModal, OnboardingData } from "./OnboardingModal";
import { AppProvider } from "@/contexts/AppContext";

export const DashboardLayout = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        // Check if profile exists and has been set up
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (!profile?.full_name) {
          setShowOnboarding(true);
        }
      } else {
        navigate("/auth");
      }
    });

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (!profile?.full_name) {
          setShowOnboarding(true);
        }
      } else {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleOnboardingComplete = async (data: OnboardingData) => {
    if (!user) return;

    await supabase
      .from("profiles")
      .update({
        full_name: data.fullName,
        weight: parseFloat(data.weight) || null,
        height: parseFloat(data.height) || null,
        goal_weight: parseFloat(data.goalWeight) || null,
        calorie_goal: parseInt(data.calorieGoal) || 2000,
        budget_goal: parseFloat(data.budgetGoal) || 0,
      })
      .eq("user_id", user.id);

    setShowOnboarding(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground animate-pulse">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <AppProvider user={user}>
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col">
            <TopNav user={user} />
            <main className="flex-1 p-6 overflow-auto">
              <Outlet />
            </main>
          </div>
        </div>
        <OnboardingModal open={showOnboarding} onComplete={handleOnboardingComplete} />
      </SidebarProvider>
    </AppProvider>
  );
};
