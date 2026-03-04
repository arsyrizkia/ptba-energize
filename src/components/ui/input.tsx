"use client";

import { cn } from "@/lib/utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
}

export function Input({ label, helperText, className, id, ...props }: InputProps) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-ptba-charcoal">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          "w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-ptba-charcoal",
          "placeholder:text-gray-400 transition-all duration-150",
          "hover:border-gray-300",
          className
        )}
        {...props}
      />
      {helperText && (
        <p className="text-xs text-ptba-gray">{helperText}</p>
      )}
    </div>
  );
}
