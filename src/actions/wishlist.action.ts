"use server";

import { getAuthHeaders } from "@/lib/auth-token";
import { revalidatePath } from "next/cache";
import { WishlistMutationResponse, WishlistResponse } from "@/types/wishlist.type";

export async function getUserWishlist(): Promise<{
  status: string;
  data?: WishlistResponse;
  message?: string;
}> {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      return { status: "fail", message: "Unauthenticated" };
    }

    const response = await fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
      method: "GET",
      headers: authHeaders,
      cache: "no-store",
    });

    const data: WishlistResponse = await response.json();
    if (response.ok && data.status === "success") {
      return { status: "success", data };
    }
    return { status: "fail", message: "Failed to fetch wishlist" };
  } catch (err) {
    console.error("Error fetching wishlist:", err);
    return { status: "fail", message: "Error fetching wishlist" };
  }
}

export async function addProductToWishlist(productId: string): Promise<{
  status: string;
  data?: WishlistMutationResponse;
  message?: string;
}> {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      return { status: "fail", message: "Please sign in to add to wishlist" };
    }

    const response = await fetch("https://ecommerce.routemisr.com/api/v1/wishlist", {
      method: "POST",
      body: JSON.stringify({ productId }),
      headers: authHeaders,
    });

    const data: WishlistMutationResponse = await response.json();
    if (response.ok && data.status === "success") {
      revalidatePath("/wishlist");
      return { status: "success", data, message: data.message };
    }
    return { status: "fail", message: data.message || "Failed to add to wishlist" };
  } catch (err) {
    console.error("Error adding to wishlist:", err);
    return { status: "fail", message: "Error adding to wishlist" };
  }
}

export async function removeProductFromWishlist(productId: string): Promise<{
  status: string;
  data?: WishlistMutationResponse;
  message?: string;
}> {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      return { status: "fail", message: "Unauthenticated" };
    }

    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/wishlist/${productId}`, {
      method: "DELETE",
      headers: authHeaders,
    });

    const data: WishlistMutationResponse = await response.json();
    if (response.ok && data.status === "success") {
      revalidatePath("/wishlist");
      return { status: "success", data, message: data.message };
    }
    return { status: "fail", message: data.message || "Failed to remove from wishlist" };
  } catch (err) {
    console.error("Error removing from wishlist:", err);
    return { status: "fail", message: "Error removing from wishlist" };
  }
}
