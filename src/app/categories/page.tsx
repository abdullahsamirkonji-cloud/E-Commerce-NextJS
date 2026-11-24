"use client";

import { useCategories } from "@/hooks/useCategories";
import Image from "next/image";
import Link from "next/link";
import { Layers, Loader2 } from "lucide-react";

export default function CategoriesPage() {
  const { categories, isLoading, error } = useCategories();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center text-gray-500">
        <Loader2 className="animate-spin mb-3 text-green-600" size={32} />
        <p className="text-sm font-medium">Loading categories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mx-auto mb-4 max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-red-600">
          <p className="font-semibold">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-1.5 text-xs font-semibold text-green-700 mb-2">
          <Layers size={14} /> Catalog Categories
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">All Categories</h1>
        <p className="mt-2 text-sm text-gray-500 max-w-xl">
          Discover thousands of items tailored to your everyday lifestyle and electronics needs.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories.map((category) => (
          <Link
            key={category._id}
            href={`/categories/${category._id}`}
            className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
          >
            <div className="relative h-48 w-full overflow-hidden bg-gray-50">
              <Image
                src={category.image}
                alt={category.name}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-108"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
              <h2 className="absolute bottom-3 left-4 right-4 text-center font-bold text-white text-base drop-shadow-sm transition-transform duration-300 group-hover:translate-y-[-2px]">
                {category.name}
              </h2>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
