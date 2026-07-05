import { auth } from "@/auth/auth";
import { dashboardPathForRole } from "@/lib/roles";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  redirect(dashboardPathForRole(session.user?.role));
}
