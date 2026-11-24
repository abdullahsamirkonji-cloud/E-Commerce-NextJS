import type { GetAllCategoriesResponse, Category } from "@/types/categories.types";

export interface SubCategory {
  _id: string;
  name: string;
  slug: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetSubcategoriesResponse {
  results: number;
  data: SubCategory[];
}

export async function getAllCategories(): Promise<GetAllCategoriesResponse> {
  const response = await fetch(
    "https://ecommerce.routemisr.com/api/v1/categories",
    {
      cache: "force-cache",
      next: {
        revalidate: 120,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  const data: GetAllCategoriesResponse = await response.json();
  return data;
}

export async function getCategoryDetails(id: string): Promise<{ data: Category }> {
  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/categories/${id}`,
    {
      cache: "force-cache",
      next: {
        revalidate: 120,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch category details");
  }

  const data = await response.json();
  return data;
}

export async function getSubcategoriesOnCategory(
  categoryId: string,
): Promise<GetSubcategoriesResponse> {
  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/categories/${categoryId}/subcategories`,
    {
      cache: "force-cache",
      next: {
        revalidate: 120,
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to fetch subcategories");
  }

  const data = await response.json();
  return data;
}
