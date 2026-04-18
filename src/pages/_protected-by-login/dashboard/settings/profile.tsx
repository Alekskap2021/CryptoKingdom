import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Badge, Button, Card, CardHeader, CardTitle, Input, Label } from "@/shared/ui";
import { authClient } from "@/features/Authentication";

function ProfilePage() {
 const { data: session } = authClient.useSession();
 const [name, setName] = useState(session?.user.name || "");
 const [loading, setLoading] = useState(false);
 const [success, setSuccess] = useState<null | string>(null);
 const [error, setError] = useState<null | string>(null);

 const is2FAEnabled = !!(
  session?.user &&
  "twoFactorEnabled" in session.user &&
  session.user.twoFactorEnabled
 );

 async function handleUpdateName(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setError(null);
  setSuccess(null);
  setLoading(true);

  const { error: updateError } = await authClient.updateUser({
   name,
  });

  if (updateError) {
   setError(updateError.message || "Failed to update profile");
  } else {
   setSuccess("Profile updated successfully");
  }
  setLoading(false);
 }

 return (
  <div className="space-y-6">
   <div>
    <h2 className="text-xl font-bold text-(--sea-ink)">Profile</h2>
    <p className="text-sm text-(--sea-ink-soft)">Manage your account settings.</p>
   </div>

   <Card>
    <CardHeader>
     <CardTitle>Account Information</CardTitle>
    </CardHeader>
    <form className="space-y-4" onSubmit={handleUpdateName}>
     <div className="space-y-1.5">
      <Label htmlFor="email">Email</Label>
      <Input disabled id="email" value={session?.user.email || ""} />
     </div>
     <div className="space-y-1.5">
      <Label htmlFor="name">Name</Label>
      <Input id="name" onChange={(e) => setName(e.target.value)} value={name} />
     </div>
     {success && <p className="text-sm text-emerald-600">{success}</p>}
     {error && <p className="text-sm text-red-600">{error}</p>}
     <Button disabled={loading} type="submit">
      {loading ? "Saving..." : "Save Changes"}
     </Button>
    </form>
   </Card>

   <Card>
    <CardHeader>
     <CardTitle>Security</CardTitle>
    </CardHeader>
    <div className="flex items-center justify-between">
     <div>
      <p className="text-sm font-medium text-(--sea-ink)">Two-Factor Authentication</p>
      <p className="text-xs text-(--sea-ink-soft)">
       {is2FAEnabled ? "Your account is secured with 2FA" : "Add extra security to your account"}
      </p>
     </div>
     <div className="flex items-center gap-3">
      <Badge variant={is2FAEnabled ? "success" : "warning"}>
       {is2FAEnabled ? "Enabled" : "Disabled"}
      </Badge>
      <Link
       className="text-sm font-medium text-(--lagoon-deep) no-underline hover:underline"
       to="/dashboard/settings/two-factor">
       Manage
      </Link>
     </div>
    </div>
   </Card>
  </div>
 );
}

export const Route = createFileRoute("/_protected-by-login/dashboard/settings/profile")({
 component: ProfilePage,
});
