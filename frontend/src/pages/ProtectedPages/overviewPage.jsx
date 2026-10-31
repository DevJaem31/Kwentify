import FinancialSummary from "../../components/overview-components/financialSummary";
import SpendingOverview from "../../components/overview-components/spendingOverview";
import RecentTransactions from "../../components/overview-components/recentTransactions";
import OverviewCalendar from "../../components/overview-components/overviewCalendar";
import ImportantReminders from "../../components/overview-components/importantReminders";
import OverviewHeader from "../../components/overview-components/overviewHeader";

import useOverviewData from "../../hooks/useOverviewData";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function OverviewPage() {
  const {
    data,
    loading,
    error,
    refresh,
    summary,
    recentTransactions,
    pendingBills,
  } = useOverviewData();

  return (
    <div className="min-h-screen min-w-0 bg-background p-3 text-foreground sm:p-4 md:p-6">
      <div className="mx-auto w-full max-w-7xl space-y-5 sm:space-y-6">
        <OverviewHeader />

        {error && (
          <div className="flex flex-col gap-3 rounded-lg border border-destructive/30 bg-destructive/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-destructive">
              Unable to load your financial data. Please try again.
            </p>

            <Button
              variant="outline"
              size="sm"
              onClick={refresh}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              <RefreshCw className="mr-2 size-4" />
              Try Again
            </Button>
          </div>
        )}

        <FinancialSummary summary={summary} loading={loading} />

        <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_320px]">
          <main className="min-w-0 space-y-5 sm:space-y-6">
            <SpendingOverview
              transactions={data.transactions}
              loading={loading}
            />
            <RecentTransactions
              transactions={recentTransactions}
              loading={loading}
            />
          </main>

          <aside className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-1">
            <OverviewCalendar bills={pendingBills} loading={loading} />
            <ImportantReminders bills={pendingBills} loading={loading} />
          </aside>
        </div>
      </div>
    </div>
  );
}
