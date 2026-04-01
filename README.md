# Polymarket Clone

A Next.js application replicating the core Polymarket prediction market experience — live price updates, event grids, category pages, and event detail views.

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

### Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 15 App Router | Server components + streaming |
| Language | TypeScript | Type safety across API and UI |
| State | Jotai | Atomic, composable, no boilerplate |
| UI | shadcn/ui + Tailwind | Composable primitives, dark theme |
| Realtime | WebSocket + simulation | Polymarket CLOB WS with fallback |

### Directory structure

```
src/
├── app/
│   ├── page.tsx            # Main events grid
│   ├── crypto/page.tsx     # Crypto category page
│   ├── sports/page.tsx     # Sports category page
│   ├── politics/page.tsx   # Politics category page
│   └── events/[id]/        # Event detail page
├── atoms/
│   └── index.ts            # Jotai atoms (events, prices, category, flash)
├── components/
│   ├── events/             # EventCard, EventsGrid, CategoryPageClient
│   ├── layout/             # Header
│   ├── markets/            # MarketRow with live probability bars
│   ├── providers/          # JotaiProvider
│   └── realtime/           # PriceManager
├── hooks/
│   ├── usePriceSocket.ts   # Polymarket CLOB WebSocket subscriber
│   └── usePriceSimulation.ts  # Simulation fallback (±1.5% per tick)
└── lib/
    ├── api.ts              # Gamma API fetch + formatters + parsers
    └── types.ts            # TypeScript interfaces
```

### Realtime approach

Prices update through a two-layer system:

1. **WebSocket** (`wss://ws-subscriptions-clob.polymarket.com/ws/market`) — subscribes to all token IDs visible on screen, receiving price ticks from the Polymarket CLOB.
2. **Simulation fallback** — if the WebSocket does not connect within 5 seconds (e.g. CORS in some environments), a `setInterval` nudges prices by ±1.5% every 3 seconds to demonstrate the live-update UI.

Price updates write to a single `marketPricesAtom` (a flat `Record<tokenId, number>`). Individual `OutcomeBar` / `OutcomePreview` components each subscribe only to the slice they need, so a price tick never re-renders the whole tree.

Flash animations (`price-flash-up` / `price-flash-down`) are triggered via a separate `priceFlashAtom` and cleared after 1.4 s.

### State management

Four atoms:

| Atom | Type | Purpose |
|---|---|---|
| `eventsAtom` | `Event[]` | Canonical event list, hydrated from server |
| `selectedCategoryAtom` | `CategorySlug` | Persisted to localStorage |
| `marketPricesAtom` | `Record<string, number>` | Live prices keyed by CLOB token ID |
| `priceFlashAtom` | `Record<string, "up" \| "down" \| null>` | Transient flash state |

`filteredEventsAtom` is a derived read-only atom — no extra state needed for filtering.

### Performance

- `EventCard`, `MarketRow`, `OutcomePreview`, `OutcomeBar` are wrapped in `React.memo`
- Price atoms are granular — price ticks only re-render leaf components that subscribe to the affected token
- Static pages revalidate every 60 s (ISR) — API calls happen at build time, not per request
- Images use `next/image` with `sizes` hints for optimal loading

### Data source

All market data: `https://gamma-api.polymarket.com/events?closed=false`

### Known limitations

- The Polymarket CLOB WebSocket may be blocked by browser CORS policies in some environments; the simulation fallback handles this transparently
- `clobTokenIds` and `outcomes` in the API can be either JSON arrays or raw JSON strings — both formats are handled by `parseClobTokenIds` / `parseOutcomes` in `lib/api.ts`
- No order book / trading functionality — UI only

## Deploy to Vercel

```bash
vercel --prod
```

Or connect the repo in the Vercel dashboard. The `vercel.json` is already configured.
