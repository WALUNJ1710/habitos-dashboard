import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useProfile, Profile } from "@/hooks/useProfile";
import { useTheme, Theme } from "@/hooks/useTheme";

interface GamificationLevel {
  id: string;
  level: number;
  name: string;
  xp_required: number;
  badge_emoji: string | null;
}

interface AppContextType {
  user: User | null;
  profile: Profile | null;
  profileLoading: boolean;
  updateProfile: (updates: Partial<Profile>) => Promise<{ data?: Profile; error?: Error }>;
  theme: Theme;
  toggleTheme: () => void;
  gamificationLevels: GamificationLevel[];
  currentLevel: GamificationLevel | null;
  nextLevel: GamificationLevel | null;
  xpToNextLevel: number;
  xpProgress: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children, user }: { children: ReactNode; user: User | null }) => {
  const { profile, loading: profileLoading, updateProfile } = useProfile(user);
  const { theme, toggleTheme } = useTheme();
  const [gamificationLevels, setGamificationLevels] = useState<GamificationLevel[]>([]);

  useEffect(() => {
    const fetchLevels = async () => {
      const { data } = await supabase
        .from("gamification_levels")
        .select("*")
        .order("level", { ascending: true });
      
      if (data) {
        setGamificationLevels(data as GamificationLevel[]);
      }
    };

    fetchLevels();
  }, []);

  const currentLevel = gamificationLevels.find((l) => l.level === (profile?.level || 1)) || null;
  const nextLevel = gamificationLevels.find((l) => l.level === (profile?.level || 1) + 1) || null;
  
  const xpToNextLevel = nextLevel ? nextLevel.xp_required - (profile?.xp_points || 0) : 0;
  const xpProgress = nextLevel && currentLevel
    ? ((profile?.xp_points || 0) - currentLevel.xp_required) / (nextLevel.xp_required - currentLevel.xp_required) * 100
    : 100;

  return (
    <AppContext.Provider
      value={{
        user,
        profile,
        profileLoading,
        updateProfile,
        theme,
        toggleTheme,
        gamificationLevels,
        currentLevel,
        nextLevel,
        xpToNextLevel,
        xpProgress,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};
