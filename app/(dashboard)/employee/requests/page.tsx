import { auth } from "@/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/prisma/prisma";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { CalendarDays, FileText } from "lucide-react";
import Link from "next/link";
import { getLeaveTypeAccent, LeaveStatusBadge } from "@/components/employee";

export default async function MyRequestsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  const requests = await prisma.leaveRequest.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  const grouped = {
    ALL: requests,
    PENDING: requests.filter((r) => r.status === "PENDING"),
    APPROVED: requests.filter((r) => r.status === "APPROVED"),
    REJECTED: requests.filter((r) => r.status === "REJECTED"),
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My requests</h1>
          <p className="text-sm text-muted-foreground">
            {requests.length} total request{requests.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button>
          <Link href="/employee/apply">Apply for leave</Link>
        </Button>
      </div>

      <Tabs defaultValue="ALL">
        <TabsList>
          <TabsTrigger value="ALL">All ({grouped.ALL.length})</TabsTrigger>
          <TabsTrigger value="PENDING">
            Pending ({grouped.PENDING.length})
          </TabsTrigger>
          <TabsTrigger value="APPROVED">
            Approved ({grouped.APPROVED.length})
          </TabsTrigger>
          <TabsTrigger value="REJECTED">
            Rejected ({grouped.REJECTED.length})
          </TabsTrigger>
        </TabsList>

        {Object.entries(grouped).map(([key, list]) => (
          <TabsContent key={key} value={key} className="space-y-3 mt-4">
            {list.length === 0 ? (
              <EmptyState />
            ) : (
              list.map((req) => (
                <Card
                  key={req.id}
                  className={`border-l-4 ${getLeaveTypeAccent(req.leaveType)} transition-shadow hover:shadow-md`}
                >
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">
                          {req.leaveType.charAt(0) +
                            req.leaveType.slice(1).toLowerCase()}{" "}
                          leave
                        </p>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground mt-0.5">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {format(req.startDate, "MMM d, yyyy")}
                          {req.startDate.getTime() !==
                            req.endDate.getTime() && (
                            <> — {format(req.endDate, "MMM d, yyyy")}</>
                          )}
                          <span className="mx-1">·</span>
                          {req.totalDays} day{req.totalDays !== 1 ? "s" : ""}
                        </div>
                      </div>
                      <LeaveStatusBadge status={req.status} />
                    </div>

                    <div className="flex items-start gap-1.5 text-sm text-muted-foreground border-t pt-3">
                      <FileText className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                      <p className="line-clamp-2">{req.reason}</p>
                    </div>

                    <p className="text-xs text-muted-foreground">
                      Requested on{" "}
                      {format(req.createdAt, "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-12 text-muted-foreground">
      <FileText className="h-8 w-8 mx-auto mb-2 opacity-40" />
      <p className="text-sm">No requests here yet</p>
    </div>
  );
}
