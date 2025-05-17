
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Spinner = ({ size = "md", className }: SpinnerProps) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
  };

  return (
    <div className={cn("animate-spin", sizeClasses[size], className)}>
      <div className="h-full w-full rounded-full border-2 border-t-app-accent border-r-transparent border-b-app-accent border-l-transparent"></div>
    </div>
  );
};
