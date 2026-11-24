"use client";

import { getSubcategoriesOnCategory, SubCategory } from "@/api/categories.api";
import { useQuery } from "@tanstack/react-query";

export function useSubcategories(categoryId: string) {
  return useQuery({
    queryKey: ["subcategories", categoryId],
    queryFn: async () => {
      if (!categoryId) return [];
      const res = await getSubcategoriesOnCategory(categoryId);
      return res.data;
    },
    enabled: !!categoryId,
  });
}
