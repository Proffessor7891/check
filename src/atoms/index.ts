import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { Event, CategorySlug, MarketPrice } from "@/lib/types";

export const eventsAtom = atom<Event[]>([]);

export const isLoadingAtom = atom<boolean>(true);

export const selectedCategoryAtom = atomWithStorage<CategorySlug>(
  "selectedCategory",
  "all"
);

export const marketPricesAtom = atom<MarketPrice>({});

export const priceFlashAtom = atom<Record<string, "up" | "down" | null>>({});

export const filteredEventsAtom = atom((get) => {
  const events = get(eventsAtom);
  const category = get(selectedCategoryAtom);

  if (category === "all") return events;

  return events.filter((event) =>
    event.tags?.some((tag) => tag.slug === category)
  );
});

export const eventByIdAtom = (id: string) =>
  atom((get) => get(eventsAtom).find((e) => e.id === id));
