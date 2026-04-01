export interface Tag {
  id: string;
  label: string;
  slug: string;
}

export interface Market {
  id: string;
  question: string;
  conditionId: string;
  slug: string;
  image: string | null;
  icon: string | null;
  outcomes: string[];
  outcomePrices: string[];
  volume: string;
  volumeNum: number;
  active: boolean;
  closed: boolean;
  groupItemTitle: string;
  clobTokenIds: string[];
  lastTradePrice: number;
  bestAsk: number;
  oneDayPriceChange: number;
  endDateIso: string;
  acceptingOrders: boolean;
  spread: number;
}

export interface Event {
  id: string;
  ticker: string;
  slug: string;
  title: string;
  description: string;
  image: string;
  icon: string;
  active: boolean;
  closed: boolean;
  volume: string;
  volume24hr: number;
  liquidity: string;
  markets: Market[];
  tags: Tag[];
  endDate: string;
  createdAt: string;
  featured: boolean;
  new: boolean;
}

export type CategorySlug = "all" | "crypto" | "sports" | "politics" | "pop-culture" | "science";

export interface PriceUpdate {
  tokenId: string;
  price: number;
  timestamp: number;
}

export interface MarketPrice {
  [tokenId: string]: number;
}
