import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetailLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <Skeleton className="mb-6 h-5 w-28 bg-[#1e2535]" />
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-6 flex items-start gap-4">
            <Skeleton className="h-20 w-20 shrink-0 rounded-xl bg-[#1e2535]" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-24 bg-[#1e2535]" />
              <Skeleton className="h-7 w-full bg-[#1e2535]" />
              <Skeleton className="h-7 w-3/4 bg-[#1e2535]" />
              <Skeleton className="h-4 w-48 bg-[#1e2535]" />
            </div>
          </div>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-40 w-full rounded-xl bg-[#1e2535]" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <Skeleton className="h-48 w-full rounded-xl bg-[#1e2535]" />
          <Skeleton className="h-32 w-full rounded-xl bg-[#1e2535]" />
        </div>
      </div>
    </div>
  );
}
