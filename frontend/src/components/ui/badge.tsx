import * as React from "react";
import { cn } from "../../lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "outline";
}

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variant === "default" && "border-transparent bg-indigo-600 text-white",
        variant === "outline" && "text-slate-200 border-slate-800",
        className
      )}
      {...props}
    />
  );
}