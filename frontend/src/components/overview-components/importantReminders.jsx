import { Bell, CalendarClock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

function formatDueDate(value) {
  const date = value?.toDate ? value.toDate() : new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function ImportantReminders({ bills = [], loading }) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Bell className="size-5 text-primary" />
          Important Reminders
        </CardTitle>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Loading reminders...
          </p>
        ) : bills.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
            <CalendarClock className="size-7 text-muted-foreground" />

            <p className="text-sm font-medium">No upcoming reminders</p>

            <p className="text-xs text-muted-foreground">
              Your unpaid bills will appear here.
            </p>
          </div>
        ) : (
          <div>
            {bills.slice(0, 5).map((bill, index) => (
              <div key={bill.id}>
                <div className="flex items-center justify-between gap-3 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {bill.title || "Untitled bill"}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      Due {formatDueDate(bill.dueDate)}
                    </p>
                  </div>

                  <p className="shrink-0 text-sm font-semibold">
                    {currency.format(Number(bill.amount) || 0)}
                  </p>
                </div>

                {index < Math.min(bills.length, 5) - 1 && <Separator />}
              </div>
            ))}
          </div>
        )}

        <Button variant="outline" className="mt-3 w-full">
          View All Reminders
        </Button>
      </CardContent>
    </Card>
  );
}
