import { Skeleton } from "../skeleton";
import { TableCell, TableRow } from "../table";

export function UsersTableSkeleton({ limit }: { limit: number }) {
  return (
    <>
      {Array.from({ length: limit }).map((_, i) => (
        <TableRow key={i} className="animate-pulse">
          <TableCell>
            <Skeleton className="h-4 w-32 rounded" />
          </TableCell>
          <TableCell className="hidden sm:table-cell">
            <Skeleton className="h-4 w-40 rounded" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-24 rounded" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-8 w-20 rounded" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
}
