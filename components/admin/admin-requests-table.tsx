"use client";

import { useState, useTransition } from "react";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  approveLeaveRequest,
  rejectLeaveRequest,
} from "@/server/actions/admin-leave";
import { Check, X } from "lucide-react";
import { getLeaveTypeAccent, LeaveStatusBadge } from "../employee";

interface LeaveRequestRow {
  id: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
  user: { name: string; email: string; leaveBalance: number | null };
}

export function AdminRequestsTable({
  requests,
}: {
  requests: LeaveRequestRow[];
}) {
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);

  const handleApprove = (id: string) => {
    setProcessingId(id);
    setErrorId(null);
    startTransition(async () => {
      const result = await approveLeaveRequest(id);
      if (result.error) setErrorId(id);
      setProcessingId(null);
    });
  };

  const handleReject = (id: string) => {
    setProcessingId(id);
    setErrorId(null);
    startTransition(async () => {
      const result = await rejectLeaveRequest(id);
      if (result.error) setErrorId(id);
      setProcessingId(null);
    });
  };

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground text-sm">
          No leave requests yet
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((req) => {
        const initials = req.user.name
          .split(" ")
          .map((p) => p[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

        const isRowBusy = isPending && processingId === req.id;

        return (
          <Card
            key={req.id}
            className={`border-l-4 ${getLeaveTypeAccent(req.leaveType)} ${
              req.status === "PENDING" ? "" : "opacity-70"
            }`}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex gap-3 min-w-0">
                  <div className="h-9 w-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">{req.user.name}</p>
                      <LeaveStatusBadge status={req.status} />
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {req.user.email}
                    </p>

                    <div className="text-sm mt-2 space-y-0.5">
                      <p>
                        <span className="font-medium">
                          {req.leaveType.charAt(0) +
                            req.leaveType.slice(1).toLowerCase()}
                        </span>{" "}
                        · {format(req.startDate, "MMM d")} –{" "}
                        {format(req.endDate, "MMM d, yyyy")} · {req.totalDays}{" "}
                        day{req.totalDays !== 1 ? "s" : ""}
                      </p>
                      <p className="text-muted-foreground line-clamp-2">
                        {req.reason}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Balance remaining: {req.user.leaveBalance ?? 0} days
                      </p>
                    </div>
                  </div>
                </div>

                {req.status === "PENDING" && (
                  <div className="flex gap-2 shrink-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      disabled={isRowBusy}
                      onClick={() => handleReject(req.id)}
                    >
                      <X className="h-3.5 w-3.5 mr-1" />
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      className="bg-emerald-600 hover:bg-emerald-700"
                      disabled={isRowBusy}
                      onClick={() => handleApprove(req.id)}
                    >
                      <Check className="h-3.5 w-3.5 mr-1" />
                      {isRowBusy ? "..." : "Approve"}
                    </Button>
                  </div>
                )}
              </div>

              {errorId === req.id && (
                <p className="text-xs text-red-600 mt-2">
                  Something went wrong — please try again.
                </p>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
