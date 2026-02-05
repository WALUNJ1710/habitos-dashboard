import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Pill, Trash2, Check } from "lucide-react";
import { MedicineReminder, MedicineLog } from "@/hooks/useHealthLogs";
import { cn } from "@/lib/utils";

interface MedicineReminderProps {
  reminders: MedicineReminder[];
  logs: MedicineLog[];
  onAdd: (medicine: {
    medicine_name: string;
    dosage: string | null;
    reminder_times: string[];
  }) => Promise<{ error?: any }>;
  onMarkTaken: (reminderId: string) => Promise<{ error?: any }>;
  onDelete: (id: string) => Promise<void>;
}

export const MedicineReminderCard = ({
  reminders,
  logs,
  onAdd,
  onMarkTaken,
  onDelete,
}: MedicineReminderProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    medicine_name: "",
    dosage: "",
    reminder_times: ["08:00"],
  });

  const handleSubmit = async () => {
    if (!formData.medicine_name.trim()) return;

    setLoading(true);
    const result = await onAdd({
      medicine_name: formData.medicine_name,
      dosage: formData.dosage || null,
      reminder_times: formData.reminder_times,
    });
    setLoading(false);

    if (!result.error) {
      setFormData({ medicine_name: "", dosage: "", reminder_times: ["08:00"] });
      setOpen(false);
    }
  };

  const isTaken = (reminderId: string) => logs.some((l) => l.reminder_id === reminderId);

  return (
    <div className="glass-card rounded-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-neon-orange/20 flex items-center justify-center">
            <Pill className="h-5 w-5 text-neon-orange" />
          </div>
          <div>
            <h3 className="font-semibold">Medicine Reminders</h3>
            <p className="text-sm text-muted-foreground">Track your medications</p>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Medicine Reminder</DialogTitle>
              <DialogDescription>Set up a reminder for your medication</DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Medicine Name</Label>
                <Input
                  placeholder="e.g., Vitamin D"
                  value={formData.medicine_name}
                  onChange={(e) => setFormData({ ...formData, medicine_name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Dosage (optional)</Label>
                <Input
                  placeholder="e.g., 1 tablet"
                  value={formData.dosage}
                  onChange={(e) => setFormData({ ...formData, dosage: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Reminder Time</Label>
                <Input
                  type="time"
                  value={formData.reminder_times[0]}
                  onChange={(e) => setFormData({ ...formData, reminder_times: [e.target.value] })}
                />
              </div>
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading || !formData.medicine_name.trim()}>
                {loading ? "Adding..." : "Add Reminder"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {reminders.length > 0 ? (
        <div className="space-y-3">
          {reminders.map((reminder) => {
            const taken = isTaken(reminder.id);
            return (
              <div
                key={reminder.id}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg bg-secondary/30",
                  taken && "border-l-4 border-neon-green"
                )}
              >
                <div className="flex items-center gap-3">
                  <Checkbox
                    checked={taken}
                    onCheckedChange={() => !taken && onMarkTaken(reminder.id)}
                    disabled={taken}
                  />
                  <div>
                    <p className={cn("font-medium", taken && "line-through text-muted-foreground")}>
                      {reminder.medicine_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {reminder.dosage} • {reminder.reminder_times.join(", ")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {taken && <Check className="h-4 w-4 text-neon-green" />}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => onDelete(reminder.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground text-center py-4">
          No medicine reminders. Add one to start tracking!
        </p>
      )}
    </div>
  );
};
