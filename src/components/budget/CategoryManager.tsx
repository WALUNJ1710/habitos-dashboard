import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { BudgetCategory } from "@/hooks/useBudget";
import { Plus, Settings, Trash2 } from "lucide-react";
import { Database } from "@/integrations/supabase/types";
import { toast } from "sonner";

type TransactionType = Database["public"]["Enums"]["transaction_type"];

interface CategoryManagerProps {
  categories: BudgetCategory[];
  onAddCategory: (category: Omit<BudgetCategory, "id" | "user_id" | "created_at">) => Promise<{ error?: Error | null }>;
  onUpdateCategory: (id: string, updates: Partial<BudgetCategory>) => Promise<{ error?: Error | null }>;
  onDeleteCategory: (id: string) => void;
}

const categoryIcons = ["🍔", "🏠", "🚗", "📱", "🎮", "👕", "💊", "📚", "✈️", "💰", "🎁", "💼", "🔧", "📺", "🏋️"];
const categoryColors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"];

export const CategoryManager = ({
  categories,
  onAddCategory,
  onUpdateCategory,
  onDeleteCategory,
}: CategoryManagerProps) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<TransactionType>("expense");
  const [icon, setIcon] = useState("🍔");
  const [color, setColor] = useState("#6366f1");
  const [budgetLimit, setBudgetLimit] = useState("");
  const [saving, setSaving] = useState(false);

  const handleAddCategory = async () => {
    if (!name.trim()) {
      toast.error("Please enter a category name");
      return;
    }

    setSaving(true);
    const { error } = await onAddCategory({
      name: name.trim(),
      type,
      icon,
      color,
      budget_limit: budgetLimit ? parseFloat(budgetLimit) : null,
    });

    setSaving(false);

    if (!error) {
      toast.success("Category created!");
      setName("");
      setBudgetLimit("");
      setShowAddDialog(false);
    }
  };

  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  return (
    <div className="glass-card rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neon-cyan flex items-center justify-center">
            <Settings className="h-5 w-5 text-primary-foreground" />
          </div>
          <h3 className="font-semibold">Categories</h3>
        </div>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gradient-primary">
              <Plus className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Category</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name *</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Groceries"
                  className="mt-1"
                  maxLength={50}
                />
              </div>

              <div>
                <Label>Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as TransactionType)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expense">Expense</SelectItem>
                    <SelectItem value="income">Income</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Icon</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {categoryIcons.map((i) => (
                    <button
                      key={i}
                      onClick={() => setIcon(i)}
                      className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                        icon === i ? "bg-primary/20 ring-2 ring-primary" : "bg-secondary/50 hover:bg-secondary"
                      }`}
                    >
                      {i}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <Label>Color</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {categoryColors.map((c) => (
                    <button
                      key={c}
                      onClick={() => setColor(c)}
                      className={`w-8 h-8 rounded-full transition-all ${
                        color === c ? "ring-2 ring-offset-2 ring-primary" : ""
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {type === "expense" && (
                <div>
                  <Label>Budget Limit (Optional)</Label>
                  <Input
                    type="number"
                    value={budgetLimit}
                    onChange={(e) => setBudgetLimit(e.target.value)}
                    placeholder="Monthly limit"
                    className="mt-1"
                  />
                </div>
              )}

              <Button onClick={handleAddCategory} disabled={saving} className="w-full bg-gradient-primary">
                {saving ? "Creating..." : "Create Category"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {expenseCategories.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Expenses</p>
            <div className="flex flex-wrap gap-2">
              {expenseCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 text-sm group"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color || "#6366f1" }}
                  />
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <button
                    onClick={() => onDeleteCategory(cat.id)}
                    className="opacity-0 group-hover:opacity-100 text-destructive transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {incomeCategories.length > 0 && (
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-2">Income</p>
            <div className="flex flex-wrap gap-2">
              {incomeCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 text-sm group"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: cat.color || "#10b981" }}
                  />
                  <span>{cat.icon}</span>
                  <span>{cat.name}</span>
                  <button
                    onClick={() => onDeleteCategory(cat.id)}
                    className="opacity-0 group-hover:opacity-100 text-destructive transition-opacity"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
