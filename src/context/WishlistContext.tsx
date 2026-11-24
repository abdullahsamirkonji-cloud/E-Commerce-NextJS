"use client";

import {
  addProductToWishlist,
  getUserWishlist,
  removeProductFromWishlist,
} from "@/actions/wishlist.action";
import { toast } from "@/components/ui/toast";
import { useSession } from "next-auth/react";
import React, { createContext, useContext, useEffect, useState } from "react";

interface WishlistContextType {
  wishlistIds: string[];
  wishlistCount: number;
  isInWishlist: (productId: string) => boolean;
  toggleWishlist: (productId: string) => Promise<boolean>;
  refreshWishlist: () => Promise<void>;
  isLoading: boolean;
}

export const WishlistContext = createContext<WishlistContextType>({
  wishlistIds: [],
  wishlistCount: 0,
  isInWishlist: () => false,
  toggleWishlist: async () => false,
  refreshWishlist: async () => {},
  isLoading: false,
});

export default function WishlistContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchWishlist() {
    if (status !== "authenticated") {
      setWishlistIds([]);
      return;
    }
    try {
      setIsLoading(true);
      const res = await getUserWishlist();
      if (res.status === "success" && res.data?.data) {
        setWishlistIds(res.data.data.map((item) => item._id || item.id));
      }
    } catch (e) {
      console.error("Error loading wishlist IDs:", e);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchWishlist();
  }, [status]);

  function isInWishlist(productId: string) {
    return wishlistIds.includes(productId);
  }

  async function toggleWishlist(productId: string): Promise<boolean> {
    if (status !== "authenticated") {
      toast.add({
        type: "warning",
        description: "Please sign in to add items to your wishlist.",
      });
      return false;
    }

    const currentlyInWishlist = isInWishlist(productId);

    // Optimistic update
    setWishlistIds((prev) =>
      currentlyInWishlist
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );

    try {
      if (currentlyInWishlist) {
        const res = await removeProductFromWishlist(productId);
        if (res.status === "success") {
          toast.add({
            type: "info",
            description: "Removed from wishlist",
          });
          if (res.data?.data) setWishlistIds(res.data.data);
          return true;
        } else {
          // Rollback
          setWishlistIds((prev) => [...prev, productId]);
          toast.add({ type: "error", description: res.message || "Failed to remove" });
          return false;
        }
      } else {
        const res = await addProductToWishlist(productId);
        if (res.status === "success") {
          toast.add({
            type: "success",
            description: "Added to wishlist!",
          });
          if (res.data?.data) setWishlistIds(res.data.data);
          return true;
        } else {
          // Rollback
          setWishlistIds((prev) => prev.filter((id) => id !== productId));
          toast.add({ type: "error", description: res.message || "Failed to add" });
          return false;
        }
      }
    } catch {
      // Rollback on crash
      setWishlistIds((prev) =>
        currentlyInWishlist ? [...prev, productId] : prev.filter((id) => id !== productId),
      );
      toast.add({ type: "error", description: "Something went wrong" });
      return false;
    }
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistCount: wishlistIds.length,
        isInWishlist,
        toggleWishlist,
        refreshWishlist: fetchWishlist,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
