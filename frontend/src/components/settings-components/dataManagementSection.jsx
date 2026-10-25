import { ArrowDownToLine, RotateCcw, Wallet } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import SectionHeading from "./SectionHeading";

export default function DataManagementSection({ onExport }) {
  return (
    <Card
      id="data"
      className="scroll-mt-6 rounded-2xl border-border/70 shadow-sm"
    >
      <CardHeader>
        <SectionHeading
          icon={Wallet}
          title="Data management"
          description="Keep control over your Kwentify preferences and financial records."
        />
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium">Export preferences</p>

            <p className="text-sm leading-5 text-muted-foreground">
              Download a JSON file containing your saved settings. This does not
              export transactions or other financial records.
            </p>
          </div>

          <Button
            type="button"
            variant="outline"
            className="shrink-0 rounded-xl"
            onClick={onExport}
          >
            <ArrowDownToLine className="mr-2 size-4" />
            Export settings
          </Button>
        </div>

        <Separator />

        <div className="flex items-start gap-3">
          <RotateCcw className="mt-0.5 size-5 text-muted-foreground" />

          <div className="space-y-1">
            <p className="text-sm font-medium">Financial data</p>

            <p className="text-sm leading-5 text-muted-foreground">
              Your transactions, budgets, savings, and investments should be
              exported and managed through dedicated data management workflows.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
