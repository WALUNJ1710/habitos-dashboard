import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Utensils, Dumbbell } from "lucide-react";

interface CalorieData {
  day: string;
  consumed: number;
  burned: number;
  target: number;
}

interface CalorieComparisonChartProps {
  data: CalorieData[];
}

export const CalorieComparisonChart = ({ data }: CalorieComparisonChartProps) => {
  const avgConsumed = data.length > 0 
    ? Math.round(data.reduce((sum, d) => sum + d.consumed, 0) / data.length)
    : 0;
  const avgBurned = data.length > 0 
    ? Math.round(data.reduce((sum, d) => sum + d.burned, 0) / data.length)
    : 0;
  const target = data[0]?.target || 2000;

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neon-cyan flex items-center justify-center">
            <Utensils className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">Calories Consumed vs Burned</h3>
            <p className="text-sm text-muted-foreground">Last 7 days</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-3 rounded-lg bg-secondary/30">
          <Utensils className="h-4 w-4 mx-auto mb-1 text-neon-cyan" />
          <p className="text-lg font-bold">{avgConsumed}</p>
          <p className="text-xs text-muted-foreground">Avg Consumed</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-secondary/30">
          <Dumbbell className="h-4 w-4 mx-auto mb-1 text-neon-orange" />
          <p className="text-lg font-bold">{avgBurned}</p>
          <p className="text-xs text-muted-foreground">Avg Burned</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-secondary/30">
          <p className="text-lg font-bold text-primary">{target}</p>
          <p className="text-xs text-muted-foreground">Daily Target</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <ReferenceLine y={target} stroke="hsl(var(--primary))" strokeDasharray="3 3" />
            <Bar 
              dataKey="consumed" 
              fill="hsl(var(--neon-cyan))" 
              name="Consumed" 
              radius={[4, 4, 0, 0]} 
            />
            <Bar 
              dataKey="burned" 
              fill="hsl(var(--neon-orange))" 
              name="Burned" 
              radius={[4, 4, 0, 0]} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neon-cyan" />
          <span className="text-sm text-muted-foreground">Consumed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-neon-orange" />
          <span className="text-sm text-muted-foreground">Burned</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-0.5 bg-primary" />
          <span className="text-sm text-muted-foreground">Target</span>
        </div>
      </div>
    </div>
  );
};
