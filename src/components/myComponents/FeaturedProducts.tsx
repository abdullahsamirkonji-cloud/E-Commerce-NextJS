import { getAllProducts } from "@/api/product.api";
import ProductCard from "./ProductCard";

export default async function FeaturedProducts() {
  const response = await getAllProducts();
  console.log(response.data);
  return (
    <div className="container mx-auto">
      <div className="grid gap-3 grid-cols-1 md:grid-cols-3 lg:grid-cols-5 ">
        {response.data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
