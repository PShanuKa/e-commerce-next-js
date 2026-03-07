import { cn } from "@/lib/utils";
import { ImSpinner2 } from "react-icons/im";

export const Table = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className={cn("w-full min-w-max", className)}>{children}</table>
    </div>
  );
};



export const TableHead = ({ children }: { children: React.ReactNode }) => {
  return <thead>{children}</thead>;
};



export const TableHeaderRow = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <tr className={cn("bg-(--table-header-row-bg) h-[33px] px-4", className)}>
      {children}
    </tr>
  );
};

export const TableHeaderCell = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <th
      className={cn(
        "text-(--table-header-font-color) font-medium uppercase text-[10px] text-start px-4 ",
        className
      )}
    >
      {children}
    </th>
  );
};

export const TableBodyRow = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <tr className={cn(`h-[55px] border-b border-(--gray-200)`, className)} {...props}>
      {children}
    </tr>
  );
};

export const TableBody = ({ children , isLoading , noDataMessage = false }: { children: React.ReactNode; isLoading?: boolean; noDataMessage?: boolean }) => {
  return  <tbody>
    {isLoading ? (
      <TableBodyRow>
        <TableBodyCell colSpan={500} className="text-center py-20">
          <div className="flex items-center justify-center h-[50px]">
          <ImSpinner2 className="animate-spin text-(--Primary) text-[30px]"/>
          </div>
        </TableBodyCell>
      </TableBodyRow>
    ) : 
    noDataMessage ? (
      <TableBodyRow>
        <TableBodyCell colSpan={500} className="text-center py-20">
          <p className="text-(--table-body-font-color)">No data found</p>
        </TableBodyCell>
      </TableBodyRow>
    ) : (
      children
    )}
    
    </tbody>;
};

export const TableBodyCell = ({
  children,
  className,
  ...props
}: {
  children: React.ReactNode;
  className?: string;
} & React.TdHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <td
      className={cn(
        "text-(--table-body-font-color) px-4 text-[12px] font-medium ",
        className
      )}
      {...props}
    >
      {" "}
      {children}
    </td>
  );
};
