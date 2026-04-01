"use client";

import { memo, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAtomValue } from "jotai";
import { marketPricesAtom, priceFlashAtom } from "@/atoms";
import { formatVolume, parseProbability, parseClobTokenIds, parseOutcomes } from "@/lib/api";
import type { Event } from "@/lib/types";
import { cn } from "@/lib/utils";

interface EventCardProps {
  event: Event;
}

function OutcomePreview({
  tokenId,
  label,
  initialPrice,
}: {
  tokenId: string;
  label: string;
  initialPrice: number;
}) {
  const prices = useAtomValue(marketPricesAtom);
  const flashes = useAtomValue(priceFlashAtom);
  const price = prices[tokenId] ?? initialPrice;
  const flash = flashes[tokenId];
  const pct = Math.round(price * 100);
  const isYes = label.toLowerCase() === "yes" || pct >= 50;

  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg px-3 py-2 transition-colors",
        flash === "up" && "price-flash-up",
        flash === "down" && "price-flash-down",
        "bg-[#1e2535]/60"
      )}
    >
      <span className="text-sm font-medium text-[#c4cde0]">{label}</span>
      <span
        className={cn(
          "text-sm font-bold tabular-nums",
          isYes ? "text-[#16c784]" : "text-[#ea3943]"
        )}
      >
        {pct}%
      </span>
    </div>
  );
}

const MemoOutcomePreview = memo(OutcomePreview);

export const EventCard = memo(function EventCard({ event }: EventCardProps) {
  const primaryMarket = event.markets?.[0];

  const outcomes = useMemo(() => {
    if (!primaryMarket) return [];
    const names = parseOutcomes(primaryMarket.outcomes);
    const prices = parseOutcomes(primaryMarket.outcomePrices as unknown as string[]);
    const tokenIds = parseClobTokenIds(primaryMarket.clobTokenIds as unknown as string);
    return names.slice(0, 2).map((name, i) => ({
      label: name,
      tokenId: tokenIds[i] ?? "",
      initialPrice: parseProbability(prices[i] ?? "0.5"),
    }));
  }, [primaryMarket]);

  const volume24h = event.volume24hr ?? 0;
  const hasMultipleMarkets = event.markets && event.markets.length > 1;

  return (
    <Link
      href={`/events/${event.id}`}
      className="group block rounded-xl border border-[#222840] bg-[#161b27] p-4 transition-all duration-200 hover:border-[#3d4f7c] hover:shadow-lg hover:shadow-black/20"
    >
      <div className="flex gap-3">
        {event.image && (
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg">
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover"
              sizes="64px"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white group-hover:text-[#8ba4ff] transition-colors">
            {event.title}
          </h3>
          <div className="mt-1.5 flex items-center gap-3 text-xs text-[#6b7a99]">
            <span>${formatVolume(event.volume).replace("$", "")} Vol.</span>
            {volume24h > 0 && (
              <span className="text-[#16c784]">
                +${formatVolume(volume24h).replace("$", "")} 24h
              </span>
            )}
            {hasMultipleMarkets && (
              <span>{event.markets.length} markets</span>
            )}
          </div>
        </div>
      </div>

      {outcomes.length > 0 && (
        <div className="mt-3 space-y-1.5">
          {outcomes.map((o) => (
            <MemoOutcomePreview
              key={o.tokenId || o.label}
              tokenId={o.tokenId}
              label={o.label}
              initialPrice={o.initialPrice}
            />
          ))}
        </div>
      )}
    </Link>
  );
});
