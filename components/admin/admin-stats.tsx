"use client";

import { motion, Variants } from "framer-motion";
import { Clock, CheckCircle2, XCircle, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface AdminStatsProps {
  pending: number;
  approved: number;
  rejected: number;
  employees: number;
}

export function AdminStats({ pending, approved, rejected, employees }: AdminStatsProps) {
  const stats = [
    {
      label: "Pending Review",
      value: pending,
      icon: Clock,
      color: "amber",
      gradient: "from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20",
      accentColor: "text-amber-500 dark:text-amber-400",
      borderColor: "group-hover:border-amber-500/30",
      iconBg: "bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-300",
      glowColor: "shadow-amber-500/10",
      description: "Needs administrative action",
    },
    {
      label: "Approved Requests",
      value: approved,
      icon: CheckCircle2,
      color: "emerald",
      gradient: "from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20",
      accentColor: "text-emerald-500 dark:text-emerald-400",
      borderColor: "group-hover:border-emerald-500/30",
      iconBg: "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-300",
      glowColor: "shadow-emerald-500/10",
      description: "Completed approvals",
    },
    {
      label: "Rejected Requests",
      value: rejected,
      icon: XCircle,
      color: "rose",
      gradient: "from-rose-500/10 to-red-500/10 dark:from-rose-500/20 dark:to-red-500/20",
      accentColor: "text-rose-500 dark:text-rose-400",
      borderColor: "group-hover:border-rose-500/30",
      iconBg: "bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-300",
      glowColor: "shadow-rose-500/10",
      description: "Completed rejections",
    },
    {
      label: "Total Employees",
      value: employees,
      icon: Users,
      color: "violet",
      gradient: "from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20",
      accentColor: "text-violet-500 dark:text-violet-400",
      borderColor: "group-hover:border-violet-500/30",
      iconBg: "bg-violet-100 dark:bg-violet-950/50 text-violet-600 dark:text-violet-300",
      glowColor: "shadow-violet-500/10",
      description: "Active system members",
    },
  ];

  const containerVariants: Variants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 12 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        type: "spring" as const, 
        stiffness: 120, 
        damping: 14 
      } 
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 lg:grid-cols-4 gap-4"
    >
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="group relative"
          >
            <Card className={`relative overflow-hidden transition-all duration-300 border border-foreground/5 hover:border-foreground/10 hover:shadow-lg ${stat.glowColor} h-full`}>
              {/* Background Gradient glow on card hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`} />
              
              <CardContent className="p-5 flex flex-col justify-between h-full space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium tracking-wide uppercase text-muted-foreground/80">
                    {stat.label}
                  </span>
                  <div className={`p-2 rounded-lg ${stat.iconBg} transition-transform duration-300 group-hover:scale-110`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>

                <div className="space-y-1">
                  <motion.p 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-3xl font-semibold tracking-tight"
                  >
                    {stat.value}
                  </motion.p>
                  <p className="text-[11px] text-muted-foreground/75 leading-none">
                    {stat.description}
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </motion.div>
  );
}
