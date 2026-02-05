import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Moon, Footprints, Heart, Scale } from "lucide-react";
import { toast } from "sonner";

interface QuickLogProps {
  todayLog: {
    sleep_hours: number | null;
    steps: number;
    heart_rate: number | null;
    weight: number | null;
  } | null;
  onLogSleep: (hours: number) => Promise<{ error?: any }>;
  onLogSteps: (steps: number) => Promise<{ error?: any }>;
  onLogHeartRate: (rate: number) => Promise<{ error?: any }>;
  onLogWeight: (weight: number) => Promise<{ error?: any }>;
}

export const QuickHealthLogs = ({
  todayLog,
  onLogSleep,
  onLogSteps,
  onLogHeartRate,
  onLogWeight,
}: QuickLogProps) => {
  const [sleep, setSleep] = useState(todayLog?.sleep_hours?.toString() || "");
  const [steps, setSteps] = useState(todayLog?.steps?.toString() || "");
  const [heartRate, setHeartRate] = useState(todayLog?.heart_rate?.toString() || "");
  const [weight, setWeight] = useState(todayLog?.weight?.toString() || "");
  const [loading, setLoading] = useState<string | null>(null);

  const handleLog = async (type: string, value: string, logFn: (val: number) => Promise<any>) => {
    const numVal = parseFloat(value);
    if (isNaN(numVal) || numVal <= 0) {
      toast.error("Please enter a valid number");
      return;
    }

    setLoading(type);
    const result = await logFn(numVal);
    setLoading(null);

    if (result.error) {
      toast.error("Failed to log");
    } else {
      toast.success("Logged successfully!");
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Sleep */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <Moon className="h-4 w-4 text-indigo-400" />
          </div>
          <span className="font-medium">Sleep</span>
        </div>
        <div className="flex gap-2">
          <Input
            type="number"
            step="0.5"
            placeholder="Hours"
            value={sleep}
            onChange={(e) => setSleep(e.target.value)}
            className="bg-secondary/50"
          />
          <Button
            size="sm"
            onClick={() => handleLog("sleep", sleep, onLogSleep)}
            disabled={loading === "sleep"}
          >
            Log
          </Button>
        </div>
        {todayLog?.sleep_hours && (
          <p className="text-xs text-muted-foreground mt-2">
            Today: {todayLog.sleep_hours}h
          </p>
        )}
      </div>

      {/* Steps */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-neon-green/20 flex items-center justify-center">
            <Footprints className="h-4 w-4 text-neon-green" />
          </div>
          <span className="font-medium">Steps</span>
        </div>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Steps"
            value={steps}
            onChange={(e) => setSteps(e.target.value)}
            className="bg-secondary/50"
          />
          <Button
            size="sm"
            onClick={() => handleLog("steps", steps, onLogSteps)}
            disabled={loading === "steps"}
          >
            Log
          </Button>
        </div>
        {todayLog?.steps ? (
          <p className="text-xs text-muted-foreground mt-2">Today: {todayLog.steps.toLocaleString()}</p>
        ) : null}
      </div>

      {/* Heart Rate */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
            <Heart className="h-4 w-4 text-red-400" />
          </div>
          <span className="font-medium">Heart Rate</span>
        </div>
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="BPM"
            value={heartRate}
            onChange={(e) => setHeartRate(e.target.value)}
            className="bg-secondary/50"
          />
          <Button
            size="sm"
            onClick={() => handleLog("heart", heartRate, onLogHeartRate)}
            disabled={loading === "heart"}
          >
            Log
          </Button>
        </div>
        {todayLog?.heart_rate && (
          <p className="text-xs text-muted-foreground mt-2">
            Today: {todayLog.heart_rate} bpm
          </p>
        )}
      </div>

      {/* Weight */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-lg bg-neon-purple/20 flex items-center justify-center">
            <Scale className="h-4 w-4 text-neon-purple" />
          </div>
          <span className="font-medium">Weight</span>
        </div>
        <div className="flex gap-2">
          <Input
            type="number"
            step="0.1"
            placeholder="kg"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="bg-secondary/50"
          />
          <Button
            size="sm"
            onClick={() => handleLog("weight", weight, onLogWeight)}
            disabled={loading === "weight"}
          >
            Log
          </Button>
        </div>
        {todayLog?.weight && (
          <p className="text-xs text-muted-foreground mt-2">Today: {todayLog.weight} kg</p>
        )}
      </div>
    </div>
  );
};
