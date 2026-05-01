import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/ui";
import { Dialog } from "@/shared/ui/Dialog.tsx";
import { useMutateDeleteApiKey } from "../hooks/useMutateDeleteApiKey";

export const deleteKeyTrigger = Dialog.createHandle();

interface DeleteApiKeyTriggerProps {
 id: string;
}

export const DeleteApiKeyTrigger = (props: DeleteApiKeyTriggerProps) => {
 return (
  <Button
   size="icon"
   title="Delete"
   variant="ghost"
   nativeButton={false}
   render={
    <Link to="." search={{ apiKeyId: props.id, modal: "delete" }}>
     <Trash2 className="text-red-500" size={16} />{" "}
    </Link>
   }
  />
 );
};

export const ApiKeyDeleteForm = () => {
 const { isPending, mutateAsync } = useMutateDeleteApiKey();

 const { apiKeyId, modal } = useSearch({ from: "/_protected-by-login/api-keys" });
 const navigate = useNavigate({ from: "/api-keys" });

 const openHandler = (open: boolean) => {
  if (!open) {
   navigate({
    search: (prev) => ({
     ...prev,
     apiKeyId: undefined,
     modal: undefined,
    }),
    to: ".",
   });
  }
 };

 return (
  <Dialog
   handle={deleteKeyTrigger}
   open={Boolean(apiKeyId) && modal === "delete"}
   onOpenChange={openHandler}>
   <Dialog.Content className="w-1/3">
    <div className="start mb-5 flex flex-col items-start gap-3">
     <Dialog.Title className="text-left">Delete API Key</Dialog.Title>
     <Dialog.Description className="text-left">
      Are you sure you want to delete this API key? This action cannot be undone.
     </Dialog.Description>
    </div>

    <div className="flex justify-end gap-2">
     <Dialog.Close
      render={
       <Button type="button" variant="ghost">
        Cancel
       </Button>
      }
     />

     <Button onClick={() => mutateAsync(apiKeyId ?? "")} disabled={isPending} variant="danger">
      Delete
     </Button>
    </div>
   </Dialog.Content>
  </Dialog>
 );
};
