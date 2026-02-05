import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SavingsGoal } from "@/hooks/useBudget";
import { formatCurrency } from "@/lib/currency";
import { Plus, Target, Trash2, PiggyBank, CheckCircle } from "lucide-react";
import { format, parseISO, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";
import { z } from "zod";
import { toast } from "sonner";

const goalSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name too long"),
  target_amount: z.number().positive("Amount must be positive").max(100000000, "Amount too large"),
});

interface SavingsGoalTrackerProps {
  goals: SavingsGoal[];
  currency: string;
  onAddGoal: (goal: Omit<SavingsGoal, "id" | "user_id" | "created_at">) => Promise<{ error?: Error | null }>;
  onUpdateGoal: (id: string, updates: Partial<SavingsGoal>) => Promise<{ error?: Error | null }>;
  onDeleteGoal: (id: string) => void;
}

export const SavingsGoalTracker = ({
  goals,
  currency,
  onAddGoal,
  onUpdateGoal,
  onDeleteGoal,
}: SavingsGoalTrackerProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [name, setName] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [saving, setSaving] = useState(false);

  const [depositGoalId, setDepositGoalId] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState("");

  const handleAddGoal = async () => {
    const validation = goalSchema.safeParse({
      name: name.trim(),
      target_amount: parseFloat(targetAmount),
    });

    if (!validation.success) {
      toast.error(validation.error.errors[0].message);
      return;
    }

    setSaving(true);
    const { error } = await onAddGoal({
      name: name.trim(),
      target_amount: parseFloat(targetAmount),
      current_amount: 0,
      target_date: targetDate || null,
      is_completed: false,
    });

    setSaving(false);

    if (!error) {
      toast.success("Savings goal created!");
      setName("");
      setTargetAmount("");
      setTargetDate("");
      setShowAddDialog(false);
    }
  };

  const handleDeposit = async () => {
    if (!depositGoalId || !depositAmount) return;

    const goal = goals.find((g) => g.id === depositGoalId);
    if (!goal) return;

    const newAmount = (goal.current_amount || 0) + parseFloat(depositAmount);
    const isCompleted = newAmount >= goal.target_amount;

    await onUpdateGoal(depositGoalId, {
      current_amount: newAmount,
      is_completed: isCompleted,
    });

    if (isCompleted) {
      toast.success("🎉 Congratulations! Goal completed!");
    } else {
      toast.success("Deposit added!");
    }

    setDepositGoalId(null);
    setDepositAmount("");
  };

  return (
    <div className="glass-card rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neon-purple flex items-center justify-center">
            <PiggyBank className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">Savings Goals</h3>
            <p className="text-sm text-muted-foreground">{goals.length} active goals</p>
          </div>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gradient-primary">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Savings Goal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Goal Name *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Emergency Fund"
                  className="mt-1"
                  maxLength={100}
                />
              </div>
              <div>
                <Label>Target Amount *</Label>
                <Input
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  placeholder="50000"
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Target Date (Optional)</Label>
                <Input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  className="mt-1"
                />
              </div>
              <Button onClick={handleAddGoal} disabled={saving} className="w-full bg-gradient-primary">
                {saving ? "Creating..." : "Create Goal"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {goals.length === 0 ? (
        <p className="text-center text-muted-foreground py-4">No savings goals yet</p>
      ) : (
        <div className="space-y-4">
          {goals.map((goal) => {
            const progress = Math.min(((goal.current_amount || 0) / goal.target_amount) * 100, 100);
            const daysLeft = goal.target_date
              ? differenceInDays(parseISO(goal.target_date), new Date())
              : null;

            return (
              <div
                key={goal.id}
                className={cn(
                  "p-4 rounded-lg bg-secondary/30",
                  goal.is_completed && "border-2 border-success"
                )}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {goal.is_completed ? (
                      <CheckCircle className="h-5 w-5 text-success" />
                    ) : (
                      <Target className="h-5 w-5 text-primary" />
                    )}
                    <span className="font-medium">{goal.name}</span>
                  </div>
                  <button
                    onClick={() => onDeleteGoal(goal.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {formatCurrency(goal.current_amount || 0, currency)} /{" "}
                      {formatCurrency(goal.target_amount, currency)}
                    </span>
                    <span className="font-medium">{progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                  {daysLeft !== null && daysLeft > 0 && (
                    <p className="text-xs text-muted-foreground">{daysLeft} days left</p>
                  )}
                </div>

                {!goal.is_completed && (
                  <div className="mt-3 flex gap-2">
                    {depositGoalId === goal.id ? (
                      <>
                        <Input
                          type="number"
                          value={depositAmount}
                          onChange={(e) => setDepositAmount(e.target.value)}
                          placeholder="Amount"
                          className="flex-1"
                        />
                        <Button size="sm" onClick={handleDeposit}>
                          Add
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setDepositGoalId(null)}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDepositGoalId(goal.id)}
                        className="w-full"
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add Money
                      </Button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
