import { TrendingUp, Zap, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductivityScoreProps {
  score: number;
  bestDay: { day: string; score: number };
}

export const ProductivityScore = ({ score, bestDay }: ProductivityScoreProps) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  const getScoreGrade = (score: number) => {
    if (score >= 90) return "A+";
    if (score >= 80) return "A";
    if (score >= 70) return "B";
    if (score >= 60) return "C";
    if (score >= 50) return "D";
    return "F";
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
          <Zap className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold">Productivity Score</h3>
          <p className="text-sm text-muted-foreground">Based on tasks & habits</p>
        </div>
      </div>

      <div className="flex items-end gap-4 mb-4">
        <span className={cn("text-5xl font-bold", getScoreColor(score))}>
          {score}
        </span>
        <span className="text-muted-foreground text-lg mb-2">/100</span>
        <span className={cn("text-2xl font-bold mb-1 ml-auto px-3 py-1 rounded-lg", 
          score >= 70 ? "bg-success/20 text-success" : "bg-warning/20 text-warning"
        )}>
          {getScoreGrade(score)}
        </span>
      </div>

      <div className="h-2 bg-secondary rounded-full overflow-hidden mb-6">
        <div 
          className={cn("h-full rounded-full transition-all", 
            score >= 80 ? "bg-success" : score >= 60 ? "bg-warning" : "bg-destructive"
          )}
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
        <Calendar className="h-5 w-5 text-neon-orange" />
        <div>
          <p className="text-sm font-medium">Most Productive Day</p>
          <p className="text-lg font-bold text-neon-orange">{bestDay.day}</p>
        </div>
        <TrendingUp className="h-5 w-5 text-success ml-auto" />
      </div>
    </div>
  );
};
