import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { format, subDays, startOfWeek, endOfWeek, eachDayOfInterval, differenceInDays, parseISO } from "date-fns";

export interface Habit {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string;
  frequency: string;
  target_count: number;
  user_id: string;
  created_at: string;
}

export interface HabitLog {
  id: string;
  habit_id: string;
  log_date: string;
  completed_count: number;
  skipped: boolean;
  notes: string | null;
}

export interface HabitStreak {
  id: string;
  habit_id: string;
  current_streak: number;
  longest_streak: number;
  streak_level: "bronze" | "silver" | "gold" | "diamond";
  streak_freezes_available: number;
  last_completed_date: string | null;
  last_freeze_used: string | null;
}

export interface HabitWithStreak extends Habit {
  streak: HabitStreak | null;
  todayLog: HabitLog | null;
}

export interface DayActivity {
  date: Date;
  completedCount: number;
  totalHabits: number;
}

export const useHabits = (user: User | null) => {
  const [habits, setHabits] = useState<HabitWithStreak[]>([]);
  const [loading, setLoading] = useState(true);
  const [heatmapData, setHeatmapData] = useState<DayActivity[]>([]);

  const today = format(new Date(), "yyyy-MM-dd");

  const fetchHabits = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch habits with their streaks
      const { data: habitsData, error: habitsError } = await supabase
        .from("habits")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (habitsError) throw habitsError;

      // Fetch streaks for all habits
      const { data: streaksData } = await supabase
        .from("habit_streaks")
        .select("*")
        .eq("user_id", user.id);

      // Fetch today's logs
      const { data: logsData } = await supabase
        .from("habit_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("log_date", today);

      // Combine data
      const habitsWithStreaks: HabitWithStreak[] = (habitsData || []).map((habit) => ({
        ...habit,
        color: habit.color || "#10b981",
        frequency: habit.frequency || "daily",
        target_count: habit.target_count || 1,
        streak: streaksData?.find((s) => s.habit_id === habit.id) as HabitStreak | null,
        todayLog: logsData?.find((l) => l.habit_id === habit.id) as HabitLog | null,
      }));

      setHabits(habitsWithStreaks);
    } catch (error) {
      console.error("Error fetching habits:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchHeatmapData = async () => {
    if (!user) return;

    const endDate = new Date();
    const startDate = subDays(endDate, 90);

    const { data: logsData } = await supabase
      .from("habit_logs")
      .select("*")
      .eq("user_id", user.id)
      .gte("log_date", format(startDate, "yyyy-MM-dd"))
      .lte("log_date", format(endDate, "yyyy-MM-dd"));

    const { data: habitsData } = await supabase
      .from("habits")
      .select("id")
      .eq("user_id", user.id);

    const totalHabits = habitsData?.length || 1;

    // Create heatmap data
    const days = eachDayOfInterval({ start: startDate, end: endDate });
    const heatmap: DayActivity[] = days.map((date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      const dayLogs = logsData?.filter((l) => l.log_date === dateStr && !l.skipped) || [];
      return {
        date,
        completedCount: dayLogs.length,
        totalHabits,
      };
    });

    setHeatmapData(heatmap);
  };

  useEffect(() => {
    fetchHabits();
    fetchHeatmapData();
  }, [user]);

  const addHabit = async (habit: Omit<Habit, "id" | "user_id" | "created_at">) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { data, error } = await supabase
      .from("habits")
      .insert({
        ...habit,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) return { error };

    // Create streak record
    await supabase.from("habit_streaks").insert({
      habit_id: data.id,
      user_id: user.id,
      current_streak: 0,
      longest_streak: 0,
      streak_level: "bronze",
      streak_freezes_available: 1,
    });

    await fetchHabits();
    return { data };
  };

  const toggleHabitComplete = async (habitId: string, completed: boolean) => {
    if (!user) return;

    const habit = habits.find((h) => h.id === habitId);
    if (!habit) return;

    if (completed) {
      // Mark as completed
      const { error: logError } = await supabase.from("habit_logs").upsert(
        {
          habit_id: habitId,
          user_id: user.id,
          log_date: today,
          completed_count: 1,
          skipped: false,
        },
        { onConflict: "habit_id,log_date" }
      );

      if (logError) {
        // If upsert fails, try insert
        await supabase.from("habit_logs").insert({
          habit_id: habitId,
          user_id: user.id,
          log_date: today,
          completed_count: 1,
          skipped: false,
        });
      }

      // Update streak
      const currentStreak = habit.streak;
      const lastCompleted = currentStreak?.last_completed_date;
      const yesterday = format(subDays(new Date(), 1), "yyyy-MM-dd");
      
      let newStreak = 1;
      if (lastCompleted === yesterday) {
        newStreak = (currentStreak?.current_streak || 0) + 1;
      } else if (lastCompleted === today) {
        newStreak = currentStreak?.current_streak || 1;
      }

      const longestStreak = Math.max(newStreak, currentStreak?.longest_streak || 0);
      
      // Determine streak level
      let streakLevel: "bronze" | "silver" | "gold" | "diamond" = "bronze";
      if (longestStreak >= 100) streakLevel = "diamond";
      else if (longestStreak >= 30) streakLevel = "gold";
      else if (longestStreak >= 7) streakLevel = "silver";

      await supabase
        .from("habit_streaks")
        .update({
          current_streak: newStreak,
          longest_streak: longestStreak,
          streak_level: streakLevel,
          last_completed_date: today,
        })
        .eq("habit_id", habitId)
        .eq("user_id", user.id);

    } else {
      // Remove completion
      await supabase
        .from("habit_logs")
        .delete()
        .eq("habit_id", habitId)
        .eq("user_id", user.id)
        .eq("log_date", today);
    }

    await fetchHabits();
    await fetchHeatmapData();
  };

  const skipHabit = async (habitId: string) => {
    if (!user) return;

    await supabase.from("habit_logs").upsert(
      {
        habit_id: habitId,
        user_id: user.id,
        log_date: today,
        completed_count: 0,
        skipped: true,
      },
      { onConflict: "habit_id,log_date" }
    );

    await fetchHabits();
  };

  const useStreakFreeze = async (habitId: string) => {
    if (!user) return { success: false, message: "Not authenticated" };

    const habit = habits.find((h) => h.id === habitId);
    if (!habit?.streak) return { success: false, message: "No streak found" };

    if (habit.streak.streak_freezes_available <= 0) {
      return { success: false, message: "No streak freezes available" };
    }

    // Check if already used this month
    const lastFreeze = habit.streak.last_freeze_used;
    if (lastFreeze) {
      const lastFreezeDate = parseISO(lastFreeze);
      const now = new Date();
      if (lastFreezeDate.getMonth() === now.getMonth() && lastFreezeDate.getFullYear() === now.getFullYear()) {
        return { success: false, message: "Already used streak freeze this month" };
      }
    }

    await supabase
      .from("habit_streaks")
      .update({
        streak_freezes_available: habit.streak.streak_freezes_available - 1,
        last_freeze_used: new Date().toISOString(),
      })
      .eq("habit_id", habitId)
      .eq("user_id", user.id);

    await fetchHabits();
    return { success: true, message: "Streak freeze applied!" };
  };

  const deleteHabit = async (habitId: string) => {
    if (!user) return;

    await supabase.from("habits").delete().eq("id", habitId).eq("user_id", user.id);
    await fetchHabits();
  };

  const getHabitInsights = () => {
    if (heatmapData.length === 0) return null;

    // Find best day of week
    const dayStats: Record<number, { completed: number; total: number }> = {};
    heatmapData.forEach((day) => {
      const dayOfWeek = day.date.getDay();
      if (!dayStats[dayOfWeek]) {
        dayStats[dayOfWeek] = { completed: 0, total: 0 };
      }
      dayStats[dayOfWeek].completed += day.completedCount;
      dayStats[dayOfWeek].total += day.totalHabits;
    });

    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let bestDay = 0;
    let bestRate = 0;

    Object.entries(dayStats).forEach(([day, stats]) => {
      const rate = stats.total > 0 ? stats.completed / stats.total : 0;
      if (rate > bestRate) {
        bestRate = rate;
        bestDay = parseInt(day);
      }
    });

    // Calculate overall success rate
    const totalCompleted = heatmapData.reduce((sum, d) => sum + d.completedCount, 0);
    const totalPossible = heatmapData.reduce((sum, d) => sum + d.totalHabits, 0);
    const overallRate = totalPossible > 0 ? Math.round((totalCompleted / totalPossible) * 100) : 0;

    return {
      bestDay: dayNames[bestDay],
      bestDayRate: Math.round(bestRate * 100),
      overallSuccessRate: overallRate,
    };
  };

  // Calculate stats
  const totalStreak = habits.length > 0 
    ? Math.max(...habits.map((h) => h.streak?.current_streak || 0), 0) 
    : 0;
  const longestStreak = habits.length > 0 
    ? Math.max(...habits.map((h) => h.streak?.longest_streak || 0), 0) 
    : 0;
  const completedToday = habits.filter((h) => h.todayLog && !h.todayLog.skipped).length;

  return {
    habits,
    loading,
    heatmapData,
    addHabit,
    toggleHabitComplete,
    skipHabit,
    useStreakFreeze,
    deleteHabit,
    getHabitInsights,
    refetch: fetchHabits,
    stats: {
      totalStreak,
      longestStreak,
      completedToday,
      totalHabits: habits.length,
      completionRate: habits.length > 0 ? Math.round((completedToday / habits.length) * 100) : 0,
    },
  };
};
