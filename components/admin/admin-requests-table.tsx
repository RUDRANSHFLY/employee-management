"use client";

import { useState, useTransition } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Check, 
  X, 
  Search, 
  Calendar, 
  FileText, 
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Inbox,
  UserCheck
} from "lucide-react";
import {
  approveLeaveRequest,
  rejectLeaveRequest,
} from "@/server/actions/admin-leave";

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

const LEAVE_TYPE_DECORATION: Record<string, { bg: string; text: string; border: string }> = {
  CASUAL: { 
    bg: "bg-blue-50/50 dark:bg-blue-950/20", 
    text: "text-blue-600 dark:text-blue-400", 
    border: "border-blue-100 dark:border-blue-950/50" 
  },
  SICK: { 
    bg: "bg-rose-50/50 dark:bg-rose-950/20", 
    text: "text-rose-600 dark:text-rose-400", 
    border: "border-rose-100 dark:border-rose-950/50" 
  },
  EARNED: { 
    bg: "bg-violet-50/50 dark:bg-violet-950/20", 
    text: "text-violet-600 dark:text-violet-400", 
    border: "border-violet-100 dark:border-violet-950/50" 
  },
  UNPAID: { 
    bg: "bg-slate-50/50 dark:bg-slate-900/20", 
    text: "text-slate-600 dark:text-slate-400", 
    border: "border-slate-100 dark:border-slate-800" 
  },
};

const STATUS_BADGE_CONFIG = {
  PENDING: {
    label: "Awaiting Review",
    bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    icon: Clock,
  },
  APPROVED: {
    label: "Approved",
    bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejected",
    bg: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
    icon: XCircle,
  },
} as const;

