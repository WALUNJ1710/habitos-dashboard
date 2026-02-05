import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { TrendingUp } from "lucide-react";

interface WeeklyStats {
  week: string;
  productivity: number;
  calories: number;
  spending: number;
  streak: number;
}

interface WeeklyTrendChartProps {
  data: WeeklyStats[];
}

export const WeeklyTrendChart = ({ data }: WeeklyTrendChartProps) => {
  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
          <TrendingUp className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold">Weekly Performance Trends</h3>
          <p className="text-sm text-muted-foreground">Last 4 weeks comparison</p>
        </div>
      </div>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="week" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              formatter={(value: number) => `${value}%`}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="productivity" 
              stroke="hsl(var(--primary))" 
              strokeWidth={2} 
              name="Productivity"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="calories" 
              stroke="hsl(var(--neon-cyan))" 
              strokeWidth={2} 
              name="Calorie Goals"
              dot={{ r: 4 }}
            />
            <Line 
              type="monotone" 
              dataKey="spending" 
              stroke="hsl(var(--neon-purple))" 
              strokeWidth={2} 
              name="Budget Adherence"
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
