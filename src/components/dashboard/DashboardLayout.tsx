 import { useState, useEffect } from "react";
 import { Outlet, useNavigate, useLocation } from "react-router-dom";
 import { supabase } from "@/integrations/supabase/client";
 import { User } from "@supabase/supabase-js";
 import { AppSidebar } from "./AppSidebar";
 import { TopNav } from "./TopNav";
 import { SidebarProvider } from "@/components/ui/sidebar";
 
 export const DashboardLayout = () => {
   const [user, setUser] = useState<User | null>(null);
   const [loading, setLoading] = useState(true);
   const navigate = useNavigate();
   const location = useLocation();
 
   useEffect(() => {
     const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
       setUser(session?.user ?? null);
       setLoading(false);
       if (!session?.user) {
         navigate("/auth");
       }
     });
 
     supabase.auth.getSession().then(({ data: { session } }) => {
       setUser(session?.user ?? null);
       setLoading(false);
       if (!session?.user) {
         navigate("/auth");
       }
     });
 
     return () => subscription.unsubscribe();
   }, [navigate]);
 
   if (loading) {
     return (
       <div className="min-h-screen flex items-center justify-center">
         <div className="animate-pulse text-primary text-xl">Loading...</div>
       </div>
     );
   }
 
   if (!user) {
     return null;
   }
 
   return (
     <SidebarProvider>
       <div className="min-h-screen flex w-full">
         <AppSidebar />
         <div className="flex-1 flex flex-col">
           <TopNav user={user} />
           <main className="flex-1 p-6 overflow-auto">
             <Outlet />
           </main>
         </div>
       </div>
     </SidebarProvider>
   );
 };