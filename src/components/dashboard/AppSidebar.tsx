 import {
   LayoutDashboard,
   CheckSquare,
   Flame,
   Heart,
   Apple,
   Wallet,
   BarChart3,
   Settings,
 } from "lucide-react";
 import { NavLink } from "@/components/NavLink";
 import { useLocation } from "react-router-dom";
 import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarHeader,
   SidebarFooter,
   useSidebar,
 } from "@/components/ui/sidebar";
 
 const menuItems = [
   { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
   { title: "To-Do Manager", url: "/dashboard/todos", icon: CheckSquare },
   { title: "Streak Tracker", url: "/dashboard/streaks", icon: Flame },
   { title: "Health Tracker", url: "/dashboard/health", icon: Heart },
   { title: "Calorie Manager", url: "/dashboard/calories", icon: Apple },
   { title: "Budget Tracker", url: "/dashboard/budget", icon: Wallet },
   { title: "Reports", url: "/dashboard/reports", icon: BarChart3 },
   { title: "Settings", url: "/dashboard/settings", icon: Settings },
 ];
 
 export function AppSidebar() {
   const location = useLocation();
   const { state } = useSidebar();
   const isCollapsed = state === "collapsed";
 
   return (
     <Sidebar collapsible="icon" className="border-r border-sidebar-border">
       <SidebarHeader className="p-4 border-b border-sidebar-border">
         <div className="flex items-center gap-3">
           <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
             <span className="text-sm font-bold text-primary-foreground">H</span>
           </div>
           {!isCollapsed && (
             <span className="text-lg font-bold text-gradient">HabitOS</span>
           )}
         </div>
       </SidebarHeader>
 
       <SidebarContent className="px-2 py-4">
         <SidebarGroup>
           <SidebarGroupContent>
             <SidebarMenu>
               {menuItems.map((item) => {
                 const isActive = location.pathname === item.url || 
                   (item.url !== "/dashboard" && location.pathname.startsWith(item.url));
                 
                 return (
                   <SidebarMenuItem key={item.title}>
                     <SidebarMenuButton
                       asChild
                       isActive={isActive}
                       tooltip={item.title}
                     >
                       <NavLink
                         to={item.url}
                         end={item.url === "/dashboard"}
                         className="flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 hover:bg-sidebar-accent"
                         activeClassName="bg-sidebar-accent text-sidebar-primary"
                       >
                         <item.icon className={`h-5 w-5 ${isActive ? 'text-sidebar-primary' : 'text-sidebar-foreground'}`} />
                         {!isCollapsed && (
                           <span className={isActive ? 'text-sidebar-primary font-medium' : ''}>
                             {item.title}
                           </span>
                         )}
                       </NavLink>
                     </SidebarMenuButton>
                   </SidebarMenuItem>
                 );
               })}
             </SidebarMenu>
           </SidebarGroupContent>
         </SidebarGroup>
       </SidebarContent>
 
       <SidebarFooter className="p-4 border-t border-sidebar-border">
         <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
           <div className="w-2 h-2 rounded-full bg-neon-green animate-pulse" />
           {!isCollapsed && (
             <span className="text-xs text-muted-foreground">System Online</span>
           )}
         </div>
       </SidebarFooter>
     </Sidebar>
   );
 }