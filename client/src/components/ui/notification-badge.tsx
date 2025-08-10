import { cn } from "../../lib/utils";

interface NotificationBadgeProps {
  count: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export default function NotificationBadge({ 
  count, 
  className,
  size = "md" 
}: NotificationBadgeProps) {
  if (count === 0) return null;

  const sizeClasses = {
    sm: "w-4 h-4 text-xs",
    md: "w-5 h-5 text-xs",
    lg: "w-6 h-6 text-sm"
  };

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-red-500 text-white font-semibold",
        sizeClasses[size],
        className
      )}
    >
      {count > 99 ? "99+" : count}
    </div>
  );
}
