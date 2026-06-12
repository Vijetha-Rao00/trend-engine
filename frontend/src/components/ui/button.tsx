import * as React from "react";
import { cn } from "../../lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline";
  size?: "default" | "sm";
}

export function Button({
  className = "",
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        variant === "default" && "bg-indigo-600 text-white hover:bg-indigo-500",
        variant === "outline" && "border border-slate-800 bg-background hover:bg-slate-900 hover:text-white text-slate-200",
        size === "default" && "h-10 px-4 py-2",
        size === "sm" && "h-9 rounded-md px-3",
        className
      )}
      {...props}
    />
  );
}