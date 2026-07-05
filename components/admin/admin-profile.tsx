import { auth } from "@/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/prisma/prisma";
import { signOutAction } from "@/server/actions/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, LogOut, ArrowRight, Bell } from "lucide-react";

export async function AdminProfile() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session!.user as { name: string; email: string };

  const pendingCount = await prisma.leaveRequest.count({
    where: { status: "PENDING" },
  });

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="overflow-hidden border border-foreground/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_8px_30px_rgb(0,0,0,0.05)]">
      {/* Sleek top gradient accent bar */}
      <div className="h-20 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-transparent relative border-b border-foreground/5">
        <div className="absolute top-4 right-4">
          <Badge className="bg-background text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-950 font-medium text-[10px] uppercase tracking-wider px-2 py-0.5 shadow-xs">
            Admin Portal
          </Badge>
        </div>
      </div>
      
      <CardContent className="px-6 pb-6 -mt-10">
        <div className="flex items-end justify-between">
          <div className="h-20 w-20 rounded-2xl p-[3px] bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 shadow-md">
            <div className="h-full w-full rounded-[13px] bg-background flex items-center justify-center">
              <span className="text-xl font-bold tracking-tight bg-gradient-to-br from-indigo-600 to-pink-600 bg-clip-text text-transparent">
                {initials}
              </span>
            </div>
          </div>

          <form action={signOutAction} className="pb-1">
            <Button 
              variant="outline" 
              size="icon" 
              type="submit" 
              title="Sign out"
              className="h-9 w-9 rounded-lg border-foreground/10 hover:bg-destructive/5 hover:text-destructive hover:border-destructive/20 transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <div className="mt-4 space-y-1">
          <p className="font-semibold text-lg tracking-tight leading-none text-foreground/90">{user.name}</p>
          <p className="text-xs text-muted-foreground/80 font-mono truncate">{user.email}</p>
        </div>

        <div className="mt-3.5 flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 text-xs font-semibold border border-indigo-500/10">
            <Shield className="h-3.5 w-3.5" />
            System Administrator
          </div>
        </div>

        {pendingCount > 0 ? (
          <div className="mt-5 pt-5 border-t border-foreground/5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground/80 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                Pending Requests
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-md">
                {pendingCount} urgent
              </span>
            </div>
            <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-lg flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
              <span className="font-medium">Action required</span>
              <span className="flex items-center font-semibold text-[11px] gap-0.5">
                Review <ArrowRight className="h-3 w-3" />
              </span>
            </div>
          </div>
        ) : (
          <div className="mt-5 pt-5 border-t border-foreground/5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground/70 justify-center py-2 bg-foreground/5 rounded-lg border border-dotted border-foreground/10">
              <Bell className="h-3.5 w-3.5 text-muted-foreground/50" />
              <span>Inbox is all caught up!</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
