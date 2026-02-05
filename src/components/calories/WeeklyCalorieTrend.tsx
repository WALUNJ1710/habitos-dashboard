import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  BarChart,
  Bar,
} from "recharts";
import { format, parseISO } from "date-fns";
import { CalorieGoal } from "@/hooks/useCalories";

interface WeeklyCalorieTrendProps {
  data: { date: string; consumed: number; burned: number }[];
  goal: CalorieGoal | null;
}

export const WeeklyCalorieTrend = ({ data, goal }: WeeklyCalorieTrendProps) => {
  const chartData = data.map((d) => ({
    ...d,
    day: format(parseISO(d.date), "EEE"),
    net: d.consumed - d.burned,
    target: goal?.daily_target || 2000,
  }));

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="font-semibold mb-6">Weekly Calorie Trend</h3>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))" }}
            />
            <Legend />
            <Bar dataKey="consumed" name="Consumed" fill="hsl(var(--neon-orange))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="burned" name="Burned" fill="hsl(var(--neon-pink))" radius={[4, 4, 0, 0]} />
            <Line
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="hsl(var(--neon-cyan))"
              strokeDasharray="5 5"
              dot={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border">
        <div className="text-center">
          <p className="text-2xl font-bold">
            {Math.round(data.reduce((sum, d) => sum + d.consumed, 0) / (data.length || 1))}
          </p>
          <p className="text-sm text-muted-foreground">Avg Consumed</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">
            {Math.round(data.reduce((sum, d) => sum + d.burned, 0) / (data.length || 1))}
          </p>
          <p className="text-sm text-muted-foreground">Avg Burned</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold">{data.reduce((sum, d) => sum + d.consumed, 0).toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">Week Total</p>
        </div>
      </div>
    </div>
  );
};
