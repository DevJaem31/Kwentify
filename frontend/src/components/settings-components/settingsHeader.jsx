import { Link } from "react-router-dom";
import { Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SettingsHeader({ saving, onSave }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link
            to="/dashboard"
            className="transition-colors hover:text-foreground"
          >
            Dashboard
          </Link>

          <ChevronRight className="size-4" />

          <span className="text-foreground">Settings</span>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Settings
        </h1>

        <p className="max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
          Personalize your Kwentify experience and manage your account
          preferences.
        </p>
      </div>

      <Button
        onClick={onSave}
        disabled={saving}
        className="w-full rounded-xl sm:w-auto"
      >
        <Check className="mr-2 size-4" />
        {saving ? "Saving changes..." : "Save changes"}
      </Button>
    </div>
  );
}
