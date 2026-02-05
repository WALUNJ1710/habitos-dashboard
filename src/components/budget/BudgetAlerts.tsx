import { AlertTriangle, CheckCircle } from "lucide-react";
import { formatCurrency } from "@/lib/currency";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface CategoryBudget {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  budget_limit: number | null;
  spent: number;
  remaining: number;
  isOverBudget: boolean;
}

interface BudgetAlertsProps {
  categorySpending: CategoryBudget[];
  currency: string;
}

export const BudgetAlerts = ({ categorySpending, currency }: BudgetAlertsProps) => {
  const categoriesWithBudget = categorySpending.filter((c) => c.budget_limit && c.budget_limit > 0);
  const overBudget = categoriesWithBudget.filter((c) => c.isOverBudget);
  const nearLimit = categoriesWithBudget.filter(
    (c) => !c.isOverBudget && c.spent / (c.budget_limit || 1) >= 0.8
  );

  return (
    <div className="glass-card rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Budget Status</h3>
        {overBudget.length > 0 && (
          <span className="text-xs px-2 py-1 rounded-full bg-destructive/20 text-destructive">
            {overBudget.length} over budget
          </span>
        )}
      </div>

      {categoriesWithBudget.length === 0 ? (
        <p className="text-sm text-muted-foreground text-center py-4">
          Set budget limits on categories to track spending
        </p>
      ) : (
        <div className="space-y-4">
          {categoriesWithBudget.map((cat) => {
            const progress = Math.min((cat.spent / (cat.budget_limit || 1)) * 100, 100);
            const isWarning = progress >= 80 && progress < 100;

            return (
              <div key={cat.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span>{cat.icon}</span>
                    <span className="font-medium text-sm">{cat.name}</span>
                    {cat.isOverBudget && <AlertTriangle className="h-4 w-4 text-destructive" />}
                    {!cat.isOverBudget && progress < 80 && (
                      <CheckCircle className="h-4 w-4 text-success" />
                    )}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {formatCurrency(cat.spent, currency)} / {formatCurrency(cat.budget_limit || 0, currency)}
                  </span>
                </div>
                <Progress
                  value={progress}
                  className={cn(
                    "h-2",
                    cat.isOverBudget
                      ? "[&>div]:bg-destructive"
                      : isWarning
                      ? "[&>div]:bg-warning"
                      : "[&>div]:bg-success"
                  )}
                />
              </div>
            );
          })}
        </div>
      )}

      {/* Alerts */}
      {(overBudget.length > 0 || nearLimit.length > 0) && (
        <div className="pt-4 border-t border-border space-y-2">
          {overBudget.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2 p-2 rounded bg-destructive/10 text-destructive text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>
                {cat.icon} {cat.name} is over budget by{" "}
                {formatCurrency(Math.abs(cat.remaining), currency)}
              </span>
            </div>
          ))}
          {nearLimit.map((cat) => (
            <div key={cat.id} className="flex items-center gap-2 p-2 rounded bg-warning/10 text-warning text-sm">
              <AlertTriangle className="h-4 w-4" />
              <span>
                {cat.icon} {cat.name} is approaching limit ({Math.round((cat.spent / (cat.budget_limit || 1)) * 100)}%)
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
