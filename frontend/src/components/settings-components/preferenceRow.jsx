import { Switch } from "@/components/ui/switch";

export default function PreferenceRow({
  title,
  description,
  checked,
  onCheckedChange,
  disabled = false,
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-4">
      <div className="min-w-0 space-y-1">
        <p className="text-sm font-medium">{title}</p>

        <p className="text-sm leading-5 text-muted-foreground">{description}</p>
      </div>

      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
        aria-label={title}
      />
    </div>
  );
}
