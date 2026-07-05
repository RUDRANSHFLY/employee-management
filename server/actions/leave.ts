"use server";

import { auth } from "@/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/prisma/prisma";
import { revalidatePath } from "next/cache";
import { differenceInCalendarDays } from "date-fns";
import { LeaveType } from "@/generated/prisma/enums";

interface ApplyLeaveInput {
  leaveType: LeaveType;
  startDate: string; // ISO date string from the client
  endDate: string;
  reason: string;
}

export async function applyForLeave(input: ApplyLeaveInput) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) {
    return { error: "Not authenticated" };
  }

  const start = new Date(input.startDate);
  const end = new Date(input.endDate);

  if (end < start) {
    return { error: "End date cannot be before start date" };
  }
  if (!input.reason || input.reason.trim().length < 5) {
    return { error: "Please provide a reason (at least 5 characters)" };
  }

  const totalDays = differenceInCalendarDays(end, start) + 1; // inclusive of both days

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { leaveBalance: true },
  });

  // UNPAID leave doesn't draw from the balance, so skip the check
  if (input.leaveType !== "UNPAID") {
    const remaining = user?.leaveBalance ?? 0;
    if (remaining < totalDays) {
      return {
        error: `Insufficient balance. You have ${remaining} day(s) left.`,
      };
    }
  }

  // Balance is NOT deducted here — the request is still PENDING.
  // Deduction happens in the admin approve action, once it's actually granted.
  await prisma.leaveRequest.create({
    data: {
      userId: session.user.id,
      leaveType: input.leaveType,
      startDate: start,
      endDate: end,
      totalDays,
      reason: input.reason.trim(),
    },
  });

  revalidatePath("/employee");
  revalidatePath("/employee/requests");

  return { success: true };
}
