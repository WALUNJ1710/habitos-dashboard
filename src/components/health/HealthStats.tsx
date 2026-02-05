import { Scale, Activity, Droplet, Moon, Footprints, Heart } from "lucide-react";
import { HealthLog } from "@/hooks/useHealthLogs";

interface HealthStatsProps {
  todayLog: HealthLog | null;
  profile: {
    weight?: number | null;
    height?: number | null;
    goal_weight?: number | null;
  } | null;
  weeklyStats: {
    avgWater: number;
    avgSleep: string;
    avgSteps: number;
  };
}

export const HealthStats = ({ todayLog, profile, weeklyStats }: HealthStatsProps) => {
  const currentWeight = todayLog?.weight || profile?.weight || 0;
  const height = profile?.height || 170;
  const heightM = height / 100;
  const bmi = currentWeight > 0 ? currentWeight / (heightM * heightM) : 0;

  const getBmiCategory = (bmi: number) => {
    if (bmi === 0) return { label: "N/A", color: "text-muted-foreground" };
    if (bmi < 18.5) return { label: "Underweight", color: "text-blue-400" };
    if (bmi < 25) return { label: "Normal", color: "text-neon-green" };
    if (bmi < 30) return { label: "Overweight", color: "text-yellow-400" };
    return { label: "Obese", color: "text-red-400" };
  };

  const bmiCategory = getBmiCategory(bmi);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Scale className="h-4 w-4 text-neon-purple" />
          <span className="text-xs text-muted-foreground">Weight</span>
        </div>
        <p className="text-xl font-bold">{currentWeight || "—"} kg</p>
      </div>

      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Activity className="h-4 w-4 text-neon-green" />
          <span className="text-xs text-muted-foreground">BMI</span>
        </div>
        <p className="text-xl font-bold">{bmi > 0 ? bmi.toFixed(1) : "—"}</p>
        <p className={`text-xs ${bmiCategory.color}`}>{bmiCategory.label}</p>
      </div>

      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Droplet className="h-4 w-4 text-neon-cyan" />
          <span className="text-xs text-muted-foreground">Water Today</span>
        </div>
        <p className="text-xl font-bold">{todayLog?.water_intake_ml || 0} ml</p>
      </div>

      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Moon className="h-4 w-4 text-indigo-400" />
          <span className="text-xs text-muted-foreground">Sleep (Avg)</span>
        </div>
        <p className="text-xl font-bold">{weeklyStats.avgSleep}h</p>
      </div>

      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Footprints className="h-4 w-4 text-neon-green" />
          <span className="text-xs text-muted-foreground">Steps (Avg)</span>
        </div>
        <p className="text-xl font-bold">{weeklyStats.avgSteps.toLocaleString()}</p>
      </div>

      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <Heart className="h-4 w-4 text-red-400" />
          <span className="text-xs text-muted-foreground">Heart Rate</span>
        </div>
        <p className="text-xl font-bold">{todayLog?.heart_rate || "—"} bpm</p>
      </div>
    </div>
  );
};
