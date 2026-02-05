import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/currency";

interface CategorySpending {
  id: string;
  name: string;
  spent: number;
  color: string | null;
  icon: string | null;
}

interface SpendingPieChartProps {
  categorySpending: CategorySpending[];
  currency: string;
}

export const SpendingPieChart = ({ categorySpending, currency }: SpendingPieChartProps) => {
  const data = categorySpending
    .filter((c) => c.spent > 0)
    .map((c) => ({
      name: `${c.icon || ""} ${c.name}`,
      value: c.spent,
      color: c.color || "#6366f1",
    }));

  if (data.length === 0) {
    return (
      <div className="glass-card rounded-xl p-6">
        <h3 className="font-semibold mb-4">Spending by Category</h3>
        <div className="h-64 flex items-center justify-center text-muted-foreground">
          No spending data this month
        </div>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-medium">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">
            {formatCurrency(payload[0].value, currency)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="font-semibold mb-4">Spending by Category</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              formatter={(value) => <span className="text-sm">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
