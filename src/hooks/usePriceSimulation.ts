"use client";

import { useEffect, useRef } from "react";
import { useSetAtom } from "jotai";
import { marketPricesAtom, priceFlashAtom } from "@/atoms";

const TICK_INTERVAL = 3000;
const MAX_DRIFT = 0.015;

export function usePriceSimulation(
  initialPrices: Record<string, number>,
  active = true
) {
  const setMarketPrices = useSetAtom(marketPricesAtom);
  const setPriceFlash = useSetAtom(priceFlashAtom);
  const pricesRef = useRef<Record<string, number>>(initialPrices);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    pricesRef.current = initialPrices;
    setMarketPrices((prev) => ({ ...prev, ...initialPrices }));
  }, [initialPrices, setMarketPrices]);

  useEffect(() => {
    if (!active) return;

    const tokenIds = Object.keys(initialPrices);
    if (tokenIds.length === 0) return;

    intervalRef.current = setInterval(() => {
      const updates: Record<string, number> = {};
      const flashes: Record<string, "up" | "down"> = {};
      const count = Math.ceil(tokenIds.length * 0.3);
      const toUpdate = [...tokenIds]
        .sort(() => Math.random() - 0.5)
        .slice(0, count);

      toUpdate.forEach((id) => {
        const current = pricesRef.current[id] ?? 0.5;
        const drift = (Math.random() - 0.5) * 2 * MAX_DRIFT;
        const next = Math.max(0.01, Math.min(0.99, current + drift));
        if (Math.abs(next - current) > 0.001) {
          updates[id] = next;
          flashes[id] = next > current ? "up" : "down";
          pricesRef.current[id] = next;
        }
      });

      if (Object.keys(updates).length > 0) {
        setMarketPrices((prev) => ({ ...prev, ...updates }));
        setPriceFlash((prev) => ({ ...prev, ...flashes }));
        setTimeout(() => {
          setPriceFlash((prev) => {
            const next = { ...prev };
            Object.keys(flashes).forEach((id) => {
              next[id] = null;
            });
            return next;
          });
        }, 1400);
      }
    }, TICK_INTERVAL);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active, initialPrices, setMarketPrices, setPriceFlash]);
}
