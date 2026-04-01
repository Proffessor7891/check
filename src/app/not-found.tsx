import Link from "next/link";
import { TrendingUp } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center py-24 text-center">
      <TrendingUp className="mb-4 h-12 w-12 text-[#5f6fff]" />
      <h1 className="text-2xl font-bold text-white">Market not found</h1>
      <p className="mt-2 text-[#8b9bb4]">
        This market may have been closed or doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-[#5f6fff] px-5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
      >
        Browse Markets
      </Link>
    </div>
  );
}
