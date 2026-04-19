import { cn } from "@/shared/lib/cn";
import { Card } from "@/shared/ui";

export const ApiKeyEmptyPlaceholder = () => {
 return (
  <Card className={cn("py-8 text-center")}>
   <p className="text-sm text-slate-400">No API keys added yet.</p>
  </Card>
 );
};
