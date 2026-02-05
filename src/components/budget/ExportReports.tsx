import { Button } from "@/components/ui/button";
import { Transaction } from "@/hooks/useBudget";
import { formatCurrency } from "@/lib/currency";
import { format, parseISO } from "date-fns";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { toast } from "sonner";

interface ExportReportsProps {
  transactions: Transaction[];
  currency: string;
  month: Date;
}

export const ExportReports = ({ transactions, currency, month }: ExportReportsProps) => {
  const exportToCSV = () => {
    if (transactions.length === 0) {
      toast.error("No transactions to export");
      return;
    }

    const headers = ["Date", "Type", "Category", "Description", "Payment Mode", "Amount"];
    const rows = transactions.map((tx) => [
      tx.transaction_date,
      tx.type,
      tx.category?.name || "",
      tx.description || "",
      tx.payment_mode || "",
      tx.type === "income" ? tx.amount : -tx.amount,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `budget_report_${format(month, "yyyy_MM")}.csv`;
    link.click();

    toast.success("CSV exported successfully!");
  };

  const exportToJSON = () => {
    if (transactions.length === 0) {
      toast.error("No transactions to export");
      return;
    }

    const data = {
      month: format(month, "MMMM yyyy"),
      exportedAt: new Date().toISOString(),
      summary: {
        totalIncome: transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
        totalExpenses: transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
        transactionCount: transactions.length,
      },
      transactions: transactions.map((tx) => ({
        date: tx.transaction_date,
        type: tx.type,
        category: tx.category?.name,
        description: tx.description,
        amount: tx.amount,
        paymentMode: tx.payment_mode,
        isRecurring: tx.is_recurring,
      })),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `budget_report_${format(month, "yyyy_MM")}.json`;
    link.click();

    toast.success("JSON exported successfully!");
  };

  const printReport = () => {
    if (transactions.length === 0) {
      toast.error("No transactions to print");
      return;
    }

    const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
    const totalExpenses = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);

    const printContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Budget Report - ${format(month, "MMMM yyyy")}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f4f4f4; }
            .income { color: green; }
            .expense { color: red; }
            .summary { margin: 20px 0; padding: 10px; background: #f9f9f9; }
          </style>
        </head>
        <body>
          <h1>Budget Report - ${format(month, "MMMM yyyy")}</h1>
          <div class="summary">
            <p><strong>Total Income:</strong> <span class="income">${formatCurrency(totalIncome, currency)}</span></p>
            <p><strong>Total Expenses:</strong> <span class="expense">${formatCurrency(totalExpenses, currency)}</span></p>
            <p><strong>Balance:</strong> ${formatCurrency(totalIncome - totalExpenses, currency)}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Category</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${transactions
                .map(
                  (tx) => `
                <tr>
                  <td>${format(parseISO(tx.transaction_date), "MMM d, yyyy")}</td>
                  <td>${tx.type}</td>
                  <td>${tx.category?.icon || ""} ${tx.category?.name || "-"}</td>
                  <td>${tx.description || "-"}</td>
                  <td class="${tx.type}">${tx.type === "income" ? "+" : "-"}${formatCurrency(tx.amount, currency)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank");
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-neon-orange flex items-center justify-center">
          <Download className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold">Export Reports</h3>
          <p className="text-sm text-muted-foreground">{format(month, "MMMM yyyy")}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Button variant="outline" onClick={exportToCSV} className="flex flex-col h-auto py-3">
          <FileSpreadsheet className="h-5 w-5 mb-1" />
          <span className="text-xs">CSV</span>
        </Button>
        <Button variant="outline" onClick={exportToJSON} className="flex flex-col h-auto py-3">
          <FileText className="h-5 w-5 mb-1" />
          <span className="text-xs">JSON</span>
        </Button>
        <Button variant="outline" onClick={printReport} className="flex flex-col h-auto py-3">
          <Download className="h-5 w-5 mb-1" />
          <span className="text-xs">Print</span>
        </Button>
      </div>
    </div>
  );
};
