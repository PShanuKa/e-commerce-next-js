import { cn } from "@/lib/utils";
import { FaArrowUp } from "react-icons/fa";

const KpiCard3 = ({ className, title, value, icon   }: { className?: string, title: string, value: number, icon: React.ReactNode }) => {
    return (
        <div className={" rounded-md p-5 bg-white  shadow-sm"} >
            <div className="flex justify-between">
                <div>

                    <h1 className="text-[13px] font-normal uppercase text-(--font-color-secondary)">{title}</h1>
                    <h2 className="text-[16px] font-bold  text-(--font-color-primary) mt-1">{value}</h2>
                </div>
                <div className={cn("text-white bg-gray-100 rounded-full p-4", className)}>{icon}</div>
            </div>
        </div>
    )
}

export default KpiCard3;