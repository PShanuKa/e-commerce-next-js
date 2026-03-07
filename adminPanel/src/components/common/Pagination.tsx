import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FaAngleDown } from "react-icons/fa";

interface PaginationProps {
  className?: string;
  currentPage: number;
  totalPages: number;
  limit: number;
  total: number;
  onPageChange: (page: number) => void;
  onLimitChange: (limit: number) => void;
}

const Pagination = ({
  className,
  currentPage = 1,
  totalPages = 1,
  limit = 10,
  total = 0,
  onPageChange,
  onLimitChange,
}: PaginationProps) => {
  const startRow = (currentPage - 1) * limit + 1;
  const endRow = Math.min(currentPage * limit, total);

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= maxPagesToShow; i++) {
          pages.push(i);
        }
      } else if (currentPage >= totalPages - 2) {
        for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
      }
    }
    return pages;
  };

  return (
    <div
      className={cn(
        "flex justify-between items-center w-full",
        className
      )}
    >
      <div className="flex items-center gap-2">
        <p className="text-[12px] text-(--table-body-font-color) font-medium">Show</p>
        <Select value={limit.toString()} onValueChange={(value) => onLimitChange(parseInt(value))}>
          <SelectTrigger className="w-[70px] text-(--table-body-font-color) outline-none shadow-none rounded-(--border-rounded-primary) focus-visible:ring-0 text-[12px]" size="sm">
            <SelectValue placeholder={limit.toString()} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10" >10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="30">30</SelectItem>
            <SelectItem value="40">40</SelectItem>
            <SelectItem value="50">50</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-[12px] text-(--table-body-font-color) font-medium">
          entries. Showing rows {startRow} to {endRow} of {total} entries
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-[36px] h-[36px] border border-(--border-color-secondary) rounded-full items-center justify-center flex text-(--table-body-font-color) disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaAngleDown size={13} className="text-(--table-body-font-color) rotate-90" />
        </button>
        {getPageNumbers().map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-[36px] h-[36px] rounded-full items-center justify-center flex text-[12px] ${
              currentPage === page
                ? "bg-(--Primary) text-white"
                : "border border-(--border-color-secondary) text-(--table-body-font-color)"
            }`}
          >
            {page}
          </button>
        ))}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-[36px] h-[36px] border border-(--border-color-secondary) rounded-full items-center justify-center flex text-(--table-body-font-color) disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaAngleDown size={13} className="text-(--table-body-font-color) rotate-270" />
        </button>
      </div>

      {/* <div className="flex items-center gap-5">
        <button className="border-2 border-(--pagination-text)/50 group hover:border-(--pagination-text)/100 transition-all duration-150 rounded-full ">
          <MdNavigateNext size={30} className="rotate-180 text-(--pagination-text)/50 group-hover:text-(--pagination-text)/100 transition-all duration-150"  />
        </button>
        <span className="text-[15px] text-(--pagination-text)/50 hover:text-(--pagination-text) font-semibold transition-all cursor-pointer">1</span>
        <span className="text-[15px] text-(--pagination-text)/50 hover:text-(--pagination-text) font-semibold transition-all cursor-pointer">2</span>
        <span className="text-[15px] text-(--pagination-text)/50 hover:text-(--pagination-text) font-semibold transition-all cursor-pointer">3</span>
        <button className="border-2 border-(--pagination-text)/50 rounded-full  group hover:border-(--pagination-text)/100 transition-all duration-150">
          <MdNavigateNext size={30} className="text-(--pagination-text)/50 group-hover:text-(--pagination-text)/100 transition-all duration-150" />
        </button>
      </div> */}
    </div>
  );
};

export default Pagination;
