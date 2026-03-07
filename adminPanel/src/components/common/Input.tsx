import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { BsUpload } from "react-icons/bs";
import { IoCloseCircle } from "react-icons/io5";

// Input Component Props Interface
interface InputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "onChange" | "onBlur" | "onFocus" | "value"
> {
  type?:
    | "text"
    | "email"
    | "password"
    | "number"
    | "tel"
    | "url"
    | "search"
    | "date"
    | "time"
    | "datetime-local";
  placeholder?: string;
  label?: string;
  value?: string | number;
  className?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
}

// Select Component Props Interface
interface SelectProps {
  placeholder?: string;
  label?: string;
  value?: string;
  className?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  options: Array<{ label: string; value: string }>;
  onChange?: (value: string) => void;
}

// Textarea Component Props Interface
interface TextareaProps {
  name?: string;
  placeholder?: string;
  label?: string;
  value?: string;
  className?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
}

// Image Upload Component Props Interface
interface ImageUploadProps {
  label?: string;
  description?: string;
  value?: File | string | null;
  className?: string;
  errorMessage?: string;
  required?: boolean;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  onChange?: (file: File | null) => void;
  previewSize?: "sm" | "md" | "lg";
}

// Base Input Component
export const Input = ({
  type = "text",

  placeholder,
  label,
  value,
  className,
  errorMessage,
  required = false,
  disabled = false,

  onChange,
  onBlur,
  onFocus,
  ...props
}: InputProps) => {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label
          className={cn(
            "text-[12px] font-medium block mb-1",
            errorMessage
              ? "text-(--Warning)"
              : "text-(--table-body-font-color)",
          )}
        >
          {label}
          {required && <span className="text-(--Warning) ml-0.5">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        {...props}
        className={cn(
          "w-full h-[33px] px-3 text-[12px] rounded-(--border-rounded-primary) transition-colors outline-none",
          "border border-(--border-color-secondary)",
          "text-black placeholder:text-(--table-body-font-color) placeholder:opacity-50",
          "focus:border-(--Primary) focus:ring-1 focus:ring-(--Primary)/20",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-(--gray-100)",
          errorMessage && "border-(--Warning) bg-(--Warning)/5",
          !errorMessage && "bg-white",
        )}
      />
      {errorMessage && (
        <p className="text-[10px] mt-1 text-(--Warning) font-medium">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

// Custom Select Component (Native HTML select)
export const Select = ({
  placeholder,
  label,
  value,
  className,
  errorMessage,
  required = false,
  disabled = false,
  options = [],
  onChange,
  ...props
}: SelectProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange?.(e.target.value);
  };

  return (
    <div className={cn("w-full ", className)}>
      {label && (
        <label
          className={cn(
            "text-[12px] font-normal block mb-1 ",
            errorMessage
              ? "text-(--Warning)"
              : "text-(--table-body-font-color)",
          )}
        >
          {label}
          {required && <span className="text-(--Warning) ml-0.5">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={handleChange}
          disabled={disabled}
          {...props}
          className={cn(
            "w-full h-[33px] px-3 pr-8 text-[12px] rounded-(--border-rounded-primary) transition-colors outline-none appearance-none",
            "border border-(--border-color-secondary)",
            "text-black",
            "focus:border-(--Primary) focus:ring-1 focus:ring-(--Primary)/20",
            "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-(--gray-100)",
            errorMessage && "border-(--Warning) bg-(--Warning)/5",
            !errorMessage && "bg-white",
            !value && "text-(--table-body-font-color) opacity-50", // Placeholder style
          )}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-(--table-body-font-color)">
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 4.5L6 7.5L9 4.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
      {errorMessage && (
        <p className="text-[10px] mt-1 text-(--Warning) font-medium">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

// Textarea Component
export const Textarea = ({
  placeholder,
  label,
  value,
  className,
  errorMessage,
  required = false,
  disabled = false,
  rows = 4,
  onChange,
  onBlur,
  onFocus,
  ...props
}: TextareaProps) => {
  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label
          className={cn(
            "text-[12px] font-medium block mb-1",
            errorMessage
              ? "text-(--Warning)"
              : "text-(--table-body-font-color)",
          )}
        >
          {label}
          {required && <span className="text-(--Warning) ml-0.5">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
        onBlur={onBlur}
        onFocus={onFocus}
        disabled={disabled}
        rows={rows}
        className={cn(
          "w-full px-3 py-2 text-[12px] rounded-(--border-rounded-primary) transition-colors outline-none resize-none",
          "border border-(--border-color-secondary)",
          "text-(--table-body-font-color) placeholder:text-(--table-body-font-color) placeholder:opacity-50",
          "focus:border-(--Primary) focus:ring-1 focus:ring-(--Primary)/20",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-(--gray-100)",
          errorMessage && "border-(--Warning) bg-(--Warning)/5",
          !errorMessage && "bg-white",
        )}
      />
      {errorMessage && (
        <p className="text-[10px] mt-1 text-(--Warning) font-medium">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

// Image Upload Component
export const ImageUpload = ({
  label,
  description,
  value,
  className,
  errorMessage,
  required = false,
  disabled = false,
  accept = "image/*",
  maxSize = 5, // 5MB default
  onChange,
  previewSize = "md",
  ...props
}: ImageUploadProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>("");

  // Size mapping
  const sizeMap = {
    sm: "h-[84px] w-[84px]",
    md: "h-[120px] w-[120px]",
    lg: "h-[160px] w-[160px]",
  };

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) {
      setPreview(null);
      setError("");
      onChange?.(null);
      return;
    }

    // Validate file size
    const fileSizeMB = file.size / 1024 / 1024;
    if (fileSizeMB > maxSize) {
      setError(`File size must be less than ${maxSize}MB`);
      setPreview(null);
      onChange?.(null);
      return;
    }

    // Validate file type
    if (accept !== "*" && !file.type.match(accept.replace("*", ".*"))) {
      setError("Invalid file type");
      setPreview(null);
      onChange?.(null);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setError("");
    };
    reader.readAsDataURL(file);

    onChange?.(file);
  };

  // Handle upload button click
  const handleUploadClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  // Handle remove image
  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setError("");
    onChange?.(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Set preview from value prop (if it's a URL string)
  React.useEffect(() => {
    if (typeof value === "string" && value) {
      setPreview(value);
    }
  }, [value]);

  return (
    <div className={cn("w-full", className)}>
      {label && (
        <label
          className={cn(
            "text-[12px] font-medium block mb-1",
            errorMessage || error ? "text-(--Warning)" : "text-(--default)",
          )}
        >
          {label}
          {required && <span className="text-(--Warning) ml-0.5">*</span>}
        </label>
      )}

      {description && (
        <p className="text-[12px] font-normal text-(--default) mb-2">
          {description}
        </p>
      )}

      <div className="flex flex-col gap-2">
        {/* Upload Box */}
        <div
          onClick={handleUploadClick}
          className={cn(
            sizeMap[previewSize],
            "border border-(--border-color-secondary) rounded-(--border-rounded-primary)",
            "flex flex-col items-center justify-center gap-2 cursor-pointer",
            "transition-all hover:border-(--Primary) hover:bg-(--Primary)/5",
            "relative overflow-hidden group",
            errorMessage || error
              ? "border-(--Warning) bg-(--Warning)/5"
              : "bg-white",
            disabled &&
              "opacity-50 cursor-not-allowed hover:border-(--border-color-secondary) hover:bg-white",
          )}
        >
          {preview ? (
            <>
              {/* Image Preview */}
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              {/* Remove Button Overlay */}
              {!disabled && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    type="button"
                    onClick={handleRemove}
                    className="p-2 bg-white rounded-full hover:bg-red-50 transition-colors"
                  >
                    <IoCloseCircle size={24} className="text-(--Danger)" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Upload Icon */}
              <BsUpload size={20} className="text-(--Primary)" />
              <p className="text-[11px] font-normal text-(--table-body-font-color)">
                Upload
              </p>
            </>
          )}
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          disabled={disabled}
          {...props}
          className="hidden"
        />

        {/* Error Message */}
        {(errorMessage || error) && (
          <p className="text-[10px] mt-1 text-(--Warning) font-medium">
            {errorMessage || error}
          </p>
        )}

        {/* File Info */}
        {preview && value instanceof File && (
          <p className="text-[10px] text-(--table-body-font-color)">
            {value.name} ({(value.size / 1024).toFixed(2)} KB)
          </p>
        )}
      </div>
    </div>
  );
};

// Default export as Input for backward compatibility
export default Input;
