import { getAllBrands } from "@/api/brands.api";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Brands | ShopZone",
  description: "Explore top brands available on ShopZone",
};

export default async function BrandsPage() {
  const response = await getAllBrands();
  const brands = response.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-4 py-1.5 text-xs font-semibold text-green-700 mb-2">
          <Sparkles size={14} /> Official Brand Partners
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Featured Brands</h1>
        <p className="mt-2 text-sm text-gray-500 max-w-xl">
          Browse products from world-class manufacturers and authentic trusted brands.
        </p>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
        {brands.map((brand) => (
          <Link
            key={brand._id}
            href={`/brands/${brand._id}`}
            className="group relative flex flex-col items-center justify-center rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-md"
          >
            <div className="relative h-24 w-full flex items-center justify-center">
              <Image
                src={brand.image}
                alt={brand.name}
                fill
                sizes="(max-width: 768px) 50vw, 20vw"
                className="object-contain transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <h2 className="mt-4 text-center text-sm font-bold text-gray-800 transition-colors group-hover:text-green-600">
              {brand.name}
            </h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
