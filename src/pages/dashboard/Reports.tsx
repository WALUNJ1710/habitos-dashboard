import { useApp } from "@/contexts/AppContext";
import { useAnalytics } from "@/hooks/useAnalytics";
import { ProductivityScore } from "@/components/reports/ProductivityScore";
import { HealthScoreSummary } from "@/components/reports/HealthScoreSummary";
import { HabitPerformance } from "@/components/reports/HabitPerformance";
import { SpendingSavingsTrend } from "@/components/reports/SpendingSavingsTrend";
import { CalorieComparisonChart } from "@/components/reports/CalorieComparisonChart";
import { MonthlyDashboard } from "@/components/reports/MonthlyDashboard";
import { AchievementHistory } from "@/components/reports/AchievementHistory";
import { WeeklyTrendChart } from "@/components/reports/WeeklyTrendChart";
import { StreakConsistency } from "@/components/reports/StreakConsistency";
import { Skeleton } from "@/components/ui/skeleton";

const Reports = () => {
  const { user } = useApp();
  const {
    loading,
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
  } = useAnalytics(user);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">Track your overall performance</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1">Track your overall performance</p>
      </div>

      {/* Top Row - Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ProductivityScore score={productivityScore} bestDay={bestDay} />
        <HealthScoreSummary score={healthScore} />
        <AchievementHistory achievements={achievements} />
      </div>

      {/* Weekly Trends */}
      <WeeklyTrendChart data={weeklyStats} />

      {/* Middle Row - Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <HabitPerformance data={performanceData} />
        <StreakConsistency data={getStreakTrend()} />
      </div>

      {/* Financial & Calorie Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingSavingsTrend data={getSpendingVsSavings()} />
        <CalorieComparisonChart data={getCalorieTrend()} />
      </div>

      {/* Monthly Dashboard */}
      <MonthlyDashboard report={monthlyReport} />
    </div>
  );
};

export default Reports;
