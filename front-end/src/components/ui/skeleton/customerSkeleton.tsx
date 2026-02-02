import { Skeleton } from "@/src/components/ui/skeleton";

export function CustomerDetailsSkeleton() {
  return (
    <div className="space-y-4 mt-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-4 w-64" />
      <Skeleton className="h-4 w-56" />
      <Skeleton className="h-4 w-40" />
    </div>
  );
}
