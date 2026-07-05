"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, differenceInCalendarDays } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar as CalendarIcon, 
  Activity, 
  Award, 
  ShieldAlert, 
  ArrowRight,
  Sparkles,
  AlertCircle,
  Clock,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { applyForLeave } from "@/server/actions/leave";

const LEAVE_TYPES = ["CASUAL", "SICK", "EARNED", "UNPAID"] as const;

const LEAVE_TYPE_OPTIONS = [
  {
    key: "CASUAL" as const,
    title: "Casual Leave",
    description: "Personal business, short routine breaks.",
    icon: CalendarIcon,
    themeColor: "indigo",
    accent: "border-indigo-500/20 text-indigo-600 dark:text-indigo-400 bg-indigo-500/5",
    activeGlow: "ring-2 ring-indigo-500/40 border-indigo-500 bg-indigo-500/[0.08]",
  },
  {
    key: "SICK" as const,
    title: "Sick Leave",
    description: "Medical concerns, illness, recovery time.",
    icon: Activity,
    themeColor: "rose",
    accent: "border-rose-500/20 text-rose-600 dark:text-rose-400 bg-rose-500/5",
    activeGlow: "ring-2 ring-rose-500/40 border-rose-500 bg-rose-500/[0.08]",
  },
  {
    key: "EARNED" as const,
    title: "Earned Leave",
    description: "Planned vacations, accrued annual leave.",
    icon: Award,
    themeColor: "violet",
    accent: "border-violet-500/20 text-violet-600 dark:text-violet-400 bg-violet-500/5",
    activeGlow: "ring-2 ring-violet-500/40 border-violet-500 bg-violet-500/[0.08]",
  },
  {
    key: "UNPAID" as const,
    title: "Unpaid Leave",
    description: "Time off without balance deductions.",
    icon: ShieldAlert,
    themeColor: "slate",
    accent: "border-slate-500/20 text-slate-600 dark:text-slate-400 bg-slate-500/5",
    activeGlow: "ring-2 ring-slate-500/40 border-slate-500 bg-slate-500/[0.08]",
  },
];

