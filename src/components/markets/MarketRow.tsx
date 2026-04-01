"use client";

import { memo } from "react";
import { useAtomValue } from "jotai";
import { marketPricesAtom, priceFlashAtom } from "@/atoms";
import { parseProbability } from "@/lib/api";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface MarketRowProps {
  question: string;
  outcomes: string[];
  outcomePrices: string[];
  tokenIds: string[];
  volume: string;
  oneDayPriceChange?: number;
}

function OutcomeBar({
  label,
  tokenId,
  initialPrice,
  isLast,
}: {
  label: string;
  tokenId: string;
  initialPrice: number;
  isLast: boolean;
}) {
  const prices = useAtomValue(marketPricesAtom);
  const flashes = useAtomValue(priceFlashAtom);
  const price = prices[tokenId] ?? initialPrice;
  const flash = flashes[tokenId];
  const pct = price * 100;
  const isYes = label.toLowerCase() === "yes";
  const isHighProb = pct >= 50;

  return (
    <div className={cn("pb-3", !isLast && "mb-3 border-b border-[#222840]")}>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-[#c4cde0]">{label}</span>
        <div
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sm font-bold tabular-nums transition-all",
            flash === "up" && "price-flash-up",
            flash === "down" && "price-flash-down",
            isYes || isHighProb ? "text-[#16c784]" : "text-[#ea3943]"
          )}
        >
          {flash === "up" && <TrendingUp className="h-3 w-3" />}
          {flash === "down" && <TrendingDown className="h-3 w-3" />}
          {pct.toFixed(1)}%
        </div>
      </div>
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-[#1e2535]">
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full transition-all duration-700",
            isYes || isHighProb ? "bg-[#16c784]" : "bg-[#ea3943]"
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

const MemoOutcomeBar = memo(OutcomeBar);

export const MarketRow = memo(function MarketRow({
  question,
  outcomes,
  outcomePrices,
  tokenIds,
  oneDayPriceChange,
}: MarketRowProps) {
  const hasChange = oneDayPriceChange !== undefined && oneDayPriceChange !== 0;
  const changeUp = (oneDayPriceChange ?? 0) > 0;

  return (
    <div className="rounded-xl border border-[#222840] bg-[#161b27] p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold leading-snug text-white">
          {question}
        </h3>
        {hasChange && (
          <span
            className={cn(
              "shrink-0 text-xs font-medium",
              changeUp ? "text-[#16c784]" : "text-[#ea3943]"
            )}
          >
            {changeUp ? "+" : ""}
            {((oneDayPriceChange ?? 0) * 100).toFixed(1)}% 24h
          </span>
        )}
      </div>

      <div>
        {outcomes.slice(0, 3).map((outcome, i) => (
          <MemoOutcomeBar
            key={tokenIds[i] || outcome}
            label={outcome}
            tokenId={tokenIds[i] ?? ""}
            initialPrice={parseProbability(outcomePrices[i] ?? "0.5")}
            isLast={i === Math.min(outcomes.length, 3) - 1}
          />
        ))}
        {outcomes.length > 3 && (
          <p className="mt-2 text-xs text-[#6b7a99]">
            +{outcomes.length - 3} more outcomes
          </p>
        )}
      </div>

      <div className="mt-3 flex gap-2">
        <button className="flex-1 rounded-lg bg-[#16c784]/15 py-2 text-sm font-semibold text-[#16c784] transition-colors hover:bg-[#16c784]/25">
          Buy Yes
        </button>
        <button className="flex-1 rounded-lg bg-[#ea3943]/15 py-2 text-sm font-semibold text-[#ea3943] transition-colors hover:bg-[#ea3943]/25">
          Buy No
        </button>
      </div>
    </div>
  );
});
