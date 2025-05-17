
import { cn } from "@/lib/utils";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const Logo = ({ size = "md", className }: LogoProps) => {
  const sizeClasses = {
    sm: "h-6",
    md: "h-8", 
    lg: "h-12"
  };

  return (
    <div className={cn("font-bold text-app-accent", sizeClasses[size], className)}>
      <span className="bg-gradient-to-r from-app-accent to-app-secondary bg-clip-text text-transparent">
        ZING ZAG
      </span>
    </div>
  );
};
