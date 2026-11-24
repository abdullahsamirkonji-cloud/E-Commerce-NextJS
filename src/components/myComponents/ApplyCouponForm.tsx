"use client";

import { applyCoupon } from "@/actions/cart.action";
import { toast } from "../ui/toast";
import { Loader2, Tag } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function ApplyCouponForm() {
  const [coupon, setCoupon] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleApply(e: React.FormEvent) {
    e.preventDefault();
    if (!coupon.trim()) return;

    try {
      setIsLoading(true);
      const res = await applyCoupon(coupon.trim());
      if (res.status === "success") {
        toast.add({
          type: "success",
          description: res.message || "Coupon applied successfully!",
        });
        setCoupon("");
        // Refresh the server component so totalCartPrice re-renders with discount
        router.refresh();
      } else {
        toast.add({
          type: "error",
          description: res.message || "Invalid coupon code",
          priority: "high",
        });
      }
    } catch {
      toast.add({
        type: "error",
        description: "Failed to apply coupon. Try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <form onSubmit={handleApply} className="flex gap-2">
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Promo / Coupon code"
          value={coupon}
          onChange={(e) => setCoupon(e.target.value)}
          className="w-full h-10 pl-8 pr-3 rounded-xl border border-gray-200 text-xs font-semibold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <Tag size={14} className="absolute left-2.5 top-3 text-gray-400" />
      </div>
      <button
        type="submit"
        disabled={isLoading || !coupon.trim()}
        className="px-4 h-10 rounded-xl bg-gray-900 text-xs font-bold text-white transition-all hover:bg-black disabled:opacity-50"
      >
        {isLoading ? <Loader2 size={14} className="animate-spin" /> : "Apply"}
      </button>
    </form>
  );
}

