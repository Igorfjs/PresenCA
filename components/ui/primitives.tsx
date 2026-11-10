import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)); }

/** Small, composable UI primitives following the shadcn/ui composition pattern. */
export function Button({ className, variant = "default", size = "default", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "default" | "outline" | "ghost" | "destructive"; size?: "default" | "sm" | "icon" }) {
  const variants = { default: "bg-emerald-700 text-white hover:bg-emerald-800", outline: "border border-stone-200 bg-white hover:bg-stone-50", ghost: "hover:bg-stone-100", destructive: "bg-rose-600 text-white hover:bg-rose-700" };
  const sizes = { default: "h-9 px-4", sm: "h-8 px-3", icon: "h-9 w-9" };
  return <button className={cn("inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50", variants[variant], sizes[size], className)} {...props} />;
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <section className={cn("rounded-xl border border-stone-200 bg-white text-stone-900 shadow-sm", className)} {...props} />; }
export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn("flex flex-col gap-1.5 p-6", className)} {...props} />; }
export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) { return <h3 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />; }
export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) { return <p className={cn("text-sm text-stone-500", className)} {...props} />; }
export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn("p-6 pt-0", className)} {...props} />; }
export function Badge({ className, tone = "default", children }: { className?: string; tone?: "default" | "muted" | "success" | "warning"; children: ReactNode }) { const tones = { default: "bg-emerald-50 text-emerald-800", muted: "bg-stone-100 text-stone-700", success: "bg-green-50 text-green-800", warning: "bg-amber-50 text-amber-800" }; return <span className={cn("inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium", tones[tone], className)}>{children}</span>; }
export function Skeleton({ className, ...props }: HTMLAttributes<HTMLDivElement>) { return <div className={cn("animate-pulse rounded-md bg-stone-100", className)} {...props} />; }
