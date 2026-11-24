"use client";

import { deleteProductFromCart } from "@/actions/cart.action";
import { Loader2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "../ui/toast";

export default function DeleteCartItemBtn({
  productId,
}: {
  productId: string;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    try {
      setIsDeleting(true);
      const res = await deleteProductFromCart(productId);
      if (res.status === "success") {
        toast.add({
          type: "info",
          description: "Item removed from your cart",
        });
      }
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={isDeleting}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
    >
      {isDeleting ? (
        <Loader2 size={14} className="animate-spin" />
      ) : (
        <Trash2 size={14} />
      )}
      <span>Remove</span>
    </button>
  );
}
