import { Check, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import { deleteApiKey, updateApiKey } from "../api/api-keys.actions.ts";
import type { ApiKeyRecord } from "../api/api-keys.schema.ts";
import { Badge, Button, Card, Input } from "#/shared/ui";

interface ApiKeyListProps {
 keys: ApiKeyRecord[];
 onRefresh?: () => Promise<void>;
}

export const ApiKeyList = (props: ApiKeyListProps) => {
 const { keys, onRefresh } = props;
 const [editingId, setEditingId] = useState<null | string>(null);
 const [editLabel, setEditLabel] = useState("");
 const [error, setError] = useState<null | string>(null);

 async function handleDelete(id: string) {
  if (!confirm("Are you sure you want to delete this API key?")) return;
  setError(null);
  try {
   await deleteApiKey({ data: { id } });
   await onRefresh?.();
  } catch (err) {
   setError(err instanceof Error ? err.message : "Failed to delete key.");
  }
 }

 function startEditing(key: ApiKeyRecord) {
  setEditingId(key.id);
  setEditLabel(key.label);
 }

 async function handleUpdate(id: string) {
  setError(null);
  try {
   await updateApiKey({ data: { id, label: editLabel } });
   setEditingId(null);
   await onRefresh?.();
  } catch (err) {
   setError(err instanceof Error ? err.message : "Failed to update key.");
  }
 }

 return (
  <div className="space-y-3">
   {error && <p className="text-sm text-red-600">{error}</p>}
   {keys.map((key) => (
    <Card key={key.id}>
     <div className="flex items-center justify-between gap-4">
      <div className="min-w-0 flex-1">
       {editingId === key.id ? (
        <div className="flex items-center gap-2">
         <Input
          className="max-w-48"
          onChange={(e) => setEditLabel(e.target.value)}
          onKeyDown={(e) => {
           if (e.key === "Enter") void handleUpdate(key.id);
           if (e.key === "Escape") setEditingId(null);
          }}
          value={editLabel}
         />
         <Button onClick={() => handleUpdate(key.id)} size="icon" variant="ghost">
          <Check size={16} />
         </Button>
         <Button onClick={() => setEditingId(null)} size="icon" variant="ghost">
          <X size={16} />
         </Button>
        </div>
       ) : (
        <p className="truncate text-sm font-medium text-(--sea-ink)">{key.label}</p>
       )}
       <p className="mt-0.5 font-mono text-xs text-(--sea-ink-soft)">{key.maskedKey}</p>
      </div>
      <div className="flex items-center gap-2">
       {key.testnet && <Badge variant="info">Testnet</Badge>}
       <Button onClick={() => startEditing(key)} size="icon" title="Edit label" variant="ghost">
        <Pencil size={16} />
       </Button>
       <Button onClick={() => handleDelete(key.id)} size="icon" title="Delete" variant="ghost">
        <Trash2 className="text-red-500" size={16} />
       </Button>
      </div>
     </div>
    </Card>
   ))}
  </div>
 );
};
