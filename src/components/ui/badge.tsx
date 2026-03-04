import { cn } from "@/lib/utils/cn";

type BadgeVariant = "default" | "success" | "warning" | "danger" | "info" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-ptba-navy/10 text-ptba-navy",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  danger: "bg-red-50 text-ptba-red border-red-200",
  info: "bg-blue-50 text-ptba-steel-blue border-blue-200",
  neutral: "bg-gray-100 text-ptba-gray border-gray-200",
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border",
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
