import {
  GetAllProductsResponse,
  ProductDetailsResponse,
} from "@/types/product.type";

export interface ProductQueryParams {
  page?: number | string;
  limit?: number | string;
  sort?: string;
  category?: string;
  brand?: string;
  keyword?: string;
  priceGte?: number | string;
  priceLte?: number | string;
}

export async function getAllProducts(
  params?: ProductQueryParams,
): Promise<GetAllProductsResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.sort) query.set("sort", params.sort);
  if (params?.category) query.set("category[in]", params.category);
  if (params?.brand) query.set("brand", params.brand);
  if (params?.keyword) query.set("keyword", params.keyword);
  if (params?.priceGte) query.set("price[gte]", String(params.priceGte));
  if (params?.priceLte) query.set("price[lte]", String(params.priceLte));

  const queryString = query.toString();
  const url = `https://ecommerce.routemisr.com/api/v1/products${queryString ? `?${queryString}` : ""}`;

  const response = await fetch(url, {
    cache: "no-store",
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error("Failed To Fetch Data");
  }

  // Fallback title filter in case the backend returns unfiltered results for some keywords
  if (params?.keyword && Array.isArray(data.data)) {
    const kw = params.keyword.toLowerCase();
    const filtered = data.data.filter(
      (p: { title?: string; description?: string }) =>
        p.title?.toLowerCase().includes(kw) ||
        p.description?.toLowerCase().includes(kw),
    );
    if (filtered.length > 0) {
      data.data = filtered;
    }
  }

  return data;
}

export async function getProductDetails(
  id: string,
): Promise<ProductDetailsResponse> {
  const response = await fetch(
    `https://ecommerce.routemisr.com/api/v1/products/${id}`,
    {
      cache: "force-cache",
      next: {
        revalidate:60
      }
    },
  );
  if (!response.ok) {
    throw new Error("Failed To Fetch Data");
  }
  const data = await response.json();
  return data;
}
