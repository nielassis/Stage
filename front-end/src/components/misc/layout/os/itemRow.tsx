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
        className="h-10 w-10 rounded-md bg-gray-200 flex items-center justify-center text-muted-foreground"
        variant="secondary"
      >
        {icon}
      </Button>
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-wider">
          {label}
        </p>
        <p className="font-medium text-foreground">{value}</p>
      </div>
    </div>
  );
}
