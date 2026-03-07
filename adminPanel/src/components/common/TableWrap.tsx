import { cn } from "@/lib/utils";

const TableWrap = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("bg-white rounded-md border border-(--border-color-primary)", className)}>
      {children}
    </div>
  );
};

export default TableWrap;

export const TableWrapHeader = ({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("h-16 w-full px-4 flex items-center justify-between  ", className)}>
      <div>
        <h1 className="text-sm font-semibold text-(--font-color-primary)">
          {title}
        </h1>
        {description && (
        <p className="text-[12px]  font-light text-(--font-color-secondary)">
          {description}
        </p>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
};

export const TableWrapBody = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn(" w-full  flex   ", className)}>
      {children}
    </div>
  );
};

export const TableWrapFooter = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("w-full h-20  px-4 flex items-center justify-between  ", className)}>
      {children}
    </div>
  );
};