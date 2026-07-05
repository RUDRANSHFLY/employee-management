import { auth } from "@/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Profile } from "@/components/auth/profile";
import { ShieldCheck, UserCircle2 } from "lucide-react";

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  const role = session.user?.role || "EMPLOYEE";
  const isAdmin = role === "ADMIN";

  return (
    <div className="min-h-screen bg-slate-50/30 dark:bg-zinc-950/20">
      <header className="sticky top-0 z-50 w-full border-b border-foreground/5 bg-background/80 backdrop-blur-md">
        <div className="flex h-16 items-center justify-between px-6 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-lg ${
              isAdmin 
                ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" 
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
            }`}>
              {isAdmin ? (
                <ShieldCheck className="h-4.5 w-4.5" />
              ) : (
                <UserCircle2 className="h-4.5 w-4.5" />
              )}
            </div>
            <div>
              <span className="text-[10px] font-bold text-muted-foreground/60 tracking-wider uppercase leading-none block">
                Leave Management
              </span>
              <span className="text-sm font-semibold text-foreground/80 leading-none">
                {isAdmin ? "Admin Operations Control" : "Employee Workspace"}
              </span>
            </div>
          </div>
          
          <Profile />
        </div>
      </header>
      <main className="px-6 py-8 max-w-7xl mx-auto w-full">{children}</main>
    </div>
  );
}
