import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { format, subDays, startOfMonth, endOfMonth, eachDayOfInterval, getDay, startOfWeek, subMonths } from "date-fns";

interface DayStats {
  date: string;
  day: string;
  dayOfWeek: number;
  tasksCompleted: number;
  totalTasks: number;
  habitsCompleted: number;
  totalHabits: number;
  caloriesConsumed: number;
  caloriesBurned: number;
  calorieTarget: number;
  spending: number;
  income: number;
  healthScore: number;
}

interface WeeklyStats {
  week: string;
  productivity: number;
  calories: number;
  spending: number;
  streak: number;
}

interface PerformanceData {
  subject: string;
  score: number;
  fullMark: number;
}

interface Achievement {
  id: string;
  badge_name: string;
  badge_emoji: string | null;
  earned_at: string;
}

interface MonthlyReport {
  month: string;
  tasksCompleted: number;
  habitsCompleted: number;
  totalSpending: number;
  totalIncome: number;
  savingsRate: number;
  avgCalories: number;
  avgHealthScore: number;
  activeDays: number;
}

export const useAnalytics = (user: User | null) => {
  const [loading, setLoading] = useState(true);
  const [dailyStats, setDailyStats] = useState<DayStats[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [monthlyReport, setMonthlyReport] = useState<MonthlyReport | null>(null);
  const [productivityScore, setProductivityScore] = useState(0);
  const [bestDay, setBestDay] = useState({ day: "Monday", score: 0 });
  const [healthScore, setHealthScore] = useState(0);

  useEffect(() => {
    if (!user) return;
    fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const endDate = new Date();
      const startDate = subDays(endDate, 30);
      const dateRange = eachDayOfInterval({ start: startDate, end: endDate });

      // Fetch all data in parallel
      const [
        tasksRes,
        habitsRes,
        habitLogsRes,
        mealsRes,
        mealItemsRes,
        foodItemsRes,
        exerciseRes,
        transactionsRes,
        healthLogsRes,
        badgesRes,
        calorieGoalsRes,
        profileRes,
      ] = await Promise.all([
        supabase.from("tasks").select("*").eq("user_id", user.id),
        supabase.from("habits").select("*").eq("user_id", user.id),
        supabase.from("habit_logs").select("*").eq("user_id", user.id)
          .gte("log_date", format(startDate, "yyyy-MM-dd")),
        supabase.from("meals").select("*").eq("user_id", user.id)
          .gte("meal_date", format(startDate, "yyyy-MM-dd")),
        supabase.from("meal_items").select("*, food_items(calories, protein, carbs, fat)").eq("user_id", user.id),
        supabase.from("food_items").select("*"),
        supabase.from("exercise_logs").select("*").eq("user_id", user.id)
          .gte("log_date", format(startDate, "yyyy-MM-dd")),
        supabase.from("transactions").select("*").eq("user_id", user.id)
          .gte("transaction_date", format(startDate, "yyyy-MM-dd")),
        supabase.from("health_logs").select("*").eq("user_id", user.id)
          .gte("log_date", format(startDate, "yyyy-MM-dd")),
        supabase.from("user_badges").select("*").eq("user_id", user.id)
          .order("earned_at", { ascending: false }),
        supabase.from("calorie_goals").select("*").eq("user_id", user.id).single(),
        supabase.from("profiles").select("*").eq("user_id", user.id).single(),
      ]);

      const tasks = tasksRes.data || [];
      const habits = habitsRes.data || [];
      const habitLogs = habitLogsRes.data || [];
      const meals = mealsRes.data || [];
      const mealItems = mealItemsRes.data || [];
      const exercises = exerciseRes.data || [];
      const transactions = transactionsRes.data || [];
      const healthLogs = healthLogsRes.data || [];
      const badges = (badgesRes.data || []) as Achievement[];
      const calorieGoal = calorieGoalsRes.data?.daily_target || profileRes.data?.calorie_goal || 2000;

      // Calculate daily stats
      const daily: DayStats[] = dateRange.map((date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        const dayName = format(date, "EEE");
        const dayOfWeek = getDay(date);

        // Tasks
        const dayTasks = tasks.filter((t) => t.completed_at && format(new Date(t.completed_at), "yyyy-MM-dd") === dateStr);
        const totalTasksCreated = tasks.filter((t) => format(new Date(t.created_at), "yyyy-MM-dd") === dateStr);

        // Habits
        const dayHabitLogs = habitLogs.filter((l) => l.log_date === dateStr && !l.skipped);

        // Calories
        const dayMeals = meals.filter((m) => m.meal_date === dateStr);
        const dayMealIds = dayMeals.map((m) => m.id);
        const dayMealItems = mealItems.filter((mi) => dayMealIds.includes(mi.meal_id));
        const caloriesConsumed = dayMealItems.reduce((sum, mi) => {
          const foodItem = mi.food_items as any;
          return sum + (foodItem?.calories || 0) * (mi.quantity || 1);
        }, 0);

        const dayExercises = exercises.filter((e) => e.log_date === dateStr);
        const caloriesBurned = dayExercises.reduce((sum, e) => sum + e.calories_burned, 0);

        // Transactions
        const dayTransactions = transactions.filter((t) => t.transaction_date === dateStr);
        const spending = dayTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0);
        const income = dayTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + Number(t.amount), 0);

        // Health
        const dayHealth = healthLogs.find((h) => h.log_date === dateStr);
        const moodScores = { great: 100, good: 80, okay: 60, bad: 40, terrible: 20 };
        const moodScore = dayHealth?.mood ? moodScores[dayHealth.mood as keyof typeof moodScores] || 60 : 0;
        const waterScore = dayHealth?.water_intake_ml ? Math.min((dayHealth.water_intake_ml / 2000) * 100, 100) : 0;
        const sleepScore = dayHealth?.sleep_hours ? Math.min((dayHealth.sleep_hours / 8) * 100, 100) : 0;
        const healthScoreCalc = dayHealth ? Math.round((moodScore + waterScore + sleepScore) / 3) : 0;

        return {
          date: dateStr,
          day: dayName,
          dayOfWeek,
          tasksCompleted: dayTasks.length,
          totalTasks: totalTasksCreated.length,
          habitsCompleted: dayHabitLogs.length,
          totalHabits: habits.length,
          caloriesConsumed,
          caloriesBurned,
          calorieTarget: calorieGoal,
          spending,
          income,
          healthScore: healthScoreCalc,
        };
      });

      setDailyStats(daily);

      // Calculate weekly stats (last 4 weeks)
      const weekly: WeeklyStats[] = [];
      for (let i = 3; i >= 0; i--) {
        const weekStart = subDays(endDate, (i + 1) * 7);
        const weekEnd = subDays(endDate, i * 7);
        const weekDays = daily.filter((d) => {
          const date = new Date(d.date);
          return date >= weekStart && date < weekEnd;
        });

        const tasksCompleted = weekDays.reduce((sum, d) => sum + d.tasksCompleted, 0);
        const habitsCompleted = weekDays.reduce((sum, d) => sum + d.habitsCompleted, 0);
        const totalHabits = weekDays.reduce((sum, d) => sum + d.totalHabits, 0);
        const caloriesConsumed = weekDays.reduce((sum, d) => sum + d.caloriesConsumed, 0);
        const calorieTarget = weekDays.reduce((sum, d) => sum + d.calorieTarget, 0);
        const spending = weekDays.reduce((sum, d) => sum + d.spending, 0);
        const budgetGoal = profileRes.data?.budget_goal || 10000;

        const productivityRate = totalHabits > 0 ? Math.round((habitsCompleted / totalHabits) * 100) : 0;
        const calorieRate = calorieTarget > 0 ? Math.round(Math.max(0, 100 - Math.abs(100 - (caloriesConsumed / calorieTarget) * 100))) : 0;
        const spendingRate = budgetGoal > 0 ? Math.round(Math.max(0, 100 - (spending / (budgetGoal / 4)) * 100)) : 100;

        weekly.push({
          week: `Week ${4 - i}`,
          productivity: productivityRate,
          calories: calorieRate,
          spending: spendingRate,
          streak: Math.min(tasksCompleted + habitsCompleted, 100),
        });
      }
      setWeeklyStats(weekly);

      // Calculate productivity score
      const totalTasksCompleted = tasks.filter((t) => t.status === "done").length;
      const totalHabitsCompleted = habitLogs.filter((l) => !l.skipped).length;
      const totalPossibleHabits = habits.length * 30; // 30 days
      
      const taskScore = tasks.length > 0 ? (totalTasksCompleted / Math.max(tasks.length, 1)) * 100 : 0;
      const habitScore = totalPossibleHabits > 0 ? (totalHabitsCompleted / totalPossibleHabits) * 100 : 0;
      const prodScore = Math.round((taskScore * 0.6 + habitScore * 0.4));
      setProductivityScore(prodScore);

      // Find best day of week
      const dayPerformance: Record<number, { completed: number; total: number }> = {};
      daily.forEach((d) => {
        if (!dayPerformance[d.dayOfWeek]) {
          dayPerformance[d.dayOfWeek] = { completed: 0, total: 0 };
        }
        dayPerformance[d.dayOfWeek].completed += d.tasksCompleted + d.habitsCompleted;
        dayPerformance[d.dayOfWeek].total += 1;
      });

      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      let bestDayIndex = 0;
      let bestDayScore = 0;
      Object.entries(dayPerformance).forEach(([day, stats]) => {
        const avg = stats.total > 0 ? stats.completed / stats.total : 0;
        if (avg > bestDayScore) {
          bestDayScore = avg;
          bestDayIndex = parseInt(day);
        }
      });
      setBestDay({ day: dayNames[bestDayIndex], score: Math.round(bestDayScore) });

      // Calculate health score
      const recentHealthLogs = healthLogs.slice(-7);
      if (recentHealthLogs.length > 0) {
        const avgHealthScore = recentHealthLogs.reduce((sum, h) => {
          const moodScores = { great: 100, good: 80, okay: 60, bad: 40, terrible: 20 };
          const moodScore = h.mood ? moodScores[h.mood as keyof typeof moodScores] || 60 : 60;
          const waterScore = h.water_intake_ml ? Math.min((h.water_intake_ml / 2000) * 100, 100) : 50;
          const sleepScore = h.sleep_hours ? Math.min((Number(h.sleep_hours) / 8) * 100, 100) : 50;
          return sum + (moodScore + waterScore + sleepScore) / 3;
        }, 0) / recentHealthLogs.length;
        setHealthScore(Math.round(avgHealthScore));
      }

      // Performance breakdown
      const budgetGoal = profileRes.data?.budget_goal || 10000;
      const totalSpending = transactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + Number(t.amount), 0);
      const financeScore = budgetGoal > 0 ? Math.round(Math.max(0, 100 - (totalSpending / budgetGoal) * 100)) : 50;
      
      const caloriesAvg = daily.reduce((sum, d) => sum + d.caloriesConsumed, 0) / Math.max(daily.length, 1);
      const fitnessScore = calorieGoal > 0 ? Math.round(Math.max(0, 100 - Math.abs(100 - (caloriesAvg / calorieGoal) * 100))) : 50;

      setPerformanceData([
        { subject: "Tasks", score: Math.round(taskScore), fullMark: 100 },
        { subject: "Health", score: healthScore || 50, fullMark: 100 },
        { subject: "Fitness", score: fitnessScore, fullMark: 100 },
        { subject: "Finance", score: financeScore, fullMark: 100 },
        { subject: "Habits", score: Math.round(habitScore), fullMark: 100 },
      ]);

      setAchievements(badges);

      // Monthly report
      const thisMonth = startOfMonth(new Date());
      const thisMonthEnd = endOfMonth(new Date());
      const monthDays = daily.filter((d) => {
        const date = new Date(d.date);
        return date >= thisMonth && date <= thisMonthEnd;
      });

      const monthTasks = tasks.filter((t) => 
        t.status === "done" && t.completed_at && 
        new Date(t.completed_at) >= thisMonth && new Date(t.completed_at) <= thisMonthEnd
      ).length;
      
      const monthHabits = habitLogs.filter((l) => {
        const date = new Date(l.log_date);
        return date >= thisMonth && date <= thisMonthEnd && !l.skipped;
      }).length;

      const monthSpending = monthDays.reduce((sum, d) => sum + d.spending, 0);
      const monthIncome = monthDays.reduce((sum, d) => sum + d.income, 0);
      const monthCalories = monthDays.reduce((sum, d) => sum + d.caloriesConsumed, 0);
      const activeDays = monthDays.filter((d) => d.tasksCompleted > 0 || d.habitsCompleted > 0).length;

      setMonthlyReport({
        month: format(new Date(), "MMMM yyyy"),
        tasksCompleted: monthTasks,
        habitsCompleted: monthHabits,
        totalSpending: monthSpending,
        totalIncome: monthIncome,
        savingsRate: monthIncome > 0 ? Math.round(((monthIncome - monthSpending) / monthIncome) * 100) : 0,
        avgCalories: monthDays.length > 0 ? Math.round(monthCalories / monthDays.length) : 0,
        avgHealthScore: monthDays.length > 0 ? Math.round(monthDays.reduce((sum, d) => sum + d.healthScore, 0) / monthDays.length) : 0,
        activeDays,
      });

    } catch (error) {
      console.error("Error fetching analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  // Get spending vs savings trend
  const getSpendingVsSavings = () => {
    const last6Months: { month: string; spending: number; savings: number }[] = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const monthStr = format(monthDate, "MMM");
      const monthDays = dailyStats.filter((d) => {
        const date = new Date(d.date);
        return date.getMonth() === monthDate.getMonth() && date.getFullYear() === monthDate.getFullYear();
      });

      const spending = monthDays.reduce((sum, d) => sum + d.spending, 0);
      const income = monthDays.reduce((sum, d) => sum + d.income, 0);

      last6Months.push({
        month: monthStr,
        spending,
        savings: Math.max(0, income - spending),
      });
    }

    return last6Months;
  };

  // Get calories consumed vs burned trend
  const getCalorieTrend = () => {
    return dailyStats.slice(-7).map((d) => ({
      day: d.day,
      consumed: d.caloriesConsumed,
      burned: d.caloriesBurned,
      target: d.calorieTarget,
    }));
  };

  // Get streak data for last 6 months
  const getStreakTrend = () => {
    const last6Months: { month: string; streak: number }[] = [];
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const monthStr = format(monthDate, "MMM");
      const monthDays = dailyStats.filter((d) => {
        const date = new Date(d.date);
        return date.getMonth() === monthDate.getMonth() && date.getFullYear() === monthDate.getFullYear();
      });

      const streak = monthDays.reduce((sum, d) => sum + d.habitsCompleted, 0);
      last6Months.push({ month: monthStr, streak });
    }

    return last6Months;
  };

  return {
    loading,
    dailyStats,
    weeklyStats,
    performanceData,
    achievements,
    monthlyReport,
    productivityScore,
    bestDay,
    healthScore,
    getSpendingVsSavings,
    getCalorieTrend,
    getStreakTrend,
    refetch: fetchAnalytics,
  };
};
