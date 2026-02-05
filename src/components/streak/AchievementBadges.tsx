interface AchievementBadgesProps {
  currentStreak: number;
  longestStreak: number;
}

interface Badge {
  id: string;
  name: string;
  emoji: string;
  requirement: number;
  description: string;
}

const badges: Badge[] = [
  { id: "7days", name: "7 Day Streak", emoji: "🔥", requirement: 7, description: "7 consecutive days" },
  { id: "30days", name: "30 Day Warrior", emoji: "⚡", requirement: 30, description: "30 consecutive days" },
  { id: "100days", name: "100 Day Legend", emoji: "🏆", requirement: 100, description: "100 consecutive days" },
  { id: "365days", name: "Year Master", emoji: "👑", requirement: 365, description: "365 consecutive days" },
];

export const AchievementBadges = ({ currentStreak, longestStreak }: AchievementBadgesProps) => {
  return (
    <div className="glass-card rounded-xl p-6">
      <h3 className="font-semibold mb-4">Achievements</h3>
      <div className="flex flex-wrap gap-4">
        {badges.map((badge) => {
          const isUnlocked = longestStreak >= badge.requirement;
          const progress = Math.min(longestStreak, badge.requirement);

          return (
            <div
              key={badge.id}
              className={`flex items-center gap-3 p-3 rounded-lg bg-secondary/30 ${
                !isUnlocked && "opacity-50"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isUnlocked ? "bg-neon-orange" : "bg-secondary"
                }`}
              >
                {badge.emoji}
              </div>
              <div>
                <p className="font-medium">{badge.name}</p>
                <p className="text-xs text-muted-foreground">
                  {isUnlocked ? "Completed" : `${progress}/${badge.requirement} days`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
