import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon, Sparkles, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, TaskCategory } from "@/hooks/useTasks";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface AddTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: TaskCategory[];
  onAdd: (task: Partial<Task>) => Promise<void>;
  editTask?: Task | null;
  onUpdate?: (id: string, task: Partial<Task>) => Promise<void>;
}

export const AddTaskDialog = ({
  open,
  onOpenChange,
  categories,
  onAdd,
  editTask,
  onUpdate,
}: AddTaskDialogProps) => {
  const [title, setTitle] = useState(editTask?.title || "");
  const [description, setDescription] = useState(editTask?.description || "");
  const [priority, setPriority] = useState<Task["priority"]>(editTask?.priority || "medium");
  const [categoryId, setCategoryId] = useState(editTask?.category_id || "");
  const [dueDate, setDueDate] = useState<Date | undefined>(
    editTask?.due_date ? new Date(editTask.due_date) : undefined
  );
  const [dueTime, setDueTime] = useState(editTask?.due_time || "");
  const [isRecurring, setIsRecurring] = useState(editTask?.is_recurring || false);
  const [recurrenceType, setRecurrenceType] = useState<Task["recurrence_type"]>(
    editTask?.recurrence_type || "daily"
  );
  const [tags, setTags] = useState(editTask?.tags?.join(", ") || "");
  const [isFocusTask, setIsFocusTask] = useState(editTask?.is_focus_task || false);
  const [isBreakingDown, setIsBreakingDown] = useState(false);
  const [aiSubtasks, setAiSubtasks] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!title.trim()) return;

    const taskData: Partial<Task> = {
      title,
      description: description || null,
      priority,
      category_id: categoryId || null,
      due_date: dueDate ? format(dueDate, "yyyy-MM-dd") : null,
      due_time: dueTime || null,
      is_recurring: isRecurring,
      recurrence_type: isRecurring ? recurrenceType : null,
      tags: tags ? tags.split(",").map((t) => t.trim()).filter(Boolean) : null,
      is_focus_task: isFocusTask,
    };

    if (editTask && onUpdate) {
      await onUpdate(editTask.id, taskData);
    } else {
      await onAdd(taskData);
    }

    resetForm();
    onOpenChange(false);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPriority("medium");
    setCategoryId("");
    setDueDate(undefined);
    setDueTime("");
    setIsRecurring(false);
    setRecurrenceType("daily");
    setTags("");
    setIsFocusTask(false);
    setAiSubtasks([]);
  };

  const handleAIBreakdown = async () => {
    if (!title.trim()) {
      toast({ title: "Enter a task title first", variant: "destructive" });
      return;
    }

    setIsBreakingDown(true);
    try {
      const { data, error } = await supabase.functions.invoke("ai-assistant", {
        body: { type: "breakdown_task", taskTitle: title },
      });

      if (error) throw error;

      const content = data.content;
      // Try to parse JSON from the response
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const subtasks = JSON.parse(jsonMatch[0]);
        setAiSubtasks(subtasks.map((s: { title: string }) => s.title));
        toast({ title: "Task broken down!", description: `${subtasks.length} subtasks generated.` });
      }
    } catch (error) {
      console.error("AI breakdown error:", error);
      toast({ title: "AI Error", description: "Could not break down the task.", variant: "destructive" });
    } finally {
      setIsBreakingDown(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editTask ? "Edit Task" : "Add New Task"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Title</Label>
            <div className="flex gap-2">
              <Input
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <Button
                variant="outline"
                size="icon"
                onClick={handleAIBreakdown}
                disabled={isBreakingDown}
                title="AI Task Breakdown"
              >
                {isBreakingDown ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Add details..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select value={priority} onValueChange={(v) => setPriority(v as Task["priority"])}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">🟢 Low</SelectItem>
                  <SelectItem value="medium">🟡 Medium</SelectItem>
                  <SelectItem value="high">🟠 High</SelectItem>
                  <SelectItem value="urgent">🔴 Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dueDate ? format(dueDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Due Time</Label>
              <Input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Tags (comma separated)</Label>
            <Input
              placeholder="work, important, review"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
              <Label>Recurring task</Label>
            </div>
            {isRecurring && (
              <Select
                value={recurrenceType || "daily"}
                onValueChange={(v) => setRecurrenceType(v as Task["recurrence_type"])}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Switch checked={isFocusTask} onCheckedChange={setIsFocusTask} />
            <Label>Focus task (show in Today view)</Label>
          </div>

          {aiSubtasks.length > 0 && (
            <div className="p-3 rounded-lg bg-secondary/30">
              <Label className="text-sm text-muted-foreground mb-2 block">
                AI-Generated Subtasks (will be added after creating task)
              </Label>
              <ul className="space-y-1">
                {aiSubtasks.map((subtask, i) => (
                  <li key={i} className="text-sm flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {subtask}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-gradient-primary">
              {editTask ? "Update Task" : "Add Task"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
