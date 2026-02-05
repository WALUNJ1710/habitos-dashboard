import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ExerciseLog } from "@/hooks/useCalories";
import { Dumbbell, Trash2, Plus, Flame } from "lucide-react";
import { format } from "date-fns";

interface ExerciseLoggerProps {
  exercises: ExerciseLog[];
  totalBurned: number;
  onAddExercise: (exercise: Omit<ExerciseLog, "id" | "user_id" | "created_at">) => Promise<{ error?: Error | null }>;
  onRemoveExercise: (exerciseId: string) => void;
}

const exerciseTypes = [
  "Walking",
  "Running",
  "Cycling",
  "Swimming",
  "Weight Training",
  "HIIT",
  "Yoga",
  "Sports",
  "Other",
];

export const ExerciseLogger = ({
  exercises,
  totalBurned,
  onAddExercise,
  onRemoveExercise,
}: ExerciseLoggerProps) => {
  const [showForm, setShowForm] = useState(false);
  const [exerciseType, setExerciseType] = useState("Walking");
  const [calories, setCalories] = useState("");
  const [duration, setDuration] = useState("");

  const today = format(new Date(), "yyyy-MM-dd");

  const handleAdd = async () => {
    if (!calories) return;

    await onAddExercise({
      exercise_name: exerciseType,
      calories_burned: parseInt(calories),
      duration_minutes: parseInt(duration) || null,
      log_date: today,
      notes: null,
    });

    setExerciseType("Walking");
    setCalories("");
    setDuration("");
    setShowForm(false);
  };

  return (
    <div className="glass-card rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neon-pink flex items-center justify-center">
            <Dumbbell className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold">Calories Burned</h3>
            <p className="text-sm text-muted-foreground">Log your activities</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Flame className="h-5 w-5 text-destructive" />
          <span className="text-xl font-bold text-destructive">-{totalBurned}</span>
        </div>
      </div>

      {showForm ? (
        <div className="space-y-4 p-4 rounded-lg bg-secondary/30">
          <div>
            <Label>Activity Type</Label>
            <Select value={exerciseType} onValueChange={setExerciseType}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {exerciseTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Calories Burned *</Label>
              <Input
                type="number"
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                placeholder="kcal"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Duration (mins)</Label>
              <Input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="minutes"
                className="mt-1"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleAdd} disabled={!calories} className="flex-1 bg-gradient-primary">
              Add Activity
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => setShowForm(true)} variant="outline" className="w-full">
          <Plus className="h-4 w-4 mr-2" /> Log Exercise
        </Button>
      )}

      {/* Exercise List */}
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {exercises.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No activities logged today</p>
        ) : (
          exercises.map((exercise) => (
            <div
              key={exercise.id}
              className="flex items-center justify-between p-3 rounded-lg bg-secondary/30"
            >
              <div>
                <p className="font-medium">{exercise.exercise_name}</p>
                {exercise.duration_minutes && (
                  <p className="text-sm text-muted-foreground">{exercise.duration_minutes} mins</p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-success font-medium">-{exercise.calories_burned} kcal</span>
                <button
                  onClick={() => onRemoveExercise(exercise.id)}
                  className="text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
