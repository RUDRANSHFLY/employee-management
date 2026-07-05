import { auth } from "@/auth/auth";
import { prisma } from "@/prisma/prisma";
import { AdminProfile, AdminRequestsTable, AdminStats } from "@/components/admin";
import { normalizeRole } from "@/lib/roles";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (normalizeRole(session?.user?.role) !== "ADMIN") {
    redirect("/employee");
  }

  const [pendingCount, approvedCount, rejectedCount, employeeCount, requests] =
    await Promise.all([
      prisma.leaveRequest.count({ where: { status: "PENDING" } }),
      prisma.leaveRequest.count({ where: { status: "APPROVED" } }),
      prisma.leaveRequest.count({ where: { status: "REJECTED" } }),
      prisma.user.count({ where: { role: "EMPLOYEE" } }),
      prisma.leaveRequest.findMany({
        orderBy: [{ status: "asc" }, { createdAt: "desc" }],
        include: {
          user: {
            select: { name: true, email: true, leaveBalance: true },
          },
        },
      }),
    ]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8 items-start max-w-7xl mx-auto w-full">
      <aside className="lg:sticky lg:top-6">
        <AdminProfile />
      </aside>

      <main className="space-y-8 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-foreground/5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground/90 flex items-center gap-2">
              Operations Control
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Oversee and manage system-wide leave requests and team balances.
            </p>
          </div>
          
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 border border-indigo-500/10 text-xs font-semibold self-start sm:self-center">
            <Sparkles className="h-4 w-4 text-indigo-500 animate-pulse" />
            <span>Active Session</span>
          </div>
        </div>

        {/* Dynamic statistics section with animations */}
        <AdminStats
          pending={pendingCount}
          approved={approvedCount}
          rejected={rejectedCount}
          employees={employeeCount}
        />

        {/* Requests search, filter, and table container */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight text-foreground/80">
              Leave Requests Queue
            </h2>
          </div>
          
          <AdminRequestsTable requests={requests} />
        </div>
      </main>
    </div>
  );
}
