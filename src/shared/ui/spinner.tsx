import { Loader2 } from "lucide-react";
import { cn } from "../lib/cn";

interface SpinnerProps {
 className?: string;
 size?: number;
}

export function Spinner({ className, size = 20 }: SpinnerProps) {
 return <Loader2 className={cn("animate-spin text-(--sea-ink-soft)", className)} size={size} />;
}
