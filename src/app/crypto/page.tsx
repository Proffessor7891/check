import { fetchEvents } from "@/lib/api";
import { CategoryPageClient } from "@/components/events/CategoryPageClient";

export const revalidate = 60;

export default async function CryptoPage() {
  const events = await fetchEvents({ tag: "crypto", limit: 20 });

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <CategoryPageClient
        events={events}
        category="Crypto"
        description="Trade on cryptocurrency prices, protocol upgrades, and blockchain milestones"
        accentColor="#f59e0b"
      />
    </div>
  );
}
