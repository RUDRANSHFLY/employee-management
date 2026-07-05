"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ClipboardList,
  LayoutDashboard,
  PlusCircle,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";

import { Profile } from "@/components/auth/profile";
import { normalizeRole } from "@/lib/roles";
import { cn } from "@/lib/utils";

interface DashboardNavbarProps {
  role: string | null | undefined;
}

export function DashboardNavbar({ role }: DashboardNavbarProps) {
  const pathname = usePathname();
  const normalizedRole = normalizeRole(role);
  const isAdmin = normalizedRole === "ADMIN";

  const links = isAdmin
    ? [
        {
          href: "/admin",
          label: "Admin",
          icon: ShieldCheck,
        },
      ]
    : [
        {
          href: "/employee",
          label: "Dashboard",
          icon: LayoutDashboard,
        },
        {
          href: "/employee/apply",
          label: "Apply",
          icon: PlusCircle,
        },
        {
          href: "/employee/requests",
          label: "Requests",
          icon: ClipboardList,
        },
      ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-zinc-950/90 shadow-[0_12px_40px_rgba(0,0,0,0.28)] backdrop-blur-xl">
      <div className="mx-auto flex min-h-16 w-full max-w-7xl flex-col gap-3 px-4 py-3 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-5">
        <div className="flex items-center justify-between gap-4">
          <Link href={isAdmin ? "/admin" : "/employee"} className="flex items-center gap-3">
            <div
              className={cn(
                "flex size-10 items-center justify-center rounded-lg border",
                isAdmin
                  ? "border-indigo-400/30 bg-indigo-500/15 text-indigo-200"
                  : "border-emerald-400/30 bg-emerald-500/15 text-emerald-200"
              )}
            >
              {isAdmin ? (
                <ShieldCheck className="h-5 w-5" />
              ) : (
                <UserCircle2 className="h-5 w-5" />
              )}
            </div>
            <div>
              <span className="block text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                Leave Management
              </span>
              <span className="block text-sm font-semibold leading-tight text-zinc-100">
                {isAdmin ? "Admin Control" : "Employee Workspace"}
              </span>
            </div>
          </Link>

          <div className="lg:hidden">
            <Profile />
          </div>
        </div>

        <nav className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto lg:justify-center">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href !== "/employee" && pathname.startsWith(`${link.href}/`));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex h-9 shrink-0 items-center gap-2 rounded-lg border px-3 text-xs font-semibold transition-colors",
                  isActive
                    ? "border-white/15 bg-white text-zinc-950 shadow-sm"
                    : "border-white/10 bg-white/[0.03] text-zinc-300 hover:border-white/20 hover:bg-white/[0.08] hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden lg:block">
          <Profile />
        </div>
      </div>
    </header>
  );
}
