import { cn } from "@/lib/utils";

const KpiCard = ({ className, title, value, allValue, type }: { className?: string, title: string, value: number, allValue: number, type?: string }) => {
    const progress = Number(value || 0) / Number(allValue || 0) * 100

    return (
        <div className={cn(" rounded-md p-4", className)} >
            <h1 className="text-[10px] font-bold text-white">{title}</h1>
            <h2 className="text-[16px] font-bold  text-white mt-1">{type}{value}/{allValue}</h2>
            <div className="w-full h-[3px] bg-white rounded-full mt-1">
                <div className="h-full bg-green-500 rounded-full"></div>
            </div>
            <p className="text-[10px] font-bold text-white mt-2">{progress.toFixed(0)}%</p>
        </div>
    )
}

export default KpiCard;