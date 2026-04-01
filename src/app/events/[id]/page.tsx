import { fetchEvent, fetchEvents, formatVolume } from "@/lib/api";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { EventDetailClient } from "@/components/events/EventDetailClient";

export const revalidate = 30;

export async function generateStaticParams() {
  try {
    const events = await fetchEvents({ limit: 20 });
    return events.map((e) => ({ id: e.id }));
  } catch {
    return [];
  }
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;

  let event;
  try {
    event = await fetchEvent(id);
  } catch {
    notFound();
  }

  const endDate = event.endDate
    ? new Date(event.endDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <Link
        href="/"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-[#8b9bb4] transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Markets
      </Link>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
        <div>
          <div className="mb-6 flex items-start gap-4">
            {event.image && (
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                  sizes="80px"
                  priority
                />
              </div>
            )}
            <div>
              <div className="mb-2 flex flex-wrap gap-2">
                {event.tags?.slice(0, 3).map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="secondary"
                    className="bg-[#1e2535] text-[#8b9bb4] hover:bg-[#2a3352]"
                  >
                    {tag.label}
                  </Badge>
                ))}
              </div>
              <h1 className="text-xl font-bold leading-snug text-white sm:text-2xl">
                {event.title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-[#6b7a99]">
                <span className="font-semibold text-[#c4cde0]">
                  {formatVolume(event.volume)} Vol.
                </span>
                {event.liquidity && (
                  <span>{formatVolume(event.liquidity)} Liq.</span>
                )}
                {endDate && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    Ends {endDate}
                  </span>
                )}
                {event.volume24hr > 0 && (
                  <span className="text-[#16c784]">
                    +{formatVolume(event.volume24hr)} 24h
                  </span>
                )}
              </div>
            </div>
          </div>

          {event.description && (
            <>
              <div className="mb-6 rounded-xl border border-[#222840] bg-[#161b27] p-4">
                <div className="flex items-center gap-2 mb-2 text-xs text-[#6b7a99]">
                  <Globe className="h-3.5 w-3.5" />
                  About this market
                </div>
                <p className="text-sm leading-relaxed text-[#8b9bb4]">
                  {event.description}
                </p>
              </div>
              <Separator className="mb-6 bg-[#222840]" />
            </>
          )}

          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">
              Markets
              <span className="ml-2 text-sm font-normal text-[#6b7a99]">
                ({event.markets?.length ?? 0})
              </span>
            </h2>
          </div>

          <EventDetailClient event={event} />
        </div>

        <div className="space-y-4">
          <div className="rounded-xl border border-[#222840] bg-[#161b27] p-4">
            <h3 className="mb-3 text-sm font-semibold text-white">
              Market Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-[#6b7a99]">Total Volume</span>
                <span className="font-semibold text-white">
                  {formatVolume(event.volume)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-[#6b7a99]">24h Volume</span>
                <span className="font-semibold text-[#16c784]">
                  +{formatVolume(event.volume24hr ?? 0)}
                </span>
              </div>
              {event.liquidity && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b7a99]">Liquidity</span>
                  <span className="font-semibold text-white">
                    {formatVolume(event.liquidity)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-[#6b7a99]">Markets</span>
                <span className="font-semibold text-white">
                  {event.markets?.length ?? 0}
                </span>
              </div>
              {endDate && (
                <div className="flex justify-between text-sm">
                  <span className="text-[#6b7a99]">Resolution</span>
                  <span className="font-semibold text-white">{endDate}</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-xl border border-[#222840] bg-[#161b27] p-4">
            <h3 className="mb-3 text-sm font-semibold text-white">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {event.tags?.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="bg-[#1e2535] text-[#8b9bb4] hover:bg-[#2a3352]"
                >
                  {tag.label}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
