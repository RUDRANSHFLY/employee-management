import { auth } from "@/auth/auth";
import { DashboardNavbar } from "@/components/dashboard-navbar";
import { normalizeRole } from "@/lib/roles";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  const role = normalizeRole(session.user?.role);

  return (
    <div className="dark min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(79,70,229,0.16),transparent_34%),linear-gradient(135deg,#09090b_0%,#111827_52%,#0f172a_100%)] text-foreground">
      <DashboardNavbar role={role} />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6">{children}</main>
    </div>
  );
}
