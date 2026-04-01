import { fetchEvents } from "@/lib/api";
import { EventsGrid } from "@/components/events/EventsGrid";

export const revalidate = 60;

export default async function HomePage() {
  const events = await fetchEvents({ limit: 20 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Markets</h1>
        <p className="mt-1 text-sm text-[#6b7a99]">
          Trade on outcomes of real-world events
        </p>
      </div>
      <EventsGrid initialEvents={events} />
    </div>
  );
}
