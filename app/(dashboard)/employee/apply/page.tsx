import { auth } from "@/auth/auth";
import { LeaveApplyForm } from "@/components/employee";
import { normalizeRole } from "@/lib/roles";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function ApplyLeavePage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (normalizeRole(session?.user?.role) === "ADMIN") {
    redirect("/admin");
  }

  return (
    <div>
      <LeaveApplyForm />
    </div>
  );
}
