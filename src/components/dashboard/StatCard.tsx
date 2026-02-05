 import { LucideIcon } from "lucide-react";
 import { cn } from "@/lib/utils";
 
 interface StatCardProps {
   title: string;
   value: string | number;
   subtitle?: string;
   icon: LucideIcon;
   trend?: {
     value: number;
     isPositive: boolean;
   };
   className?: string;
   iconClassName?: string;
 }
 
 export function StatCard({
   title,
   value,
   subtitle,
   icon: Icon,
   trend,
   className,
   iconClassName,
 }: StatCardProps) {
   return (
     <div className={cn(
       "glass-card rounded-xl p-5 hover-lift group",
       className
     )}>
       <div className="flex items-start justify-between mb-3">
         <div className={cn(
           "w-10 h-10 rounded-lg flex items-center justify-center",
           iconClassName || "bg-primary/10"
         )}>
           <Icon className={cn("h-5 w-5", iconClassName ? "text-primary-foreground" : "text-primary")} />
         </div>
         {trend && (
           <span className={cn(
             "text-xs font-medium px-2 py-1 rounded-full",
             trend.isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
           )}>
             {trend.isPositive ? "+" : ""}{trend.value}%
           </span>
         )}
       </div>
       <div>
         <p className="text-sm text-muted-foreground mb-1">{title}</p>
         <p className="text-2xl font-bold">{value}</p>
         {subtitle && (
           <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
         )}
       </div>
     </div>
   );
 }