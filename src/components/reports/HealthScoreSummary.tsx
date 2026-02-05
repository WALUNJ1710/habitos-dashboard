import { Heart, Activity, Moon, Droplets } from "lucide-react";
import { cn } from "@/lib/utils";

interface HealthScoreSummaryProps {
  score: number;
}

export const HealthScoreSummary = ({ score }: HealthScoreSummaryProps) => {
  const getHealthStatus = (score: number) => {
    if (score >= 80) return { label: "Excellent", color: "text-success", bg: "bg-success" };
    if (score >= 60) return { label: "Good", color: "text-neon-green", bg: "bg-neon-green" };
    if (score >= 40) return { label: "Fair", color: "text-warning", bg: "bg-warning" };
    return { label: "Needs Improvement", color: "text-destructive", bg: "bg-destructive" };
  };

  const status = getHealthStatus(score);

  const healthMetrics = [
    { icon: Heart, label: "Mood", color: "text-neon-pink" },
    { icon: Droplets, label: "Hydration", color: "text-neon-cyan" },
    { icon: Moon, label: "Sleep", color: "text-neon-purple" },
    { icon: Activity, label: "Activity", color: "text-neon-green" },
  ];

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-neon-pink flex items-center justify-center">
          <Heart className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold">Health Score</h3>
          <p className="text-sm text-muted-foreground">7-day average</p>
        </div>
      </div>

      <div className="relative flex items-center justify-center mb-6">
        <svg className="w-32 h-32 -rotate-90">
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke="hsl(var(--secondary))"
            strokeWidth="12"
          />
          <circle
            cx="64"
            cy="64"
            r="56"
            fill="none"
            stroke={score >= 80 ? "hsl(var(--success))" : score >= 60 ? "hsl(var(--neon-green))" : "hsl(var(--warning))"}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 352} 352`}
            className="transition-all duration-1000"
          />
        </svg>
        <div className="absolute flex flex-col items-center">
          <span className={cn("text-3xl font-bold", status.color)}>{score}</span>
          <span className="text-xs text-muted-foreground">{status.label}</span>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2">
        {healthMetrics.map((metric) => (
          <div key={metric.label} className="flex flex-col items-center p-2 rounded-lg bg-secondary/30">
            <metric.icon className={cn("h-4 w-4 mb-1", metric.color)} />
            <span className="text-xs text-muted-foreground">{metric.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
