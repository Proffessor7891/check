"use client";

import { useEffect, useMemo } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  eventsAtom,
  filteredEventsAtom,
  isLoadingAtom,
  selectedCategoryAtom,
} from "@/atoms";
import type { Event, CategorySlug } from "@/lib/types";
import { EventCard } from "./EventCard";
import { EventGridSkeleton } from "./EventCardSkeleton";
import { PriceManager } from "@/components/realtime/PriceManager";
import { parseProbability, parseClobTokenIds, parseOutcomes } from "@/lib/api";
import { cn } from "@/lib/utils";

const CATEGORIES: { label: string; slug: CategorySlug }[] = [
  { label: "All", slug: "all" },
  { label: "Crypto", slug: "crypto" },
  { label: "Sports", slug: "sports" },
  { label: "Politics", slug: "politics" },
  { label: "Pop Culture", slug: "pop-culture" },
  { label: "Science", slug: "science" },
];

interface EventsGridProps {
  initialEvents: Event[];
}

export function EventsGrid({ initialEvents }: EventsGridProps) {
  const setEvents = useSetAtom(eventsAtom);
  const setIsLoading = useSetAtom(isLoadingAtom);
  const [selectedCategory, setSelectedCategory] = useAtom(selectedCategoryAtom);
  const filteredEvents = useAtomValue(filteredEventsAtom);
  const isLoading = useAtomValue(isLoadingAtom);

  useEffect(() => {
    setEvents(initialEvents);
    setIsLoading(false);
  }, [initialEvents, setEvents, setIsLoading]);

  const { tokenIds, initialPrices } = useMemo(() => {
    const ids: string[] = [];
    const prices: Record<string, number> = {};
    initialEvents.forEach((event) => {
      event.markets?.forEach((market) => {
        const tokenIds = parseClobTokenIds(market.clobTokenIds as unknown as string);
        const outcomePrices = parseOutcomes(market.outcomePrices as unknown as string[]);
        tokenIds.forEach((tokenId, i) => {
          if (tokenId) {
            ids.push(tokenId);
            prices[tokenId] = parseProbability(outcomePrices[i] ?? "0.5");
          }
        });
      });
    });
    return { tokenIds: ids, initialPrices: prices };
  }, [initialEvents]);

  return (
    <>
      <PriceManager tokenIds={tokenIds} initialPrices={initialPrices} />

      <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map(({ label, slug }) => (
          <button
            key={slug}
            onClick={() => setSelectedCategory(slug)}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              selectedCategory === slug
                ? "bg-[#5f6fff] text-white"
                : "bg-[#1e2535] text-[#8b9bb4] hover:bg-[#2a3352] hover:text-white"
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {isLoading ? (
        <EventGridSkeleton />
      ) : filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-medium text-[#6b7a99]">No markets found</p>
          <p className="mt-1 text-sm text-[#4a5568]">
            Try selecting a different category
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </>
  );
}
