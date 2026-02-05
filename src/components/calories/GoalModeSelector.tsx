import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalorieGoal } from "@/hooks/useCalories";
import { Target, TrendingDown, TrendingUp, Scale } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface GoalModeSelectorProps {
  goal: CalorieGoal | null;
  onUpdateGoal: (updates: Partial<CalorieGoal>) => Promise<{ error?: Error | null }>;
}

const goalModes = [
  { value: "cutting", label: "Cutting", icon: TrendingDown, color: "text-destructive", desc: "Lose fat" },
  { value: "maintenance", label: "Maintenance", icon: Scale, color: "text-warning", desc: "Maintain" },
  { value: "bulking", label: "Bulking", icon: TrendingUp, color: "text-success", desc: "Gain muscle" },
] as const;

export const GoalModeSelector = ({ goal, onUpdateGoal }: GoalModeSelectorProps) => {
  const [dailyTarget, setDailyTarget] = useState(goal?.daily_target?.toString() || "2000");
  const [proteinTarget, setProteinTarget] = useState(goal?.protein_target?.toString() || "150");
  const [carbsTarget, setCarbsTarget] = useState(goal?.carbs_target?.toString() || "250");
  const [fatTarget, setFatTarget] = useState(goal?.fat_target?.toString() || "65");
  const [saving, setSaving] = useState(false);

  const handleModeChange = async (mode: "cutting" | "bulking" | "maintenance") => {
    setSaving(true);
    await onUpdateGoal({ goal_mode: mode });
    setSaving(false);
  };

  const handleSaveTargets = async () => {
    setSaving(true);
    await onUpdateGoal({
      daily_target: parseInt(dailyTarget) || 2000,
      protein_target: parseInt(proteinTarget) || 150,
      carbs_target: parseInt(carbsTarget) || 250,
      fat_target: parseInt(fatTarget) || 65,
    });
    setSaving(false);
  };

  return (
    <div className="glass-card rounded-xl p-6 space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
          <Target className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold">Goal Settings</h3>
          <p className="text-sm text-muted-foreground">Set your nutrition targets</p>
        </div>
      </div>

      {/* Goal Mode */}
      <div className="grid grid-cols-3 gap-3">
        {goalModes.map((mode) => (
          <button
            key={mode.value}
            onClick={() => handleModeChange(mode.value)}
            disabled={saving}
            className={cn(
              "p-4 rounded-lg border-2 transition-all flex flex-col items-center gap-2",
              goal?.goal_mode === mode.value
                ? "border-primary bg-primary/10"
                : "border-border hover:border-primary/50"
            )}
          >
            <mode.icon className={cn("h-6 w-6", mode.color)} />
            <span className="font-medium text-sm">{mode.label}</span>
            <span className="text-xs text-muted-foreground">{mode.desc}</span>
          </button>
        ))}
      </div>

      {/* Targets */}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <Label>Daily Calorie Target</Label>
          <Input
            type="number"
            value={dailyTarget}
            onChange={(e) => setDailyTarget(e.target.value)}
            className="bg-secondary/50 mt-1"
          />
        </div>
        <div>
          <Label>Protein (g)</Label>
          <Input
            type="number"
            value={proteinTarget}
            onChange={(e) => setProteinTarget(e.target.value)}
            className="bg-secondary/50 mt-1"
          />
        </div>
        <div>
          <Label>Carbs (g)</Label>
          <Input
            type="number"
            value={carbsTarget}
            onChange={(e) => setCarbsTarget(e.target.value)}
            className="bg-secondary/50 mt-1"
          />
        </div>
        <div>
          <Label>Fat (g)</Label>
          <Input
            type="number"
            value={fatTarget}
            onChange={(e) => setFatTarget(e.target.value)}
            className="bg-secondary/50 mt-1"
          />
        </div>
        <Button onClick={handleSaveTargets} disabled={saving} className="bg-gradient-primary">
          {saving ? "Saving..." : "Save Targets"}
        </Button>
      </div>
    </div>
  );
};
