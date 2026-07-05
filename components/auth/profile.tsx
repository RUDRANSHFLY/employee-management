"use client";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { LogOut } from "lucide-react";
import { normalizeRole } from "@/lib/roles";

export function Profile() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (isPending) {
    return (
      <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2">
        <div className="h-8 w-8 animate-pulse rounded-full bg-white/10" />
        <div className="hidden space-y-2 sm:block">
          <div className="h-2.5 w-20 animate-pulse rounded bg-white/10" />
          <div className="h-2.5 w-14 animate-pulse rounded bg-white/10" />
        </div>
      </div>
    );
  }

  if (!session) return null;

  const { name, role } = session.user as { name: string; role: string };
  const normalizedRole = normalizeRole(role);

  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-2 text-zinc-100">
      <Avatar className="h-8 w-8">
        <AvatarFallback className="bg-white text-xs font-bold text-zinc-950">
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="hidden min-w-0 sm:block">
        <p className="max-w-32 truncate text-xs font-semibold leading-none text-white">
          {name}
        </p>
        <div className="mt-1">
          <Badge
            variant={normalizedRole === "ADMIN" ? "default" : "secondary"}
            className="h-4 rounded px-1.5 text-[9px] leading-none"
          >
            {normalizedRole}
          </Badge>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        onClick={handleSignOut}
        title="Sign out"
        className="text-zinc-300 hover:bg-white/10 hover:text-white"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    </div>
  );
}
