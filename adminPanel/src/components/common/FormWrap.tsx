import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton"

const FormWrap = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "bg-white rounded-sm border border-(--border-color-primary) mb-5",
        className
      )}
    >
  
      {children}
    </div>
  );
};

export const FormWrapHeader = ({
  title,

  children,
  className,
}: {
  title: string;

  children?: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "h-12 w-full px-4 flex items-center justify-between  ",
        className
      )}
    >
      <div>
        <h1 className="text-sm font-semibold text-(--default)">{title}</h1>
      </div>
      <div>{children}</div>
    </div>
  );
};

export const FormWrapBody = ({
  children,
  className,
  isLoading = false,
}: {
  children: React.ReactNode;
  className?: string;
  isLoading?: boolean;
}) => {
  return (
    <div
      className={cn(
        " w-full   pt-4 px-4 pb-6 grid  grid-cols-1 sm:grid-cols-2  md:grid-cols-3 gap-4 border-t border-(--border-color-secondary)",
        className
      )}
    >

          {isLoading ?<>
          
            <Skeleton className="h-[40px] w-full rounded-[3px]" /> 
            <Skeleton className="h-[80px] w-full rounded-[3px] sm:col-span-2 md:col-span-3" /> 
          </>
             : children}

    </div>
  );
};

export default FormWrap;
