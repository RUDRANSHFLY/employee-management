import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    className:
      "bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-950 dark:text-amber-300",
    icon: Clock,
  },
  APPROVED: {
    label: "Approved",
    className:
      "bg-emerald-100 text-emerald-800 hover:bg-emerald-100 dark:bg-emerald-950 dark:text-emerald-300",
    icon: CheckCircle2,
  },
  REJECTED: {
    label: "Rejected",
    className:
      "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-950 dark:text-red-300",
    icon: XCircle,
  },
} as const;

export function LeaveStatusBadge({
  status,
}: {
  status: keyof typeof STATUS_CONFIG;
}) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <Badge
      variant="secondary"
      className={`gap-1 font-medium ${config.className}`}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}
