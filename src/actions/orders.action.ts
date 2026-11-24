"use server";

import { getAuthHeaders } from "@/lib/auth-token";
import { headers } from "next/headers";

export interface ShippingAddress {
  details: string;
  phone: string;
  city: string;
}

export async function cashOrder(cartId: string, shippingAddress: ShippingAddress) {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      return { status: "fail", message: "User not authenticated" };
    }

    // ⚠️ Postman "Create Cash Order From Cart (v2)" specifies /api/v2/orders/:cartId
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v2/orders/${cartId}`,
      {
        method: "POST",
        body: JSON.stringify({ shippingAddress }),
        headers: authHeaders,
      },
    );

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error creating cash order:", err);
    return { status: "fail", message: "Failed to create cash order" };
  }
}

export async function createCheckoutSession(
  cartId: string,
  shippingAddress: ShippingAddress,
  origin?: string,
) {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      return { status: "fail", message: "User not authenticated" };
    }

    const returnUrl = origin || "http://localhost:3000";
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cartId}?url=${returnUrl}`,
      {
        method: "POST",
        body: JSON.stringify({ shippingAddress }),
        headers: authHeaders,
      },
    );

    const data = await response.json();
    return data;
  } catch (err) {
    console.error("Error creating checkout session:", err);
    return { status: "fail", message: "Failed to create online payment session" };
  }
}

export async function getUserOrders(userId: string) {
  try {
    const response = await fetch(
      `https://ecommerce.routemisr.com/api/v1/orders/user/${userId}`,
      {
        cache: "no-store",
      },
    );
    if (!response.ok) {
      return { status: "fail", data: [] };
    }
    const data = await response.json();
    return { status: "success", data };
  } catch (err) {
    console.error("Error fetching user orders:", err);
    return { status: "fail", data: [] };
  }
}
