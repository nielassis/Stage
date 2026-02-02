import { Skeleton } from "@/src/components/ui/skeleton";

export function DashboardWrapperSkeleton({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <aside className="hidden md:block w-55 lg:w-70 border-r">
        <div className="p-4 space-y-4">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
        </div>
      </aside>

      <div className="flex max-w-full overflow-x-auto flex-col">
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </>
  );
}
