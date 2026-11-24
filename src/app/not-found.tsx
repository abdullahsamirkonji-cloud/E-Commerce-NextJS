import { ArrowLeft, Home, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-160px)] items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center">
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-3xl bg-green-50 text-green-600 shadow-inner">
          <span className="text-4xl font-extrabold">404</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
          Page Not Found
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          Oops! The page you were looking for doesn&apos;t exist or might have been moved.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-green-700"
          >
            <Home size={18} />
            Back to Home
          </Link>
          <Link
            href="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 font-semibold text-gray-700 shadow-sm transition-all hover:bg-gray-50"
          >
            <ShoppingBag size={18} />
            Browse Catalog
          </Link>
        </div>
      </div>
    </div>
  );
}
