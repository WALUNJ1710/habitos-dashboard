import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import TodoManager from "./pages/dashboard/TodoManager";
import StreakTracker from "./pages/dashboard/StreakTracker";
import HealthTracker from "./pages/dashboard/HealthTracker";
import CalorieManager from "./pages/dashboard/CalorieManager";
import BudgetTracker from "./pages/dashboard/BudgetTracker";
import Reports from "./pages/dashboard/Reports";
import Settings from "./pages/dashboard/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="todos" element={<TodoManager />} />
            <Route path="streaks" element={<StreakTracker />} />
            <Route path="health" element={<HealthTracker />} />
            <Route path="calories" element={<CalorieManager />} />
            <Route path="budget" element={<BudgetTracker />} />
            <Route path="reports" element={<Reports />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
