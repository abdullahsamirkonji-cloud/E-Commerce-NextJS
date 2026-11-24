"use client";
import { addProductToCart } from "@/actions/cart.action";
import { Loader2, Plus } from "lucide-react";
import { toast } from "../ui/toast";
import { useContext, useState } from "react";
import { CartContext } from "@/context/CartContext";

export default function AddToCartBtn({
  productId,
  className,
}: {
  productId: string;
  className?: string;
}) {
  const { setNumOfCartItems } = useContext(CartContext);
  const [isLoading, setIsLoading] = useState(false);

  async function handleAddToCart(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      setIsLoading(true);
      const response = await addProductToCart(productId);
      if (response && response.status === "success" && response.responseData) {
        toast.add({
          type: "success",
          description: response.responseData.message || "Product added to cart",
        });
        setNumOfCartItems(response.responseData.numOfCartItems);
      } else {
        toast.add({
          type: "error",
          description: response?.message || "Failed to add product to cart",
          priority: "high",
        });
      }
    } catch {
      toast.add({
        type: "error",
        description: "Failed to add product to cart",
        priority: "high",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={isLoading}
      aria-label="Add to cart"
      className={
        className ??
        "bg-green-500 w-10 h-10 rounded-full flex justify-center items-center hover:bg-green-600 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
      }
    >
      {isLoading ? (
        <Loader2 className="animate-spin text-white" size={18} />
      ) : (
        <Plus color="white" size={20} />
      )}
    </button>
  );
}
