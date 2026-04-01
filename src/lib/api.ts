import type { Event } from "./types";

const GAMMA_API = "https://gamma-api.polymarket.com";

interface FetchEventsOptions {
  limit?: number;
  offset?: number;
  tag?: string;
  closed?: boolean;
}

export async function fetchEvents(options: FetchEventsOptions = {}): Promise<Event[]> {
  const { limit = 20, offset = 0, tag, closed = false } = options;
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset),
    closed: String(closed),
    active: "true",
  });
  if (tag) params.set("tag_slug", tag);

  const res = await fetch(`${GAMMA_API}/events?${params}`, {
    next: { revalidate: 60 },
    headers: { "Accept-Encoding": "gzip" },
  });

  if (!res.ok) throw new Error(`Failed to fetch events: ${res.status}`);
  const data: Event[] = await res.json();
  return data;
}

export async function fetchEvent(id: string): Promise<Event> {
  const res = await fetch(`${GAMMA_API}/events/${id}`, {
    next: { revalidate: 30 },
  });

  if (!res.ok) throw new Error(`Failed to fetch event ${id}: ${res.status}`);
  return res.json();
}

export function formatVolume(volume: string | number): string {
  const n = typeof volume === "string" ? parseFloat(volume) : volume;
  if (isNaN(n)) return "$0";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(0)}`;
}

export function parseProbability(price: string | number): number {
  const n = typeof price === "string" ? parseFloat(price) : price;
  return isNaN(n) ? 0 : Math.max(0, Math.min(1, n));
}

export function parseClobTokenIds(raw: string[] | string | null | undefined): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseOutcomes(raw: string[] | string | null | undefined): string[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [String(raw)];
  }
}
