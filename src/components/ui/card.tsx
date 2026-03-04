"use client";

import { cn } from "@/lib/utils/cn";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function Card({ children, className, hover = false, onClick }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-xl bg-white border border-gray-100 shadow-sm",
        hover && "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 cursor-pointer",
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-5 pt-5 pb-3", className)}>
      {children}
    </div>
  );
}

export function CardContent({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-5 pb-5", className)}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("px-5 pb-5 pt-3 border-t border-gray-50", className)}>
      {children}
    </div>
  );
}
