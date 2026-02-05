import { Transaction } from "@/hooks/useBudget";
import { formatCurrency } from "@/lib/currency";
import { format, parseISO } from "date-fns";
import { Trash2, TrendingUp, TrendingDown, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TransactionListProps {
  transactions: Transaction[];
  currency: string;
  onDelete: (id: string) => void;
}

const paymentModeIcons: Record<string, string> = {
  cash: "💵",
  upi: "📱",
  card: "💳",
  bank_transfer: "🏦",
};

export const TransactionList = ({ transactions, currency, onDelete }: TransactionListProps) => {
  // Group by date
  const groupedTransactions = transactions.reduce((groups, tx) => {
    const date = tx.transaction_date;
    if (!groups[date]) groups[date] = [];
    groups[date].push(tx);
    return groups;
  }, {} as Record<string, Transaction[]>);

  const sortedDates = Object.keys(groupedTransactions).sort((a, b) => b.localeCompare(a));

  if (transactions.length === 0) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <p className="text-muted-foreground">No transactions this month</p>
        <p className="text-sm text-muted-foreground mt-1">Add your first transaction to get started</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-4">
      <h3 className="font-semibold mb-4">Recent Transactions</h3>
      <ScrollArea className="h-[400px]">
        <div className="space-y-6">
          {sortedDates.map((date) => (
            <div key={date}>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                {format(parseISO(date), "EEEE, MMMM d")}
              </p>
              <div className="space-y-2">
                {groupedTransactions[date].map((tx) => (
                  <div
                    key={tx.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center text-lg",
                          tx.type === "income" ? "bg-success/20" : "bg-destructive/20"
                        )}
                      >
                        {tx.category?.icon || (tx.type === "income" ? "💰" : "💸")}
                      </div>
                      <div>
                        <p className="font-medium flex items-center gap-2">
                          {tx.description || tx.category?.name || (tx.type === "income" ? "Income" : "Expense")}
                          {tx.is_recurring && <RefreshCw className="h-3 w-3 text-muted-foreground" />}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          {tx.category?.name && <span>{tx.category.name}</span>}
                          {tx.payment_mode && (
                            <span>{paymentModeIcons[tx.payment_mode]}</span>
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p
                        className={cn(
                          "font-semibold",
                          tx.type === "income" ? "text-success" : "text-destructive"
                        )}
                      >
                        {tx.type === "income" ? "+" : "-"}
                        {formatCurrency(tx.amount, currency)}
                      </p>
                      <button
                        onClick={() => onDelete(tx.id)}
                        className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
