import { fetchEvents } from "@/lib/api";
import { CategoryPageClient } from "@/components/events/CategoryPageClient";

export const revalidate = 60;

export default async function PoliticsPage() {
  const events = await fetchEvents({ tag: "politics", limit: 20 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <CategoryPageClient
        events={events}
        category="Politics"
        description="Trade on elections, policy decisions, and geopolitical developments"
        accentColor="#8b5cf6"
      />
    </div>
  );
}
