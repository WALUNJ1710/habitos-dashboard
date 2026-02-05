import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { format, startOfMonth, endOfMonth, subMonths, parseISO } from "date-fns";
import { Database } from "@/integrations/supabase/types";

type TransactionType = Database["public"]["Enums"]["transaction_type"];
type PaymentMode = Database["public"]["Enums"]["payment_mode"];
type RecurrenceType = Database["public"]["Enums"]["recurrence_type"];

export interface BudgetCategory {
  id: string;
  user_id: string;
  name: string;
  type: TransactionType;
  budget_limit: number | null;
  icon: string | null;
  color: string | null;
  created_at: string | null;
}

export interface Transaction {
  id: string;
  user_id: string;
  amount: number;
  type: TransactionType;
  category_id: string | null;
  transaction_date: string;
  description: string | null;
  payment_mode: PaymentMode | null;
  is_recurring: boolean | null;
  recurrence_type: RecurrenceType | null;
  notes: string | null;
  category?: BudgetCategory;
}

export interface SavingsGoal {
  id: string;
  user_id: string;
  name: string;
  target_amount: number;
  current_amount: number | null;
  target_date: string | null;
  is_completed: boolean | null;
  created_at: string | null;
}

export const useBudget = (user: User | null) => {
  const [categories, setCategories] = useState<BudgetCategory[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savingsGoals, setSavingsGoals] = useState<SavingsGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date());

  const monthStart = format(startOfMonth(selectedMonth), "yyyy-MM-dd");
  const monthEnd = format(endOfMonth(selectedMonth), "yyyy-MM-dd");

  const fetchData = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch categories
      const { data: catData } = await supabase
        .from("budget_categories")
        .select("*")
        .eq("user_id", user.id)
        .order("name");

      setCategories((catData || []) as BudgetCategory[]);

      // Fetch transactions for selected month
      const { data: txData } = await supabase
        .from("transactions")
        .select("*, budget_categories(*)")
        .eq("user_id", user.id)
        .gte("transaction_date", monthStart)
        .lte("transaction_date", monthEnd)
        .order("transaction_date", { ascending: false });

      const formattedTx = (txData || []).map((tx: any) => ({
        ...tx,
        category: tx.budget_categories,
      }));
      setTransactions(formattedTx as Transaction[]);

      // Fetch savings goals
      const { data: goalsData } = await supabase
        .from("savings_goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setSavingsGoals((goalsData || []) as SavingsGoal[]);
    } catch (error) {
      console.error("Error fetching budget data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user, selectedMonth]);

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  // Category spending breakdown
  const categorySpending = categories
    .filter((c) => c.type === "expense")
    .map((cat) => {
      const spent = transactions
        .filter((t) => t.category_id === cat.id && t.type === "expense")
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        ...cat,
        spent,
        remaining: (cat.budget_limit || 0) - spent,
        isOverBudget: cat.budget_limit ? spent > cat.budget_limit : false,
      };
    });

  // CRUD Operations
  const addCategory = async (category: Omit<BudgetCategory, "id" | "user_id" | "created_at">) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { error } = await supabase.from("budget_categories").insert({
      user_id: user.id,
      ...category,
    });

    if (!error) await fetchData();
    return { error };
  };

  const updateCategory = async (id: string, updates: Partial<BudgetCategory>) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { error } = await supabase
      .from("budget_categories")
      .update(updates)
      .eq("id", id)
      .eq("user_id", user.id);

    if (!error) await fetchData();
    return { error };
  };

  const deleteCategory = async (id: string) => {
    if (!user) return;

    await supabase.from("budget_categories").delete().eq("id", id).eq("user_id", user.id);
    await fetchData();
  };

  const addTransaction = async (transaction: Omit<Transaction, "id" | "user_id" | "category">) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { error } = await supabase.from("transactions").insert({
      user_id: user.id,
      amount: transaction.amount,
      type: transaction.type,
      category_id: transaction.category_id,
      transaction_date: transaction.transaction_date,
      description: transaction.description,
      payment_mode: transaction.payment_mode,
      is_recurring: transaction.is_recurring,
      recurrence_type: transaction.recurrence_type,
      notes: transaction.notes,
    });

    if (!error) await fetchData();
    return { error };
  };

  const deleteTransaction = async (id: string) => {
    if (!user) return;

    await supabase.from("transactions").delete().eq("id", id).eq("user_id", user.id);
    await fetchData();
  };

  const addSavingsGoal = async (goal: Omit<SavingsGoal, "id" | "user_id" | "created_at">) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { error } = await supabase.from("savings_goals").insert({
      user_id: user.id,
      ...goal,
    });

    if (!error) await fetchData();
    return { error };
  };

  const updateSavingsGoal = async (id: string, updates: Partial<SavingsGoal>) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { error } = await supabase
      .from("savings_goals")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .eq("user_id", user.id);

    if (!error) await fetchData();
    return { error };
  };

  const deleteSavingsGoal = async (id: string) => {
    if (!user) return;

    await supabase.from("savings_goals").delete().eq("id", id).eq("user_id", user.id);
    await fetchData();
  };

  // Get daily spending for graph
  const getDailySpending = () => {
    const dailyMap: Record<string, number> = {};
    transactions
      .filter((t) => t.type === "expense")
      .forEach((t) => {
        const date = t.transaction_date;
        dailyMap[date] = (dailyMap[date] || 0) + t.amount;
      });

    return Object.entries(dailyMap)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));
  };

  return {
    categories,
    transactions,
    savingsGoals,
    loading,
    selectedMonth,
    setSelectedMonth,
    totalIncome,
    totalExpenses,
    balance,
    categorySpending,
    addCategory,
    updateCategory,
    deleteCategory,
    addTransaction,
    deleteTransaction,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    getDailySpending,
    refetch: fetchData,
  };
};
