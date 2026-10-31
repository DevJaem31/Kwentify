import { useMemo, useState } from "react";

import {
  ChartNoAxesCombined,
  PieChart as PieChartIcon,
  SlidersHorizontal,
  X,
} from "lucide-react";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { Calendar } from "@/components/ui/calendar";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Chart colors
const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

// Currency formatter
const currencyFormatter = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
  maximumFractionDigits: 2,
});

// Convert Firestore Timestamp, Date, or date string
function toDate(value) {
  if (!value) return null;

  const date = value?.toDate
    ? value.toDate()
    : value instanceof Date
      ? value
      : new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
}

// Format transaction amount
function getAmount(value) {
  return Math.abs(Number(value) || 0);
}

// Skeleton loading
function SpendingOverviewSkeleton() {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-8 w-20" />
      </CardHeader>

      <CardContent>
        <div className="grid gap-6 lg:grid-cols-2">
          {[0, 1].map((item) => (
            <div
              key={item}
              className="space-y-4 rounded-xl border border-border/70 p-4"
            >
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-52" />
              <Skeleton className="h-56 w-full rounded-xl" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// Empty chart state
function EmptyChart({ message }) {
  return (
    <div className="flex min-h-56 flex-col items-center justify-center gap-2 text-center">
      <ChartNoAxesCombined className="size-8 text-muted-foreground/50" />

      <p className="text-sm font-medium">{message}</p>

      <p className="text-xs text-muted-foreground">
        Your chart will appear once you have expense records.
      </p>
    </div>
  );
}

export default function SpendingOverview({
  transactions = [],
  loading = false,
}) {
  const currentDate = new Date();

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // ----------------------------------------
  // FILTER STATES
  // ----------------------------------------

  const [filterOpen, setFilterOpen] = useState(false);

  const [filterMode, setFilterMode] = useState("month");

  // Temporary monthly filter selections
  const [draftMonth, setDraftMonth] = useState(months[currentMonth]);

  const [draftYear, setDraftYear] = useState(String(currentYear));

  // Temporary date range selection
  const [draftRange, setDraftRange] = useState({
    from: undefined,
    to: undefined,
  });

  // Currently applied filter
  const [activeFilter, setActiveFilter] = useState({
    type: "month",
    month: currentMonth,
    year: currentYear,
  });

  // ----------------------------------------
  // AVAILABLE YEARS
  // ----------------------------------------

  const availableYears = useMemo(() => {
    const years = transactions
      .map((transaction) =>
        toDate(transaction.date || transaction.createdAt)?.getFullYear(),
      )
      .filter(Boolean);

    return [...new Set([...years, currentYear])].sort((a, b) => b - a);
  }, [transactions, currentYear]);

  // ----------------------------------------
  // ACTIVE FILTER DATE BOUNDARIES
  // ----------------------------------------

  const filterDates = useMemo(() => {
    if (activeFilter.type === "range") {
      if (!activeFilter.from || !activeFilter.to) {
        return null;
      }

      const start = new Date(activeFilter.from);
      start.setHours(0, 0, 0, 0);

      const end = new Date(activeFilter.to);
      end.setHours(23, 59, 59, 999);

      return {
        start,
        end,
      };
    }

    const start = new Date(activeFilter.year, activeFilter.month, 1);

    const end = new Date(
      activeFilter.year,
      activeFilter.month + 1,
      0,
      23,
      59,
      59,
      999,
    );

    return {
      start,
      end,
    };
  }, [activeFilter]);

  // ----------------------------------------
  // APPLY FILTER
  // ----------------------------------------

  function applyFilter() {
    if (filterMode === "month") {
      setActiveFilter({
        type: "month",
        month: months.indexOf(draftMonth),
        year: Number(draftYear),
      });
    } else {
      if (!draftRange.from || !draftRange.to) return;

      setActiveFilter({
        type: "range",
        from: draftRange.from,
        to: draftRange.to,
      });
    }

    setFilterOpen(false);
  }

  // ----------------------------------------
  // REMOVE FILTER / RESET TO CURRENT MONTH
  // ----------------------------------------

  function resetFilter() {
    const now = new Date();

    setFilterMode("month");
    setDraftMonth(months[now.getMonth()]);
    setDraftYear(String(now.getFullYear()));

    setDraftRange({
      from: undefined,
      to: undefined,
    });

    setActiveFilter({
      type: "month",
      month: now.getMonth(),
      year: now.getFullYear(),
    });

    setFilterOpen(false);
  }

  const isCustomFilter = activeFilter.type === "range";

  // ----------------------------------------
  // CHART DATA
  // ----------------------------------------

  const { breakdown, trend, hasBreakdown, hasTrend, chartConfig } =
    useMemo(() => {
      // Filter expense transactions by selected period
      const expenses = transactions.filter((transaction) => {
        if (transaction.type?.toLowerCase() !== "expense") {
          return false;
        }

        const date = toDate(transaction.date || transaction.createdAt);

        return (
          date &&
          filterDates &&
          date >= filterDates.start &&
          date <= filterDates.end
        );
      });

      // ----------------------------------------
      // SPENDING BREAKDOWN
      // ----------------------------------------

      const categoryTotals = {};

      expenses.forEach((transaction) => {
        const category = transaction.category?.trim() || "Uncategorized";

        categoryTotals[category] =
          (categoryTotals[category] || 0) + getAmount(transaction.amount);
      });

      const breakdownData = Object.entries(categoryTotals)
        .map(([category, amount], index) => ({
          category,
          amount,
          fill: COLORS[index % COLORS.length],
        }))
        .sort((a, b) => b.amount - a.amount);

      // ----------------------------------------
      // MONTHLY SPENDING TREND
      // ----------------------------------------

      const monthlyTotals = [];

      const cursor = new Date(
        filterDates.start.getFullYear(),
        filterDates.start.getMonth(),
        1,
      );

      const lastMonth = new Date(
        filterDates.end.getFullYear(),
        filterDates.end.getMonth(),
        1,
      );

      // Create each month within the selected period
      while (cursor <= lastMonth) {
        monthlyTotals.push({
          month: cursor.toLocaleDateString("en-PH", {
            month: "short",
          }),
          year: cursor.getFullYear(),
          monthIndex: cursor.getMonth(),
          amount: 0,
        });

        cursor.setMonth(cursor.getMonth() + 1);
      }

      // Add expense amounts to their respective months
      expenses.forEach((transaction) => {
        const date = toDate(transaction.date || transaction.createdAt);

        if (!date) return;

        const entry = monthlyTotals.find(
          (item) =>
            item.monthIndex === date.getMonth() &&
            item.year === date.getFullYear(),
        );

        if (entry) {
          entry.amount += getAmount(transaction.amount);
        }
      });

      const trendData = monthlyTotals.map(({ month, year, amount }) => ({
        month,
        year,
        amount,
      }));

      // ----------------------------------------
      // CHART CONFIGURATION
      // ----------------------------------------

      const config = Object.fromEntries(
        breakdownData.map((item) => [
          item.category,
          {
            label: item.category,
            color: item.fill,
          },
        ]),
      );

      return {
        breakdown: breakdownData,
        trend: trendData,
        hasBreakdown: breakdownData.length > 0,
        hasTrend: trendData.some((item) => item.amount > 0),
        chartConfig: config,
      };
    }, [transactions, filterDates]);

  // ----------------------------------------
  // LOADING STATE
  // ----------------------------------------

  if (loading) {
    return <SpendingOverviewSkeleton />;
  }

  // ----------------------------------------
  // ACTIVE FILTER LABEL
  // ----------------------------------------

  const activeFilterLabel = isCustomFilter
    ? `${activeFilter.from.toLocaleDateString()} – ${activeFilter.to.toLocaleDateString()}`
    : `${months[activeFilter.month]} ${activeFilter.year}`;

  // ----------------------------------------
  // MAIN COMPONENT
  // ----------------------------------------

  return (
    <Card className="border-border/70 shadow-sm">
      {/* HEADER */}
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="flex items-center gap-2">
          <ChartNoAxesCombined className="size-5 text-primary" />
          Spending Overview
        </CardTitle>

        {/* FILTER POPOVER */}
        <Popover open={filterOpen} onOpenChange={setFilterOpen}>
          <PopoverTrigger
            render={
              <Button
                variant="outline"
                size="sm"
                className="h-9 gap-2 rounded-lg px-3"
              >
                <SlidersHorizontal className="size-4" />
                Filter
                {isCustomFilter && (
                  <span className="size-1.5 rounded-full bg-primary" />
                )}
              </Button>
            }
          />

          <PopoverContent
            align="end"
            sideOffset={8}
            className="w-[340px] rounded-xl border-border/70 p-0 shadow-lg"
          >
            <div className="space-y-4 p-4">
              {/* HEADER */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold">Filter spending</h4>
                  <p className="text-xs text-muted-foreground">
                    Select the period you want to view.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setFilterOpen(false)}
                  className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Close filter"
                >
                  <X className="size-4" />
                </button>
              </div>

              {/* FILTER TYPE */}
              <div className="grid grid-cols-2 rounded-lg bg-muted p-1">
                <button
                  type="button"
                  onClick={() => setFilterMode("month")}
                  className={`rounded-md px-3 py-2 text-xs font-medium transition-all ${
                    filterMode === "month"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Monthly
                </button>

                <button
                  type="button"
                  onClick={() => setFilterMode("range")}
                  className={`rounded-md px-3 py-2 text-xs font-medium transition-all ${
                    filterMode === "range"
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Date range
                </button>
              </div>

              {/* MONTHLY FILTER */}
              {filterMode === "month" ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="min-w-0 space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Month
                    </label>

                    <Select value={draftMonth} onValueChange={setDraftMonth}>
                      <SelectTrigger className="h-10 w-full rounded-lg">
                        <SelectValue placeholder="Select month" />
                      </SelectTrigger>

                      <SelectContent>
                        {months.map((month) => (
                          <SelectItem key={month} value={month}>
                            {month}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="min-w-0 space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">
                      Year
                    </label>

                    <Select value={draftYear} onValueChange={setDraftYear}>
                      <SelectTrigger className="h-10 w-full rounded-lg">
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>

                      <SelectContent>
                        {availableYears.map((year) => (
                          <SelectItem key={year} value={String(year)}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ) : (
                /* DATE RANGE FILTER */
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="min-w-0 space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        Start date
                      </label>

                      <div className="truncate rounded-lg border bg-muted/30 px-2.5 py-2 text-xs">
                        {draftRange.from
                          ? draftRange.from.toLocaleDateString()
                          : "Not selected"}
                      </div>
                    </div>

                    <div className="min-w-0 space-y-1">
                      <label className="text-xs font-medium text-muted-foreground">
                        End date
                      </label>

                      <div className="truncate rounded-lg border bg-muted/30 px-2.5 py-2 text-xs">
                        {draftRange.to
                          ? draftRange.to.toLocaleDateString()
                          : "Not selected"}
                      </div>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-lg border">
                    <Calendar
                      mode="range"
                      selected={draftRange}
                      onSelect={(range) =>
                        setDraftRange({
                          from: range?.from,
                          to: range?.to,
                        })
                      }
                      numberOfMonths={1}
                      disabled={{ after: new Date() }}
                      className="w-full p-3"
                    />
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Select a starting date and an ending date.
                  </p>
                </div>
              )}
            </div>

            {/* FOOTER ACTIONS */}
            <div className="flex items-center justify-between gap-3 border-t bg-muted/20 p-3">
              <Button
                variant="ghost"
                size="sm"
                className="h-9 text-muted-foreground"
                onClick={resetFilter}
              >
                Reset
              </Button>

              <Button
                size="sm"
                className="h-9 px-5"
                onClick={applyFilter}
                disabled={
                  filterMode === "range" && (!draftRange.from || !draftRange.to)
                }
              >
                Apply filter
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </CardHeader>

      {/* CONTENT */}
      <CardContent className="space-y-5">
        {/* ACTIVE FILTER */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>Showing expenses for:</span>

          <span className="rounded-md bg-muted px-2 py-1 font-medium text-foreground">
            {activeFilterLabel}
          </span>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* ================================== */}
          {/* SPENDING BREAKDOWN */}
          {/* ================================== */}

          <div className="min-w-0 space-y-4 rounded-xl border border-border/70 p-4">
            <div className="flex items-center gap-2">
              <PieChartIcon className="size-4 text-muted-foreground" />

              <div>
                <h3 className="text-sm font-semibold">Spending Breakdown</h3>

                <p className="text-xs text-muted-foreground">
                  Expenses by category for the selected period
                </p>
              </div>
            </div>

            {hasBreakdown ? (
              <>
                {/* DOUGHNUT CHART */}
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto h-56 w-full"
                >
                  <PieChart>
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value) =>
                            currencyFormatter.format(Number(value))
                          }
                        />
                      }
                    />

                    <Pie
                      data={breakdown}
                      dataKey="amount"
                      nameKey="category"
                      innerRadius={55}
                      outerRadius={85}
                      paddingAngle={3}
                      strokeWidth={3}
                    >
                      {breakdown.map((item) => (
                        <Cell key={item.category} fill={item.fill} />
                      ))}
                    </Pie>
                  </PieChart>
                </ChartContainer>

                {/* CATEGORY LEGEND */}
                <div className="space-y-3">
                  {breakdown.map((item) => (
                    <div
                      key={item.category}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className="size-2.5 shrink-0 rounded-full"
                          style={{
                            backgroundColor: item.fill,
                          }}
                        />

                        <span className="truncate text-muted-foreground">
                          {item.category}
                        </span>
                      </div>

                      <span className="font-medium tabular-nums">
                        {currencyFormatter.format(item.amount)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <EmptyChart message="No spending recorded for this period" />
            )}
          </div>

          {/* ================================== */}
          {/* MONTHLY SPENDING TREND */}
          {/* ================================== */}

          <div className="min-w-0 space-y-4 rounded-xl border border-border/70 p-4">
            <div className="flex items-center gap-2">
              <ChartNoAxesCombined className="size-4 text-muted-foreground" />

              <div>
                <h3 className="text-sm font-semibold">
                  Monthly Spending Trend
                </h3>

                <p className="text-xs text-muted-foreground">
                  Monthly expenses within the selected period
                </p>
              </div>
            </div>

            {hasTrend ? (
              <ChartContainer
                config={{
                  amount: {
                    label: "Expenses",
                    color: "var(--chart-1)",
                  },
                }}
                className="h-56 w-full"
              >
                <BarChart
                  data={trend}
                  accessibilityLayer
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 0,
                  }}
                >
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />

                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    fontSize={12}
                  />

                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    width={65}
                    fontSize={11}
                    tickFormatter={(value) =>
                      `₱${Number(value).toLocaleString("en-PH")}`
                    }
                  />

                  <ChartTooltip
                    cursor={false}
                    content={
                      <ChartTooltipContent
                        labelFormatter={(_, payload) => {
                          const item = payload?.[0]?.payload;

                          return item
                            ? `${item.month} ${item.year}`
                            : "Expenses";
                        }}
                        formatter={(value) =>
                          currencyFormatter.format(Number(value))
                        }
                      />
                    }
                  />

                  <Bar
                    dataKey="amount"
                    fill="var(--color-amount)"
                    radius={[5, 5, 0, 0]}
                    maxBarSize={42}
                  />
                </BarChart>
              </ChartContainer>
            ) : (
              <EmptyChart message="No spending history available" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
