"use server";

import { getAuthHeaders } from "@/lib/auth-token";
import { revalidatePath } from "next/cache";

export interface AddressData {
  name: string;
  details: string;
  phone: string;
  city: string;
}

export async function getUserAddresses() {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      return { status: "fail", message: "User not authenticated", data: [] };
    }

    const response = await fetch("https://ecommerce.routemisr.com/api/v1/addresses", {
      method: "GET",
      headers: authHeaders,
      cache: "no-store",
    });

    const data = await response.json();
    if (response.ok && data.status === "success") {
      return { status: "success", data: data.data || [] };
    }
    return { status: "fail", message: data.message || "Failed to fetch addresses", data: [] };
  } catch (err) {
    console.error("Error fetching addresses:", err);
    return { status: "fail", message: "Error fetching addresses", data: [] };
  }
}

export async function addUserAddress(address: AddressData) {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      return { status: "fail", message: "User not authenticated" };
    }

    const response = await fetch("https://ecommerce.routemisr.com/api/v1/addresses", {
      method: "POST",
      body: JSON.stringify(address),
      headers: authHeaders,
    });

    const data = await response.json();
    if (response.ok && data.status === "success") {
      revalidatePath("/profile");
      return { status: "success", message: "Address added successfully", data: data.data };
    }
    return { status: "fail", message: data.message || "Failed to add address" };
  } catch (err) {
    console.error("Error adding address:", err);
    return { status: "fail", message: "Error adding address" };
  }
}

export async function removeUserAddress(addressId: string) {
  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) {
      return { status: "fail", message: "User not authenticated" };
    }

    const response = await fetch(`https://ecommerce.routemisr.com/api/v1/addresses/${addressId}`, {
      method: "DELETE",
      headers: authHeaders,
    });

    const data = await response.json();
    if (response.ok && data.status === "success") {
      revalidatePath("/profile");
      return { status: "success", message: "Address removed successfully", data: data.data };
    }
    return { status: "fail", message: data.message || "Failed to remove address" };
  } catch (err) {
    console.error("Error removing address:", err);
    return { status: "fail", message: "Error removing address" };
  }
}
