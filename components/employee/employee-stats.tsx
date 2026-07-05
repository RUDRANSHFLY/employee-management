"use client";

import { motion, Variants } from "framer-motion";
import { Clock, CalendarRange, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface EmployeeStatsProps {
  pendingCount: number;
  leaveBalance: number;
}

export function EmployeeStats({ pendingCount, leaveBalance }: EmployeeStatsProps) {
  const totalAllocated = 20;
  const usedLeaves = Math.max(0, totalAllocated - leaveBalance);
  const percentage = Math.min(100, Math.round((usedLeaves / totalAllocated) * 100));

  const containerVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring", 
        stiffness: 110, 
        damping: 14 
      } 
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid gap-6 md:grid-cols-2"
    >
      {/* Pending Requests Stat Card */}
      <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="group">
        <Card className="relative overflow-hidden border border-foreground/5 hover:border-foreground/10 hover:shadow-lg transition-all duration-300 shadow-amber-500/[0.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 dark:from-amber-500/10 dark:to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground/80">
                Pending Approval
              </span>
              <div className="p-2 rounded-lg bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform duration-300">
                <Clock className="h-4 w-4" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-semibold tracking-tight">
                {pendingCount}
              </p>
              <p className="text-xs text-muted-foreground/75 leading-none flex items-center gap-1">
                <Info className="h-3 w-3 inline text-amber-500/70" />
                Awaiting administrative confirmation
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Leave Balance Stat Card */}
      <motion.div variants={itemVariants} whileHover={{ y: -4 }} className="group">
        <Card className="relative overflow-hidden border border-foreground/5 hover:border-foreground/10 hover:shadow-lg transition-all duration-300 shadow-indigo-500/[0.02]">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-violet-500/5 dark:from-indigo-500/10 dark:to-violet-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold tracking-wide uppercase text-muted-foreground/80">
                Available Leave Balance
              </span>
              <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">
                <CalendarRange className="h-4 w-4" />
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-baseline justify-between">
                <p className="text-3xl font-semibold tracking-tight">
                  {leaveBalance} <span className="text-xs font-medium text-muted-foreground">/ {totalAllocated} Days Left</span>
                </p>
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                  {usedLeaves} Used
                </span>
              </div>
              
              {/* Modern Tech Progress Bar */}
              <div className="space-y-1">
                <div className="h-1.5 w-full bg-foreground/5 dark:bg-foreground/10 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ delay: 0.2, duration: 0.8, ease: "easeOut" }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground/60 font-mono">
                  <span>0% used</span>
                  <span>100% limit</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
