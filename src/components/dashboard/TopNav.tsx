 import { User } from "@supabase/supabase-js";
 import { supabase } from "@/integrations/supabase/client";
 import { useNavigate } from "react-router-dom";
 import { Button } from "@/components/ui/button";
 import { SidebarTrigger } from "@/components/ui/sidebar";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuLabel,
   DropdownMenuSeparator,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu";
 import { Bell, LogOut, Settings, User as UserIcon, Search } from "lucide-react";
 import { Input } from "@/components/ui/input";
 
 interface TopNavProps {
   user: User;
 }
 
 export function TopNav({ user }: TopNavProps) {
   const navigate = useNavigate();
 
   const handleSignOut = async () => {
     await supabase.auth.signOut();
     navigate("/auth");
   };
 
   const displayName = user.user_metadata?.full_name || user.email?.split("@")[0] || "User";
   const initials = displayName.slice(0, 2).toUpperCase();
 
   return (
     <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 sticky top-0 z-40">
       <div className="flex items-center gap-4">
         <SidebarTrigger className="hover:bg-secondary rounded-lg p-2" />
         
         <div className="hidden md:flex items-center relative">
           <Search className="absolute left-3 h-4 w-4 text-muted-foreground" />
           <Input
             placeholder="Search..."
             className="w-64 pl-9 bg-secondary/50 border-border/50 focus:border-primary"
           />
         </div>
       </div>
 
       <div className="flex items-center gap-3">
         <Button variant="ghost" size="icon" className="relative hover:bg-secondary">
           <Bell className="h-5 w-5" />
           <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-neon-orange rounded-full" />
         </Button>
 
         <DropdownMenu>
           <DropdownMenuTrigger asChild>
             <Button variant="ghost" className="flex items-center gap-2 hover:bg-secondary px-2">
               <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                 <span className="text-sm font-semibold text-primary-foreground">{initials}</span>
               </div>
               <span className="hidden sm:block text-sm font-medium">{displayName}</span>
             </Button>
           </DropdownMenuTrigger>
           <DropdownMenuContent align="end" className="w-56 glass-card">
             <DropdownMenuLabel className="font-normal">
               <div className="flex flex-col space-y-1">
                 <p className="text-sm font-medium">{displayName}</p>
                 <p className="text-xs text-muted-foreground">{user.email}</p>
               </div>
             </DropdownMenuLabel>
             <DropdownMenuSeparator />
             <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
               <UserIcon className="mr-2 h-4 w-4" />
               Profile
             </DropdownMenuItem>
             <DropdownMenuItem onClick={() => navigate("/dashboard/settings")}>
               <Settings className="mr-2 h-4 w-4" />
               Settings
             </DropdownMenuItem>
             <DropdownMenuSeparator />
             <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive">
               <LogOut className="mr-2 h-4 w-4" />
               Sign out
             </DropdownMenuItem>
           </DropdownMenuContent>
         </DropdownMenu>
       </div>
     </header>
   );
 }