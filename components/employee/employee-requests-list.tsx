"use client";

import { useState } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Calendar, 
  FileText, 
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Inbox,
} from "lucide-react";
import { LeaveStatus } from "@/generated/prisma/enums";

interface LeaveRequestRow {
  id: string;
  leaveType: string;
  startDate: Date;
  endDate: Date;
  totalDays: number;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: Date;
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

export function EmployeeRequestsList({
  requests,
}: {
  requests: LeaveRequestRow[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "APPROVED" | "REJECTED">("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  // Filter requests
  const filteredRequests = requests.filter((req) => {
    const matchesSearch = 
      req.leaveType.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      {/* Search & Filter Header */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between p-4 bg-card rounded-xl border border-foreground/5 shadow-xs">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <Input
            placeholder="Search request type or reason..."
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

      {/* Tabs Row */}
      <div className="border-b border-foreground/5 flex gap-6 overflow-x-auto scrollbar-none pb-[1px]">
        {statusTabs.map((tab) => {
          const isActive = statusFilter === tab.key;
          const count = tab.key === "ALL" 
            ? requests.length 
            : requests.filter((r) => r.status === tab.key).length;

          return (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as LeaveStatus)}
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
                  layoutId="employeeRequestsTabs"
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-600"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Requests List */}
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
                    <p className="font-semibold text-foreground/80">No requests found</p>
                    <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                      There are no leaves matching your current filters. Click `&quot;`Apply for leave`&quot;` to submit a new one.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            filteredRequests.map((req) => {
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
                      : "border-foreground/5 opacity-80 hover:opacity-100"
                  }`}
                >
                  <div className="p-5 space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      {/* Left: Leave Type Accent Badge */}
                      <div className="flex items-center gap-2.5">
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold border ${typeDecoration.bg} ${typeDecoration.text} ${typeDecoration.border}`}>
                          {req.leaveType} LEAVE
                        </span>
                        
                        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
                          {req.totalDays} {req.totalDays === 1 ? "Day" : "Days"}
                        </span>
                      </div>

                      {/* Right: Status Badge */}
                      <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${statusConfig.bg}`}>
                        <StatusIcon className="h-3.5 w-3.5" />
                        {statusConfig.label}
                      </div>
                    </div>

                    {/* Middle Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 pt-3 border-t border-foreground/5">
                      {/* Calendar details */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-medium tracking-wide uppercase text-muted-foreground/60 flex items-center gap-1">
                          <Calendar className="h-3 w-3" /> Timeline
                        </span>
                        <div className="text-xs font-medium text-foreground/95 space-y-0.5 font-sans">
                          <p className="font-semibold">
                            {format(new Date(req.startDate), "EEE, MMM d")}
                          </p>
                          <p className="text-muted-foreground text-[10px]">to</p>
                          <p className="font-semibold">
                            {format(new Date(req.endDate), "EEE, MMM d, yyyy")}
                          </p>
                        </div>
                      </div>

                      {/* Reason context */}
                      <div className="space-y-1.5 flex flex-col justify-between">
                        <div className="space-y-1">
                          <span className="text-[10px] font-medium tracking-wide uppercase text-muted-foreground/60 flex items-center gap-1">
                            <FileText className="h-3 w-3" /> Reason Statement
                          </span>
                          <div className="p-3 bg-foreground/5 border border-foreground/5 rounded-lg text-xs leading-relaxed text-foreground/80 italic font-sans min-h-[50px]">
                            &ldquo;{req.reason}&rdquo;
                          </div>
                        </div>

                        <span className="text-[10px] text-muted-foreground/50 self-end mt-1 font-mono">
                          Requested {formatDistanceToNow(new Date(req.createdAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
