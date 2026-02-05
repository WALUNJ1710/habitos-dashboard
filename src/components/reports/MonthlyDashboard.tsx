import { Calendar, CheckCircle2, Flame, Wallet, Heart, Target } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface MonthlyReport {
  month: string;
  tasksCompleted: number;
  habitsCompleted: number;
  totalSpending: number;
  totalIncome: number;
  savingsRate: number;
  avgCalories: number;
  avgHealthScore: number;
  activeDays: number;
}

interface MonthlyDashboardProps {
  report: MonthlyReport | null;
}

export const MonthlyDashboard = ({ report }: MonthlyDashboardProps) => {
  if (!report) {
    return (
      <div className="glass-card rounded-xl p-6 text-center">
        <p className="text-muted-foreground">No data available for this month</p>
      </div>
    );
  }

  const metrics = [
    {
      icon: CheckCircle2,
      label: "Tasks Completed",
      value: report.tasksCompleted.toString(),
      color: "bg-primary",
    },
    {
      icon: Flame,
      label: "Habits Completed",
      value: report.habitsCompleted.toString(),
      color: "bg-neon-orange",
    },
    {
      icon: Calendar,
      label: "Active Days",
      value: `${report.activeDays}/30`,
      color: "bg-neon-green",
    },
    {
      icon: Wallet,
      label: "Total Spending",
      value: formatCurrency(report.totalSpending),
      color: "bg-neon-purple",
    },
    {
      icon: Target,
      label: "Savings Rate",
      value: `${report.savingsRate}%`,
      color: report.savingsRate >= 20 ? "bg-success" : "bg-warning",
    },
    {
      icon: Heart,
      label: "Avg Health Score",
      value: `${report.avgHealthScore}%`,
      color: "bg-neon-pink",
    },
  ];

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center">
          <Calendar className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold">Monthly Performance</h3>
          <p className="text-sm text-muted-foreground">{report.month}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="p-4 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", metric.color)}>
                <metric.icon className="h-4 w-4 text-primary-foreground" />
              </div>
            </div>
            <p className="text-2xl font-bold">{metric.value}</p>
            <p className="text-sm text-muted-foreground">{metric.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-primary/10 to-neon-purple/10 border border-primary/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Net Income</p>
            <p className={cn("text-2xl font-bold", 
              report.totalIncome - report.totalSpending >= 0 ? "text-success" : "text-destructive"
            )}>
              {formatCurrency(report.totalIncome - report.totalSpending)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Avg Daily Calories</p>
            <p className="text-2xl font-bold text-neon-cyan">{report.avgCalories}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
