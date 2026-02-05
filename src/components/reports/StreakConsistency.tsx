import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Flame } from "lucide-react";

interface StreakData {
  month: string;
  streak: number;
}

interface StreakConsistencyProps {
  data: StreakData[];
}

export const StreakConsistency = ({ data }: StreakConsistencyProps) => {
  const totalStreak = data.reduce((sum, d) => sum + d.streak, 0);
  const avgStreak = data.length > 0 ? Math.round(totalStreak / data.length) : 0;

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neon-orange flex items-center justify-center">
            <Flame className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">Streak Consistency</h3>
            <p className="text-sm text-muted-foreground">Habits completed over time</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-neon-orange">{totalStreak}</p>
          <p className="text-xs text-muted-foreground">Total completions</p>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorStreak" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--neon-orange))" stopOpacity={0.4} />
                <stop offset="95%" stopColor="hsl(var(--neon-orange))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
              }}
            />
            <Area
              type="monotone"
              dataKey="streak"
              stroke="hsl(var(--neon-orange))"
              fillOpacity={1}
              fill="url(#colorStreak)"
              strokeWidth={2}
              name="Habits Completed"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
