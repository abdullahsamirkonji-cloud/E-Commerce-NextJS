import { getBrandDetails } from "@/api/brands.api";
import { getAllProducts } from "@/api/product.api";
import ProductCard from "@/components/myComponents/ProductCard";
import { ArrowLeft, Sparkles, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function BrandDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [brandRes, productsRes] = await Promise.all([
    getBrandDetails(id).catch(() => null),
    getAllProducts({ brand: id, limit: 40 }).catch(() => ({ data: [] })),
  ]);

  if (!brandRes?.data) {
    notFound();
  }

  const brand = brandRes.data;
  const products = productsRes?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-gray-500">
        <Link href="/" className="hover:text-green-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/brands" className="hover:text-green-600 transition-colors">
          Brands
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-bold">{brand.name}</span>
      </nav>

      {/* Brand Hero Banner */}
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="max-w-xl text-center sm:text-left">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 mb-2">
              <Sparkles size={13} /> Official Brand Store
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
              {brand.name}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Browse authentic {brand.name} items with manufacturer warranty and fast delivery.
            </p>
          </div>

          <div className="relative h-28 w-28 sm:h-36 sm:w-36 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50 p-3">
            <Image
              src={brand.image}
              alt={brand.name}
              fill
              sizes="144px"
              className="object-contain p-2"
            />
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <ShoppingBag size={28} />
          </div>
          <h2 className="text-lg font-bold text-gray-900">No products available for this brand</h2>
          <p className="mt-1 text-xs text-gray-500">
            Check back soon for new arrivals from {brand.name}!
          </p>
          <Link
            href="/brands"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-green-700"
          >
            <ArrowLeft size={14} /> Back to Brands
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id || product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
