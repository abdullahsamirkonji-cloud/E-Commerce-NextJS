import { Card } from "../ui/card";
import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";
import { Product } from "@/types/product.type";
import AddToCartBtn from "./AddToCartBtn";
import WishlistToggleBtn from "./WishlistToggleBtn";

export default function ProductCard({ product }: { product: Product }) {
  const {
    category,
    description,
    imageCover,
    price,
    priceAfterDiscount,
    title,
    ratingsAverage,
    id,
  } = product;

  const categoryName = category?.name || "General";
  const hasDiscount = !!priceAfterDiscount && priceAfterDiscount < price;
  const discountPercent = hasDiscount
    ? Math.round(((price - priceAfterDiscount) / price) * 100)
    : 0;

  return (
    <Card className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg">
      {/* Top Badges */}
      <div className="absolute top-3 left-3 right-3 z-10 flex items-center justify-between pointer-events-none">
        {hasDiscount ? (
          <span className="pointer-events-auto rounded-full bg-red-500 px-2.5 py-0.5 text-xs font-bold text-white shadow-sm">
            -{discountPercent}%
          </span>
        ) : (
          <span />
        )}
        <div className="pointer-events-auto">
          <WishlistToggleBtn productId={id} />
        </div>
      </div>

      <Link href={`/products/${id}`} className="block">
        <div className="relative h-60 w-full overflow-hidden rounded-xl bg-gray-50">
          <Image
            className="object-contain p-2 transition-transform duration-500 group-hover:scale-108"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 20vw"
            alt={title}
            src={imageCover}
          />
        </div>
        <div className="mt-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-green-600">
            {categoryName}
          </p>
          <h3 className="mt-1 font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-green-600 transition-colors">
            {title}
          </h3>
          <p className="mt-1 text-xs text-gray-500 line-clamp-2">
            {description}
          </p>
          <div className="mt-2 flex items-center gap-1.5">
            <div className="flex text-amber-400">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star
                  key={index}
                  size={14}
                  className={
                    index < Math.floor(ratingsAverage || 0)
                      ? "fill-amber-400"
                      : "text-gray-300"
                  }
                />
              ))}
            </div>
            <span className="text-xs font-semibold text-gray-700">
              {ratingsAverage?.toFixed(1) || "0.0"}
            </span>
          </div>
        </div>
      </Link>

      <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3">
        <div className="flex flex-col">
          {hasDiscount ? (
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-green-600">
                {priceAfterDiscount} EGP
              </span>
              <span className="text-xs text-gray-400 line-through">
                {price} EGP
              </span>
            </div>
          ) : (
            <span className="text-lg font-extrabold text-gray-900">
              {price} EGP
            </span>
          )}
        </div>
        <AddToCartBtn productId={id} />
      </div>
    </Card>
  );
}
