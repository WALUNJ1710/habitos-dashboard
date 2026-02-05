import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface Task {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  priority: "low" | "medium" | "high" | "urgent";
  status: "todo" | "in_progress" | "done";
  category_id: string | null;
  goal_id: string | null;
  due_date: string | null;
  due_time: string | null;
  is_recurring: boolean;
  recurrence_type: "daily" | "weekly" | "monthly" | "custom" | null;
  recurrence_interval: number | null;
  tags: string[] | null;
  notes: string | null;
  time_spent_minutes: number;
  is_focus_task: boolean;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Subtask {
  id: string;
  task_id: string;
  user_id: string;
  title: string;
  is_completed: boolean;
  created_at: string;
}

export interface TaskCategory {
  id: string;
  user_id: string;
  name: string;
  color: string;
  icon: string | null;
}

export const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [categories, setCategories] = useState<TaskCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTasks = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [tasksRes, subtasksRes, categoriesRes] = await Promise.all([
      supabase.from("tasks").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
      supabase.from("subtasks").select("*").eq("user_id", user.id),
      supabase.from("task_categories").select("*").eq("user_id", user.id),
    ]);

    if (tasksRes.data) setTasks(tasksRes.data as Task[]);
    if (subtasksRes.data) setSubtasks(subtasksRes.data as Subtask[]);
    if (categoriesRes.data) setCategories(categoriesRes.data as TaskCategory[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTasks();

    const channel = supabase
      .channel("tasks-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "tasks" }, fetchTasks)
      .on("postgres_changes", { event: "*", schema: "public", table: "subtasks" }, fetchTasks)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchTasks]);

  const addTask = async (task: Partial<Task>) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: new Error("Not authenticated") };

    const insertData = {
      title: task.title || "Untitled",
      user_id: user.id,
      description: task.description,
      priority: task.priority,
      status: task.status,
      category_id: task.category_id,
      goal_id: task.goal_id,
      due_date: task.due_date,
      due_time: task.due_time,
      is_recurring: task.is_recurring,
      recurrence_type: task.recurrence_type,
      recurrence_interval: task.recurrence_interval,
      tags: task.tags,
      notes: task.notes,
      is_focus_task: task.is_focus_task,
    };

    const { data, error } = await supabase
      .from("tasks")
      .insert(insertData)
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Task added!", description: "Your task has been created." });
    }

    return { data, error };
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    const { data, error } = await supabase
      .from("tasks")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }

    return { data, error };
  };

  const deleteTask = async (id: string) => {
    const { error } = await supabase.from("tasks").delete().eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Task deleted", description: "The task has been removed." });
    }

    return { error };
  };

  const addSubtask = async (taskId: string, title: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: new Error("Not authenticated") };

    const { data, error } = await supabase
      .from("subtasks")
      .insert({ task_id: taskId, user_id: user.id, title })
      .select()
      .single();

    return { data, error };
  };

  const toggleSubtask = async (id: string, isCompleted: boolean) => {
    const { error } = await supabase
      .from("subtasks")
      .update({ is_completed: isCompleted })
      .eq("id", id);

    return { error };
  };

  const deleteSubtask = async (id: string) => {
    const { error } = await supabase.from("subtasks").delete().eq("id", id);
    return { error };
  };

  const addCategory = async (name: string, color: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: new Error("Not authenticated") };

    const { data, error } = await supabase
      .from("task_categories")
      .insert({ user_id: user.id, name, color })
      .select()
      .single();

    return { data, error };
  };

  return {
    tasks,
    subtasks,
    categories,
    loading,
    addTask,
    updateTask,
    deleteTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
    addCategory,
    refetch: fetchTasks,
  };
};
