import { Trash2 } from "lucide-react";
import { Button } from "@/shared/ui";
import { useMutateCancelBybitOrder } from "../hooks/useMutateCancelBybitOrder.ts";

interface CancelBybitOrderButtonProps {
 apiKeyId: string;
 orderId: string;
 symbol: string;
}

export const CancelBybitOrderButton = (props: CancelBybitOrderButtonProps) => {
 const { apiKeyId, orderId, symbol } = props;
 const cancelOrderMutation = useMutateCancelBybitOrder();

 async function handleClick() {
  if (!confirm("Cancel this order?")) {
   return;
  }

  try {
   await cancelOrderMutation.mutateAsync({
    apiKeyId,
    orderId,
    symbol,
   });
  } catch {
   // Keep current page behavior: fail silently.
  }
 }

 return (
  <Button
   disabled={cancelOrderMutation.isPending}
   onClick={handleClick}
   size="icon"
   title="Cancel"
   variant="ghost">
   <Trash2 className="text-red-500" size={14} />
  </Button>
 );
};
