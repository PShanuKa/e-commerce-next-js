import { cn } from "@/lib/utils";

const ChartWrap = ({ children, title, description, className }: { children: React.ReactNode, title: string, description: string, className?: string }) => {





    return (
        <div className={cn("bg-white rounded-md  mt-5 ", className)}>
            <div className=" py-6 px-5 border-b border-(--border-color-primary)">
                <h1 className="text-[13px] font-normal uppercase  text-(--font-color-secondary)">{title}</h1>
                <p className="text-[12px] font-bold text-(--font-color-secondary)">{description}</p>
            </div>
            <div className="p-5">

                {children}
            </div>
        </div>
    )
}

export default ChartWrap;