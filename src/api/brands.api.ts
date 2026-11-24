import { GetAllBrandsResponse, BrandDetailsResponse } from "@/types/brands.types";

export async function getAllBrands(): Promise<GetAllBrandsResponse> {
  const response = await fetch("https://ecommerce.routemisr.com/api/v1/brands", {
    cache: "force-cache",
    next: {
      revalidate: 120,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch brands");
  }

  const data: GetAllBrandsResponse = await response.json();
  return data;
}

export async function getBrandDetails(id: string): Promise<BrandDetailsResponse> {
  const response = await fetch(`https://ecommerce.routemisr.com/api/v1/brands/${id}`, {
    cache: "force-cache",
    next: {
      revalidate: 120,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch brand details");
  }

  const data: BrandDetailsResponse = await response.json();
  return data;
}
