import { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { formatCurrency } from "@/src/utils/ui/formatCurrency";

interface KpiCardProps {
  label: string;
  value: number;
  isCurrency?: boolean;
  icon: LucideIcon;
  iconColor: string;
}

export function KpiCard({
  label,
  value,
  icon: Icon,
  iconColor,
  isCurrency = false,
}: KpiCardProps) {
  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-foreground">
          {isCurrency ? formatCurrency(value) : value}
        </div>
      </CardContent>
    </Card>
  );
}
