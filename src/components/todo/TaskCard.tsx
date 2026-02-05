import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { format } from "date-fns";
import {
  MoreVertical,
  Trash2,
  Edit2,
  ChevronDown,
  Plus,
  Clock,
  Calendar,
  Flag,
  Repeat,
  Target,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Task, Subtask, TaskCategory } from "@/hooks/useTasks";

interface TaskCardProps {
  task: Task;
  subtasks: Subtask[];
  category?: TaskCategory;
  onToggle: (status: "todo" | "in_progress" | "done") => void;
  onDelete: () => void;
  onEdit: () => void;
  onAddSubtask: (title: string) => void;
  onToggleSubtask: (id: string, completed: boolean) => void;
  onDeleteSubtask: (id: string) => void;
}

const priorityColors = {
  low: "bg-success/20 text-success border-success/30",
  medium: "bg-warning/20 text-warning border-warning/30",
  high: "bg-neon-orange/20 text-neon-orange border-neon-orange/30",
  urgent: "bg-destructive/20 text-destructive border-destructive/30",
};

const statusColors = {
  todo: "border-l-muted-foreground",
  in_progress: "border-l-neon-blue",
  done: "border-l-neon-green",
};

export const TaskCard = ({
  task,
  subtasks,
  category,
  onToggle,
  onDelete,
  onEdit,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
}: TaskCardProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newSubtask, setNewSubtask] = useState("");

  const taskSubtasks = subtasks.filter((s) => s.task_id === task.id);
  const completedSubtasks = taskSubtasks.filter((s) => s.is_completed).length;
  const isDone = task.status === "done";

  const handleAddSubtask = () => {
    if (newSubtask.trim()) {
      onAddSubtask(newSubtask);
      setNewSubtask("");
    }
  };

  return (
    <div
      className={cn(
        "p-4 rounded-lg bg-secondary/30 border-l-4 transition-all hover:bg-secondary/50",
        statusColors[task.status],
        isDone && "opacity-60"
      )}
    >
      <div className="flex items-start gap-3">
        <Checkbox
          checked={isDone}
          onCheckedChange={(checked) =>
            onToggle(checked ? "done" : "todo")
          }
          className="mt-1"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={cn("font-medium", isDone && "line-through text-muted-foreground")}>
              {task.title}
            </p>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onEdit}>
                  <Edit2 className="h-4 w-4 mr-2" /> Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onToggle("in_progress")}>
                  <Clock className="h-4 w-4 mr-2" /> In Progress
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4 mr-2" /> Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {task.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="outline" className={priorityColors[task.priority]}>
              <Flag className="h-3 w-3 mr-1" />
              {task.priority}
            </Badge>

            {category && (
              <Badge
                variant="outline"
                style={{ borderColor: category.color, color: category.color }}
              >
                {category.name}
              </Badge>
            )}

            {task.due_date && (
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                <Calendar className="h-3 w-3 mr-1" />
                {format(new Date(task.due_date), "MMM d")}
              </Badge>
            )}

            {task.is_recurring && (
              <Badge variant="outline" className="bg-neon-purple/10 text-neon-purple border-neon-purple/30">
                <Repeat className="h-3 w-3 mr-1" />
                {task.recurrence_type}
              </Badge>
            )}

            {task.goal_id && (
              <Badge variant="outline" className="bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30">
                <Target className="h-3 w-3 mr-1" />
                Goal
              </Badge>
            )}

            {task.time_spent_minutes > 0 && (
              <Badge variant="secondary">
                <Clock className="h-3 w-3 mr-1" />
                {Math.floor(task.time_spent_minutes / 60)}h {task.time_spent_minutes % 60}m
              </Badge>
            )}

            {taskSubtasks.length > 0 && (
              <Badge variant="secondary">
                {completedSubtasks}/{taskSubtasks.length} subtasks
              </Badge>
            )}
          </div>

          {task.tags && task.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {task.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Subtasks */}
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="mt-2 -ml-2">
                <ChevronDown
                  className={cn("h-4 w-4 mr-1 transition-transform", isOpen && "rotate-180")}
                />
                Subtasks
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2 space-y-2">
              {taskSubtasks.map((subtask) => (
                <div key={subtask.id} className="flex items-center gap-2 pl-2">
                  <Checkbox
                    checked={subtask.is_completed}
                    onCheckedChange={(checked) =>
                      onToggleSubtask(subtask.id, checked as boolean)
                    }
                  />
                  <span
                    className={cn(
                      "flex-1 text-sm",
                      subtask.is_completed && "line-through text-muted-foreground"
                    )}
                  >
                    {subtask.title}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-destructive"
                    onClick={() => onDeleteSubtask(subtask.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
              <div className="flex gap-2 pl-2">
                <Input
                  placeholder="Add subtask..."
                  value={newSubtask}
                  onChange={(e) => setNewSubtask(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddSubtask()}
                  className="h-8 text-sm"
                />
                <Button size="sm" onClick={handleAddSubtask}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    </div>
  );
};
