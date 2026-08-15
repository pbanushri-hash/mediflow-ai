import React from "react";

export type StatusType =
  | "Waiting"
  | "In Consultation"
  | "In Progress"
  | "Completed"
  | "Confirmed"
  | "Cancelled"
  | "No Show"
  | "Available"
  | "Occupied"
  | "Maintenance"
  | "Sanitizing"
  | "Urgent"
  | "Standard";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
  dot?: boolean;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
  dot = true,
}) => {
  const getBadgeStyle = (val: string) => {
    switch (val.toLowerCase()) {
      case "waiting":
        return {
          bg: "bg-amber-50 text-amber-700 border-amber-200",
          dot: "bg-amber-500",
        };
      case "in consultation":
      case "in progress":
      case "in service":
        return {
          bg: "bg-sky-50 text-sky-700 border-sky-200",
          dot: "bg-sky-500 animate-pulse",
        };
      case "completed":
        return {
          bg: "bg-emerald-50 text-emerald-700 border-emerald-200",
          dot: "bg-emerald-500",
        };
      case "confirmed":
      case "available":
        return {
          bg: "bg-teal-50 text-teal-700 border-teal-200",
          dot: "bg-teal-500",
        };
      case "cancelled":
      case "no show":
      case "maintenance":
        return {
          bg: "bg-rose-50 text-rose-700 border-rose-200",
          dot: "bg-rose-500",
        };
      case "occupied":
      case "on break":
      case "needs timely evaluation":
      case "urgent":
        return {
          bg: "bg-purple-50 text-purple-700 border-purple-200",
          dot: "bg-purple-500",
        };
      default:
        return {
          bg: "bg-slate-100 text-slate-700 border-slate-200",
          dot: "bg-slate-400",
        };
    }
  };

  const style = getBadgeStyle(status);
  const sizeClasses =
    size === "sm"
      ? "text-[11px] px-2 py-0.5"
      : size === "lg"
      ? "text-sm px-3.5 py-1.5"
      : "text-xs px-2.5 py-1";

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${style.bg} ${sizeClasses}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />}
      <span className="whitespace-nowrap">{status}</span>
    </span>
  );
};
