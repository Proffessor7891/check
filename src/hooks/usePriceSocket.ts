"use client";

import { useEffect, useRef, useCallback } from "react";
import { useSetAtom } from "jotai";
import { marketPricesAtom, priceFlashAtom } from "@/atoms";

interface ClobPriceMessage {
  asset_id: string;
  price: string;
}

const WS_URL = "wss://ws-subscriptions-clob.polymarket.com/ws/market";
const RECONNECT_DELAY = 3000;
const MAX_RECONNECTS = 5;

export function usePriceSocket(tokenIds: string[]) {
  const setMarketPrices = useSetAtom(marketPricesAtom);
  const setPriceFlash = useSetAtom(priceFlashAtom);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectCount = useRef(0);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevPrices = useRef<Record<string, number>>({});
  const mountedRef = useRef(true);

  const flashPrice = useCallback(
    (tokenId: string, direction: "up" | "down") => {
      setPriceFlash((prev) => ({ ...prev, [tokenId]: direction }));
      setTimeout(() => {
        setPriceFlash((prev) => ({ ...prev, [tokenId]: null }));
      }, 1400);
    },
    [setPriceFlash]
  );

  const connect = useCallback(() => {
    if (!mountedRef.current || tokenIds.length === 0) return;

    try {
      const ws = new WebSocket(WS_URL);
      wsRef.current = ws;

      ws.onopen = () => {
        reconnectCount.current = 0;
        ws.send(
          JSON.stringify({
            assets_ids: tokenIds,
            type: "market",
          })
        );
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data) as ClobPriceMessage[];
          const updates: Record<string, number> = {};

          (Array.isArray(data) ? data : [data]).forEach((msg) => {
            if (msg.asset_id && msg.price) {
              const newPrice = parseFloat(msg.price);
              if (!isNaN(newPrice)) {
                updates[msg.asset_id] = newPrice;
                const prev = prevPrices.current[msg.asset_id];
                if (prev !== undefined && Math.abs(newPrice - prev) > 0.001) {
                  flashPrice(msg.asset_id, newPrice > prev ? "up" : "down");
                }
                prevPrices.current[msg.asset_id] = newPrice;
              }
            }
          });

          if (Object.keys(updates).length > 0) {
            setMarketPrices((prev) => ({ ...prev, ...updates }));
          }
        } catch {
          // silently ignore parse errors
        }
      };

      ws.onerror = () => {
        ws.close();
      };

      ws.onclose = () => {
        if (!mountedRef.current) return;
        if (reconnectCount.current < MAX_RECONNECTS) {
          reconnectCount.current++;
          reconnectTimer.current = setTimeout(connect, RECONNECT_DELAY);
        }
      };
    } catch {
      // WebSocket not available
    }
  }, [tokenIds, setMarketPrices, flashPrice]);

  useEffect(() => {
    mountedRef.current = true;
    connect();

    return () => {
      mountedRef.current = false;
      if (reconnectTimer.current) clearTimeout(reconnectTimer.current);
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
    };
  }, [connect]);
}
