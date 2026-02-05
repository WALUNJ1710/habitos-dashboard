import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Snowflake, SkipForward, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { HabitWithStreak } from "@/hooks/useHabits";

interface HabitCardProps {
  habit: HabitWithStreak;
  onToggle: (habitId: string, completed: boolean) => void;
  onSkip: (habitId: string) => void;
  onFreeze: (habitId: string) => void;
  onDelete: (habitId: string) => void;
}

const getStreakLevelColor = (level: string) => {
  switch (level) {
    case "diamond":
      return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    case "gold":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    case "silver":
      return "bg-gray-400/20 text-gray-300 border-gray-400/30";
    default:
      return "bg-orange-500/20 text-orange-400 border-orange-500/30";
  }
};

const getStreakLevelEmoji = (level: string) => {
  switch (level) {
    case "diamond":
      return "💎";
    case "gold":
      return "🥇";
    case "silver":
      return "🥈";
    default:
      return "🥉";
  }
};

export const HabitCard = ({ habit, onToggle, onSkip, onFreeze, onDelete }: HabitCardProps) => {
  const isCompleted = habit.todayLog && !habit.todayLog.skipped;
  const isSkipped = habit.todayLog?.skipped;

  return (
    <div
      className={cn(
        "flex items-center gap-4 p-4 rounded-lg bg-secondary/30 transition-all hover:bg-secondary/50",
        isCompleted && "border-l-4",
        isSkipped && "opacity-60"
      )}
      style={{ borderLeftColor: isCompleted ? habit.color : undefined }}
    >
      <Checkbox
        checked={isCompleted}
        onCheckedChange={(checked) => onToggle(habit.id, checked as boolean)}
        className="h-5 w-5"
        disabled={isSkipped}
      />

      <div
        className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
        style={{ backgroundColor: `${habit.color}20` }}
      >
        {habit.icon || "🎯"}
      </div>

      <div className="flex-1 min-w-0">
        <p className={cn("font-medium truncate", isCompleted && "text-success line-through")}>
          {habit.name}
        </p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <Badge
            variant="outline"
            className="bg-neon-orange/10 text-neon-orange border-neon-orange/30"
          >
            🔥 {habit.streak?.current_streak || 0} days
          </Badge>
          {habit.streak && (
            <Badge variant="outline" className={getStreakLevelColor(habit.streak.streak_level)}>
              {getStreakLevelEmoji(habit.streak.streak_level)} {habit.streak.streak_level}
            </Badge>
          )}
          <span className="text-xs text-muted-foreground">
            Best: {habit.streak?.longest_streak || 0} days
          </span>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onSkip(habit.id)}>
            <SkipForward className="h-4 w-4 mr-2" />
            Skip Today
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onFreeze(habit.id)}
            disabled={(habit.streak?.streak_freezes_available || 0) <= 0}
          >
            <Snowflake className="h-4 w-4 mr-2" />
            Use Streak Freeze ({habit.streak?.streak_freezes_available || 0} left)
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDelete(habit.id)}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete Habit
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
