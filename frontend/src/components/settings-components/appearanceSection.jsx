import { Check, Laptop, Palette, SlidersHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import SectionHeading from "./SectionHeading";

const THEMES = [
  {
    value: "light",
    label: "Light",
    description: "Bright and clean",
    icon: Palette,
  },
  {
    value: "dark",
    label: "Dark",
    description: "Easy on the eyes",
    icon: Laptop,
  },
  {
    value: "system",
    label: "System",
    description: "Follow your device",
    icon: SlidersHorizontal,
  },
];

export default function AppearanceSection({ theme, onThemeChange }) {
  return (
    <Card
      id="appearance"
      className="scroll-mt-6 rounded-2xl border-border/70 shadow-sm"
    >
      <CardHeader>
        <SectionHeading
          icon={Palette}
          title="Appearance"
          description="Choose how Kwentify looks on your device."
        />
      </CardHeader>

      <CardContent className="space-y-4">
        <Label>Color theme</Label>

        <div className="grid gap-3 sm:grid-cols-3">
          {THEMES.map(({ value, label, description, icon: Icon }) => (
            <button
              key={value}
              type="button"
              aria-pressed={theme === value}
              onClick={() => onThemeChange(value)}
              className={`rounded-xl border p-4 text-left transition-all ${
                theme === value
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              <div className="mb-4 flex items-center justify-between">
                <Icon className="size-5" />

                {theme === value && <Check className="size-4 text-primary" />}
              </div>

              <p className="text-sm font-semibold">{label}</p>

              <p className="mt-1 text-xs text-muted-foreground">
                {description}
              </p>
            </button>
          ))}
        </div>

        <p className="text-xs text-muted-foreground">
          Your selected theme is applied immediately. Save changes to keep your
          preference in your account.
        </p>
      </CardContent>
    </Card>
  );
}
