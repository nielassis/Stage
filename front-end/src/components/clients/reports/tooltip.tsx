interface TooltipProps {
  active?: boolean;
  payload?: Array<{ color: string; name: string; value: string | number }>;
  label?: string;
}

export function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-card p-3 shadow-lg">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        <div className="space-y-1.5">
          {payload.map((entry, index: number) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-medium text-foreground">{entry.value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
}
