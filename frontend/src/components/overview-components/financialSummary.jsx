import { Wallet, ArrowDownLeft, ArrowUpRight, PiggyBank } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

export default function FinancialSummary({ summary }) {
  const summaryItems = [
    {
      title: "Total Balance",
      amount: summary.totalBalance,
      description: "Across all accounts",
      icon: Wallet,
    },
    {
      title: "Total Income",
      amount: summary.totalIncome,
      description: "This month",
      icon: ArrowDownLeft,
    },
    {
      title: "Total Expenses",
      amount: summary.totalExpenses,
      description: "This month",
      icon: ArrowUpRight,
    },
    {
      title: "Total Savings",
      amount: summary.totalSavings,
      description: "Current savings",
      icon: PiggyBank,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
      {summaryItems.map((item) => {
        const Icon = item.icon;

        return (
          <Card key={item.title} className="min-w-0 border-border/70 shadow-sm">
            <CardContent className="p-3 sm:p-5">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground sm:text-sm">
                  {item.title}
                </p>

                <div className="shrink-0 rounded-lg bg-primary/10 p-2 text-primary">
                  <Icon className="size-4 sm:size-5" />
                </div>
              </div>

              <p className="break-words text-lg font-bold tracking-tight sm:text-2xl">
                {currency.format(item.amount)}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {item.description}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
