import { LucideIcon } from "lucide-react";
import { Card } from "../../ui/card";

interface FallbackProps {
  text: string;
  subtext?: string;
  icon: LucideIcon;
}

export default function NoResultFallback({
  text,
  subtext,
  icon: Icon,
}: FallbackProps) {
  return (
    <Card className="flex flex-1 h-full w-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed p-6 text-center shadow-none">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Icon className="h-6 w-6 text-muted-foreground" />
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{text}</p>

        {subtext && <p className="text-xs text-muted-foreground">{subtext}</p>}
      </div>
    </Card>
  );
}
