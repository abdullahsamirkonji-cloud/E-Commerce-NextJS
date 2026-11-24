"use client";

import { Minus, Plus, Loader2 } from "lucide-react";
import { updateProductCount } from "@/actions/cart.action";
import { useState } from "react";

export default function UpdateCartItemBtn({
  productId,
  count,
}: {
  productId: string;
  count: number;
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleUpdate(newCount: number) {
    if (newCount < 1) return;
    try {
      setIsLoading(true);
      await updateProductCount(productId, newCount);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex items-center rounded-xl border border-gray-200 bg-white shadow-xs">
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={isLoading || count <= 1}
        onClick={() => handleUpdate(count - 1)}
        className="flex h-8 w-8 items-center justify-center text-gray-600 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Minus size={14} />
      </button>
      <span className="min-w-8 text-center text-xs font-bold text-gray-900">
        {isLoading ? <Loader2 size={12} className="animate-spin inline text-green-600" /> : count}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={isLoading}
        onClick={() => handleUpdate(count + 1)}
        className="flex h-8 w-8 items-center justify-center text-gray-600 hover:text-black transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
      >
        <Plus size={14} />
      </button>
    </div>
  );
}
