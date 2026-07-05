export function normalizeRole(role: string | null | undefined) {
  return role?.toUpperCase() === "ADMIN" ? "ADMIN" : "EMPLOYEE";
}

export function dashboardPathForRole(role: string | null | undefined) {
  return normalizeRole(role) === "ADMIN" ? "/admin" : "/employee";
}
