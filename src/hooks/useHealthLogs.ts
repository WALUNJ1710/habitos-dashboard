import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { format, subDays, startOfWeek, eachDayOfInterval } from "date-fns";

export interface HealthLog {
  id: string;
  user_id: string;
  log_date: string;
  weight: number | null;
  water_intake_ml: number;
  sleep_hours: number | null;
  steps: number;
  mood: "great" | "good" | "okay" | "bad" | "terrible" | null;
  heart_rate: number | null;
  notes: string | null;
  created_at: string;
}

export interface MedicineReminder {
  id: string;
  user_id: string;
  medicine_name: string;
  dosage: string | null;
  reminder_times: string[];
  is_active: boolean;
  created_at: string;
}

export interface MedicineLog {
  id: string;
  reminder_id: string;
  log_date: string;
  taken_at: string | null;
}

export const useHealthLogs = (user: User | null) => {
  const [todayLog, setTodayLog] = useState<HealthLog | null>(null);
  const [weeklyLogs, setWeeklyLogs] = useState<HealthLog[]>([]);
  const [monthlyLogs, setMonthlyLogs] = useState<HealthLog[]>([]);
  const [medicineReminders, setMedicineReminders] = useState<MedicineReminder[]>([]);
  const [medicineLogs, setMedicineLogs] = useState<MedicineLog[]>([]);
  const [loading, setLoading] = useState(true);

  const today = format(new Date(), "yyyy-MM-dd");

  const fetchLogs = async () => {
    if (!user) return;

    setLoading(true);
    try {
      // Fetch today's log
      const { data: todayData } = await supabase
        .from("health_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("log_date", today)
        .maybeSingle();

      setTodayLog(todayData as HealthLog | null);

      // Fetch last 7 days
      const weekStart = format(subDays(new Date(), 6), "yyyy-MM-dd");
      const { data: weekData } = await supabase
        .from("health_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("log_date", weekStart)
        .order("log_date", { ascending: true });

      setWeeklyLogs((weekData || []) as HealthLog[]);

      // Fetch last 30 days
      const monthStart = format(subDays(new Date(), 29), "yyyy-MM-dd");
      const { data: monthData } = await supabase
        .from("health_logs")
        .select("*")
        .eq("user_id", user.id)
        .gte("log_date", monthStart)
        .order("log_date", { ascending: true });

      setMonthlyLogs((monthData || []) as HealthLog[]);

      // Fetch medicine reminders
      const { data: reminders } = await supabase
        .from("medicine_reminders")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true);

      setMedicineReminders((reminders || []) as MedicineReminder[]);

      // Fetch today's medicine logs
      const { data: medLogs } = await supabase
        .from("medicine_logs")
        .select("*")
        .eq("user_id", user.id)
        .eq("log_date", today);

      setMedicineLogs((medLogs || []) as MedicineLog[]);
    } catch (error) {
      console.error("Error fetching health logs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [user]);

  const updateTodayLog = async (updates: Partial<HealthLog>) => {
    if (!user) return { error: new Error("Not authenticated") };

    try {
      if (todayLog) {
        // Update existing
        const { error } = await supabase
          .from("health_logs")
          .update({ ...updates, updated_at: new Date().toISOString() })
          .eq("id", todayLog.id);

        if (error) throw error;
      } else {
        // Create new
        const { error } = await supabase.from("health_logs").insert({
          user_id: user.id,
          log_date: today,
          ...updates,
        });

        if (error) throw error;
      }

      await fetchLogs();
      return { success: true };
    } catch (error) {
      return { error };
    }
  };

  const addWater = async (amountMl: number) => {
    const currentWater = todayLog?.water_intake_ml || 0;
    return updateTodayLog({ water_intake_ml: currentWater + amountMl });
  };

  const setMood = async (mood: HealthLog["mood"]) => {
    return updateTodayLog({ mood });
  };

  const logWeight = async (weight: number) => {
    return updateTodayLog({ weight });
  };

  const logSleep = async (hours: number) => {
    return updateTodayLog({ sleep_hours: hours });
  };

  const logSteps = async (steps: number) => {
    return updateTodayLog({ steps });
  };

  const logHeartRate = async (heartRate: number) => {
    return updateTodayLog({ heart_rate: heartRate });
  };

  // Medicine reminders
  const addMedicineReminder = async (medicine: {
    medicine_name: string;
    dosage: string | null;
    reminder_times: string[];
  }) => {
    if (!user) return { error: new Error("Not authenticated") };

    const { error } = await supabase.from("medicine_reminders").insert({
      user_id: user.id,
      ...medicine,
      is_active: true,
    });

    if (!error) await fetchLogs();
    return { error };
  };

  const markMedicineTaken = async (reminderId: string) => {
    if (!user) return { error: new Error("Not authenticated") };

    const existingLog = medicineLogs.find((l) => l.reminder_id === reminderId);
    if (existingLog) return { success: true };

    const { error } = await supabase.from("medicine_logs").insert({
      user_id: user.id,
      reminder_id: reminderId,
      log_date: today,
      taken_at: new Date().toISOString(),
    });

    if (!error) await fetchLogs();
    return { error };
  };

  const deleteMedicineReminder = async (id: string) => {
    if (!user) return;

    await supabase
      .from("medicine_reminders")
      .update({ is_active: false })
      .eq("id", id)
      .eq("user_id", user.id);

    await fetchLogs();
  };

  // Stats calculations
  const getWeeklyStats = () => {
    const avgWater = weeklyLogs.length > 0
      ? Math.round(weeklyLogs.reduce((sum, l) => sum + (l.water_intake_ml || 0), 0) / weeklyLogs.length)
      : 0;

    const avgSleep = weeklyLogs.filter((l) => l.sleep_hours).length > 0
      ? weeklyLogs.filter((l) => l.sleep_hours).reduce((sum, l) => sum + (l.sleep_hours || 0), 0) /
        weeklyLogs.filter((l) => l.sleep_hours).length
      : 0;

    const avgSteps = weeklyLogs.length > 0
      ? Math.round(weeklyLogs.reduce((sum, l) => sum + (l.steps || 0), 0) / weeklyLogs.length)
      : 0;

    return { avgWater, avgSleep: avgSleep.toFixed(1), avgSteps };
  };

  return {
    todayLog,
    weeklyLogs,
    monthlyLogs,
    medicineReminders,
    medicineLogs,
    loading,
    updateTodayLog,
    addWater,
    setMood,
    logWeight,
    logSleep,
    logSteps,
    logHeartRate,
    addMedicineReminder,
    markMedicineTaken,
    deleteMedicineReminder,
    getWeeklyStats,
    refetch: fetchLogs,
  };
};
