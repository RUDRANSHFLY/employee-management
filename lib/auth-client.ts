import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import type { auth } from "@/auth/auth";

export const { signIn, signUp, useSession, signOut } = createAuthClient({
  plugins: [inferAdditionalFields<typeof auth>()],
  baseURL: "http://localhost:3000",
});
