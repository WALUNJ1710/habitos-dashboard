import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  CheckSquare,
  Flame,
  Heart,
  Apple,
  Wallet,
  BarChart3,
  ArrowRight,
  Zap,
} from "lucide-react";

const features = [
  { icon: LayoutDashboard, title: "Dashboard", description: "Get a bird's eye view of your life" },
  { icon: CheckSquare, title: "To-Do Manager", description: "Track tasks with priorities" },
  { icon: Flame, title: "Streak Tracker", description: "Build lasting habits" },
  { icon: Heart, title: "Health Tracker", description: "Monitor weight & BMI" },
  { icon: Apple, title: "Calorie Manager", description: "Track nutrition & exercise" },
  { icon: Wallet, title: "Budget Tracker", description: "Manage your finances" },
  { icon: BarChart3, title: "Reports", description: "Analyze your performance" },
];

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session?.user);
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setIsLoggedIn(!!session?.user);
      if (session?.user) {
        navigate("/dashboard");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-neon-cyan/10 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <header className="flex items-center justify-between p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center animate-float">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-gradient">HabitOS</span>
          </div>
          <Link to="/auth">
            <Button variant="outline" className="bg-secondary/50 border-border/50 hover:bg-secondary">
              Sign In
            </Button>
          </Link>
        </header>

        {/* Hero */}
        <main className="container mx-auto px-6 py-20 text-center">
          <div className="max-w-3xl mx-auto animate-slide-up">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6">
              <span className="text-gradient">Optimize</span> Your Life
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              The all-in-one dashboard for productivity, fitness, nutrition, and finances. 
              Track everything that matters in one beautiful interface.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/auth">
                <Button size="lg" className="bg-gradient-primary hover:opacity-90 text-lg px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="bg-secondary/50 text-lg px-8">
                Watch Demo
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="mt-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 stagger-children">
            {features.map((feature, i) => (
              <div
                key={i}
                className="glass-card rounded-xl p-6 hover-lift text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-primary mb-4 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <feature.icon className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="mt-24 glass-card rounded-2xl p-8 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div>
                <p className="text-4xl font-bold text-gradient">10K+</p>
                <p className="text-muted-foreground mt-1">Active Users</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-gradient-purple">1M+</p>
                <p className="text-muted-foreground mt-1">Tasks Completed</p>
              </div>
              <div>
                <p className="text-4xl font-bold text-gradient">99.9%</p>
                <p className="text-muted-foreground mt-1">Uptime</p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-24 mb-12">
            <h2 className="text-3xl font-bold mb-4">Ready to transform your life?</h2>
            <p className="text-muted-foreground mb-6">Join thousands of users optimizing their daily routines</p>
            <Link to="/auth">
              <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                Start Your Journey
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
          <p>© 2024 HabitOS. All rights reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
