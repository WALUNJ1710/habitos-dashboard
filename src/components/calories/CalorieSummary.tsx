import { Progress } from "@/components/ui/progress";
import { CalorieGoal } from "@/hooks/useCalories";
import { Utensils, Flame, Target, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface CalorieSummaryProps {
  goal: CalorieGoal | null;
  consumed: number;
  burned: number;
  macros: { protein: number; carbs: number; fat: number };
}

export const CalorieSummary = ({ goal, consumed, burned, macros }: CalorieSummaryProps) => {
  const dailyTarget = goal?.daily_target || 2000;
  const netCalories = consumed - burned;
  const remaining = dailyTarget - netCalories;
  const progress = Math.min((consumed / dailyTarget) * 100, 100);

  const proteinTarget = goal?.protein_target || 150;
  const carbsTarget = goal?.carbs_target || 250;
  const fatTarget = goal?.fat_target || 65;

  const getModeLabel = () => {
    switch (goal?.goal_mode) {
      case "cutting":
        return "🔥 Cutting";
      case "bulking":
        return "💪 Bulking";
      default:
        return "⚖️ Maintenance";
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-neon-orange flex items-center justify-center">
              <Utensils className="h-5 w-5 text-primary-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Consumed</p>
          </div>
          <p className="text-3xl font-bold">{consumed.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">kcal</p>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-neon-pink flex items-center justify-center">
              <Flame className="h-5 w-5 text-primary-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Burned</p>
          </div>
          <p className="text-3xl font-bold">{burned.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">kcal</p>
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-neon-cyan flex items-center justify-center">
              <Target className="h-5 w-5 text-primary-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Daily Goal</p>
          </div>
          <p className="text-3xl font-bold">{dailyTarget.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">{getModeLabel()}</p>
        </div>

        <div
          className={cn(
            "glass-card rounded-xl p-5",
            remaining > 0 ? "border-l-4 border-success" : "border-l-4 border-destructive"
          )}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-neon-green flex items-center justify-center">
              <TrendingUp className="h-5 w-5 text-primary-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">Remaining</p>
          </div>
          <p className={cn("text-3xl font-bold", remaining > 0 ? "text-success" : "text-destructive")}>
            {remaining.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">kcal</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Daily Progress</h3>
          <span className="text-sm text-muted-foreground">{progress.toFixed(0)}%</span>
        </div>
        <Progress value={progress} className="h-4" />
        <p className="text-sm text-muted-foreground mt-2">
          {consumed} / {dailyTarget} kcal consumed (net: {netCalories} kcal)
        </p>
      </div>

      {/* Macro Breakdown */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold mb-4">Macro Breakdown</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Protein</span>
              <span className="text-sm text-muted-foreground">
                {macros.protein.toFixed(0)}g / {proteinTarget}g
              </span>
            </div>
            <Progress
              value={Math.min((macros.protein / proteinTarget) * 100, 100)}
              className="h-2 bg-secondary [&>div]:bg-neon-pink"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Carbs</span>
              <span className="text-sm text-muted-foreground">
                {macros.carbs.toFixed(0)}g / {carbsTarget}g
              </span>
            </div>
            <Progress
              value={Math.min((macros.carbs / carbsTarget) * 100, 100)}
              className="h-2 bg-secondary [&>div]:bg-neon-orange"
            />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Fat</span>
              <span className="text-sm text-muted-foreground">
                {macros.fat.toFixed(0)}g / {fatTarget}g
              </span>
            </div>
            <Progress
              value={Math.min((macros.fat / fatTarget) * 100, 100)}
              className="h-2 bg-secondary [&>div]:bg-neon-cyan"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
