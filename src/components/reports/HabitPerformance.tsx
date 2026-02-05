import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts";
import { Target } from "lucide-react";

interface PerformanceData {
  subject: string;
  score: number;
  fullMark: number;
}

interface HabitPerformanceProps {
  data: PerformanceData[];
}

export const HabitPerformance = ({ data }: HabitPerformanceProps) => {
  const avgScore = data.length > 0 
    ? Math.round(data.reduce((sum, d) => sum + d.score, 0) / data.length)
    : 0;

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neon-purple flex items-center justify-center">
            <Target className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">Performance Breakdown</h3>
            <p className="text-sm text-muted-foreground">All categories analysis</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-neon-purple">{avgScore}%</p>
          <p className="text-xs text-muted-foreground">Average</p>
        </div>
      </div>

      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data}>
            <PolarGrid stroke="hsl(var(--border))" />
            <PolarAngleAxis 
              dataKey="subject" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={12} 
            />
            <PolarRadiusAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={10}
              domain={[0, 100]}
            />
            <Radar
              name="Performance"
              dataKey="score"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-5 gap-2 mt-4">
        {data.map((item) => (
          <div key={item.subject} className="text-center p-2 rounded-lg bg-secondary/30">
            <p className="text-lg font-bold text-primary">{item.score}%</p>
            <p className="text-xs text-muted-foreground">{item.subject}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
