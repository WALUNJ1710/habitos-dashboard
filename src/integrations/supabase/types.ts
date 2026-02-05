export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      budget_categories: {
        Row: {
          budget_limit: number | null
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          name: string
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Insert: {
          budget_limit?: number | null
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          type: Database["public"]["Enums"]["transaction_type"]
          user_id: string
        }
        Update: {
          budget_limit?: number | null
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          user_id?: string
        }
        Relationships: []
      }
      calorie_goals: {
        Row: {
          carbs_target: number | null
          created_at: string | null
          daily_target: number | null
          fat_target: number | null
          goal_mode: Database["public"]["Enums"]["goal_mode"] | null
          id: string
          protein_target: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          carbs_target?: number | null
          created_at?: string | null
          daily_target?: number | null
          fat_target?: number | null
          goal_mode?: Database["public"]["Enums"]["goal_mode"] | null
          id?: string
          protein_target?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          carbs_target?: number | null
          created_at?: string | null
          daily_target?: number | null
          fat_target?: number | null
          goal_mode?: Database["public"]["Enums"]["goal_mode"] | null
          id?: string
          protein_target?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      exercise_logs: {
        Row: {
          calories_burned: number
          created_at: string | null
          duration_minutes: number | null
          exercise_name: string
          id: string
          log_date: string
          notes: string | null
          user_id: string
        }
        Insert: {
          calories_burned: number
          created_at?: string | null
          duration_minutes?: number | null
          exercise_name: string
          id?: string
          log_date: string
          notes?: string | null
          user_id: string
        }
        Update: {
          calories_burned?: number
          created_at?: string | null
          duration_minutes?: number | null
          exercise_name?: string
          id?: string
          log_date?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      food_items: {
        Row: {
          calories: number
          carbs: number | null
          created_at: string | null
          fat: number | null
          id: string
          is_favorite: boolean | null
          is_global: boolean | null
          name: string
          protein: number | null
          serving_size: string | null
          user_id: string | null
        }
        Insert: {
          calories: number
          carbs?: number | null
          created_at?: string | null
          fat?: number | null
          id?: string
          is_favorite?: boolean | null
          is_global?: boolean | null
          name: string
          protein?: number | null
          serving_size?: string | null
          user_id?: string | null
        }
        Update: {
          calories?: number
          carbs?: number | null
          created_at?: string | null
          fat?: number | null
          id?: string
          is_favorite?: boolean | null
          is_global?: boolean | null
          name?: string
          protein?: number | null
          serving_size?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      gamification_levels: {
        Row: {
          badge_emoji: string | null
          id: string
          level: number
          name: string
          xp_required: number
        }
        Insert: {
          badge_emoji?: string | null
          id?: string
          level: number
          name: string
          xp_required: number
        }
        Update: {
          badge_emoji?: string | null
          id?: string
          level?: number
          name?: string
          xp_required?: number
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          is_completed: boolean | null
          target_date: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_completed?: boolean | null
          target_date?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          is_completed?: boolean | null
          target_date?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      habit_logs: {
        Row: {
          completed_count: number | null
          created_at: string | null
          habit_id: string
          id: string
          log_date: string
          notes: string | null
          skipped: boolean | null
          user_id: string
        }
        Insert: {
          completed_count?: number | null
          created_at?: string | null
          habit_id: string
          id?: string
          log_date: string
          notes?: string | null
          skipped?: boolean | null
          user_id: string
        }
        Update: {
          completed_count?: number | null
          created_at?: string | null
          habit_id?: string
          id?: string
          log_date?: string
          notes?: string | null
          skipped?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_logs_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: false
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habit_streaks: {
        Row: {
          created_at: string | null
          current_streak: number | null
          habit_id: string
          id: string
          last_completed_date: string | null
          last_freeze_used: string | null
          longest_streak: number | null
          streak_freezes_available: number | null
          streak_level: Database["public"]["Enums"]["streak_level"] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_streak?: number | null
          habit_id: string
          id?: string
          last_completed_date?: string | null
          last_freeze_used?: string | null
          longest_streak?: number | null
          streak_freezes_available?: number | null
          streak_level?: Database["public"]["Enums"]["streak_level"] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_streak?: number | null
          habit_id?: string
          id?: string
          last_completed_date?: string | null
          last_freeze_used?: string | null
          longest_streak?: number | null
          streak_freezes_available?: number | null
          streak_level?: Database["public"]["Enums"]["streak_level"] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "habit_streaks_habit_id_fkey"
            columns: ["habit_id"]
            isOneToOne: true
            referencedRelation: "habits"
            referencedColumns: ["id"]
          },
        ]
      }
      habits: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          frequency: string | null
          icon: string | null
          id: string
          name: string
          target_count: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          frequency?: string | null
          icon?: string | null
          id?: string
          name: string
          target_count?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          frequency?: string | null
          icon?: string | null
          id?: string
          name?: string
          target_count?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      health_logs: {
        Row: {
          created_at: string | null
          heart_rate: number | null
          id: string
          log_date: string
          mood: Database["public"]["Enums"]["mood_type"] | null
          notes: string | null
          sleep_hours: number | null
          steps: number | null
          updated_at: string | null
          user_id: string
          water_intake_ml: number | null
          weight: number | null
        }
        Insert: {
          created_at?: string | null
          heart_rate?: number | null
          id?: string
          log_date: string
          mood?: Database["public"]["Enums"]["mood_type"] | null
          notes?: string | null
          sleep_hours?: number | null
          steps?: number | null
          updated_at?: string | null
          user_id: string
          water_intake_ml?: number | null
          weight?: number | null
        }
        Update: {
          created_at?: string | null
          heart_rate?: number | null
          id?: string
          log_date?: string
          mood?: Database["public"]["Enums"]["mood_type"] | null
          notes?: string | null
          sleep_hours?: number | null
          steps?: number | null
          updated_at?: string | null
          user_id?: string
          water_intake_ml?: number | null
          weight?: number | null
        }
        Relationships: []
      }
      meal_items: {
        Row: {
          created_at: string | null
          food_item_id: string
          id: string
          meal_id: string
          quantity: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          food_item_id: string
          id?: string
          meal_id: string
          quantity?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          food_item_id?: string
          id?: string
          meal_id?: string
          quantity?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "meal_items_food_item_id_fkey"
            columns: ["food_item_id"]
            isOneToOne: false
            referencedRelation: "food_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "meal_items_meal_id_fkey"
            columns: ["meal_id"]
            isOneToOne: false
            referencedRelation: "meals"
            referencedColumns: ["id"]
          },
        ]
      }
      meals: {
        Row: {
          created_at: string | null
          id: string
          meal_date: string
          meal_type: Database["public"]["Enums"]["meal_type"]
          notes: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          meal_date: string
          meal_type: Database["public"]["Enums"]["meal_type"]
          notes?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          meal_date?: string
          meal_type?: Database["public"]["Enums"]["meal_type"]
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      medicine_logs: {
        Row: {
          id: string
          log_date: string
          reminder_id: string
          taken_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          log_date: string
          reminder_id: string
          taken_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          log_date?: string
          reminder_id?: string
          taken_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medicine_logs_reminder_id_fkey"
            columns: ["reminder_id"]
            isOneToOne: false
            referencedRelation: "medicine_reminders"
            referencedColumns: ["id"]
          },
        ]
      }
      medicine_reminders: {
        Row: {
          created_at: string | null
          dosage: string | null
          id: string
          is_active: boolean | null
          medicine_name: string
          reminder_times: string[] | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          dosage?: string | null
          id?: string
          is_active?: boolean | null
          medicine_name: string
          reminder_times?: string[] | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          dosage?: string | null
          id?: string
          is_active?: boolean | null
          medicine_name?: string
          reminder_times?: string[] | null
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string | null
          title: string
          type: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          title: string
          type?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          title?: string
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          budget_goal: number | null
          calorie_goal: number | null
          created_at: string | null
          currency: string | null
          full_name: string | null
          goal_weight: number | null
          height: number | null
          id: string
          level: number | null
          notifications_enabled: boolean | null
          theme: string | null
          updated_at: string | null
          user_id: string
          weight: number | null
          xp_points: number | null
        }
        Insert: {
          avatar_url?: string | null
          budget_goal?: number | null
          calorie_goal?: number | null
          created_at?: string | null
          currency?: string | null
          full_name?: string | null
          goal_weight?: number | null
          height?: number | null
          id?: string
          level?: number | null
          notifications_enabled?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id: string
          weight?: number | null
          xp_points?: number | null
        }
        Update: {
          avatar_url?: string | null
          budget_goal?: number | null
          calorie_goal?: number | null
          created_at?: string | null
          currency?: string | null
          full_name?: string | null
          goal_weight?: number | null
          height?: number | null
          id?: string
          level?: number | null
          notifications_enabled?: boolean | null
          theme?: string | null
          updated_at?: string | null
          user_id?: string
          weight?: number | null
          xp_points?: number | null
        }
        Relationships: []
      }
      savings_goals: {
        Row: {
          created_at: string | null
          current_amount: number | null
          id: string
          is_completed: boolean | null
          name: string
          target_amount: number
          target_date: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_amount?: number | null
          id?: string
          is_completed?: boolean | null
          name: string
          target_amount: number
          target_date?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_amount?: number | null
          id?: string
          is_completed?: boolean | null
          name?: string
          target_amount?: number
          target_date?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subtasks: {
        Row: {
          created_at: string | null
          id: string
          is_completed: boolean | null
          task_id: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          task_id: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_completed?: boolean | null
          task_id?: string
          title?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subtasks_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      task_categories: {
        Row: {
          color: string | null
          created_at: string | null
          icon: string | null
          id: string
          name: string
          user_id: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name: string
          user_id: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          icon?: string | null
          id?: string
          name?: string
          user_id?: string
        }
        Relationships: []
      }
      task_time_logs: {
        Row: {
          created_at: string | null
          duration_minutes: number | null
          end_time: string | null
          id: string
          start_time: string
          task_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          start_time: string
          task_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          duration_minutes?: number | null
          end_time?: string | null
          id?: string
          start_time?: string
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "task_time_logs_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "tasks"
            referencedColumns: ["id"]
          },
        ]
      }
      tasks: {
        Row: {
          category_id: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string | null
          due_time: string | null
          goal_id: string | null
          id: string
          is_focus_task: boolean | null
          is_recurring: boolean | null
          notes: string | null
          priority: Database["public"]["Enums"]["task_priority"] | null
          recurrence_interval: number | null
          recurrence_type: Database["public"]["Enums"]["recurrence_type"] | null
          status: Database["public"]["Enums"]["task_status"] | null
          tags: string[] | null
          time_spent_minutes: number | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          goal_id?: string | null
          id?: string
          is_focus_task?: boolean | null
          is_recurring?: boolean | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          recurrence_interval?: number | null
          recurrence_type?:
            | Database["public"]["Enums"]["recurrence_type"]
            | null
          status?: Database["public"]["Enums"]["task_status"] | null
          tags?: string[] | null
          time_spent_minutes?: number | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          due_time?: string | null
          goal_id?: string | null
          id?: string
          is_focus_task?: boolean | null
          is_recurring?: boolean | null
          notes?: string | null
          priority?: Database["public"]["Enums"]["task_priority"] | null
          recurrence_interval?: number | null
          recurrence_type?:
            | Database["public"]["Enums"]["recurrence_type"]
            | null
          status?: Database["public"]["Enums"]["task_status"] | null
          tags?: string[] | null
          time_spent_minutes?: number | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tasks_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "task_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tasks_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "goals"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          category_id: string | null
          created_at: string | null
          description: string | null
          id: string
          is_recurring: boolean | null
          notes: string | null
          payment_mode: Database["public"]["Enums"]["payment_mode"] | null
          recurrence_type: Database["public"]["Enums"]["recurrence_type"] | null
          transaction_date: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          notes?: string | null
          payment_mode?: Database["public"]["Enums"]["payment_mode"] | null
          recurrence_type?:
            | Database["public"]["Enums"]["recurrence_type"]
            | null
          transaction_date: string
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          category_id?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_recurring?: boolean | null
          notes?: string | null
          payment_mode?: Database["public"]["Enums"]["payment_mode"] | null
          recurrence_type?:
            | Database["public"]["Enums"]["recurrence_type"]
            | null
          transaction_date?: string
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "budget_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          badge_emoji: string | null
          badge_name: string
          earned_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          badge_emoji?: string | null
          badge_name: string
          earned_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          badge_emoji?: string | null
          badge_name?: string
          earned_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      award_xp: {
        Args: { user_uuid: string; xp_amount: number }
        Returns: undefined
      }
      is_habit_owner: { Args: { habit_uuid: string }; Returns: boolean }
      is_meal_owner: { Args: { meal_uuid: string }; Returns: boolean }
      is_task_owner: { Args: { task_uuid: string }; Returns: boolean }
    }
    Enums: {
      goal_mode: "cutting" | "bulking" | "maintenance"
      meal_type: "breakfast" | "lunch" | "dinner" | "snack"
      mood_type: "great" | "good" | "okay" | "bad" | "terrible"
      payment_mode: "cash" | "upi" | "card" | "bank_transfer"
      recurrence_type: "daily" | "weekly" | "monthly" | "custom"
      streak_level: "bronze" | "silver" | "gold" | "diamond"
      task_priority: "low" | "medium" | "high" | "urgent"
      task_status: "todo" | "in_progress" | "done"
      transaction_type: "income" | "expense"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      goal_mode: ["cutting", "bulking", "maintenance"],
      meal_type: ["breakfast", "lunch", "dinner", "snack"],
      mood_type: ["great", "good", "okay", "bad", "terrible"],
      payment_mode: ["cash", "upi", "card", "bank_transfer"],
      recurrence_type: ["daily", "weekly", "monthly", "custom"],
      streak_level: ["bronze", "silver", "gold", "diamond"],
      task_priority: ["low", "medium", "high", "urgent"],
      task_status: ["todo", "in_progress", "done"],
      transaction_type: ["income", "expense"],
    },
  },
} as const
