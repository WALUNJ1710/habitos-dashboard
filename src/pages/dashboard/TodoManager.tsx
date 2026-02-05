import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Search,
  Filter,
  LayoutGrid,
  List,
  Target,
  Calendar,
  Loader2,
} from "lucide-react";
import { useTasks, Task } from "@/hooks/useTasks";
import { TaskCard } from "@/components/todo/TaskCard";
import { AddTaskDialog } from "@/components/todo/AddTaskDialog";
import { KanbanBoard } from "@/components/todo/KanbanBoard";
import { AIAssistant } from "@/components/todo/AIAssistant";

type ViewMode = "list" | "kanban";
type FilterStatus = "all" | "todo" | "in_progress" | "done";
type FilterPriority = "all" | "low" | "medium" | "high" | "urgent";

const TodoManager = () => {
  const {
    tasks,
    subtasks,
    categories,
    loading,
    addTask,
    updateTask,
    deleteTask,
    addSubtask,
    toggleSubtask,
    deleteSubtask,
  } = useTasks();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("all");
  const [filterPriority, setFilterPriority] = useState<FilterPriority>("all");
  const [activeTab, setActiveTab] = useState("all");

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    // Search filter
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    // Status filter
    if (filterStatus !== "all" && task.status !== filterStatus) {
      return false;
    }
    // Priority filter
    if (filterPriority !== "all" && task.priority !== filterPriority) {
      return false;
    }
    // Tab filter
    if (activeTab === "today") {
      const today = new Date().toISOString().split("T")[0];
      return task.due_date === today || task.is_focus_task;
    }
    if (activeTab === "upcoming") {
      const today = new Date();
      return task.due_date && new Date(task.due_date) > today;
    }
    return true;
  });

  // Calculate stats
  const completedCount = tasks.filter((t) => t.status === "done").length;
  const inProgressCount = tasks.filter((t) => t.status === "in_progress").length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  const handleToggleStatus = async (id: string, status: "todo" | "in_progress" | "done") => {
    await updateTask(id, { 
      status, 
      completed_at: status === "done" ? new Date().toISOString() : null 
    });
  };

  const handleAddTask = async (task: Partial<Task>) => {
    await addTask(task);
  };

  const handleUpdateTask = async (id: string, task: Partial<Task>) => {
    await updateTask(id, task);
    setEditingTask(null);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowAddDialog(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">To-Do Manager</h1>
          <p className="text-muted-foreground mt-1">Stay organized and productive</p>
        </div>
        <div className="flex gap-2">
          <AIAssistant />
          <Button onClick={() => setShowAddDialog(true)} className="bg-gradient-primary">
            <Plus className="mr-2 h-4 w-4" /> Add Task
          </Button>
        </div>
      </div>

      {/* Progress Card */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold">Today's Progress</h3>
          <div className="flex gap-4 text-sm">
            <span className="text-muted-foreground">
              <Badge variant="secondary" className="mr-1">{completedCount}</Badge> Done
            </span>
            <span className="text-muted-foreground">
              <Badge variant="secondary" className="mr-1 bg-neon-blue/20">{inProgressCount}</Badge> In Progress
            </span>
            <span className="text-muted-foreground">
              <Badge variant="secondary" className="mr-1">{tasks.length - completedCount - inProgressCount}</Badge> Todo
            </span>
          </div>
        </div>
        <Progress value={progress} className="h-3" />
        <p className="text-sm text-muted-foreground mt-2">
          {completedCount} of {tasks.length} tasks completed ({Math.round(progress)}%)
        </p>
      </div>

      {/* Filters & Controls */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary/50"
            />
          </div>

          <div className="flex gap-2">
            <Select value={filterStatus} onValueChange={(v) => setFilterStatus(v as FilterStatus)}>
              <SelectTrigger className="w-32 bg-secondary/50">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="todo">To Do</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="done">Done</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPriority} onValueChange={(v) => setFilterPriority(v as FilterPriority)}>
              <SelectTrigger className="w-32 bg-secondary/50">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priority</SelectItem>
                <SelectItem value="urgent">🔴 Urgent</SelectItem>
                <SelectItem value="high">🟠 High</SelectItem>
                <SelectItem value="medium">🟡 Medium</SelectItem>
                <SelectItem value="low">🟢 Low</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === "kanban" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setViewMode("kanban")}
              >
                <LayoutGrid className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-secondary/50">
          <TabsTrigger value="all" className="gap-2">
            <Target className="h-4 w-4" /> All Tasks
          </TabsTrigger>
          <TabsTrigger value="today" className="gap-2">
            🔥 Today's Focus
          </TabsTrigger>
          <TabsTrigger value="upcoming" className="gap-2">
            <Calendar className="h-4 w-4" /> Upcoming
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {viewMode === "kanban" ? (
            <KanbanBoard
              tasks={filteredTasks}
              subtasks={subtasks}
              categories={categories}
              onToggleStatus={handleToggleStatus}
              onDelete={deleteTask}
              onEdit={handleEdit}
              onAddSubtask={addSubtask}
              onToggleSubtask={toggleSubtask}
              onDeleteSubtask={deleteSubtask}
            />
          ) : (
            <div className="glass-card rounded-xl p-6">
              {filteredTasks.length > 0 ? (
                <div className="space-y-3">
                  {filteredTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      subtasks={subtasks}
                      category={categories.find((c) => c.id === task.category_id)}
                      onToggle={(status) => handleToggleStatus(task.id, status)}
                      onDelete={() => deleteTask(task.id)}
                      onEdit={() => handleEdit(task)}
                      onAddSubtask={(title) => addSubtask(task.id, title)}
                      onToggleSubtask={toggleSubtask}
                      onDeleteSubtask={deleteSubtask}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No tasks found</p>
                  <p className="text-sm">Add your first task to get started!</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Add/Edit Task Dialog */}
      <AddTaskDialog
        open={showAddDialog}
        onOpenChange={(open) => {
          setShowAddDialog(open);
          if (!open) setEditingTask(null);
        }}
        categories={categories}
        onAdd={handleAddTask}
        editTask={editingTask}
        onUpdate={handleUpdateTask}
      />
    </div>
  );
};

export default TodoManager;
