import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { DayActivity } from "@/hooks/useHabits";

interface HabitHeatmapProps {
  data: DayActivity[];
}

const getHeatmapColor = (completedCount: number, totalHabits: number) => {
  if (totalHabits === 0) return "bg-secondary/50";
  const rate = completedCount / totalHabits;
  if (rate === 0) return "bg-secondary/50";
  if (rate <= 0.25) return "bg-neon-green/20";
  if (rate <= 0.5) return "bg-neon-green/40";
  if (rate <= 0.75) return "bg-neon-green/60";
  if (rate < 1) return "bg-neon-green/80";
  return "bg-neon-green";
};

export const HabitHeatmap = ({ data }: HabitHeatmapProps) => {
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">Activity Heatmap</h3>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm bg-secondary/50" />
            <div className="w-3 h-3 rounded-sm bg-neon-green/20" />
            <div className="w-3 h-3 rounded-sm bg-neon-green/40" />
            <div className="w-3 h-3 rounded-sm bg-neon-green/60" />
            <div className="w-3 h-3 rounded-sm bg-neon-green" />
          </div>
          <span>More</span>
        </div>
      </div>
      <div className="flex flex-wrap gap-1">
        {data.map((day, i) => (
          <div
            key={i}
            className={cn(
              "w-3 h-3 rounded-sm transition-all hover:scale-125 cursor-pointer",
              getHeatmapColor(day.completedCount, day.totalHabits)
            )}
            title={`${format(day.date, "MMM d, yyyy")}: ${day.completedCount}/${day.totalHabits} habits completed`}
          />
        ))}
      </div>
    </div>
  );
};
