import { Skeleton } from "@/components/ui/skeleton";

export function EventCardSkeleton() {
  return (
    <div className="rounded-xl border border-[#222840] bg-[#161b27] p-4">
      <div className="flex gap-3">
        <Skeleton className="h-16 w-16 shrink-0 rounded-lg bg-[#1e2535]" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full rounded bg-[#1e2535]" />
          <Skeleton className="h-4 w-2/3 rounded bg-[#1e2535]" />
          <Skeleton className="h-3 w-1/3 rounded bg-[#1e2535]" />
        </div>
      </div>
      <div className="mt-3 space-y-1.5">
        <Skeleton className="h-9 w-full rounded-lg bg-[#1e2535]" />
        <Skeleton className="h-9 w-full rounded-lg bg-[#1e2535]" />
      </div>
    </div>
  );
}

export function EventGridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <EventCardSkeleton key={i} />
      ))}
    </div>
  );
}
