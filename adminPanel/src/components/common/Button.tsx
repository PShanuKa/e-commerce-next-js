import { cn } from "@/lib/utils";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "outlineDanger";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
}

export const Button = ({
  variant = "primary",
  size = "md",
  children,
  className,
  
  loading = false,
  disabled = false,
  fullWidth = false,
  type = "button",
  ...props
}: ButtonProps) => {
  // Variant styles
  const variantStyles = {
    primary: "bg-(--Primary) text-white hover:opacity-90",
    secondary: "bg-(--gray-300) text-(--font-color-primary) hover:bg-(--gray-400)",
    outline: "border border-(--Primary) text-(--Primary) hover:bg-(--Primary)/10",
  
    ghost: "text-(--Primary) hover:bg-(--Primary)/10",
    danger: "bg-(--Danger) text-white hover:opacity-90",
    outlineDanger : "border border-(--Danger) text-(--Danger) hover:bg-(--Danger)/10"
  };

  // Size styles
  const sizeStyles = {
    sm: "h-[30px] px-4 text-[11px]",
    md: "h-[37px] px-6 text-[12px]",
    lg: "h-[44px] px-8 text-[14px]",
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      
      className={cn(
        // Base styles
        "font-semibold rounded-(--border-rounded-primary) transition-opacity inline-flex items-center justify-center gap-2",
        // Variant
        variantStyles[variant],
        // Size
        sizeStyles[size],
        // Full width
        fullWidth && "w-full",
        // Disabled
        (disabled || loading) && "opacity-50 cursor-not-allowed",
        // Custom className
        className
      )}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
