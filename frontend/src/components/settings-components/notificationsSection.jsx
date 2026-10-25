import { Bell } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import SectionHeading from "./SectionHeading";
import PreferenceRow from "./PreferenceRow";

export default function NotificationsSection({
  notifications,
  onChange,
  notificationBusy,
  notificationPermission,
  onPushToggle,
}) {
  const pushSupported = notificationPermission !== "unsupported";

  return (
    <Card
      id="notifications"
      className="scroll-mt-6 rounded-2xl border-border/70 shadow-sm"
    >
      <CardHeader>
        <SectionHeading
          icon={Bell}
          title="Notifications"
          description="Choose which financial reminders you want to receive."
        />
      </CardHeader>

      <CardContent>
        <div className="flex items-start justify-between gap-4 rounded-xl bg-muted/50 p-4">
          <div className="space-y-1">
            <p className="text-sm font-medium">Browser push notifications</p>

            <p className="text-sm leading-5 text-muted-foreground">
              Receive browser notifications after granting permission and
              registering this device.
            </p>

            {notificationPermission === "denied" && (
              <p className="text-xs text-destructive">
                Notifications are blocked in your browser settings.
              </p>
            )}

            {!pushSupported && (
              <p className="text-xs text-destructive">
                Notifications are not supported in this browser.
              </p>
            )}
          </div>

          <Switch
            checked={notifications.pushEnabled}
            onCheckedChange={onPushToggle}
            disabled={notificationBusy || !pushSupported}
            aria-label="Browser push notifications"
          />
        </div>

        <div className="divide-y">
          <PreferenceRow
            title="Bill reminders"
            description="Reminders for upcoming bills and payment due dates."
            checked={notifications.billReminders}
            onCheckedChange={(checked) => onChange("billReminders", checked)}
          />

          <PreferenceRow
            title="Budget alerts"
            description="Alerts when spending approaches your budget limit."
            checked={notifications.budgetAlerts}
            onCheckedChange={(checked) => onChange("budgetAlerts", checked)}
          />

          <PreferenceRow
            title="Savings milestones"
            description="Updates when you reach your savings goals."
            checked={notifications.savingsMilestones}
            onCheckedChange={(checked) =>
              onChange("savingsMilestones", checked)
            }
          />
        </div>

        <p className="mt-3 text-xs leading-5 text-muted-foreground">
          These switches save your preferences. Bill reminders, budget alerts,
          and savings notifications still need corresponding notification
          workflows to send messages.
        </p>
      </CardContent>
    </Card>
  );
}
