import { Form } from "@base-ui/react/form";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useValidateForm } from "@/shared/hooks/useValidateForm.ts";
import { Button, Input } from "@/shared/ui";
import { Dialog } from "@/shared/ui/Dialog.tsx";
import { Field } from "@/shared/ui/Field.tsx";
import { useMutateEditApiKey } from "../hooks/useMutateEditApiKey.tsx";
import { type ApiKeyUpdateInput, apiKeyUpdateSchema } from "../model/schema.ts";

const editKeyTrigger = Dialog.createHandle();

export const ApiKeyEditForm = () => {
 const { apiKeyId } = useSearch({ from: "/_protected-by-login/api-keys" });
 const navigate = useNavigate({ from: "/api-keys" });

 const { isPending, mutateAsync } = useMutateEditApiKey();
 const { errors, validateForm } = useValidateForm(apiKeyUpdateSchema);

 return (
  <Dialog
   handle={editKeyTrigger}
   open={Boolean(apiKeyId)}
   onOpenChange={(open) => !open && navigate({ search: { apiKeyId: undefined }, to: "." })}>
   <Dialog.Content className="w-1/3">
    <div className="start mb-5 flex flex-col items-start gap-3">
     <Dialog.Title className="text-left">Edit your API Key</Dialog.Title>
    </div>

    <Form
     className="space-y-4"
     errors={errors}
     validationMode={"onBlur"}
     onFormSubmit={(values: ApiKeyUpdateInput) => {
      validateForm(values);
      mutateAsync({ ...values, id: apiKeyId ?? "" });
     }}>
     <Field label="Name" name="label">
      <Input placeholder="e.g. My API Key" />
     </Field>

     <div className="flex justify-end gap-2">
      <Dialog.Close
       render={
        <Button type="button" variant="ghost">
         Cancel
        </Button>
       }
      />

      <Button type="submit" disabled={isPending}>
       Save Key
      </Button>
     </div>
    </Form>
   </Dialog.Content>
  </Dialog>
 );
};
