import { cn } from "@/lib/utils";
import { FaArrowUp } from "react-icons/fa";

const KpiCard2 = ({
  className,
  title,
  value,
  icon,
  discription,
  previous30Days,
  prefix,
  decimals,
}: {
  className?: string;
  title: string;
  value: number;
  previous30Days?: number;
  icon: React.ReactNode;
  discription: string;
  prefix?: string;
  decimals?: number;
}) => {
  const change =
    ((Number(value) - Number(previous30Days)) / Number(previous30Days)) * 100;

  const progress = Math.abs(change).toFixed(1);

  const isNegative = change < 0;

  return (
    <div className={" rounded-md p-5 bg-white  shadow-sm"}>
      <div className="flex justify-between">
        <div>
          <h1 className="text-[13px] font-normal uppercase text-(--font-color-secondary)">
            {title}
          </h1>
          <h2 className="text-[16px] font-bold  text-(--font-color-primary) mt-1">
            {prefix}
            {decimals !== undefined ? Number(value).toFixed(decimals) : value}
          </h2>
        </div>
        <div
          className={cn("text-white bg-gray-100 rounded-full p-4", className)}
        >
          {icon}
        </div>
      </div>
      {previous30Days ? (
        <div className="flex items-center gap-2 mt-3">
          <FaArrowUp
            size={14}
            className={`mt-1 transition-transform duration-300 ${
              isNegative ? "text-red-500 rotate-180" : "text-green-500"
            }`}
          />

          <p className="text-[12px] font-normal text-(--font-color-primary) mt-2">
            {progress}%
          </p>

          <p className="text-[12px] font-light text-(--font-color-secondary)/70 mt-2">
            {discription}
          </p>
        </div>
      ) : null}
    </div>
  );
};

export default KpiCard2;
