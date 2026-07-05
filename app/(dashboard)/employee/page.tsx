import { headers } from "next/headers";
import Link from "next/link";
import { Sparkles, CalendarPlus, History, ArrowRight } from "lucide-react";

import { auth } from "@/auth/auth";
import { prisma } from "@/prisma/prisma";
import { Greeting, EmployeeStats } from "@/components/employee";
import { Card, CardContent } from "@/components/ui/card";

export default async function EmployeePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const firstName = session!.user.name.split(" ")[0];

  const balances = await prisma.user.findUniqueOrThrow({
    where: { id: session!.user.id },
    select: { leaveBalance: true },
  });

  const pendingCount = await prisma.leaveRequest.count({
    where: { userId: session!.user.id, status: "PENDING" },
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto w-full">
      {/* Header section with Greeting and Session Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-foreground/5">
        <Greeting firstName={firstName} />
        
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/5 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 text-xs font-semibold self-start sm:self-center">
          <Sparkles className="h-4 w-4 text-emerald-500 animate-pulse" />
          <span>Active Employee Account</span>
        </div>
      </div>

      {/* Advanced Animated Stats Grid */}
      <EmployeeStats 
        pendingCount={pendingCount} 
        leaveBalance={balances.leaveBalance ?? 20} 
      />

      {/* Core Action Widgets */}
      <div className="space-y-4">
        <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground/80">
          Workplace Actions
        </h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Apply for Leave Card */}
          <Link href="/employee/apply" className="group">
            <Card className="h-full border border-foreground/5 hover:border-indigo-500/20 shadow-xs hover:shadow-md hover:shadow-indigo-500/[0.01] transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/[0.02] to-violet-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              <CardContent className="p-6 flex flex-col justify-between h-full gap-6">
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 w-fit group-hover:scale-110 transition-transform duration-300">
                    <CalendarPlus className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground/90">
                    Apply for Leave
                  </h3>
                  <p className="text-xs text-muted-foreground/80 leading-relaxed">
                    Submit a new leave request. Choose from casual, sick, earned, or unpaid leave and select your timeline.
                  </p>
                </div>
                
                <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                  Request absence <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </CardContent>
            </Card>
          </Link>

          {/* View Leave History Card */}
          <Link href="/employee/requests" className="group">
            <Card className="h-full border border-foreground/5 hover:border-emerald-500/20 shadow-xs hover:shadow-md hover:shadow-emerald-500/[0.01] transition-all duration-300 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.02] to-teal-500/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              <CardContent className="p-6 flex flex-col justify-between h-full gap-6">
                <div className="space-y-2">
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 w-fit group-hover:scale-110 transition-transform duration-300">
                    <History className="h-5 w-5" />
                  </div>
                  <h3 className="font-semibold text-lg text-foreground/90">
                    Leave History & Archives
                  </h3>
                  <p className="text-xs text-muted-foreground/80 leading-relaxed">
                    Review status logs of your current and historical leave applications. See admin feedback and remaining allowances.
                  </p>
                </div>
                
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 group-hover:gap-1.5 transition-all">
                  Browse past requests <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}
