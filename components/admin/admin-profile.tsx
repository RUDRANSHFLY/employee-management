import { auth } from "@/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/prisma/prisma";
import { signOutAction } from "@/server/actions/auth";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShieldCheck, LogOut } from "lucide-react";

export async function AdminProfile() {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session!.user as { name: string; email: string };

  const pendingCount = await prisma.leaveRequest.count({
    where: { status: "PENDING" },
  });

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <Card className="overflow-hidden">
      <div className="h-14 bg-linear-to-r from-indigo-500 via-violet-500 to-fuchsia-500" />
      <CardContent className="px-5 pb-5 -mt-8">
        <div className="flex items-end justify-between">
          <div className="flex items-end gap-3">
            <div className="h-16 w-16 rounded-full p-[3px] bg-gradient-to-br from-indigo-500 to-fuchsia-500 shadow-md">
              <div className="h-full w-full rounded-full bg-background flex items-center justify-center">
                <span className="text-lg font-semibold">{initials}</span>
              </div>
            </div>
          </div>

          <form action={signOutAction}>
            <Button variant="ghost" size="icon" type="submit" title="Sign out">
              <LogOut className="h-4 w-4" />
            </Button>
          </form>
        </div>

        <div className="mt-3 space-y-1">
          <p className="font-semibold leading-none">{user.name}</p>
          <p className="text-sm text-muted-foreground">{user.email}</p>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <Badge className="gap-1 bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white hover:opacity-90 border-0">
            <ShieldCheck className="h-3 w-3" />
            Administrator
          </Badge>
        </div>

        {pendingCount > 0 && (
          <div className="mt-4 pt-4 border-t flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Awaiting review
            </span>
            <Badge variant="secondary" className="font-semibold">
              {pendingCount} pending
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
