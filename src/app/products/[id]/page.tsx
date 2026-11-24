import { getProductDetails } from "@/api/product.api";
import AddToCartBtn from "@/components/myComponents/AddToCartBtn";
import ProductGallery from "@/components/myComponents/ProductGallery";
import ProductReviews from "@/components/myComponents/ProductReviews";
import WishlistToggleBtn from "@/components/myComponents/WishlistToggleBtn";
import { BadgeCheck, RotateCcw, Shield, Star, Truck } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

async function ProductDetails({ id }: { id: string }) {
  let responseDetails;
  try {
    responseDetails = await getProductDetails(id);
  } catch (err) {
    notFound();
  }

  const product = responseDetails?.data;
  if (!product) notFound();

  const {
    title,
    description,
    price,
    priceAfterDiscount,
    brand,
    category,
    ratingsAverage,
    ratingsQuantity,
    quantity,
    imageCover,
    images,
  } = product;

  const brandName = brand?.name;
  const categoryName = category?.name || "Catalog";
  const hasDiscount = !!priceAfterDiscount && priceAfterDiscount < price;
  const discountPercent = hasDiscount
    ? Math.round(((price - priceAfterDiscount) / price) * 100)
    : 0;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="mb-6 flex items-center gap-2 text-xs font-medium text-gray-500">
        <Link href="/" className="hover:text-green-600 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link
          href={`/products?category=${category?._id || ""}`}
          className="hover:text-green-600 transition-colors"
        >
          {categoryName}
        </Link>
        <span>/</span>
        <span className="text-gray-900 truncate max-w-xs">{title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Image Gallery */}
        <div className="lg:col-span-5">
          <ProductGallery
            images={images || []}
            title={title}
            imageCover={imageCover}
          />
        </div>

        {/* Right Column: Product Info & Actions */}
        <div className="lg:col-span-7 flex flex-col">
          {/* Header & Badges */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                {categoryName}
              </span>
              {brandName && (
                <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                  {brandName}
                </span>
              )}
            </div>
            <WishlistToggleBtn productId={id} size={22} className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-all" />
          </div>

          <h1 className="mt-3 text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight">
            {title}
          </h1>

          {/* Rating */}
          <div className="mt-3 flex items-center gap-3">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={18}
                  className={
                    index < Math.floor(ratingsAverage || 0)
                      ? "fill-amber-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-sm font-bold text-gray-900">
              {ratingsAverage?.toFixed(1) || "0.0"}
            </span>
            <span className="text-sm text-gray-400">
              ({ratingsQuantity || 0} customer reviews)
            </span>
          </div>

          {/* Price & Stock */}
          <div className="mt-6 rounded-2xl border border-gray-100 bg-gray-50/70 p-5">
            <div className="flex items-baseline gap-3">
              {hasDiscount ? (
                <>
                  <span className="text-3xl font-extrabold text-green-600">
                    {priceAfterDiscount} EGP
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    {price} EGP
                  </span>
                  <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-bold text-red-600">
                    Save {discountPercent}%
                  </span>
                </>
              ) : (
                <span className="text-3xl font-extrabold text-gray-900">
                  {price} EGP
                </span>
              )}
            </div>

            <p className="mt-2 text-xs font-semibold text-gray-600">
              Availability:{" "}
              {quantity > 0 ? (
                <span className="text-green-600 font-bold">In Stock ({quantity} items remaining)</span>
              ) : (
                <span className="text-red-500 font-bold">Out of Stock</span>
              )}
            </p>
          </div>

          {/* Description */}
          <div className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-gray-900">
              Description
            </h2>
            <p className="mt-2 text-sm text-gray-600 leading-relaxed whitespace-pre-line">
              {description}
            </p>
          </div>

          {/* Add to Cart Actions */}
          <div className="mt-8 flex items-center gap-4">
            <AddToCartBtn
              productId={id}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-green-600 px-8 py-3.5 text-base font-bold text-white shadow-md transition-all duration-200 hover:bg-green-700 hover:shadow-lg disabled:opacity-50"
            />
          </div>

          {/* Trust Guarantees */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-gray-100 pt-6">
            <div className="flex items-center gap-3">
              <Truck size={20} className="text-green-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-900">Fast Delivery</p>
                <p className="text-[11px] text-gray-500">Free on eligible orders</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <RotateCcw size={20} className="text-green-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-900">Easy Returns</p>
                <p className="text-[11px] text-gray-500">14-day replacement</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Shield size={20} className="text-green-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-900">100% Genuine</p>
                <p className="text-[11px] text-gray-500">Official distributor</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <ProductReviews productId={id} />
    </div>
  );
}

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-20 text-center text-gray-500">
          Loading product details...
        </div>
      }
    >
      <ProductDetails id={id} />
    </Suspense>
  );
}
