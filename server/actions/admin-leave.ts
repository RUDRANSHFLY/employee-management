"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth/auth";
import { prisma } from "@/prisma/prisma";

export async function approveLeaveRequest(requestId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user.role !== "ADMIN") {
      return { error: "Not authorized" };
    }

    const leaveRequest = await prisma.leaveRequest.findUniqueOrThrow({
      where: { id: requestId },
    });

    if (!leaveRequest) {
      return { error: "Request not found" };
    }
    if (leaveRequest.status !== "PENDING") {
      return { error: "This request has already been reviewed" };
    }

    // Transaction: status update + balance deduction succeed or fail together.
    // Without this, a network blip could leave you with an APPROVED request
    // that never actually deducted days from the employee's balance.
    await prisma.$transaction(async (tx) => {
      await tx.leaveRequest.update({
        where: { id: requestId },
        data: { status: "APPROVED" },
      });

      if (leaveRequest.leaveType !== "UNPAID") {
        await tx.user.update({
          where: { id: leaveRequest.userId },
          data: { leaveBalance: { decrement: leaveRequest.totalDays } },
        });
      }
    });

    revalidatePath("/admin");
    revalidatePath("/employee");
    revalidatePath("/employee/requests");

    return { success: true };
  } catch (err) {
    console.log("error on approving the leave request: ", err);
    return { succcess: false };
  }
}

export async function rejectLeaveRequest(requestId: string) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session || session.user.role !== "ADMIN") {
      return { error: "Not authorized" };
    }

    const leaveRequest = await prisma.leaveRequest.findUnique({
      where: { id: requestId },
    });

    if (!leaveRequest) {
      return { error: "Request not found" };
    }
    if (leaveRequest.status !== "PENDING") {
      return { error: "This request has already been reviewed" };
    }

    await prisma.leaveRequest.update({
      where: { id: requestId },
      data: { status: "REJECTED" },
    });

    revalidatePath("/admin");
    revalidatePath("/employee");
    revalidatePath("/employee/requests");

    return { success: true };
  } catch (err) {
    console.log("error on rejecting the leave request: ", err);
    return { succcess: false };
  }
}
