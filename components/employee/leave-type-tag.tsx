const TYPE_COLORS: Record<string, string> = {
  CASUAL: "border-l-blue-400",
  SICK: "border-l-rose-400",
  EARNED: "border-l-violet-400",
  UNPAID: "border-l-slate-400",
};

export function getLeaveTypeAccent(type: string) {
  return TYPE_COLORS[type] ?? "border-l-slate-400";
}
