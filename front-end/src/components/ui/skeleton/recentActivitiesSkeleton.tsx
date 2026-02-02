import { Skeleton } from "@/src/components/ui/skeleton";

export function RecentActivitiesSkeleton() {
  return (
    <div className="rounded-xl border p-4 space-y-4 w-full">
      <Skeleton className="h-5 w-48" />

      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex gap-3 items-start w-full">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-3 w-56" />
          </div>
        </div>
      ))}
    </div>
  );
}
