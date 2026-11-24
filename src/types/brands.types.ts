export interface Brand {
  _id: string;
  name: string;
  slug: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

export interface BrandsMetadata {
  currentPage: number;
  numberOfPages: number;
  limit: number;
  nextPage?: number;
}

export interface GetAllBrandsResponse {
  results: number;
  metadata: BrandsMetadata;
  data: Brand[];
}

export interface BrandDetailsResponse {
  data: Brand;
}
