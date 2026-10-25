import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function SettingsCardSkeleton({ rows = 3 }) {
  return (
    <Card className="rounded-2xl border-border/70 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="size-10 shrink-0 rounded-xl" />

          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-64 max-w-full" />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-52 max-w-full" />
            </div>

            <Skeleton className="h-9 w-20 shrink-0 rounded-xl" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default function SettingsSkeleton() {
  return (
    <div
      className="mx-auto w-full max-w-5xl space-y-6"
      aria-label="Loading settings"
      aria-busy="true"
    >
      <div className="space-y-3">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72 max-w-full" />
      </div>

      <SettingsCardSkeleton rows={3} />
      <SettingsCardSkeleton rows={4} />
      <SettingsCardSkeleton rows={2} />
    </div>
  );
}
