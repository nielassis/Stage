import { Button } from "@/src/components/ui/button";

export function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3">
      <Button
        className="h-10 w-10 rounded-md bg-muted-foreground/30 flex items-center justify-center text-slate-400"
        variant="secondary"
      >
        {icon}
      </Button>
      <div>
        <p className="text-xs text-slate-400 uppercase tracking-wider">
          {label}
        </p>
        <p className="font-medium text-slate-100">{value}</p>
      </div>
    </div>
  );
}
