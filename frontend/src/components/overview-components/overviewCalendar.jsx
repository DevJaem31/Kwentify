import { useMemo, useState } from "react";
import { CalendarDays, Clock, RotateCcw } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function toDate(value) {
  if (!value) return null;

  const date = value?.toDate
    ? value.toDate()
    : value instanceof Date
      ? value
      : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(Number(amount) || 0);
}

function isSameDay(dateA, dateB) {
  return (
    dateA.getFullYear() === dateB.getFullYear() &&
    dateA.getMonth() === dateB.getMonth() &&
    dateA.getDate() === dateB.getDate()
  );
}

export default function OverviewCalendar({ bills = [], loading = false }) {
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState(today);
  const [month, setMonth] = useState(today);

  // Convert bill due dates into valid Date objects.
  const calendarEvents = useMemo(() => {
    return bills
      .map((bill) => ({
        ...bill,
        eventDate: toDate(bill.dueDate),
      }))
      .filter((bill) => bill.eventDate);
  }, [bills]);

  // Dates with important reminders.
  const eventDates = useMemo(
    () => calendarEvents.map((event) => event.eventDate),
    [calendarEvents],
  );

  // Reminders for the selected date.
  const selectedEvents = calendarEvents.filter((event) =>
    isSameDay(event.eventDate, selectedDate),
  );

  const goToToday = () => {
    const currentDate = new Date();

    setSelectedDate(currentDate);
    setMonth(currentDate);
  };

  return (
    <Card className="min-w-0 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <div className="flex items-center gap-2">
          <CalendarDays className="size-5 text-primary" />
          <CardTitle className="text-base font-semibold">Calendar</CardTitle>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={goToToday}
          className="h-8 gap-1.5"
        >
          <RotateCcw className="size-3.5" />
          Today
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          month={month}
          onMonthChange={setMonth}
          captionLayout="dropdown"
          startMonth={new Date(2020, 0)}
          endMonth={new Date(2035, 11)}
          modifiers={{
            hasEvent: eventDates,
          }}
          modifiersClassNames={{
            hasEvent:
              "relative after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-primary",
          }}
          className="w-full"
          classNames={{
            month: "w-full",
            month_grid: "w-full",
          }}
        />

        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-primary" />
            Important reminder
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-accent-foreground" />
            Selected date
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <h4 className="text-sm font-semibold">
              {selectedDate.toLocaleDateString("en-PH", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </h4>

            <span className="text-xs text-muted-foreground">
              {selectedEvents.length} reminder(s)
            </span>
          </div>

          {loading ? (
            <p className="py-3 text-center text-sm text-muted-foreground">
              Loading reminders...
            </p>
          ) : selectedEvents.length > 0 ? (
            <div className="space-y-3">
              {selectedEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start gap-3 rounded-lg border p-3"
                >
                  <div className="mt-0.5 rounded-md bg-primary/10 p-2">
                    <Clock className="size-4 text-primary" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium">
                      {event.title || "Untitled reminder"}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      Due date reminder
                    </p>
                  </div>

                  <span className="shrink-0 text-sm font-semibold">
                    {formatCurrency(event.amount)}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="rounded-lg bg-muted/40 px-3 py-4 text-center text-sm text-muted-foreground">
              No important reminders for this date.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
