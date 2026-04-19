import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Button, Card, CardHeader, CardTitle, Input, Label } from "@/shared/ui";
import { Badge } from "@/shared/ui/badge";
import { authClient } from "@/features/Authentication";

type TwoFactorStep = "confirm" | "idle" | "setup";

function TwoFactorPage() {
 const { data: session } = authClient.useSession();
 const [step, setStep] = useState<TwoFactorStep>("idle");
 const [totpUri, setTotpUri] = useState<null | string>(null);
 const [backupCodes, setBackupCodes] = useState<string[]>([]);
 const [verifyCode, setVerifyCode] = useState("");
 const [error, setError] = useState<null | string>(null);
 const [loading, setLoading] = useState(false);
 const [success, setSuccess] = useState<null | string>(null);

 const is2FAEnabled = !!(
  session?.user &&
  "twoFactorEnabled" in session.user &&
  session.user.twoFactorEnabled
 );

 async function handleEnable() {
  setError(null);
  setLoading(true);

  const { data, error: enableError } = await authClient.twoFactor.enable({
   password: prompt("Enter your password to enable 2FA") || "",
  });

  if (enableError) {
   setError(enableError.message || "Failed to enable 2FA");
   setLoading(false);
   return;
  }

  if (data) {
   setTotpUri(data.totpURI);
   if (data.backupCodes) setBackupCodes(data.backupCodes);
  }
  setStep("setup");
  setLoading(false);
 }

 async function handleVerify(e: FormEvent<HTMLFormElement>) {
  e.preventDefault();
  setError(null);
  setLoading(true);

  const { error: verifyError } = await authClient.twoFactor.verifyTotp({
   code: verifyCode,
  });

  if (verifyError) {
   setError(verifyError.message || "Invalid code");
   setLoading(false);
   return;
  }

  setStep("confirm");
  setSuccess("Two-factor authentication has been enabled successfully!");
  setLoading(false);
 }

 async function handleDisable() {
  setError(null);
  setLoading(true);

  const { error: disableError } = await authClient.twoFactor.disable({
   password: prompt("Enter your password to disable 2FA") || "",
  });

  if (disableError) {
   setError(disableError.message || "Failed to disable 2FA");
   setLoading(false);
   return;
  }

  setStep("idle");
  setSuccess("Two-factor authentication has been disabled.");
  setLoading(false);
 }

 return (
  // <div>
  //  <p className="text-sm font-medium text-(--sea-ink)">Two-Factor Authentication</p>
  //  <p className="text-xs text-(--sea-ink-soft)">
  //   {is2FAEnabled ? "Your account is secured with 2FA" : "Add extra security to your account"}
  //  </p>
  // </div>
  <div className="space-y-6">
   <div>
    <h2 className="text-xl font-bold text-(--sea-ink)">Two-Factor Authentication</h2>
    <p className="text-sm text-(--sea-ink-soft)">Add an extra layer of security to your account.</p>
   </div>

   <Card>
    <CardHeader>
     <CardTitle>Status</CardTitle>
     <Badge variant={is2FAEnabled ? "success" : "default"}>
      {is2FAEnabled ? "Enabled" : "Disabled"}
     </Badge>
    </CardHeader>

    {success && <p className="mb-4 text-sm text-emerald-600">{success}</p>}
    {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

    {step === "idle" && !is2FAEnabled && (
     <Button disabled={loading} onClick={handleEnable}>
      {loading ? "Setting up..." : "Enable 2FA"}
     </Button>
    )}

    {step === "idle" && is2FAEnabled && (
     <Button disabled={loading} onClick={handleDisable} variant="danger">
      {loading ? "Disabling..." : "Disable 2FA"}
     </Button>
    )}

    {step === "setup" && totpUri && (
     <div className="space-y-4">
      <div className="space-y-2">
       <p className="text-sm font-medium text-(--sea-ink)">
        Scan this QR code with your authenticator app:
       </p>
       <div className="flex justify-center rounded-lg border border-(--line) bg-white p-4">
        <img
         alt="TOTP QR Code"
         src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(totpUri)}`}
        />
       </div>
       <details className="text-xs text-(--sea-ink-soft)">
        <summary className="cursor-pointer">Can&apos;t scan? Enter this key manually</summary>
        <code className="mt-1 block rounded-sm bg-(--surface) p-2 text-xs break-all">
         {totpUri}
        </code>
       </details>
      </div>

      {backupCodes.length > 0 && (
       <div className="space-y-2">
        <p className="text-sm font-medium text-(--sea-ink)">
         Save these backup codes in a safe place:
        </p>
        <div className="grid grid-cols-2 gap-1 rounded-lg border border-(--line) bg-(--surface) p-3">
         {backupCodes.map((code) => (
          <code className="text-xs" key={code}>
           {code}
          </code>
         ))}
        </div>
       </div>
      )}

      <form className="space-y-3" onSubmit={handleVerify}>
       <div className="space-y-1.5">
        <Label htmlFor="verify-code">Enter the 6-digit code from your app</Label>
        <Input
         id="verify-code"
         inputMode="numeric"
         maxLength={6}
         onChange={(e) => setVerifyCode(e.target.value)}
         pattern="[0-9]{6}"
         placeholder="000000"
         required
         value={verifyCode}
        />
       </div>
       <Button className="w-full" disabled={loading} type="submit">
        {loading ? "Verifying..." : "Verify & Enable"}
       </Button>
      </form>
     </div>
    )}

    {step === "confirm" && (
     <div className="space-y-3">
      <p className="text-sm text-(--sea-ink)">
       2FA is now active. You will need your authenticator app to sign in.
      </p>
      <Button onClick={() => setStep("idle")} variant="secondary">
       Done
      </Button>
     </div>
    )}
   </Card>
  </div>
 );
}

export const Route = createFileRoute("/_protected-by-login/two-factor")({
 component: TwoFactorPage,
});
