import { TrendingUp, Calendar, Target, Lightbulb } from "lucide-react";

interface HabitInsightsProps {
  insights: {
    bestDay: string;
    bestDayRate: number;
    overallSuccessRate: number;
  } | null;
  stats: {
    totalStreak: number;
    longestStreak: number;
    completedToday: number;
    totalHabits: number;
    completionRate: number;
  };
}

export const HabitInsights = ({ insights, stats }: HabitInsightsProps) => {
  if (!insights) {
    return (
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold mb-4 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-neon-orange" />
          Habit Insights
        </h3>
        <p className="text-muted-foreground text-sm">
          Complete habits for a few days to see personalized insights!
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="font-semibold mb-4 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-neon-orange" />
        Habit Insights
      </h3>

      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
          <div className="w-10 h-10 rounded-lg bg-neon-green/20 flex items-center justify-center">
            <Calendar className="h-5 w-5 text-neon-green" />
          </div>
          <div>
            <p className="font-medium">Best Performance Day</p>
            <p className="text-sm text-muted-foreground">
              You perform best on <span className="text-neon-green font-semibold">{insights.bestDay}s</span> with{" "}
              {insights.bestDayRate}% completion rate
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
          <div className="w-10 h-10 rounded-lg bg-neon-purple/20 flex items-center justify-center">
            <Target className="h-5 w-5 text-neon-purple" />
          </div>
          <div>
            <p className="font-medium">Overall Success Rate</p>
            <p className="text-sm text-muted-foreground">
              Your 90-day habit success rate is{" "}
              <span className="text-neon-purple font-semibold">{insights.overallSuccessRate}%</span>
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30">
          <div className="w-10 h-10 rounded-lg bg-neon-cyan/20 flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-neon-cyan" />
          </div>
          <div>
            <p className="font-medium">Streak Progress</p>
            <p className="text-sm text-muted-foreground">
              Current best: <span className="text-neon-orange font-semibold">{stats.totalStreak} days</span>
              {stats.totalStreak < stats.longestStreak && (
                <> • {stats.longestStreak - stats.totalStreak} days to beat your record!</>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
