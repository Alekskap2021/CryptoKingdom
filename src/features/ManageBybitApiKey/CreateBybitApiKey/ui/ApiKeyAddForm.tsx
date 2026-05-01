import { Form } from "@base-ui/react";
import { Plus } from "lucide-react";
import { useValidateForm } from "@/shared/hooks/useValidateForm.ts";
import { Button, Input } from "@/shared/ui";
import { CheckboxField } from "@/shared/ui/CheckboxField.tsx";
import { Dialog } from "@/shared/ui/Dialog.tsx";
import { Field } from "@/shared/ui/Field.tsx";
import { useMutateAddApiKey } from "../hooks/useMutateAddApiKey.ts";
import { type ApiKeyInput, apiKeySchema } from "../model/schema.ts";

export const createFormTrigger = Dialog.createHandle();

export const CreateApiKeyTrigger = () => {
 return (
  <Dialog.Trigger
   handle={createFormTrigger}
   render={
    <Button>
     <Plus size={16} />
     Add Key
    </Button>
   }
  />
 );
};

export const ApiKeyAddForm = () => {
 const { errors, validateForm } = useValidateForm(apiKeySchema);
 const { isPending, mutateAsync } = useMutateAddApiKey();

 return (
  <Dialog handle={createFormTrigger}>
   <Dialog.Content className="w-1/3">
    <div className="start mb-5 flex flex-col items-start gap-3">
     <Dialog.Title className="text-left">Add New API Key</Dialog.Title>
     <Dialog.Description className="text-left">
      Enter your API key from Inishe exchange to enable trading and connect to Bybit API on our
      platform. This will allow you to trade, manage positions, and use all trading features
      directly through our website. <br />
     </Dialog.Description>
    </div>

    <Form
     className="space-y-4"
     errors={errors}
     validationMode={"onBlur"}
     onFormSubmit={(values: ApiKeyInput) => {
      validateForm(values);
      mutateAsync(values);
     }}>
     <Field label="Name" name="label">
      <Input placeholder="e.g. Main Trading" />
     </Field>

     <Field label="API Key" name="apiKey">
      <Input placeholder="Your Bybit API key" />
     </Field>

     <Field label="API Secret" name="apiSecret">
      <Input placeholder="Your Bybit API secret" />
     </Field>

     <CheckboxField name="testnet">Testnet key</CheckboxField>

     <div className="flex justify-end gap-2">
      <Dialog.Close
       render={
        <Button type="button" variant="ghost">
         Cancel
        </Button>
       }
      />

      <Button
       render={
        <a href="https://www.bybit.com/app/user/api-management" target="_blank" rel="noreferrer">
         Create API Key →
        </a>
       }
       variant="outline"
       nativeButton={false}
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
