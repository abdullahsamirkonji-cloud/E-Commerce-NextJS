"use client";

import { getUserWishlist } from "@/actions/wishlist.action";
import AddToCartBtn from "@/components/myComponents/AddToCartBtn";
import WishlistToggleBtn from "@/components/myComponents/WishlistToggleBtn";
import { useWishlist } from "@/context/WishlistContext";
import { Product } from "@/types/product.type";
import { Heart, Loader2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function WishlistPage() {
  const { wishlistIds } = useWishlist();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadWishlist() {
      try {
        setIsLoading(true);
        const res = await getUserWishlist();
        if (res.status === "success" && res.data?.data) {
          setProducts(res.data.data);
        }
      } catch (err) {
        console.error("Failed to load wishlist items:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadWishlist();
  }, [wishlistIds]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between border-b border-gray-100 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3.5 py-1 text-xs font-semibold text-red-600 mb-2">
            <Heart size={14} className="fill-red-600" /> Saved Favourites
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">My Wishlist</h1>
          <p className="mt-1 text-sm text-gray-500">
            {products.length} {products.length === 1 ? "item" : "items"} saved in your wishlist
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Loader2 className="animate-spin text-red-500 mb-3" size={32} />
          <p className="text-sm font-medium">Loading your wishlist...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="mx-auto max-w-md text-center py-16">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-400">
            <Heart size={36} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Your wishlist is empty</h2>
          <p className="mt-2 text-sm text-gray-500">
            Explore our catalog and click the heart icon on items you love to save them for later!
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-green-700"
          >
            <ShoppingBag size={18} />
            Explore Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const id = product._id || product.id;
            const hasDiscount = !!product.priceAfterDiscount && product.priceAfterDiscount < product.price;

            return (
              <div
                key={id}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-gray-200"
              >
                {/* Remove from wishlist button */}
                <div className="absolute top-3 right-3 z-10">
                  <WishlistToggleBtn productId={id} />
                </div>

                <Link href={`/products/${id}`} className="block">
                  <div className="relative h-56 w-full overflow-hidden rounded-xl bg-gray-50">
                    <Image
                      src={product.imageCover}
                      alt={product.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="mt-3">
                    <p className="text-xs font-semibold uppercase text-green-600">
                      {product.category?.name || "General"}
                    </p>
                    <h3 className="mt-1 font-bold text-gray-900 text-sm line-clamp-1 group-hover:text-green-600 transition-colors">
                      {product.title}
                    </h3>
                  </div>
                </Link>

                <div className="mt-4 flex items-center justify-between border-t border-gray-50 pt-3">
                  <div>
                    {hasDiscount ? (
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-base font-extrabold text-green-600">
                          {product.priceAfterDiscount} EGP
                        </span>
                        <span className="text-xs text-gray-400 line-through">
                          {product.price} EGP
                        </span>
                      </div>
                    ) : (
                      <span className="text-base font-extrabold text-gray-900">
                        {product.price} EGP
                      </span>
                    )}
                  </div>
                  <AddToCartBtn productId={id} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
