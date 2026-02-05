import { Award, Trophy, Star, Medal } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface Achievement {
  id: string;
  badge_name: string;
  badge_emoji: string | null;
  earned_at: string;
}

interface AchievementHistoryProps {
  achievements: Achievement[];
}

export const AchievementHistory = ({ achievements }: AchievementHistoryProps) => {
  const defaultBadges = [
    { name: "First Steps", emoji: "👣", description: "Complete your first task" },
    { name: "Streak Starter", emoji: "🔥", description: "Maintain a 3-day streak" },
    { name: "Week Warrior", emoji: "⚔️", description: "Complete all habits for a week" },
    { name: "Budget Master", emoji: "💰", description: "Stay under budget for a month" },
    { name: "Health Champion", emoji: "🏆", description: "Log health data for 30 days" },
  ];

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-warning flex items-center justify-center">
          <Trophy className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h3 className="font-semibold">Achievement History</h3>
          <p className="text-sm text-muted-foreground">{achievements.length} badges earned</p>
        </div>
      </div>

      {achievements.length > 0 ? (
        <div className="space-y-3">
          {achievements.slice(0, 10).map((achievement) => (
            <div 
              key={achievement.id} 
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
            >
              <span className="text-2xl">{achievement.badge_emoji || "🏅"}</span>
              <div className="flex-1">
                <p className="font-medium">{achievement.badge_name}</p>
                <p className="text-xs text-muted-foreground">
                  Earned {format(new Date(achievement.earned_at), "MMM d, yyyy")}
                </p>
              </div>
              <Star className="h-4 w-4 text-warning" />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground mb-4">
            Complete activities to earn badges! Here are some you can unlock:
          </p>
          {defaultBadges.map((badge, i) => (
            <div 
              key={i} 
              className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 border border-dashed border-secondary"
            >
              <span className="text-2xl opacity-50">{badge.emoji}</span>
              <div className="flex-1">
                <p className="font-medium text-muted-foreground">{badge.name}</p>
                <p className="text-xs text-muted-foreground/70">{badge.description}</p>
              </div>
              <Medal className="h-4 w-4 text-muted-foreground/50" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
