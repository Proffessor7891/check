import { EventGridSkeleton } from "@/components/events/EventCardSkeleton";

export default function HomeLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-6 space-y-1">
        <div className="h-7 w-24 rounded bg-[#1e2535]" />
        <div className="h-4 w-64 rounded bg-[#1e2535]" />
      </div>
      <div className="mb-6 flex gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-8 w-20 rounded-full bg-[#1e2535]" />
        ))}
      </div>
      <EventGridSkeleton />
    </div>
  );
}
