import { ChevronRight, LockKeyhole, ShieldCheck } from "lucide-react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import SectionHeading from "./SectionHeading";

export default function SecuritySection({
  onPasswordReset,
  resetBusy = false,
  resetCooldown = 0,
}) {
  return (
    <Card
      id="security"
      className="scroll-mt-20 rounded-2xl border-border/70 shadow-sm"
    >
      <CardHeader>
        <SectionHeading
          icon={LockKeyhole}
          title="Security and privacy"
          description="Manage access to your account and protect your information."
        />
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium">Password</p>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Request a password reset link for your account email.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full shrink-0 rounded-xl sm:w-auto"
            onClick={onPasswordReset}
            disabled={resetBusy || resetCooldown > 0}
          >
            {resetBusy
              ? "Sending..."
              : resetCooldown > 0
                ? `Try again in ${Math.floor(resetCooldown / 60)}:${String(
                    resetCooldown % 60,
                  ).padStart(2, "0")}`
                : "Reset password"}

            {!resetBusy && resetCooldown === 0 && (
              <ChevronRight className="ml-2 size-4" />
            )}
          </Button>
        </div>

        <Separator />

        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-muted-foreground" />

          <div className="min-w-0 space-y-1">
            <p className="text-sm font-medium">Account protection</p>

            <p className="text-sm leading-5 text-muted-foreground">
              Keep Firebase authentication enabled and configure Firestore
              security rules so each user can access only their own financial
              data.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
