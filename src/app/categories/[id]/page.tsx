import { getCategoryDetails, getSubcategoriesOnCategory } from "@/api/categories.api";
import { getAllProducts } from "@/api/product.api";
import ProductCard from "@/components/myComponents/ProductCard";
import { ArrowLeft, Layers, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function CategoryDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [categoryRes, subcategoriesRes, productsRes] = await Promise.all([
    getCategoryDetails(id).catch(() => null),
    getSubcategoriesOnCategory(id).catch(() => ({ data: [] })),
    getAllProducts({ category: id, limit: 40 }).catch(() => ({ data: [] })),
  ]);

  if (!categoryRes?.data) {
    notFound();
  }

  const category = categoryRes.data;
  const subcategories = subcategoriesRes?.data || [];
  const products = productsRes?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-gray-500">
        <Link href="/" className="hover:text-green-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/categories" className="hover:text-green-600 transition-colors">
          Categories
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-bold">{category.name}</span>
      </nav>

      {/* Category Hero Banner */}
      <div className="relative mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row items-center justify-between p-6 sm:p-8 gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 mb-2">
              <Layers size={13} /> Category Collection
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900">
              {category.name}
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Explore {products.length} {products.length === 1 ? "product" : "products"} available in this department.
            </p>
          </div>

          <div className="relative h-32 w-32 sm:h-40 sm:w-40 shrink-0 overflow-hidden rounded-2xl border border-gray-100 bg-gray-50">
            <Image
              src={category.image}
              alt={category.name}
              fill
              sizes="160px"
              className="object-contain p-2"
            />
          </div>
        </div>

        {/* Subcategories Chips Bar */}
        {subcategories.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50/60 px-6 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2">
              Popular Subcategories:
            </p>
            <div className="flex flex-wrap gap-2">
              {subcategories.map((sub) => (
                <span
                  key={sub._id}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-1 text-xs font-semibold text-gray-700 shadow-xs"
                >
                  {sub.name}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <ShoppingBag size={28} />
          </div>
          <h2 className="text-lg font-bold text-gray-900">No products found in this category</h2>
          <p className="mt-1 text-xs text-gray-500">
            Check back soon or browse our other categories!
          </p>
          <Link
            href="/categories"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-green-700"
          >
            <ArrowLeft size={14} /> Back to Categories
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
