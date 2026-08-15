import React from "react";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive?: boolean;
    label?: string;
  };
  onClick?: () => void;
  accentBorder?: boolean;
}

export const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = "text-sky-600 bg-sky-50",
  trend,
  onClick,
  accentBorder = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 ${
        onClick ? "cursor-pointer hover:border-sky-300" : ""
      } ${accentBorder ? "border-l-4 border-l-sky-500" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {title}
          </span>
          <div className="mt-2 text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            {value}
          </div>
        </div>

        <div className={`p-3 rounded-xl ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
          {subtitle && <span className="text-slate-500">{subtitle}</span>}
          {trend && (
            <span
              className={`inline-flex items-center font-medium ${
                trend.isPositive ? "text-emerald-600" : "text-slate-500"
              }`}
            >
              {trend.isPositive ? (
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              ) : (
                <ArrowDownRight className="w-3.5 h-3.5 mr-0.5" />
              )}
              {trend.value} {trend.label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};
