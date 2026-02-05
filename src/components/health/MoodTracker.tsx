import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface MoodTrackerProps {
  currentMood: "great" | "good" | "okay" | "bad" | "terrible" | null;
  onSetMood: (mood: "great" | "good" | "okay" | "bad" | "terrible") => Promise<{ error?: any }>;
}

const MOODS = [
  { value: "great", emoji: "😄", label: "Great", color: "bg-green-500/20 border-green-500" },
  { value: "good", emoji: "🙂", label: "Good", color: "bg-lime-500/20 border-lime-500" },
  { value: "okay", emoji: "😐", label: "Okay", color: "bg-yellow-500/20 border-yellow-500" },
  { value: "bad", emoji: "😔", label: "Bad", color: "bg-orange-500/20 border-orange-500" },
  { value: "terrible", emoji: "😢", label: "Terrible", color: "bg-red-500/20 border-red-500" },
] as const;

export const MoodTracker = ({ currentMood, onSetMood }: MoodTrackerProps) => {
  const [loading, setLoading] = useState(false);

  const handleSetMood = async (mood: "great" | "good" | "okay" | "bad" | "terrible") => {
    setLoading(true);
    await onSetMood(mood);
    setLoading(false);
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 rounded-lg bg-neon-purple/20 flex items-center justify-center">
          <span className="text-xl">🧘</span>
        </div>
        <div>
          <h3 className="font-semibold">How are you feeling?</h3>
          <p className="text-sm text-muted-foreground">Track your daily mood</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {MOODS.map((mood) => (
          <button
            key={mood.value}
            onClick={() => handleSetMood(mood.value)}
            disabled={loading}
            className={cn(
              "flex flex-col items-center gap-1 p-3 rounded-lg border-2 transition-all hover:scale-105",
              currentMood === mood.value
                ? mood.color
                : "bg-secondary/50 border-transparent hover:bg-secondary"
            )}
          >
            <span className="text-2xl">{mood.emoji}</span>
            <span className="text-xs">{mood.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
