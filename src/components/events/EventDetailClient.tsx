"use client";

import { useMemo } from "react";
import { parseProbability, parseClobTokenIds, parseOutcomes } from "@/lib/api";
import { MarketRow } from "@/components/markets/MarketRow";
import { PriceManager } from "@/components/realtime/PriceManager";
import type { Event } from "@/lib/types";

interface EventDetailClientProps {
  event: Event;
}

export function EventDetailClient({ event }: EventDetailClientProps) {
  const { tokenIds, initialPrices } = useMemo(() => {
    const ids: string[] = [];
    const prices: Record<string, number> = {};
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
    return { tokenIds: ids, initialPrices: prices };
  }, [event]);

  return (
    <>
      <PriceManager tokenIds={tokenIds} initialPrices={initialPrices} />
      <div className="space-y-4">
        {event.markets?.map((market) => (
          <MarketRow
            key={market.id}
            question={market.question}
            outcomes={parseOutcomes(market.outcomes as unknown as string[])}
            outcomePrices={parseOutcomes(market.outcomePrices as unknown as string[])}
            tokenIds={parseClobTokenIds(market.clobTokenIds as unknown as string)}
            volume={market.volume}
            oneDayPriceChange={market.oneDayPriceChange}
          />
        ))}
      </div>
    </>
  );
}
