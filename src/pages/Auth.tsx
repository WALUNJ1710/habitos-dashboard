 import { useState } from "react";
 import { useNavigate } from "react-router-dom";
 import { supabase } from "@/integrations/supabase/client";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Checkbox } from "@/components/ui/checkbox";
 import { useToast } from "@/hooks/use-toast";
 import { Mail, Lock, User, ArrowRight, Github, Loader2, Eye, EyeOff } from "lucide-react";
 
 type AuthMode = "login" | "signup" | "forgot";
 
 const Auth = () => {
   const [mode, setMode] = useState<AuthMode>("login");
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const [fullName, setFullName] = useState("");
   const [rememberMe, setRememberMe] = useState(false);
   const [showPassword, setShowPassword] = useState(false);
   const [loading, setLoading] = useState(false);
   const { toast } = useToast();
   const navigate = useNavigate();
 
   const handleAuth = async (e: React.FormEvent) => {
     e.preventDefault();
     setLoading(true);
 
     try {
       if (mode === "login") {
         const { error } = await supabase.auth.signInWithPassword({
           email,
           password,
         });
         if (error) throw error;
         navigate("/dashboard");
       } else if (mode === "signup") {
         const { error } = await supabase.auth.signUp({
           email,
           password,
           options: {
             emailRedirectTo: `${window.location.origin}/dashboard`,
             data: { full_name: fullName },
           },
         });
         if (error) throw error;
         toast({
           title: "Check your email",
           description: "We sent you a confirmation link to verify your account.",
         });
       } else if (mode === "forgot") {
         const { error } = await supabase.auth.resetPasswordForEmail(email, {
           redirectTo: `${window.location.origin}/auth`,
         });
         if (error) throw error;
         toast({
           title: "Reset link sent",
           description: "Check your email for the password reset link.",
         });
       }
     } catch (error: any) {
       toast({
         title: "Error",
         description: error.message || "Something went wrong",
         variant: "destructive",
       });
     } finally {
       setLoading(false);
     }
   };
 
   const handleSocialLogin = async (provider: "google" | "github") => {
     const { error } = await supabase.auth.signInWithOAuth({
       provider,
       options: {
         redirectTo: `${window.location.origin}/dashboard`,
       },
     });
     if (error) {
       toast({
         title: "Error",
         description: error.message,
         variant: "destructive",
       });
     }
   };
 
   return (
     <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
       {/* Background grid */}
       <div className="absolute inset-0 bg-grid-pattern bg-grid opacity-20" />
       
       {/* Gradient orbs */}
       <div className="absolute top-1/4 -left-32 w-96 h-96 bg-neon-blue/20 rounded-full blur-3xl" />
       <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl" />
 
       <div className="w-full max-w-md relative z-10">
         {/* Logo */}
         <div className="text-center mb-8">
           <h1 className="text-4xl font-bold text-gradient mb-2">HabitOS</h1>
           <p className="text-muted-foreground">Life Optimization Dashboard</p>
         </div>
 
         {/* Auth Card */}
         <div className="glass-card rounded-2xl p-8 animate-slide-up">
           <h2 className="text-2xl font-semibold mb-6">
             {mode === "login" && "Welcome back"}
             {mode === "signup" && "Create account"}
             {mode === "forgot" && "Reset password"}
           </h2>
 
           <form onSubmit={handleAuth} className="space-y-4">
             {mode === "signup" && (
               <div className="space-y-2">
                 <Label htmlFor="fullName">Full Name</Label>
                 <div className="relative">
                   <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                   <Input
                     id="fullName"
                     type="text"
                     placeholder="John Doe"
                     value={fullName}
                     onChange={(e) => setFullName(e.target.value)}
                     className="pl-10 bg-secondary/50 border-border/50 focus:border-primary"
                     required
                   />
                 </div>
               </div>
             )}
 
             <div className="space-y-2">
               <Label htmlFor="email">Email</Label>
               <div className="relative">
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                 <Input
                   id="email"
                   type="email"
                   placeholder="you@example.com"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="pl-10 bg-secondary/50 border-border/50 focus:border-primary"
                   required
                 />
               </div>
             </div>
 
             {mode !== "forgot" && (
               <div className="space-y-2">
                 <Label htmlFor="password">Password</Label>
                 <div className="relative">
                   <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                   <Input
                     id="password"
                     type={showPassword ? "text" : "password"}
                     placeholder="••••••••"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     className="pl-10 pr-10 bg-secondary/50 border-border/50 focus:border-primary"
                     required
                     minLength={6}
                   />
                   <button
                     type="button"
                     onClick={() => setShowPassword(!showPassword)}
                     className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                   >
                     {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                   </button>
                 </div>
               </div>
             )}
 
             {mode === "login" && (
               <div className="flex items-center justify-between">
                 <div className="flex items-center space-x-2">
                   <Checkbox
                     id="remember"
                     checked={rememberMe}
                     onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                   />
                   <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                     Remember me
                   </Label>
                 </div>
                 <button
                   type="button"
                   onClick={() => setMode("forgot")}
                   className="text-sm text-primary hover:underline"
                 >
                   Forgot password?
                 </button>
               </div>
             )}
 
             <Button
               type="submit"
               className="w-full bg-gradient-primary hover:opacity-90 transition-opacity"
               disabled={loading}
             >
               {loading ? (
                 <Loader2 className="h-4 w-4 animate-spin" />
               ) : (
                 <>
                   {mode === "login" && "Sign in"}
                   {mode === "signup" && "Create account"}
                   {mode === "forgot" && "Send reset link"}
                   <ArrowRight className="ml-2 h-4 w-4" />
                 </>
               )}
             </Button>
           </form>
 
           {mode !== "forgot" && (
             <>
               <div className="relative my-6">
                 <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-border/50" />
                 </div>
                 <div className="relative flex justify-center text-xs">
                   <span className="bg-card px-2 text-muted-foreground">or continue with</span>
                 </div>
               </div>
 
               <div className="grid grid-cols-2 gap-4">
                 <Button
                   type="button"
                   variant="outline"
                   onClick={() => handleSocialLogin("google")}
                   className="bg-secondary/50 border-border/50 hover:bg-secondary hover:border-primary/50"
                 >
                   <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                     <path
                       fill="currentColor"
                       d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                     />
                     <path
                       fill="currentColor"
                       d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                     />
                     <path
                       fill="currentColor"
                       d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                     />
                     <path
                       fill="currentColor"
                       d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                     />
                   </svg>
                   Google
                 </Button>
                 <Button
                   type="button"
                   variant="outline"
                   onClick={() => handleSocialLogin("github")}
                   className="bg-secondary/50 border-border/50 hover:bg-secondary hover:border-primary/50"
                 >
                   <Github className="h-4 w-4 mr-2" />
                   GitHub
                 </Button>
               </div>
             </>
           )}
 
           <div className="mt-6 text-center text-sm">
             {mode === "login" && (
               <p className="text-muted-foreground">
                 Don't have an account?{" "}
                 <button
                   onClick={() => setMode("signup")}
                   className="text-primary hover:underline font-medium"
                 >
                   Sign up
                 </button>
               </p>
             )}
             {mode === "signup" && (
               <p className="text-muted-foreground">
                 Already have an account?{" "}
                 <button
                   onClick={() => setMode("login")}
                   className="text-primary hover:underline font-medium"
                 >
                   Sign in
                 </button>
               </p>
             )}
             {mode === "forgot" && (
               <button
                 onClick={() => setMode("login")}
                 className="text-primary hover:underline font-medium"
               >
                 Back to login
               </button>
             )}
           </div>
         </div>
 
         <p className="text-center text-xs text-muted-foreground mt-6">
           By continuing, you agree to our Terms of Service and Privacy Policy
         </p>
       </div>
     </div>
   );
 };
 
 export default Auth;