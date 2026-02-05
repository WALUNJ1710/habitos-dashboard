import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { TrendingUp, TrendingDown, Wallet } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

interface SpendingSavingsTrendProps {
  data: { month: string; spending: number; savings: number }[];
}

export const SpendingSavingsTrend = ({ data }: SpendingSavingsTrendProps) => {
  const totalSpending = data.reduce((sum, d) => sum + d.spending, 0);
  const totalSavings = data.reduce((sum, d) => sum + d.savings, 0);
  const trend = data.length >= 2 
    ? data[data.length - 1].savings - data[data.length - 2].savings 
    : 0;

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neon-green flex items-center justify-center">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">Spending vs Savings</h3>
            <p className="text-sm text-muted-foreground">Last 6 months trend</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {trend >= 0 ? (
            <TrendingUp className="h-5 w-5 text-success" />
          ) : (
            <TrendingDown className="h-5 w-5 text-destructive" />
          )}
          <span className={trend >= 0 ? "text-success" : "text-destructive"}>
            {trend >= 0 ? "+" : ""}{formatCurrency(trend)}
          </span>
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--destructive))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--destructive))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSavings" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
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
              formatter={(value: number) => formatCurrency(value)}
            />
            <Area
              type="monotone"
              dataKey="spending"
              stroke="hsl(var(--destructive))"
              fillOpacity={1}
              fill="url(#colorSpending)"
              strokeWidth={2}
              name="Spending"
            />
            <Area
              type="monotone"
              dataKey="savings"
              stroke="hsl(var(--success))"
              fillOpacity={1}
              fill="url(#colorSavings)"
              strokeWidth={2}
              name="Savings"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-destructive" />
          <span className="text-sm text-muted-foreground">Spending: {formatCurrency(totalSpending)}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-success" />
          <span className="text-sm text-muted-foreground">Savings: {formatCurrency(totalSavings)}</span>
        </div>
      </div>
    </div>
  );
};
