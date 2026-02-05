import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BudgetCategory, Transaction } from "@/hooks/useBudget";
import { Plus, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Database } from "@/integrations/supabase/types";
import { z } from "zod";
import { toast } from "sonner";

type TransactionType = Database["public"]["Enums"]["transaction_type"];
type PaymentMode = Database["public"]["Enums"]["payment_mode"];
type RecurrenceType = Database["public"]["Enums"]["recurrence_type"];

const transactionSchema = z.object({
  amount: z.number().positive("Amount must be positive").max(100000000, "Amount too large"),
  description: z.string().max(200, "Description too long").optional(),
  notes: z.string().max(500, "Notes too long").optional(),
});

interface TransactionFormProps {
  categories: BudgetCategory[];
  onAddTransaction: (transaction: Omit<Transaction, "id" | "user_id" | "category">) => Promise<{ error?: Error | null }>;
}

const paymentModes: { value: PaymentMode; label: string }[] = [
  { value: "cash", label: "💵 Cash" },
  { value: "upi", label: "📱 UPI" },
  { value: "card", label: "💳 Card" },
  { value: "bank_transfer", label: "🏦 Bank Transfer" },
];

export const TransactionForm = ({ categories, onAddTransaction }: TransactionFormProps) => {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<TransactionType>("expense");
  const [amount, setAmount] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));
  const [paymentMode, setPaymentMode] = useState<PaymentMode>("cash");
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<RecurrenceType>("monthly");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);

  const filteredCategories = categories.filter((c) => c.type === type);

  const resetForm = () => {
    setAmount("");
    setCategoryId("");
    setDescription("");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setPaymentMode("cash");
    setIsRecurring(false);
    setNotes("");
  };

  const handleSubmit = async () => {
    const parsedAmount = parseFloat(amount);
    
    const validation = transactionSchema.safeParse({
      amount: parsedAmount,
      description: description.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    if (!parsedAmount) {
      toast.error("Please enter an amount");
      return;
    }

    setSaving(true);
    const { error } = await onAddTransaction({
      amount: parsedAmount,
      type,
      category_id: categoryId || null,
      transaction_date: date,
      description: description.trim() || null,
      payment_mode: paymentMode,
      is_recurring: isRecurring,
      recurrence_type: isRecurring ? recurrenceType : null,
      notes: notes.trim() || null,
    });

    setSaving(false);

    if (!error) {
      toast.success(`${type === "income" ? "Income" : "Expense"} added successfully`);
      resetForm();
      setOpen(false);
    } else {
      toast.error("Failed to add transaction");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-primary">
          <Plus className="h-4 w-4 mr-2" /> Add Transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setType("income")}
              className={cn(
                "p-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-all",
                type === "income" ? "border-success bg-success/10" : "border-border"
              )}
            >
              <TrendingUp className="h-4 w-4 text-success" />
              <span className="font-medium">Income</span>
            </button>
            <button
              onClick={() => setType("expense")}
              className={cn(
                "p-3 rounded-lg border-2 flex items-center justify-center gap-2 transition-all",
                type === "expense" ? "border-destructive bg-destructive/10" : "border-border"
              )}
            >
              <TrendingDown className="h-4 w-4 text-destructive" />
              <span className="font-medium">Expense</span>
            </button>
          </div>

          {/* Amount */}
          <div>
            <Label>Amount *</Label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="mt-1 text-lg"
            />
          </div>

          {/* Category */}
          <div>
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label>Description</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What was this for?"
              className="mt-1"
              maxLength={200}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Date */}
            <div>
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1"
              />
            </div>

            {/* Payment Mode */}
            <div>
              <Label>Payment Mode</Label>
              <Select value={paymentMode} onValueChange={(v) => setPaymentMode(v as PaymentMode)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {paymentModes.map((mode) => (
                    <SelectItem key={mode.value} value={mode.value}>
                      {mode.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Recurring */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30">
            <div>
              <p className="font-medium">Recurring Transaction</p>
              <p className="text-sm text-muted-foreground">Auto-repeat this transaction</p>
            </div>
            <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
          </div>

          {isRecurring && (
            <div>
              <Label>Repeat</Label>
              <Select value={recurrenceType} onValueChange={(v) => setRecurrenceType(v as RecurrenceType)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Notes */}
          <div>
            <Label>Notes</Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Additional notes..."
              className="mt-1"
              rows={2}
              maxLength={500}
            />
          </div>

          <Button onClick={handleSubmit} disabled={saving} className="w-full bg-gradient-primary">
            {saving ? "Adding..." : `Add ${type === "income" ? "Income" : "Expense"}`}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
