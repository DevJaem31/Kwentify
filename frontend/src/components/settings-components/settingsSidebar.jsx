import { CircleHelp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NAV_ITEMS } from "./settings-tools/settings.constants";

export default function SettingsSidebar({
  user,
  fullName,
  activeSection,
  onNavigate,
}) {
  return (
    <aside className="space-y-4 lg:sticky lg:top-6">
      <Card className="overflow-hidden rounded-2xl border-border/70 shadow-sm">
        <CardContent className="p-3">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-muted/60 p-3">
            <Avatar className="size-10">
              <AvatarImage src={user?.photoURL ?? ""} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {(fullName || user?.email || "K").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {fullName || "Kwentify user"}
              </p>

              <p className="truncate text-xs text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </div>

          <nav
            aria-label="Settings sections"
            className="grid grid-cols-2 gap-1 lg:grid-cols-1"
          >
            {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                type="button"
                onClick={() => onNavigate(id)}
                aria-current={activeSection === id ? "location" : undefined}
                className={`flex min-h-10 items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors ${
                  activeSection === id
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="size-4 shrink-0" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </CardContent>
      </Card>

      <div className="hidden items-start gap-3 rounded-xl border border-border/70 p-4 lg:flex">
        <CircleHelp className="mt-0.5 size-4 text-muted-foreground" />

        <div className="space-y-1">
          <p className="text-sm font-medium">Need help?</p>

          <p className="text-xs leading-5 text-muted-foreground">
            Keep your preferences updated to make managing your money easier.
          </p>
        </div>
      </div>
    </aside>
  );
}
