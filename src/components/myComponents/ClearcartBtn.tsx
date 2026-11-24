"use client";

import { clearCart } from "@/actions/cart.action";
import { useContext, useState } from "react";
import { CartContext } from "@/context/CartContext";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "../ui/toast";

export default function ClearcartBtn() {
  const { setNumOfCartItems } = useContext(CartContext);
  const [isClearing, setIsClearing] = useState(false);

  async function handleClear() {
    if (!window.confirm("Are you sure you want to remove all items from your cart?")) {
      return;
    }
    try {
      setIsClearing(true);
      const res = await clearCart();
      if (res.status === "success") {
        setNumOfCartItems(0);
        toast.add({
          type: "info",
          description: "Shopping cart cleared",
        });
      }
    } finally {
      setIsClearing(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClear}
      disabled={isClearing}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 transition-colors disabled:opacity-50"
    >
      {isClearing ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Trash2 size={14} />
      )}
      <span>Clear Cart</span>
    </button>
  );
}
