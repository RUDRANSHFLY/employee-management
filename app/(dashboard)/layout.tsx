import { auth } from "@/auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Profile } from "@/components/auth/profile";

export default async function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/login");
  }

  return (
    <div>
      <header className="flex items-center justify-between p-4 border-b">
        <h1 className="text-lg font-semibold">Leave Management — Employee</h1>
        <Profile />
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
