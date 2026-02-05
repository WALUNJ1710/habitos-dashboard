import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Droplet, Plus, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface WaterTrackerProps {
  currentMl: number;
  goalMl?: number;
  onAddWater: (amount: number) => Promise<{ error?: any }>;
}

const WATER_AMOUNTS = [250, 500, 750];

export const WaterTracker = ({ currentMl, goalMl = 2500, onAddWater }: WaterTrackerProps) => {
  const [loading, setLoading] = useState(false);
  const progress = Math.min((currentMl / goalMl) * 100, 100);
  const glasses = Math.floor(currentMl / 250);

  const handleAdd = async (amount: number) => {
    setLoading(true);
    await onAddWater(amount);
    setLoading(false);
  };

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neon-cyan/20 flex items-center justify-center">
            <Droplet className="h-5 w-5 text-neon-cyan" />
          </div>
          <div>
            <h3 className="font-semibold">Water Intake</h3>
            <p className="text-sm text-muted-foreground">
              {currentMl} / {goalMl} ml
            </p>
          </div>
        </div>
        <span className="text-2xl font-bold text-neon-cyan">{glasses} 🥛</span>
      </div>

      {/* Progress bar */}
      <div className="relative h-4 bg-secondary rounded-full overflow-hidden mb-4">
        <div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-neon-cyan to-blue-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Quick add buttons */}
      <div className="flex gap-2">
        {WATER_AMOUNTS.map((amount) => (
          <Button
            key={amount}
            variant="outline"
            className="flex-1"
            onClick={() => handleAdd(amount)}
            disabled={loading}
          >
            <Plus className="h-4 w-4 mr-1" />
            {amount}ml
          </Button>
        ))}
      </div>
    </div>
  );
};
