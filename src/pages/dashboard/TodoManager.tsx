 import { useState } from "react";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Checkbox } from "@/components/ui/checkbox";
 import { Badge } from "@/components/ui/badge";
 import { Progress } from "@/components/ui/progress";
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
 import { CalendarIcon, Plus, Trash2, Edit2, X, Check } from "lucide-react";
 import { cn } from "@/lib/utils";
 
 interface Todo {
   id: string;
   title: string;
   completed: boolean;
   priority: "low" | "medium" | "high";
   category: string;
   dueDate?: Date;
 }
 
 const categories = ["Work", "Personal", "Health", "Finance", "Learning"];
 
 // Empty initial todos - user will add their own
 const initialTodos: Todo[] = [];
 
 const TodoManager = () => {
   const [todos, setTodos] = useState<Todo[]>(initialTodos);
   const [newTodo, setNewTodo] = useState("");
   const [newPriority, setNewPriority] = useState<"low" | "medium" | "high">("medium");
   const [newCategory, setNewCategory] = useState("Personal");
   const [newDueDate, setNewDueDate] = useState<Date>();
   const [editingId, setEditingId] = useState<string | null>(null);
   const [editText, setEditText] = useState("");
 
   const completedCount = todos.filter((t) => t.completed).length;
   const progress = todos.length > 0 ? (completedCount / todos.length) * 100 : 0;
 
   const addTodo = () => {
     if (!newTodo.trim()) return;
     const todo: Todo = {
       id: Date.now().toString(),
       title: newTodo,
       completed: false,
       priority: newPriority,
       category: newCategory,
       dueDate: newDueDate,
     };
     setTodos([...todos, todo]);
     setNewTodo("");
     setNewDueDate(undefined);
   };
 
   const toggleTodo = (id: string) => {
     setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
   };
 
   const deleteTodo = (id: string) => {
     setTodos(todos.filter((t) => t.id !== id));
   };
 
   const startEdit = (todo: Todo) => {
     setEditingId(todo.id);
     setEditText(todo.title);
   };
 
   const saveEdit = (id: string) => {
     setTodos(todos.map((t) => (t.id === id ? { ...t, title: editText } : t)));
     setEditingId(null);
   };
 
   const getPriorityColor = (priority: string) => {
     switch (priority) {
       case "high": return "bg-destructive/20 text-destructive border-destructive/30";
       case "medium": return "bg-warning/20 text-warning border-warning/30";
       case "low": return "bg-success/20 text-success border-success/30";
       default: return "";
     }
   };
 
   return (
     <div className="space-y-6 animate-fade-in">
       <div>
         <h1 className="text-3xl font-bold">To-Do Manager</h1>
         <p className="text-muted-foreground mt-1">Stay organized and productive</p>
       </div>
 
       {/* Progress */}
       <div className="glass-card rounded-xl p-6">
         <div className="flex items-center justify-between mb-4">
           <h3 className="font-semibold">Today's Progress</h3>
           <span className="text-sm text-muted-foreground">{completedCount}/{todos.length} tasks</span>
         </div>
         <Progress value={progress} className="h-3" />
       </div>
 
       {/* Add Todo */}
       <div className="glass-card rounded-xl p-6">
         <h3 className="font-semibold mb-4">Add New Task</h3>
         <div className="flex flex-col sm:flex-row gap-4">
           <Input
             placeholder="What needs to be done?"
             value={newTodo}
             onChange={(e) => setNewTodo(e.target.value)}
             onKeyPress={(e) => e.key === "Enter" && addTodo()}
             className="flex-1 bg-secondary/50"
           />
           <Select value={newPriority} onValueChange={(v: any) => setNewPriority(v)}>
             <SelectTrigger className="w-full sm:w-32 bg-secondary/50">
               <SelectValue placeholder="Priority" />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="low">Low</SelectItem>
               <SelectItem value="medium">Medium</SelectItem>
               <SelectItem value="high">High</SelectItem>
             </SelectContent>
           </Select>
           <Select value={newCategory} onValueChange={setNewCategory}>
             <SelectTrigger className="w-full sm:w-32 bg-secondary/50">
               <SelectValue placeholder="Category" />
             </SelectTrigger>
             <SelectContent>
               {categories.map((cat) => (
                 <SelectItem key={cat} value={cat}>{cat}</SelectItem>
               ))}
             </SelectContent>
           </Select>
           <Popover>
             <PopoverTrigger asChild>
               <Button variant="outline" className="w-full sm:w-auto bg-secondary/50">
                 <CalendarIcon className="mr-2 h-4 w-4" />
                 {newDueDate ? format(newDueDate, "PPP") : "Due date"}
               </Button>
             </PopoverTrigger>
             <PopoverContent className="w-auto p-0" align="start">
               <Calendar
                 mode="single"
                 selected={newDueDate}
                 onSelect={setNewDueDate}
                 initialFocus
                 className="pointer-events-auto"
               />
             </PopoverContent>
           </Popover>
           <Button onClick={addTodo} className="bg-gradient-primary">
             <Plus className="mr-2 h-4 w-4" /> Add
           </Button>
         </div>
       </div>
 
       {/* Todo List */}
       <div className="glass-card rounded-xl p-6">
         <h3 className="font-semibold mb-4">Tasks</h3>
         {todos.length > 0 ? (
           <div className="space-y-3">
             {todos.map((todo) => (
             <div
               key={todo.id}
               className={cn(
                 "flex items-center gap-4 p-4 rounded-lg bg-secondary/30 transition-all",
                 todo.completed && "opacity-60"
               )}
             >
               <Checkbox
                 checked={todo.completed}
                 onCheckedChange={() => toggleTodo(todo.id)}
               />
               <div className="flex-1 min-w-0">
                 {editingId === todo.id ? (
                   <div className="flex gap-2">
                     <Input
                       value={editText}
                       onChange={(e) => setEditText(e.target.value)}
                       className="bg-secondary"
                       autoFocus
                     />
                     <Button size="icon" variant="ghost" onClick={() => saveEdit(todo.id)}>
                       <Check className="h-4 w-4" />
                     </Button>
                     <Button size="icon" variant="ghost" onClick={() => setEditingId(null)}>
                       <X className="h-4 w-4" />
                     </Button>
                   </div>
                 ) : (
                   <p className={cn("font-medium", todo.completed && "line-through")}>{todo.title}</p>
                 )}
                 <div className="flex items-center gap-2 mt-1">
                   <Badge variant="outline" className={getPriorityColor(todo.priority)}>
                     {todo.priority}
                   </Badge>
                   <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
                     {todo.category}
                   </Badge>
                   {todo.dueDate && (
                     <span className="text-xs text-muted-foreground">
                       Due: {format(todo.dueDate, "MMM d")}
                     </span>
                   )}
                 </div>
               </div>
               {editingId !== todo.id && (
                 <div className="flex gap-1">
                   <Button size="icon" variant="ghost" onClick={() => startEdit(todo)}>
                     <Edit2 className="h-4 w-4" />
                   </Button>
                   <Button size="icon" variant="ghost" onClick={() => deleteTodo(todo.id)} className="text-destructive hover:text-destructive">
                     <Trash2 className="h-4 w-4" />
                   </Button>
                 </div>
               )}
             </div>
             ))}
           </div>
         ) : (
           <div className="text-center py-8 text-muted-foreground">
             <p>No tasks yet. Add your first task above to get started!</p>
           </div>
         )}
       </div>
     </div>
   );
 };
 
 export default TodoManager;