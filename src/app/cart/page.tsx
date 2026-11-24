import { getLoggedInUserCart } from "@/actions/cart.action";
import ApplyCouponForm from "@/components/myComponents/ApplyCouponForm";
import ClearcartBtn from "@/components/myComponents/ClearcartBtn";
import DeleteCartItemBtn from "@/components/myComponents/DeleteCartItemBtn";
import UpdateCartItemBtn from "@/components/myComponents/UpdateCartItemBtn";
import { ArrowRight, Lock, ShieldCheck, ShoppingBag, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { Suspense } from "react";

async function CartItems() {
  const responseUserCart = await getLoggedInUserCart();
  const cartData = responseUserCart?.data;
  const cartItems = cartData?.data?.products || [];
  const cartId = cartData?.cartId;
  const numberOfCartItems = cartData?.numOfCartItems || 0;
  const totalCartPrice = cartData?.data?.totalCartPrice || 0;

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-md text-center py-16">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-50 text-green-600">
          <ShoppingBag size={36} />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Your cart is empty</h2>
        <p className="mt-2 text-sm text-gray-500">
          Looks like you haven&apos;t added any items to your cart yet.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-green-700"
        >
          <ShoppingBag size={18} /> Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Items List */}
      <div className="lg:col-span-8 space-y-4">
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <p className="text-sm font-semibold text-gray-500">
            {numberOfCartItems} {numberOfCartItems === 1 ? "item" : "items"} in your cart
          </p>
          <ClearcartBtn />
        </div>

        <div className="space-y-4">
          {cartItems.map(
            ({
              price,
              count,
              product: {
                _id,
                imageCover,
                title,
                category,
              },
            }) => {
              const categoryName = category?.name || "Product";
              return (
                <div
                  key={_id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4 sm:p-5 shadow-xs transition-all hover:shadow-sm"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                      <Image
                        className="object-contain p-1"
                        fill
                        sizes="80px"
                        src={imageCover}
                        alt={title}
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold uppercase text-green-600">
                        {categoryName}
                      </span>
                      <Link
                        href={`/products/${_id}`}
                        className="font-bold text-sm text-gray-900 hover:text-green-600 transition-colors line-clamp-1 block"
                      >
                        {title}
                      </Link>
                      <p className="mt-1 font-extrabold text-sm text-gray-900">
                        {price} EGP
                      </p>
                    </div>
                  </div>

                  <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-gray-50">
                    <UpdateCartItemBtn productId={_id} count={count} />
                    <DeleteCartItemBtn productId={_id} />
                  </div>
                </div>
              );
            },
          )}
        </div>
      </div>

      {/* Order Summary Box */}
      <div className="lg:col-span-4 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-5">
        <h2 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-3">
          Order Summary
        </h2>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between text-gray-600">
            <span>Items Count</span>
            <span className="font-semibold text-gray-900">{numberOfCartItems}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span className="font-semibold text-green-600">Free</span>
          </div>
          <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-extrabold text-gray-900">
            <span>Total Price</span>
            <span className="text-green-600 text-lg">{totalCartPrice} EGP</span>
          </div>
        </div>

        {/* Promo code entry */}
        <div className="border-t border-gray-100 pt-4">
          <ApplyCouponForm />
        </div>

        <Link
          href={`/createorder/${cartId}`}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-green-600 py-3.5 text-sm font-bold text-white shadow-sm transition-all hover:bg-green-700"
        >
          <span>Proceed to Checkout</span>
          <ArrowRight size={16} />
        </Link>

        <div className="space-y-2 border-t border-gray-100 pt-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <Lock size={14} className="text-green-600 shrink-0" />
            <span>Secure 256-bit SSL encrypted checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck size={14} className="text-green-600 shrink-0" />
            <span>Eligible for fast door-to-door delivery</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Cart() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-extrabold text-gray-900">Shopping Cart</h1>
        <p className="mt-1 text-sm text-gray-500">Review your products before checking out</p>
      </div>
      <Suspense
        fallback={
          <div className="py-20 text-center text-gray-500">
            Loading your cart...
          </div>
        }
      >
        <CartItems />
      </Suspense>
    </div>
  );
}
