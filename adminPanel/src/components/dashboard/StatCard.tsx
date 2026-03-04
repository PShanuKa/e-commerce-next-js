import { type ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  iconBg?: string;
}

const changeColors = {
  up: "text-emerald-600",
  down: "text-red-500",
  neutral: "text-gray-400",
};

const StatCard = ({
  label,
  value,
  icon,
  change,
  changeType = "neutral",
  iconBg = "bg-indigo-100",
}: StatCardProps) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-start justify-between">
    <div className="flex flex-col gap-1">
      <span className="text-sm text-gray-500 font-medium">{label}</span>
      <span className="text-2xl font-bold text-gray-800">{value}</span>
      {change && (
        <span className={`text-xs font-medium ${changeColors[changeType]}`}>
          {changeType === "up" ? "↑" : changeType === "down" ? "↓" : ""}{" "}
          {change}
        </span>
      )}
    </div>
    <div
      className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}
    >
      {icon}
    </div>
  </div>
);

export default StatCard;
