import { getAllBrands } from "@/api/brands.api";
import { getAllCategories } from "@/api/categories.api";
import { getAllProducts } from "@/api/product.api";
import ProductCard from "@/components/myComponents/ProductCard";
import { Filter, RotateCcw, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

export const metadata = {
  title: "Shop All Products | ShopZone",
  description: "Browse and filter our catalog of electronics, fashion, and home goods.",
};

interface SearchParamsProps {
  searchParams: Promise<{
    category?: string;
    brand?: string;
    sort?: string;
    page?: string;
    keyword?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: SearchParamsProps) {
  const resolvedParams = await searchParams;
  const currentCategory = resolvedParams.category;
  const currentBrand = resolvedParams.brand;
  const currentSort = resolvedParams.sort || "";
  const currentPage = Number(resolvedParams.page) || 1;
  const currentKeyword = resolvedParams.keyword || "";

  // Fetch products, categories and brands in parallel
  const [productsRes, categoriesRes, brandsRes] = await Promise.all([
    getAllProducts({
      category: currentCategory,
      brand: currentBrand,
      sort: currentSort,
      page: currentPage,
      limit: 20,
      keyword: currentKeyword,
    }),
    getAllCategories().catch(() => ({ data: [] })),
    getAllBrands().catch(() => ({ data: [] })),
  ]);

  const products = productsRes?.data || [];
  const categories = categoriesRes?.data || [];
  const brands = brandsRes?.data || [];
  const totalPages = productsRes?.metadata?.numberOfPages || 1;

  // Active filter names
  const activeCategoryObj = categories.find((c) => c._id === currentCategory);
  const activeBrandObj = brands.find((b) => b._id === currentBrand);
  const hasActiveFilters = !!(currentCategory || currentBrand || currentSort || currentKeyword);

  function createFilterUrl(updates: {
    category?: string | null;
    brand?: string | null;
    sort?: string | null;
    page?: string | null;
    keyword?: string | null;
  }) {
    const params = new URLSearchParams();
    const cat = updates.category !== undefined ? updates.category : currentCategory;
    const br = updates.brand !== undefined ? updates.brand : currentBrand;
    const so = updates.sort !== undefined ? updates.sort : currentSort;
    const pg = updates.page !== undefined ? updates.page : null;
    const kw = updates.keyword !== undefined ? updates.keyword : currentKeyword;

    if (cat) params.set("category", cat);
    if (br) params.set("brand", br);
    if (so) params.set("sort", so);
    if (pg && pg !== "1") params.set("page", pg);
    if (kw) params.set("keyword", kw);

    const qs = params.toString();
    return `/products${qs ? `?${qs}` : ""}`;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top Banner / Breadcrumb */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900">All Products</h1>
          <p className="mt-1 text-sm text-gray-500">
            Showing {products.length} {products.length === 1 ? "item" : "items"}
            {activeCategoryObj && ` in ${activeCategoryObj.name}`}
            {activeBrandObj && ` by ${activeBrandObj.name}`}
            {currentKeyword && ` for "${currentKeyword}"`}
          </p>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-gray-500 shrink-0">Sort By:</span>
          <div className="flex flex-wrap gap-1.5">
            {[
              { label: "Featured", value: "" },
              { label: "Price: Low to High", value: "price" },
              { label: "Price: High to Low", value: "-price" },
              { label: "Top Rated", value: "-ratingsAverage" },
            ].map((option) => (
              <Link
                key={option.label}
                href={createFilterUrl({ sort: option.value || null, page: "1" })}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  currentSort === option.value
                    ? "bg-green-600 text-white shadow-sm"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {option.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-3 space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center gap-2 font-bold text-gray-900 text-sm">
                <SlidersHorizontal size={16} className="text-green-600" />
                <span>Filters</span>
              </div>
              {hasActiveFilters && (
                <Link
                  href="/products"
                  className="flex items-center gap-1 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                >
                  <RotateCcw size={12} /> Reset
                </Link>
              )}
            </div>

            {/* Filter by Category */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Category
              </h3>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                <Link
                  href={createFilterUrl({ category: null, page: "1" })}
                  className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    !currentCategory
                      ? "bg-green-50 text-green-700 font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  All Categories
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={createFilterUrl({ category: cat._id, page: "1" })}
                    className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      currentCategory === cat._id
                        ? "bg-green-50 text-green-700 font-bold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {/* Filter by Brand */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Brand
              </h3>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                <Link
                  href={createFilterUrl({ brand: null, page: "1" })}
                  className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    !currentBrand
                      ? "bg-green-50 text-green-700 font-bold"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  All Brands
                </Link>
                {brands.map((brand) => (
                  <Link
                    key={brand._id}
                    href={createFilterUrl({ brand: brand._id, page: "1" })}
                    className={`block px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      currentBrand === brand._id
                        ? "bg-green-50 text-green-700 font-bold"
                        : "text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {brand.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-9">
          {products.length === 0 ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
                <Search size={28} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">No products match your criteria</h3>
              <p className="mt-1 text-sm text-gray-500 max-w-sm mx-auto">
                Try loosening your filters or searching for another keyword to discover more items.
              </p>
              <Link
                href="/products"
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-xs font-semibold text-white transition-all hover:bg-green-700"
              >
                <RotateCcw size={14} /> Clear all filters
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {products.map((product) => (
                  <ProductCard key={product.id || product._id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2 border-t border-gray-100 pt-6">
                  {currentPage > 1 && (
                    <Link
                      href={createFilterUrl({ page: String(currentPage - 1) })}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      ← Previous
                    </Link>
                  )}

                  <span className="px-4 py-2 text-xs font-bold text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>

                  {currentPage < totalPages && (
                    <Link
                      href={createFilterUrl({ page: String(currentPage + 1) })}
                      className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Next →
                    </Link>
                  )}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
}
