"use client";

import { useWishlist } from "@/context/WishlistContext";
import { Heart, Loader2 } from "lucide-react";
import React, { useState } from "react";

export default function WishlistToggleBtn({
  productId,
  className,
  size = 20,
}: {
  productId: string;
  className?: string;
  size?: number;
}) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isBusy, setIsBusy] = useState(false);
  const active = isInWishlist(productId);

  async function handleToggle(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsBusy(true);
      await toggleWishlist(productId);
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isBusy}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
      className={
        className ??
        `flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 ${
          active
            ? "bg-red-50 text-red-500 hover:bg-red-100"
            : "bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500"
        }`
      }
    >
      {isBusy ? (
        <Loader2 size={size - 2} className="animate-spin" />
      ) : (
        <Heart
          size={size}
          className={`transition-transform duration-200 ${active ? "fill-red-500 scale-110" : ""}`}
        />
      )}
    </button>
  );
}
