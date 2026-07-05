"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format, differenceInCalendarDays } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

export function LeaveApplyForm() {
  const router = useRouter();

  const [leaveType, setLeaveType] =
    useState<(typeof LEAVE_TYPES)[number]>("CASUAL");
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

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Apply for leave</CardTitle>
        <CardDescription>
          Fill in the details below to submit a request
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label>Leave type</Label>
          <Select
            value={leaveType}
            onValueChange={(v) => setLeaveType(v as typeof leaveType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {LEAVE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.charAt(0) + type.slice(1).toLowerCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Start date</Label>
            <Popover>
              <PopoverTrigger>
                <Button
                  variant="outline"
                  className="w-full justify-start font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  disabled={(date) =>
                    date < new Date(new Date().setHours(0, 0, 0, 0))
                  }
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>End date</Label>
            <Popover>
              <PopoverTrigger>
                <Button
                  variant="outline"
                  className="w-full justify-start font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
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

        {totalDays > 0 && (
          <p className="text-sm text-muted-foreground">
            Total:{" "}
            <span className="font-medium text-foreground">
              {totalDays} day(s)
            </span>
          </p>
        )}

        <div className="space-y-2">
          <Label>Reason</Label>
          <Textarea
            placeholder="Briefly explain the reason for your leave"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            rows={4}
          />
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        <Button onClick={handleSubmit} disabled={loading} className="w-full">
          {loading ? "Submitting..." : "Submit request"}
        </Button>
      </CardContent>
    </Card>
  );
}
