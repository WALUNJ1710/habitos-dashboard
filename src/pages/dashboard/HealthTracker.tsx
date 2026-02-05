import { useApp } from "@/contexts/AppContext";
import { useHealthLogs } from "@/hooks/useHealthLogs";
import { HealthStats } from "@/components/health/HealthStats";
import { WaterTracker } from "@/components/health/WaterTracker";
import { MoodTracker } from "@/components/health/MoodTracker";
import { QuickHealthLogs } from "@/components/health/QuickHealthLogs";
import { MedicineReminderCard } from "@/components/health/MedicineReminder";
import { HealthTrends } from "@/components/health/HealthTrends";
import { Activity, Ruler, Target } from "lucide-react";

const HealthTracker = () => {
  const { user, profile } = useApp();
  const {
    todayLog,
    monthlyLogs,
    medicineReminders,
    medicineLogs,
    loading,
    addWater,
    setMood,
    logWeight,
    logSleep,
    logSteps,
    logHeartRate,
    addMedicineReminder,
    markMedicineTaken,
    deleteMedicineReminder,
    getWeeklyStats,
  } = useHealthLogs(user);

  const weeklyStats = getWeeklyStats();

  // BMI calculations
  const currentWeight = todayLog?.weight || profile?.weight || 0;
  const height = profile?.height || 170;
  const heightM = height / 100;
  const bmi = currentWeight > 0 ? currentWeight / (heightM * heightM) : 0;
  const goalWeight = profile?.goal_weight || 0;
  const weightToGo = currentWeight > 0 && goalWeight > 0 ? Math.abs(currentWeight - goalWeight) : 0;

  const getBmiCategory = (bmi: number) => {
    if (bmi === 0) return { label: "N/A", color: "text-muted-foreground" };
    if (bmi < 18.5) return { label: "Underweight", color: "text-blue-400" };
    if (bmi < 25) return { label: "Normal", color: "text-neon-green" };
    if (bmi < 30) return { label: "Overweight", color: "text-yellow-400" };
    return { label: "Obese", color: "text-red-400" };
  };

  const bmiCategory = getBmiCategory(bmi);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">Health Tracker</h1>
        <p className="text-muted-foreground mt-1">Monitor your daily health metrics</p>
      </div>

      {/* Quick Stats */}
      <HealthStats todayLog={todayLog} profile={profile} weeklyStats={weeklyStats} />

      {/* BMI Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-neon-green/20 flex items-center justify-center">
              <Activity className="h-5 w-5 text-neon-green" />
            </div>
            <p className="text-sm text-muted-foreground">Current BMI</p>
          </div>
          <p className="text-3xl font-bold">{bmi > 0 ? bmi.toFixed(1) : "—"}</p>
          <p className={`text-sm ${bmiCategory.color}`}>{bmiCategory.label}</p>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-neon-cyan/20 flex items-center justify-center">
              <Ruler className="h-5 w-5 text-neon-cyan" />
            </div>
            <p className="text-sm text-muted-foreground">Height</p>
          </div>
          <p className="text-3xl font-bold">{height} cm</p>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-neon-orange/20 flex items-center justify-center">
              <Target className="h-5 w-5 text-neon-orange" />
            </div>
            <p className="text-sm text-muted-foreground">Goal Weight</p>
          </div>
          <p className="text-3xl font-bold">{goalWeight || "—"} kg</p>
          {weightToGo > 0 && (
            <p className="text-sm text-muted-foreground">{weightToGo.toFixed(1)} kg to go</p>
          )}
        </div>
      </div>

      {/* Water & Mood Tracking */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WaterTracker
          currentMl={todayLog?.water_intake_ml || 0}
          onAddWater={addWater}
        />
        <MoodTracker
          currentMood={todayLog?.mood || null}
          onSetMood={setMood}
        />
      </div>

      {/* Quick Logs */}
      <div>
        <h3 className="font-semibold mb-4">Quick Logs</h3>
        <QuickHealthLogs
          todayLog={todayLog}
          onLogSleep={logSleep}
          onLogSteps={logSteps}
          onLogHeartRate={logHeartRate}
          onLogWeight={logWeight}
        />
      </div>

      {/* Medicine Reminders */}
      <MedicineReminderCard
        reminders={medicineReminders}
        logs={medicineLogs}
        onAdd={addMedicineReminder}
        onMarkTaken={markMedicineTaken}
        onDelete={deleteMedicineReminder}
      />

      {/* Health Trends */}
      <HealthTrends logs={monthlyLogs} goalWeight={goalWeight} />

      {/* BMI Scale */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold mb-4">BMI Scale</h3>
        <div className="relative h-8 rounded-full overflow-hidden">
          <div className="absolute inset-0 flex">
            <div className="flex-1 bg-blue-500" title="Underweight" />
            <div className="flex-1 bg-green-500" title="Normal" />
            <div className="flex-1 bg-yellow-500" title="Overweight" />
            <div className="flex-1 bg-red-500" title="Obese" />
          </div>
          {bmi > 0 && (
            <div
              className="absolute top-0 w-1 h-full bg-foreground"
              style={{ left: `${Math.min(Math.max((bmi - 15) / 25 * 100, 0), 100)}%` }}
            />
          )}
        </div>
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>15</span>
          <span>18.5</span>
          <span>25</span>
          <span>30</span>
          <span>40</span>
        </div>
        <div className="flex justify-between mt-1 text-xs">
          <span className="text-blue-400">Underweight</span>
          <span className="text-green-400">Normal</span>
          <span className="text-yellow-400">Overweight</span>
          <span className="text-red-400">Obese</span>
        </div>
      </div>
    </div>
  );
};

export default HealthTracker;
