import { auth } from "@/auth/auth";
import { headers } from "next/headers";
import { prisma } from "@/prisma/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { EmployeeRequestsList } from "@/components/employee";

export default async function MyRequestsPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  const requests = await prisma.leaveRequest.findMany({
    where: { userId: session!.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 max-w-4xl mx-auto w-full">
      {/* Back button and Header */}
      <div className="space-y-3">
        <Link 
          href="/employee" 
          className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground w-fit transition-colors group"
        >
          <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
          Return to Workspace
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-foreground/5">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground/90">
              Absence Requests History
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Review and monitor the status of your {requests.length} submitted leave request{requests.length !== 1 ? "s" : ""}.
            </p>
          </div>
          
          <Link href="/employee/apply" className="self-start sm:self-center">
            <Button className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold px-4 transition-all flex items-center gap-1.5">
              <Plus className="h-3.5 w-3.5" />
              Apply for Leave
            </Button>
          </Link>
        </div>
      </div>

      {/* Main filterable list */}
      <EmployeeRequestsList requests={requests} />
    </div>
  );
}
