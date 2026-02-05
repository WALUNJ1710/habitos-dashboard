 import { useState } from "react";
 import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
 } from "@/components/ui/dialog";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Scale, Ruler, Target, Wallet, Utensils, ArrowRight, ArrowLeft, Check } from "lucide-react";
 import { getCurrencySymbol } from "@/lib/currency";
 
 interface OnboardingModalProps {
   open: boolean;
   onComplete: (data: OnboardingData) => void;
 }
 
 export interface OnboardingData {
   fullName: string;
   weight: string;
   height: string;
   goalWeight: string;
   calorieGoal: string;
   budgetGoal: string;
 }
 
 const steps = [
   { title: "Welcome", description: "Let's personalize your HabitOS experience" },
   { title: "Body Metrics", description: "Enter your current measurements" },
   { title: "Goals", description: "Set your fitness and budget targets" },
 ];
 
 export const OnboardingModal = ({ open, onComplete }: OnboardingModalProps) => {
   const [step, setStep] = useState(0);
   const [data, setData] = useState<OnboardingData>({
     fullName: "",
     weight: "",
     height: "",
     goalWeight: "",
     calorieGoal: "",
     budgetGoal: "",
   });
 
   const handleNext = () => {
     if (step < steps.length - 1) {
       setStep(step + 1);
     } else {
       onComplete(data);
     }
   };
 
   const handleBack = () => {
     if (step > 0) {
       setStep(step - 1);
     }
   };
 
   const isStepValid = () => {
     switch (step) {
       case 0:
         return data.fullName.trim().length > 0;
       case 1:
         return data.weight && data.height;
       case 2:
         return data.goalWeight && data.calorieGoal && data.budgetGoal;
       default:
         return true;
     }
   };
 
   return (
     <Dialog open={open}>
       <DialogContent className="sm:max-w-md glass-card border-primary/20" onPointerDownOutside={(e) => e.preventDefault()}>
         <DialogHeader>
           <DialogTitle className="text-2xl">{steps[step].title}</DialogTitle>
           <DialogDescription>{steps[step].description}</DialogDescription>
         </DialogHeader>
 
         {/* Progress indicator */}
         <div className="flex gap-2 my-4">
           {steps.map((_, i) => (
             <div
               key={i}
               className={`h-1 flex-1 rounded-full transition-all ${
                 i <= step ? "bg-primary" : "bg-secondary"
               }`}
             />
           ))}
         </div>
 
         <div className="space-y-4 py-4">
           {step === 0 && (
             <div className="space-y-4">
               <div className="text-center mb-6">
                 <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-primary flex items-center justify-center mb-4 animate-pulse-glow">
                   <span className="text-4xl">🚀</span>
                 </div>
                 <p className="text-muted-foreground">
                   Welcome to HabitOS! Let's set up your profile to get started.
                 </p>
               </div>
               <div className="space-y-2">
                 <Label htmlFor="fullName">What should we call you?</Label>
                 <Input
                   id="fullName"
                   placeholder="Enter your name"
                   value={data.fullName}
                   onChange={(e) => setData({ ...data, fullName: e.target.value })}
                   className="bg-secondary/50"
                 />
               </div>
             </div>
           )}
 
           {step === 1 && (
             <div className="space-y-4">
               <div className="space-y-2">
                 <Label htmlFor="weight" className="flex items-center gap-2">
                   <Scale className="h-4 w-4 text-neon-purple" />
                   Current Weight (kg)
                 </Label>
                 <Input
                   id="weight"
                   type="number"
                   step="0.1"
                   placeholder="e.g., 70"
                   value={data.weight}
                   onChange={(e) => setData({ ...data, weight: e.target.value })}
                   className="bg-secondary/50"
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="height" className="flex items-center gap-2">
                   <Ruler className="h-4 w-4 text-neon-cyan" />
                   Height (cm)
                 </Label>
                 <Input
                   id="height"
                   type="number"
                   placeholder="e.g., 175"
                   value={data.height}
                   onChange={(e) => setData({ ...data, height: e.target.value })}
                   className="bg-secondary/50"
                 />
               </div>
             </div>
           )}
 
           {step === 2 && (
             <div className="space-y-4">
               <div className="space-y-2">
                 <Label htmlFor="goalWeight" className="flex items-center gap-2">
                   <Target className="h-4 w-4 text-neon-green" />
                   Goal Weight (kg)
                 </Label>
                 <Input
                   id="goalWeight"
                   type="number"
                   step="0.1"
                   placeholder="e.g., 65"
                   value={data.goalWeight}
                   onChange={(e) => setData({ ...data, goalWeight: e.target.value })}
                   className="bg-secondary/50"
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="calorieGoal" className="flex items-center gap-2">
                   <Utensils className="h-4 w-4 text-neon-orange" />
                   Daily Calorie Goal
                 </Label>
                 <Input
                   id="calorieGoal"
                   type="number"
                   placeholder="e.g., 2000"
                   value={data.calorieGoal}
                   onChange={(e) => setData({ ...data, calorieGoal: e.target.value })}
                   className="bg-secondary/50"
                 />
               </div>
               <div className="space-y-2">
                 <Label htmlFor="budgetGoal" className="flex items-center gap-2">
                   <Wallet className="h-4 w-4 text-primary" />
                   Monthly Budget Goal ({getCurrencySymbol()})
                 </Label>
                 <Input
                   id="budgetGoal"
                   type="number"
                   placeholder="e.g., 50000"
                   value={data.budgetGoal}
                   onChange={(e) => setData({ ...data, budgetGoal: e.target.value })}
                   className="bg-secondary/50"
                 />
               </div>
             </div>
           )}
         </div>
 
         <div className="flex justify-between pt-4">
           <Button
             variant="outline"
             onClick={handleBack}
             disabled={step === 0}
             className="gap-2"
           >
             <ArrowLeft className="h-4 w-4" />
             Back
           </Button>
           <Button
             onClick={handleNext}
             disabled={!isStepValid()}
             className="gap-2 bg-gradient-primary"
           >
             {step === steps.length - 1 ? (
               <>
                 <Check className="h-4 w-4" />
                 Get Started
               </>
             ) : (
               <>
                 Next
                 <ArrowRight className="h-4 w-4" />
               </>
             )}
           </Button>
         </div>
       </DialogContent>
     </Dialog>
   );
 };