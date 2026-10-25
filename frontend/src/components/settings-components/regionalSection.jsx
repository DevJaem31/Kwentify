import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SectionHeading from "./SectionHeading";

export default function RegionalSection({ regional, onChange }) {
  return (
    <Card
      id="regional"
      className="scroll-mt-6 rounded-2xl border-border/70 shadow-sm"
    >
      <CardHeader>
        <SectionHeading
          icon={Globe}
          title="Regional preferences"
          description="Set how dates, currency, and times are displayed."
        />
      </CardHeader>

      <CardContent className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Display currency</Label>

          <Select
            value={regional.currency}
            onValueChange={(value) => onChange("currency", value)}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Choose currency" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="PHP">PHP - Philippine Peso (₱)</SelectItem>
              <SelectItem value="USD">USD - US Dollar ($)</SelectItem>
              <SelectItem value="EUR">EUR - Euro (€)</SelectItem>
              <SelectItem value="SGD">SGD - Singapore Dollar (S$)</SelectItem>
            </SelectContent>
          </Select>

          <p className="text-xs text-muted-foreground">
            Changes display preferences only, not underlying transaction amounts
            or exchange rates.
          </p>
        </div>

        <div className="space-y-2">
          <Label>Date format</Label>

          <Select
            value={regional.dateFormat}
            onValueChange={(value) => onChange("dateFormat", value)}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Choose date format" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="MMM d, yyyy">Oct 25, 2026</SelectItem>
              <SelectItem value="dd/MM/yyyy">25/10/2026</SelectItem>
              <SelectItem value="MM/dd/yyyy">10/25/2026</SelectItem>
              <SelectItem value="yyyy-MM-dd">2026-10-25</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label>Time zone</Label>

          <Select
            value={regional.timezone}
            onValueChange={(value) => onChange("timezone", value)}
          >
            <SelectTrigger className="rounded-xl">
              <SelectValue placeholder="Choose time zone" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Asia/Manila">
                Asia/Manila (Philippine Time)
              </SelectItem>
              <SelectItem value="Asia/Singapore">Asia/Singapore</SelectItem>
              <SelectItem value="UTC">UTC</SelectItem>
              <SelectItem value="America/New_York">America/New_York</SelectItem>
              <SelectItem value="Europe/London">Europe/London</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
