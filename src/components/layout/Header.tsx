"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { href: "/", label: "Markets" },
  { href: "/crypto", label: "Crypto" },
  { href: "/sports", label: "Sports" },
  { href: "/politics", label: "Politics" },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-[#222840] bg-[#0d0f14]/95 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex h-14 items-center gap-6">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#5f6fff]">
              <TrendingUp className="h-4 w-4 text-white" />
            </div>
            <span className="text-base font-semibold text-white hidden sm:block">
              Polymarket
            </span>
          </Link>

          <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none">
            {NAV_LINKS.map(({ href, label }) => {
              const isActive =
                href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    "whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-[#1e2535] text-white"
                      : "text-[#8b9bb4] hover:bg-[#1e2535]/60 hover:text-white"
                  )}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-lg border border-[#222840] bg-[#1e2535]/50 px-3 py-1.5 text-sm text-[#8b9bb4] transition-colors hover:border-[#3d4f7c] hover:text-white">
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:block">Search markets</span>
            </button>
            <button className="rounded-lg bg-[#5f6fff] px-4 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90">
              Sign in
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