export function LeaveApplyForm() {
  const router = useRouter();

  const [leaveType, setLeaveType] = useState<(typeof LEAVE_TYPES)[number]>("CASUAL");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const totalDays =
    startDate && endDate && endDate >= startDate
      ? differenceInCalendarDays(endDate, startDate) + 1
      : 0;

  const handleSubmit = async () => {
    setError("");

    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }
    if (endDate < startDate) {
      setError("End date cannot be before start date");
      return;
    }
    if (!reason || reason.trim().length < 5) {
      setError("Please provide a reason (at least 5 characters)");
      return;
    }

    setLoading(true);
    const result = await applyForLeave({
      leaveType,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      reason,
    });
    setLoading(false);

    if (result.error) {
      setError(result.error);
      return;
    }

    router.push("/employee/requests");
  };

  const selectedOption = LEAVE_TYPE_OPTIONS.find(opt => opt.key === leaveType)!;

  return (
    <div className="space-y-6 max-w-2xl mx-auto w-full">
      {/* Return to Dashboard Link */}
      <Link 
        href="/employee" 
        className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground w-fit transition-colors group"
      >
        <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
        Return to Dashboard
      </Link>

      <Card className="border border-foreground/5 shadow-[0_8px_30px_rgb(0,0,0,0.02)] overflow-hidden">
        {/* Decorative Top Accent Bar */}
        <div className="h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-pink-500" />
        
        <CardHeader className="px-6 pt-6 pb-4 border-b border-foreground/5">
          <CardTitle className="text-xl font-bold tracking-tight text-foreground/90">
            Submit Leave Application
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground/80">
            Select your leave category, timeline, and input your reason for review.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Visual Category Grid */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              1. Choose Leave Category
            </Label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {LEAVE_TYPE_OPTIONS.map((option) => {
                const Icon = option.icon;
                const isSelected = leaveType === option.key;
                
                return (
                  <button
                    key={option.key}
                    type="button"
                    onClick={() => setLeaveType(option.key)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all duration-200 cursor-pointer hover:shadow-xs ${
                      isSelected 
                        ? option.activeGlow 
                        : "border-foreground/10 hover:border-foreground/15 hover:bg-foreground/[0.01]"
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 ${
                      isSelected 
                        ? `bg-${option.themeColor}-500/10 text-${option.themeColor}-600 dark:text-${option.themeColor}-400`
                        : "bg-foreground/5 text-muted-foreground/80"
                    }`}>
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    
                    <div className="space-y-0.5">
                      <p className={`text-sm font-semibold leading-tight ${
                        isSelected ? "text-foreground" : "text-muted-foreground/90"
                      }`}>
                        {option.title}
                      </p>
                      <p className="text-[11px] leading-snug text-muted-foreground/75">
                        {option.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timeline Date Picker Grid */}
          <div className="space-y-3 pt-4 border-t border-foreground/5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              2. Select Leave Timeline
            </Label>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground font-medium">Start Date</span>
                <Popover>
                  <PopoverTrigger>
                    <Button
                      variant="outline"
                      className="w-full justify-start font-normal h-10 border-foreground/10 hover:border-foreground/15 rounded-lg text-xs"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground/60" />
                      {startDate ? format(startDate, "PPP") : "Choose start date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => {
                        setStartDate(date);
                        // reset end date if invalid
                        if (endDate && date && endDate < date) {
                          setEndDate(undefined);
                        }
                      }}
                      disabled={(date) =>
                        date < new Date(new Date().setHours(0, 0, 0, 0))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* End Date */}
              <div className="space-y-1.5">
                <span className="text-xs text-muted-foreground font-medium">End Date</span>
                <Popover>
                  <PopoverTrigger>
                    <Button
                      variant="outline"
                      className="w-full justify-start font-normal h-10 border-foreground/10 hover:border-foreground/15 rounded-lg text-xs"
                      disabled={!startDate}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4 text-muted-foreground/60" />
                      {endDate ? format(endDate, "PPP") : "Choose end date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) =>
                        date <
                        (startDate ?? new Date(new Date().setHours(0, 0, 0, 0)))
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Glowing duration details badge */}
            <AnimatePresence>
              {totalDays > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2.5 p-3 rounded-lg bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-between text-xs text-indigo-700 dark:text-indigo-400">
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4 text-indigo-500" />
                      Computed Absence Length
                    </span>
                    <span className="font-bold flex items-center gap-1">
                      {totalDays} {totalDays === 1 ? "Working Day" : "Working Days"}
                      <Sparkles className="h-3.5 w-3.5 text-indigo-500 animate-pulse" />
                    </span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Reason Section */}
          <div className="space-y-2 pt-4 border-t border-foreground/5">
            <div className="flex justify-between">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                3. Reason for Absence
              </Label>
              <span className="text-[10px] text-muted-foreground/60">Min. 5 characters</span>
            </div>
            
            <Textarea
              placeholder="Provide context regarding your absence for the administration..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
              className="resize-none border-foreground/10 hover:border-foreground/15 focus-visible:ring-1 focus-visible:ring-indigo-500 rounded-lg text-xs leading-relaxed"
            />
          </div>

          {/* Error Alert panel */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-lg text-xs flex items-center gap-2 font-semibold"
              >
                <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
                <span>{error}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit Panel */}
          <div className="pt-2">
            <Button 
              onClick={handleSubmit} 
              disabled={loading} 
              className="w-full h-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs hover:shadow-md transition-all duration-200"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Uploading request details...
                </>
              ) : (
                <span className="flex items-center justify-center gap-1.5">
                  Submit Request Panel <ArrowRight className="h-3.5 w-3.5" />
                </span>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
