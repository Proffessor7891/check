"use client";

import { useEffect, useRef, useState } from "react";
import { usePriceSocket } from "@/hooks/usePriceSocket";
import { usePriceSimulation } from "@/hooks/usePriceSimulation";

interface PriceManagerProps {
  tokenIds: string[];
  initialPrices: Record<string, number>;
}

export function PriceManager({ tokenIds, initialPrices }: PriceManagerProps) {
  const [wsConnected, setWsConnected] = useState(false);
  const wsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  usePriceSocket(tokenIds);
  usePriceSimulation(initialPrices, !wsConnected);

  useEffect(() => {
    wsTimeoutRef.current = setTimeout(() => {
      setWsConnected(false);
    }, 5000);

    return () => {
      if (wsTimeoutRef.current) clearTimeout(wsTimeoutRef.current);
    };
  }, []);

  return null;
}
