import { Skeleton } from "@/src/components/ui/skeleton";

export function CustomerEditSkeleton() {
  return (
    <div className="space-y-4 mt-4 max-w-xl">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-32 ml-auto" />
    </div>
  );
}
