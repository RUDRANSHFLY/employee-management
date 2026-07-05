import { headers } from "next/headers";
import Link from "next/link";

import { auth } from "@/auth/auth";
import { prisma } from "@/prisma/prisma";
import { Greeting } from "@/components/employee/greeting";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function EmployeePage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const firstName = session!.user.name.split(" ")[0];

  const balances = await prisma.user.findUniqueOrThrow({
    where: { id: session!.user.id },
    select: { leaveBalance: true },
  });

  const pendingCount = await prisma.leaveRequest.count({
    where: { userId: session!.user.id, status: "PENDING" },
  });

  return (
    <div className="space-y-8">
      <Greeting firstName={firstName} />

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium text-muted-foreground">
              Pending requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{pendingCount}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base font-medium text-muted-foreground">
              Leave balance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{balances.leaveBalance} left</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-3">
        <Button>
          <Link href="/employee/apply">Apply for leave</Link>
        </Button>
        <Button variant="outline">
          <Link href="/employee/requests">View my requests</Link>
        </Button>
      </div>
    </div>
  );
}
