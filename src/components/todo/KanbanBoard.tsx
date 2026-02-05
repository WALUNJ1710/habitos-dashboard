import { Task, Subtask, TaskCategory } from "@/hooks/useTasks";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";

interface KanbanBoardProps {
  tasks: Task[];
  subtasks: Subtask[];
  categories: TaskCategory[];
  onToggleStatus: (id: string, status: "todo" | "in_progress" | "done") => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onToggleSubtask: (id: string, completed: boolean) => void;
  onDeleteSubtask: (id: string) => void;
}

const columns = [
  { id: "todo", label: "To Do", color: "border-muted-foreground" },
  { id: "in_progress", label: "In Progress", color: "border-neon-blue" },
  { id: "done", label: "Done", color: "border-neon-green" },
] as const;

export const KanbanBoard = ({
  tasks,
  subtasks,
  categories,
  onToggleStatus,
  onDelete,
  onEdit,
  onAddSubtask,
  onToggleSubtask,
  onDeleteSubtask,
}: KanbanBoardProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((column) => {
        const columnTasks = tasks.filter((t) => t.status === column.id);

        return (
          <div key={column.id} className="flex flex-col">
            <div
              className={cn(
                "flex items-center gap-2 p-3 rounded-t-lg bg-secondary/50 border-b-2",
                column.color
              )}
            >
              <h3 className="font-semibold">{column.label}</h3>
              <span className="text-sm text-muted-foreground">({columnTasks.length})</span>
            </div>

            <div className="flex-1 p-2 space-y-2 bg-secondary/20 rounded-b-lg min-h-[200px]">
              {columnTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  subtasks={subtasks}
                  category={categories.find((c) => c.id === task.category_id)}
                  onToggle={(status) => onToggleStatus(task.id, status)}
                  onDelete={() => onDelete(task.id)}
                  onEdit={() => onEdit(task)}
                  onAddSubtask={(title) => onAddSubtask(task.id, title)}
                  onToggleSubtask={onToggleSubtask}
                  onDeleteSubtask={onDeleteSubtask}
                />
              ))}

              {columnTasks.length === 0 && (
                <div className="flex items-center justify-center h-24 text-sm text-muted-foreground">
                  No tasks
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