export function AdminRequestsTable({
  requests,
}: {
  requests: LeaveRequestRow[];
}) {
  const [isPending, startTransition] = useTransition();
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [errorId, setErrorId] = useState<string | null>(null);
  
  // Search and filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const handleApprove = (id: string) => {
    setProcessingId(id);
    setErrorId(null);
    startTransition(async () => {
      const result = await approveLeaveRequest(id);
      if (result && "error" in result) {
        setErrorId(id);
      }
      setProcessingId(null);
    });
  };

  const handleReject = (id: string) => {
    setProcessingId(id);
    setErrorId(null);
    startTransition(async () => {
      const result = await rejectLeaveRequest(id);
      if (result && "error" in result) {
        setErrorId(id);
      }
      setProcessingId(null);
    });
  };

  // Filter the requests
  const filteredRequests = requests.filter((req) => {
    const matchesSearch = 
      req.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesStatus = statusFilter === "ALL" || req.status === statusFilter;
    const matchesType = typeFilter === "ALL" || req.leaveType === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const leaveTypes = ["ALL", "CASUAL", "SICK", "EARNED", "UNPAID"];
  const statusTabs = [
    { key: "ALL", label: "All Requests" },
    { key: "PENDING", label: "Pending" },
    { key: "APPROVED", label: "Approved" },
    { key: "REJECTED", label: "Rejected" },
  ];

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-card rounded-xl border border-foreground/5 shadow-xs">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <Input
            placeholder="Search employee name, email, or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-10 w-full bg-background border-foreground/10 rounded-lg text-sm transition-all focus-visible:ring-1 focus-visible:ring-indigo-500"
          />
        </div>
        
        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium shrink-0">
            <Filter className="h-3.5 w-3.5" />
            <span>Type:</span>
          </div>
          <div className="flex gap-1 overflow-x-auto pb-1 md:pb-0 w-full md:w-auto">
            {leaveTypes.map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border shrink-0 ${
                  typeFilter === type
                    ? "bg-indigo-600 border-indigo-600 text-white shadow-xs"
                    : "bg-background border-foreground/10 text-muted-foreground hover:bg-foreground/5 hover:text-foreground"
                }`}
              >
                {type.charAt(0) + type.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs list with sliding indicator */}
      <div className="border-b border-foreground/5 flex gap-6 overflow-x-auto scrollbar-none pb-[1px]">
        {statusTabs.map((tab) => {
          const isActive = statusFilter === tab.key;
          const count = tab.key === "ALL" 
            ? requests.length 
            : requests.filter((r) => r.status === tab.key).length;

          return (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as typeof statusFilter)}
              className="relative pb-3 text-sm font-medium transition-colors text-muted-foreground hover:text-foreground shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <span className={isActive ? "text-foreground font-semibold" : ""}>{tab.label}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono font-medium ${
                isActive 
                  ? "bg-foreground text-background font-bold" 
                  : "bg-foreground/5 text-muted-foreground"
              }`}>
                {count}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Requests table / cards */}
      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredRequests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="border border-dashed border-foreground/10 rounded-2xl">
                <CardContent className="py-16 text-center space-y-3">
                  <div className="mx-auto w-12 h-12 rounded-full bg-foreground/5 flex items-center justify-center text-muted-foreground/60">
                    <Inbox className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-foreground/80">No matches found</p>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      Try refining your search terms or changing your status and type filters.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            filteredRequests.map((req) => {
              const initials = req.user.name
                .split(" ")
                .map((p) => p[0])
                .join("")
                .slice(0, 2)
                .toUpperCase();

              const isRowBusy = isPending && processingId === req.id;
              const typeDecoration = LEAVE_TYPE_DECORATION[req.leaveType] || { bg: "bg-muted", text: "text-foreground", border: "border-foreground/10" };
              const statusConfig = STATUS_BADGE_CONFIG[req.status];
              const StatusIcon = statusConfig.icon;

              return (
                <motion.div
                  key={req.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.25 }}
                  className={`group/item border rounded-xl overflow-hidden bg-card transition-all duration-300 ${
                    req.status === "PENDING"
                      ? "border-foreground/10 hover:border-indigo-500/20 shadow-xs hover:shadow-md hover:shadow-indigo-500/[0.02]"
                      : "border-foreground/5 opacity-75 hover:opacity-100"
                  }`}
                >
                  <div className="p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      {/* Left: User Avatar & Details */}
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-indigo-500/10 to-violet-500/10 dark:from-indigo-950/50 dark:to-violet-950/50 border border-indigo-500/20 flex items-center justify-center text-xs font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                          {initials}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-foreground/90">{req.user.name}</h4>
                            <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${statusConfig.bg}`}>
                              <StatusIcon className="h-3 w-3" />
                              {statusConfig.label}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground/80 font-mono mt-0.5">{req.user.email}</p>
                        </div>
                      </div>

                      {/* Right: Leave Type & Balance info */}
                      <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-center gap-2 shrink-0">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${typeDecoration.bg} ${typeDecoration.text} ${typeDecoration.border}`}>
                          {req.leaveType}
                        </span>
                        
                        <span className="text-[11px] text-muted-foreground/80 flex items-center gap-1">
                          <UserCheck className="h-3.5 w-3.5 text-muted-foreground/50" />
                          Balance: <span className="font-semibold text-foreground/80">{req.user.leaveBalance ?? 0} days</span>
                        </span>
                      </div>
                    </div>

                    {/* Middle: Leave Duration & Reason */}
                    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 pt-3 border-t border-foreground/5">
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-medium tracking-wide uppercase text-muted-foreground/60 flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Duration
                        </span>
                        <div className="text-xs font-medium text-foreground/95 space-y-0.5">
                          <p className="font-semibold">
                            {format(req.startDate, "EEE, MMM d")}
                          </p>
                          <p className="text-muted-foreground text-[11px]">to</p>
                          <p className="font-semibold">
                            {format(req.endDate, "EEE, MMM d, yyyy")}
                          </p>
                          <p className="text-indigo-600 dark:text-indigo-400 font-semibold pt-1">
                            {req.totalDays} {req.totalDays === 1 ? "Day" : "Days"} Request
                          </p>
                        </div>
                      </div>

                      <div className="space-y-1.5 flex flex-col justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] font-medium tracking-wide uppercase text-muted-foreground/60 flex items-center gap-1">
                            <FileText className="h-3 w-3" /> Reason for Absence
                          </span>
                          <div className="p-3 bg-foreground/5 border border-foreground/5 rounded-lg text-xs leading-relaxed text-foreground/80 italic font-sans min-h-[50px]">
                            &ldquo;{req.reason}&rdquo;
                          </div>
                        </div>

                        <span className="text-[10px] text-muted-foreground/50 self-end mt-1">
                          Submitted {formatDistanceToNow(req.createdAt, { addSuffix: true })}
                        </span>
                      </div>
                    </div>

                    {/* Actions Panel */}
                    {req.status === "PENDING" && (
                      <div className="flex items-center justify-end gap-3 pt-3 border-t border-foreground/5">
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 border-foreground/15 text-rose-600 hover:bg-rose-50 hover:text-rose-700 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 rounded-lg text-xs font-semibold px-4 transition-all"
                          disabled={isRowBusy}
                          onClick={() => handleReject(req.id)}
                        >
                          <X className="h-3.5 w-3.5 mr-1.5" />
                          Reject Request
                        </Button>
                        
                        <Button
                          size="sm"
                          className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold px-4 shadow-xs shadow-indigo-600/10 hover:shadow-md transition-all duration-200"
                          disabled={isRowBusy}
                          onClick={() => handleApprove(req.id)}
                        >
                          {isRowBusy ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              <Check className="h-3.5 w-3.5 mr-1.5" />
                              Approve Leave
                            </>
                          )}
                        </Button>
                      </div>
                    )}
                  </div>

                  {errorId === req.id && (
                    <div className="px-5 py-2.5 bg-rose-500/10 border-t border-rose-500/20 text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5 font-medium">
                      <XCircle className="h-3.5 w-3.5" />
                      Failed to process request. The employee&apos;s leave balance may be insufficient or there was a system error. Please retry.
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
