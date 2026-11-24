import { getAllCategories } from "@/api/categories.api";
import FeaturedProducts from "@/components/myComponents/FeaturedProducts";
import {
  ArrowRight,
  Headphones,
  Layers,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default async function HomePage() {
  const categoriesRes = await getAllCategories().catch(() => ({ data: [] }));
  const topCategories = (categoriesRes?.data || []).slice(0, 6);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-green-500 via-green-600 to-emerald-700 text-white">
        <div className="container mx-auto px-4 py-16 sm:py-24 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 backdrop-blur-md px-4 py-1.5 text-xs font-semibold text-white mb-4">
            <Sparkles size={14} /> New Season Arrivals • Up to 40% Off
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight max-w-3xl leading-tight">
            Discover Quality Essentials for Everyday Living
          </h1>

          <p className="mt-4 text-sm sm:text-base text-green-100 max-w-xl">
            Explore authentic top-rated brands across electronics, fashion, and
            lifestyle with fast doorstep delivery across Egypt.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-green-700 shadow-lg transition-all duration-200 hover:bg-gray-100 hover:scale-105"
            >
              <ShoppingBag size={18} />
              Shop Catalog
            </Link>
            <Link
              href="/categories"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-white/40 bg-white/10 backdrop-blur-md px-8 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-white/20"
            >
              Browse Categories
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
      </section>

      {/* Trust & Guarantee Perks */}
      <section className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600">
              <Truck size={22} />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-gray-900">
                Fast Shipping
              </p>
              <p className="text-[11px] text-gray-500">
                Doorstep delivery across Egypt
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <RotateCcw size={22} />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-gray-900">
                Easy Returns
              </p>
              <p className="text-[11px] text-gray-500">
                14-day hassle-free policy
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <ShieldCheck size={22} />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-gray-900">
                100% Genuine
              </p>
              <p className="text-[11px] text-gray-500">
                Official authentic products
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
              <Headphones size={22} />
            </div>
            <div>
              <p className="font-bold text-xs sm:text-sm text-gray-900">
                24/7 Support
              </p>
              <p className="text-[11px] text-gray-500">
                Dedicated assistance anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Shop by Category Preview */}
      {topCategories.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 uppercase tracking-wider">
                <Layers size={13} /> Categories
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
                Shop By Category
              </h2>
            </div>

            <Link
              href="/categories"
              className="group flex items-center gap-1.5 text-xs sm:text-sm font-bold text-green-600 hover:text-green-700 transition-colors"
            >
              <span>All Categories</span>
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {topCategories.map((cat) => (
              <Link
                key={cat._id}
                href={`/categories/${cat._id}`}
                className="group flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-4 text-center shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-md"
              >
                <div className="relative h-20 w-20 overflow-hidden rounded-full bg-gray-50 p-2 transition-transform duration-300 group-hover:scale-110">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-3 text-xs font-bold text-gray-800 group-hover:text-green-600 transition-colors line-clamp-1">
                  {cat.name}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products Showcase */}
      <section className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-green-600 uppercase tracking-wider">
              <Sparkles size={13} /> Trending Now
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Featured Products
            </h2>
          </div>

          <Link
            href="/products"
            className="group flex items-center gap-1.5 text-xs sm:text-sm font-bold text-green-600 hover:text-green-700 transition-colors"
          >
            <span>View All</span>
            <ArrowRight
              size={16}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>

        <FeaturedProducts />
      </section>
    </div>
  );
}
