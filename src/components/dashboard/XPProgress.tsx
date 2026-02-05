import { Progress } from "@/components/ui/progress";
import { useApp } from "@/contexts/AppContext";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const XPProgress = () => {
  const { profile, currentLevel, nextLevel, xpProgress, xpToNextLevel } = useApp();

  if (!profile || !currentLevel) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary/30 cursor-pointer hover:bg-secondary/50 transition-colors">
          <div className="text-2xl">{currentLevel.badge_emoji}</div>
          <div className="flex-1 min-w-[100px]">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium">Level {currentLevel.level}</span>
              <span className="text-muted-foreground">{profile.xp_points} XP</span>
            </div>
            <Progress value={xpProgress} className="h-1.5" />
          </div>
        </div>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="text-center">
        <p className="font-medium">{currentLevel.name}</p>
        {nextLevel && (
          <p className="text-xs text-muted-foreground">
            {xpToNextLevel} XP to {nextLevel.name}
          </p>
        )}
      </TooltipContent>
    </Tooltip>
  );
};
