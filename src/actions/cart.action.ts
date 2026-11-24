"use server";

import { getAuthHeaders } from "@/lib/auth-token";
import { AddToCartResponse } from "@/types/cart.type";
import { revalidatePath } from "next/cache";

export async function addProductToCart(productId: string) {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      return { status: "fail", message: "Please sign in to add products to your cart" };
    }

    const response = await fetch("https://ecommerce.routemisr.com/api/v2/cart", {
      method: "POST",
      body: JSON.stringify({ productId }),
      headers: authHeaders,
    });

    const data: AddToCartResponse = await response.json();
    if (response.ok && data.status === "success") {
      revalidatePath("/cart");
      return { status: "success", responseData: data };
    }
    return { status: "fail", responseData: data, message: data.message || "Failed to add to cart" };
  } catch {
    return { status: "fail", message: "Failed to add product to cart. Please try again." };
  }
}

export async function getLoggedInUserCart() {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      return { status: "fail", message: "User not authenticated" };
    }

    const response = await fetch("https://ecommerce.routemisr.com/api/v2/cart", {
      method: "GET",
      headers: authHeaders,
      cache: "no-store",
    });

    const data: AddToCartResponse = await response.json();
    if (response.ok && data.status === "success") {
      return {
        status: "success",
        message: "Cart retrieved successfully",
        data,
      };
    }
    return {
      status: "fail",
      data,
      message: data.message || "Failed to retrieve cart",
    };
  } catch (err) {
    return {
      status: "fail",
      message: "Failed to retrieve cart",
      err,
    };
  }
}

export async function deleteProductFromCart(productId: string) {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      return { status: "fail", message: "User not authenticated" };
    }

    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v2/cart/${productId}`,
      {
        method: "DELETE",
        headers: authHeaders,
      },
    );

    const data: AddToCartResponse = await response.json();
    if (response.ok && data.status === "success") {
      revalidatePath("/cart");
      return { status: "success", responseData: data };
    }
    return { status: "fail", responseData: data, message: data.message || "Failed to delete item" };
  } catch {
    return { status: "fail", message: "Failed to delete item from cart" };
  }
}

export async function updateProductCount(productId: string, count: number) {
  try {
    if (count < 1) {
      return deleteProductFromCart(productId);
    }

    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      return { status: "fail", message: "User not authenticated" };
    }

    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v2/cart/${productId}`,
      {
        method: "PUT",
        body: JSON.stringify({ count }),
        headers: authHeaders,
      },
    );

    const data: AddToCartResponse = await response.json();
    if (response.ok && data.status === "success") {
      revalidatePath("/cart");
      return { status: "success", responseData: data };
    }
    return { status: "fail", responseData: data, message: data.message || "Failed to update quantity" };
  } catch {
    return { status: "fail", message: "Failed to update item quantity" };
  }
}

export async function clearCart() {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      return { status: "fail", message: "User not authenticated" };
    }

    const response = await fetch("https://ecommerce.routemisr.com/api/v2/cart", {
      method: "DELETE",
      headers: authHeaders,
    });

    const data: AddToCartResponse = await response.json();
    if (response.ok && data.status === "success") {
      revalidatePath("/cart");
      return { status: "success", message: "Cart cleared successfully", data };
    }
    return { status: "fail", responseData: data, message: data.message || "Failed to clear cart" };
  } catch {
    return { status: "fail", message: "Failed to clear cart" };
  }
}

export async function applyCoupon(couponName: string) {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      return { status: "fail", message: "User not authenticated" };
    }

    const response = await fetch(
      "https://ecommerce.routemisr.com/api/v2/cart/applyCoupon",
      {
        method: "PUT",
        body: JSON.stringify({ couponName }),
        headers: authHeaders,
      },
    );

    const data = await response.json();
    if (response.ok && data.status === "success") {
      revalidatePath("/cart");
      return { status: "success", message: "Coupon applied successfully!", data };
    }
    return {
      status: "fail",
      message: data.message || "Invalid or expired coupon code",
      data,
    };
  } catch {
    return {
      status: "fail",
      message: "Failed to apply coupon. Please try again.",
    };
  }
}
