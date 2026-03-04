"use client";

import { cn } from "@/lib/utils/cn";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
}

export function Textarea({ label, helperText, className, id, ...props }: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-ptba-charcoal">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={cn(
          "w-full px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm text-ptba-charcoal",
          "placeholder:text-gray-400 transition-all duration-150 resize-y min-h-[100px]",
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
