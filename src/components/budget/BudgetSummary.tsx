import { TrendingUp, TrendingDown, Wallet, PiggyBank } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface BudgetSummaryProps {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  currency: string;
}

export const BudgetSummary = ({ totalIncome, totalExpenses, balance, currency }: BudgetSummaryProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-success flex items-center justify-center">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Income</p>
        </div>
        <p className="text-2xl font-bold text-success">{formatCurrency(totalIncome, currency)}</p>
      </div>

      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-destructive flex items-center justify-center">
            <TrendingDown className="h-5 w-5 text-primary-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Expenses</p>
        </div>
        <p className="text-2xl font-bold text-destructive">{formatCurrency(totalExpenses, currency)}</p>
      </div>

      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-neon-cyan flex items-center justify-center">
            <Wallet className="h-5 w-5 text-primary-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Balance</p>
        </div>
        <p className={cn("text-2xl font-bold", balance >= 0 ? "text-success" : "text-destructive")}>
          {formatCurrency(balance, currency)}
        </p>
      </div>

      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-neon-purple flex items-center justify-center">
            <PiggyBank className="h-5 w-5 text-primary-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Savings Rate</p>
        </div>
        <p className="text-2xl font-bold">
          {totalIncome > 0 ? Math.round((balance / totalIncome) * 100) : 0}%
        </p>
      </div>
    </div>
  );
};
