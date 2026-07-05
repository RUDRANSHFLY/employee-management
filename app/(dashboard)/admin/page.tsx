import { prisma } from "@/prisma/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle2, XCircle, Users } from "lucide-react";
import { AdminProfile, AdminRequestsTable } from "@/components/admin";

export default async function AdminPage() {
  const [pendingCount, approvedCount, rejectedCount, employeeCount, requests] =
    await Promise.all([
      prisma.leaveRequest.count({ where: { status: "PENDING" } }),
      prisma.leaveRequest.count({ where: { status: "APPROVED" } }),
      prisma.leaveRequest.count({ where: { status: "REJECTED" } }),
      prisma.user.count({ where: { role: "EMPLOYEE" } }),
      prisma.leaveRequest.findMany({
        orderBy: [{ status: "asc" }, { createdAt: "desc" }], // PENDING sorts first alphabetically-ish, see note below
        include: {
          user: {
            select: { name: true, email: true, leaveBalance: true },
          },
        },
      }),
    ]);

  const stats = [
    {
      label: "Pending",
      value: pendingCount,
      icon: Clock,
      accent: "text-amber-600",
    },
    {
      label: "Approved",
      value: approvedCount,
      icon: CheckCircle2,
      accent: "text-emerald-600",
    },
    {
      label: "Rejected",
      value: rejectedCount,
      icon: XCircle,
      accent: "text-red-600",
    },
    {
      label: "Employees",
      value: employeeCount,
      icon: Users,
      accent: "text-indigo-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
      <aside>
        <AdminProfile />
      </aside>

      <main className="space-y-6 min-w-0">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Review and manage employee leave requests
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                  <stat.icon className={`h-3.5 w-3.5 ${stat.accent}`} />
                  {stat.label}
                </div>
                <p className="text-2xl font-semibold">{stat.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <AdminRequestsTable requests={requests} />
      </main>
    </div>
  );
}
