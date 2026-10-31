import { ArrowLeftRight, ArrowDownLeft, ArrowUpRight } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const currency = new Intl.NumberFormat("en-PH", {
  style: "currency",
  currency: "PHP",
});

function formatDate(value) {
  const date = value?.toDate ? value.toDate() : new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function RecentTransactions({ transactions = [], loading }) {
  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <ArrowLeftRight className="size-5 text-primary" />
          Recent Transactions
        </CardTitle>

        <Button variant="ghost" size="sm" className="shrink-0">
          View All
        </Button>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            Loading transactions...
          </p>
        ) : transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
            <div className="rounded-full bg-muted p-3">
              <ArrowLeftRight className="size-5 text-muted-foreground" />
            </div>

            <p className="text-sm font-medium">No transactions yet</p>

            <p className="max-w-60 text-xs text-muted-foreground">
              Your recent income and expenses will appear here.
            </p>
          </div>
        ) : (
          <div>
            {transactions.map((transaction, index) => {
              const isIncome = transaction.type === "income";
              const Icon = isIncome ? ArrowDownLeft : ArrowUpRight;

              return (
                <div key={transaction.id}>
                  <div className="flex min-w-0 items-center gap-3 py-3">
                    <div className="shrink-0 rounded-full bg-primary/10 p-2.5 text-primary">
                      <Icon className="size-4" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {transaction.title ||
                          transaction.category ||
                          "Transaction"}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {formatDate(transaction.date)}
                      </p>
                    </div>

                    <p
                      className={`shrink-0 text-sm font-semibold ${
                        isIncome
                          ? "text-green-600 dark:text-green-400"
                          : "text-destructive"
                      }`}
                    >
                      {isIncome ? "+" : "-"}
                      {currency.format(Number(transaction.amount) || 0)}
                    </p>
                  </div>

                  {index < transactions.length - 1 && <Separator />}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
