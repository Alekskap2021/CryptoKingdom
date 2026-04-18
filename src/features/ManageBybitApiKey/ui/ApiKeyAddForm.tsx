import { type FormEvent, useState } from "react";
import { Button, Card, CardHeader, CardTitle, Input, Label } from "@/shared/ui";
import { createApiKey } from "../api/api-keys.actions.ts";

interface ApiKeyAddFormProps {
 onCancel: () => void;
 onSuccess?: () => void;
}

export const ApiKeyAddForm = (props: ApiKeyAddFormProps) => {
 const { onCancel, onSuccess } = props;
 const [submitting, setSubmitting] = useState(false);
 const [formError, setFormError] = useState<null | string>(null);

 async function handleSubmit(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setFormError(null);
  setSubmitting(true);

  const fd = new FormData(e.currentTarget);
  try {
   await createApiKey({
    data: {
     apiKey: fd.get("apiKey") as string,
     apiSecret: fd.get("apiSecret") as string,
     label: fd.get("label") as string,
     testnet: fd.get("testnet") === "on",
    },
   });
   onSuccess?.();
  } catch (err) {
   setFormError(err instanceof Error ? err.message : "Failed to create key");
  }
  setSubmitting(false);
 }

 return (
  <Card>
   <CardHeader>
    <CardTitle>Add New API Key</CardTitle>
   </CardHeader>

   <form className="space-y-4" onSubmit={handleSubmit}>
    <div className="space-y-1.5">
     <Label htmlFor="label">Label</Label>
     <Input id="label" name="label" placeholder="e.g. Main Trading" required />
    </div>

    <div className="space-y-1.5">
     <Label htmlFor="apiKey">API Key</Label>
     <Input id="apiKey" name="apiKey" placeholder="Your Bybit API key" required />
    </div>

    <div className="space-y-1.5">
     <Label htmlFor="apiSecret">API Secret</Label>
     <Input
      id="apiSecret"
      name="apiSecret"
      placeholder="Your Bybit API secret"
      required
      type="password"
     />
    </div>

    <label className="flex items-center gap-2 text-sm text-(--sea-ink)">
     <input className="rounded-sm" name="testnet" type="checkbox" />
     Testnet key
    </label>

    {formError && <p className="text-sm text-red-600">{formError}</p>}

    <div className="flex gap-2">
     <Button disabled={submitting} type="submit">
      {submitting ? "Saving…" : "Save Key"}
     </Button>
     <Button disabled={submitting} onClick={onCancel} type="button" variant="ghost">
      Cancel
     </Button>
    </div>
   </form>
  </Card>
 );
};
