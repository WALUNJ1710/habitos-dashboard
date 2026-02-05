import { Flame, Award, Calendar, TrendingUp } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useHabits } from "@/hooks/useHabits";
import { AddHabitDialog } from "@/components/streak/AddHabitDialog";
import { HabitCard } from "@/components/streak/HabitCard";
import { HabitHeatmap } from "@/components/streak/HabitHeatmap";
import { HabitInsights } from "@/components/streak/HabitInsights";
import { AchievementBadges } from "@/components/streak/AchievementBadges";
import { toast } from "sonner";

const StreakTracker = () => {
  const { user } = useApp();
  const {
    habits,
    loading,
    heatmapData,
    addHabit,
    toggleHabitComplete,
    skipHabit,
    useStreakFreeze,
    deleteHabit,
    getHabitInsights,
    stats,
  } = useHabits(user);

  const insights = getHabitInsights();

  const handleFreeze = async (habitId: string) => {
    const result = await useStreakFreeze(habitId);
    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleDelete = async (habitId: string) => {
    await deleteHabit(habitId);
    toast.success("Habit deleted");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Streak Tracker</h1>
          <p className="text-muted-foreground mt-1">Build lasting habits, one day at a time</p>
        </div>
        <AddHabitDialog onAdd={addHabit} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-neon-orange flex items-center justify-center animate-pulse-glow">
            <Flame className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Current Streak</p>
            <p className="text-2xl font-bold">{stats.totalStreak} days 🔥</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-neon-purple flex items-center justify-center">
            <Award className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Longest Streak</p>
            <p className="text-2xl font-bold">{stats.longestStreak} days</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-neon-green flex items-center justify-center">
            <Calendar className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Completed Today</p>
            <p className="text-2xl font-bold">{stats.completedToday}/{stats.totalHabits}</p>
          </div>
        </div>
        <div className="glass-card rounded-xl p-5 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-neon-cyan flex items-center justify-center">
            <TrendingUp className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Completion Rate</p>
            <p className="text-2xl font-bold">{stats.completionRate}%</p>
          </div>
        </div>
      </div>

      {/* Daily Habits */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold mb-4">Today's Habits</h3>
        {habits.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onToggle={toggleHabitComplete}
                onSkip={skipHabit}
                onFreeze={handleFreeze}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No habits added yet. Add your first habit to start tracking!</p>
          </div>
        )}
      </div>

      {/* Calendar Heatmap */}
      <HabitHeatmap data={heatmapData} />

      {/* Insights */}
      <HabitInsights insights={insights} stats={stats} />

      {/* Badges */}
      <AchievementBadges
        currentStreak={stats.totalStreak}
        longestStreak={stats.longestStreak}
      />
    </div>
  );
};

export default StreakTracker;
