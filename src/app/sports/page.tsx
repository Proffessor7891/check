import { fetchEvents } from "@/lib/api";
import { CategoryPageClient } from "@/components/events/CategoryPageClient";

export const revalidate = 60;

export default async function SportsPage() {
  const events = await fetchEvents({ tag: "sports", limit: 20 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <CategoryPageClient
        events={events}
        category="Sports"
        description="Bet on match outcomes, championships, player performance, and more"
        accentColor="#16c784"
      />
    </div>
  );
}
