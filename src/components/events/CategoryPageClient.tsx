"use client";

import { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAtomValue } from "jotai";
import { marketPricesAtom, priceFlashAtom } from "@/atoms";
import { parseProbability, formatVolume, parseClobTokenIds, parseOutcomes } from "@/lib/api";
import type { Event } from "@/lib/types";
import { PriceManager } from "@/components/realtime/PriceManager";
import { cn } from "@/lib/utils";
import { TrendingUp } from "lucide-react";

interface CategoryPageClientProps {
  events: Event[];
  category: string;
  description: string;
  accentColor: string;
}

function LivePriceChip({
  tokenId,
  initialPrice,
  label,
}: {
  tokenId: string;
  initialPrice: number;
  label: string;
}) {
  const prices = useAtomValue(marketPricesAtom);
  const flashes = useAtomValue(priceFlashAtom);
  const price = prices[tokenId] ?? initialPrice;
  const flash = flashes[tokenId];
  const pct = Math.round(price * 100);
  const isHigh = pct >= 50;

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg px-3 py-2",
        flash === "up" && "price-flash-up",
        flash === "down" && "price-flash-down",
        "bg-[#1a2030]"
      )}
    >
      <span className="text-xs text-[#8b9bb4]">{label}</span>
      <div className="flex items-center gap-1.5">
        <div className="relative h-1 flex-1 w-16 overflow-hidden rounded-full bg-[#222840]">
          <div
            className={cn(
              "absolute inset-y-0 left-0 rounded-full transition-all duration-700",
              isHigh ? "bg-[#16c784]" : "bg-[#ea3943]"
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
        <span
          className={cn(
            "text-sm font-bold tabular-nums w-10 text-right",
            isHigh ? "text-[#16c784]" : "text-[#ea3943]"
          )}
        >
          {pct}%
        </span>
      </div>
    </div>
  );
}

function FeaturedEventCard({ event }: { event: Event }) {
  const primaryMarket = event.markets?.[0];
  const outcomes = useMemo(() => {
    if (!primaryMarket) return [];
    const names = parseOutcomes(primaryMarket.outcomes as unknown as string[]);
    const prices = parseOutcomes(primaryMarket.outcomePrices as unknown as string[]);
    const tokenIds = parseClobTokenIds(primaryMarket.clobTokenIds as unknown as string);
    return names.slice(0, 2).map((name, i) => ({
      label: name,
      tokenId: tokenIds[i] ?? "",
      initialPrice: parseProbability(prices[i] ?? "0.5"),
    }));
  }, [primaryMarket]);

  return (
    <Link
      href={`/events/${event.id}`}
      className="group relative overflow-hidden rounded-2xl border border-[#222840] bg-[#161b27] p-5 transition-all hover:border-[#3d4f7c] hover:shadow-xl hover:shadow-black/30"
    >
      <div className="flex items-start gap-4">
        {event.image && (
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl">
            <Image src={event.image} alt={event.title} fill className="object-cover" sizes="56px" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 font-semibold leading-snug text-white group-hover:text-[#8ba4ff] transition-colors">
            {event.title}
          </h3>
          <div className="mt-1 flex items-center gap-3 text-xs text-[#6b7a99]">
            <span>{formatVolume(event.volume)} Vol.</span>
            {event.volume24hr > 0 && (
              <span className="flex items-center gap-0.5 text-[#16c784]">
                <TrendingUp className="h-3 w-3" />
                {formatVolume(event.volume24hr)} 24h
              </span>
            )}
          </div>
        </div>
      </div>
      {outcomes.length > 0 && (
        <div className="mt-4 space-y-1.5">
          {outcomes.map((o) => (
            <LivePriceChip
              key={o.tokenId || o.label}
              tokenId={o.tokenId}
              initialPrice={o.initialPrice}
              label={o.label}
            />
          ))}
        </div>
      )}
    </Link>
  );
}

export function CategoryPageClient({
  events,
  category,
  description,
  accentColor,
}: CategoryPageClientProps) {
  const { tokenIds, initialPrices } = useMemo(() => {
    const ids: string[] = [];
    const prices: Record<string, number> = {};
    events.forEach((event) => {
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
  }, [events]);

  const byVolume = useMemo(
    () => [...events].sort((a, b) => parseFloat(b.volume) - parseFloat(a.volume)),
    [events]
  );
  const featured = byVolume.slice(0, 3);
  const rest = byVolume.slice(3);

  return (
    <>
      <PriceManager tokenIds={tokenIds} initialPrices={initialPrices} />

      <div
        className="mb-8 rounded-2xl p-6"
        style={{ background: `linear-gradient(135deg, ${accentColor}18 0%, transparent 70%)`, border: `1px solid ${accentColor}30` }}
      >
        <h1 className="text-3xl font-bold text-white">{category}</h1>
        <p className="mt-2 text-[#8b9bb4]">{description}</p>
        <div className="mt-2 text-sm text-[#6b7a99]">
          {events.length} active markets
        </div>
      </div>

      {featured.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-lg font-bold text-white">
            Top Markets
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {featured.map((event) => (
              <FeaturedEventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-bold text-white">All Markets</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {rest.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="group rounded-xl border border-[#222840] bg-[#161b27] p-4 transition-all hover:border-[#3d4f7c]"
              >
                <div className="flex items-start gap-3">
                  {event.image && (
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                      <Image src={event.image} alt={event.title} fill className="object-cover" sizes="40px" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="line-clamp-2 text-sm font-medium text-white group-hover:text-[#8ba4ff] transition-colors">
                      {event.title}
                    </p>
                    <p className="mt-1 text-xs text-[#6b7a99]">
                      {formatVolume(event.volume)} Vol.
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {events.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <p className="text-lg font-medium text-[#6b7a99]">No active markets</p>
          <p className="mt-1 text-sm text-[#4a5568]">Check back later for new markets</p>
        </div>
      )}
    </>
  );
}
