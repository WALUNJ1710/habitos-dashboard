 import { useState, useEffect, createContext, useContext } from "react";
 import { Outlet, useNavigate, useLocation } from "react-router-dom";
 import { supabase } from "@/integrations/supabase/client";
 import { User } from "@supabase/supabase-js";
 import { AppSidebar } from "./AppSidebar";
 import { TopNav } from "./TopNav";
 import { SidebarProvider } from "@/components/ui/sidebar";
 import { OnboardingModal, OnboardingData } from "./OnboardingModal";
 
 interface UserProfile {
   fullName: string;
   weight: number;
   height: number;
   goalWeight: number;
   calorieGoal: number;
   budgetGoal: number;
 }
 
 interface UserProfileContextType {
   profile: UserProfile;
   setProfile: (profile: UserProfile) => void;
 }
 
 const defaultProfile: UserProfile = {
   fullName: "",
   weight: 0,
   height: 0,
   goalWeight: 0,
   calorieGoal: 0,
   budgetGoal: 0,
 };
 
 export const UserProfileContext = createContext<UserProfileContextType>({
   profile: defaultProfile,
   setProfile: () => {},
 });
 
 export const useUserProfile = () => useContext(UserProfileContext);
 
 export const DashboardLayout = () => {
   const [user, setUser] = useState<User | null>(null);
   const [loading, setLoading] = useState(true);
   const [showOnboarding, setShowOnboarding] = useState(false);
   const [profile, setProfile] = useState<UserProfile>(defaultProfile);
   const navigate = useNavigate();
   const location = useLocation();
 
   useEffect(() => {
     const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
       setUser(session?.user ?? null);
       setLoading(false);
       if (session?.user) {
         // Check if user has completed onboarding
         const storedProfile = localStorage.getItem(`habitos_profile_${session.user.id}`);
         if (storedProfile) {
           setProfile(JSON.parse(storedProfile));
         } else {
           setShowOnboarding(true);
         }
       } else {
         navigate("/auth");
       }
     });
 
     supabase.auth.getSession().then(({ data: { session } }) => {
       setUser(session?.user ?? null);
       setLoading(false);
       if (session?.user) {
         const storedProfile = localStorage.getItem(`habitos_profile_${session.user.id}`);
         if (storedProfile) {
           setProfile(JSON.parse(storedProfile));
         } else {
           setShowOnboarding(true);
         }
       } else {
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
 
 
   const handleOnboardingComplete = (data: OnboardingData) => {
     const newProfile: UserProfile = {
       fullName: data.fullName,
       weight: parseFloat(data.weight) || 0,
       height: parseFloat(data.height) || 0,
       goalWeight: parseFloat(data.goalWeight) || 0,
       calorieGoal: parseFloat(data.calorieGoal) || 0,
       budgetGoal: parseFloat(data.budgetGoal) || 0,
     };
     setProfile(newProfile);
     if (user) {
       localStorage.setItem(`habitos_profile_${user.id}`, JSON.stringify(newProfile));
     }
     setShowOnboarding(false);
   };
 
   if (!user) {
     return null;
   }
 
   return (
     <UserProfileContext.Provider value={{ profile, setProfile }}>
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
         <OnboardingModal open={showOnboarding} onComplete={handleOnboardingComplete} />
       </SidebarProvider>
     </UserProfileContext.Provider>
   );
 };