import {
  CreditCard,
  Heart,
  Lock,
  Mail,
  MapPin,
  Package,
  Phone,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  Truck,
} from "lucide-react";
import Link from "next/link";
import React from "react";

// Evaluated once at build time — avoids new Date() during prerendering
// while keeping the component fully statically renderable.
const CURRENT_YEAR = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-100 bg-white text-gray-600">
      {/* Top Perks Bar */}
      <div className="border-b border-gray-100 bg-gray-50/60 py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                <Truck size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Fast Doorstep Delivery</h4>
                <p className="text-xs text-gray-500">Express delivery across Egypt</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                <ShieldCheck size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">100% Authentic Goods</h4>
                <p className="text-xs text-gray-500">Direct from official partners</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                <CreditCard size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Flexible Payment</h4>
                <p className="text-xs text-gray-500">Cash on Delivery & Secure Card</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                <Lock size={22} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-gray-900">Secure Checkout</h4>
                <p className="text-xs text-gray-500">256-bit SSL encrypted transactions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8">
          {/* Brand Info */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-2xl font-black text-green-600 transition-transform hover:scale-105"
            >
              <ShoppingBag size={28} />
              <span>ShopZone</span>
            </Link>
            <p className="text-xs text-gray-500 leading-relaxed max-w-sm">
              ShopZone is Egypt&apos;s modern destination for electronics, fashion, and home essentials. Quality products, genuine warranties, and fast delivery at your doorstep.
            </p>
            <div className="space-y-2 text-xs text-gray-500 pt-2">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-green-600 shrink-0" />
                <span>Cairo, Egypt</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-green-600 shrink-0" />
                <span>+20 100 000 0000</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-green-600 shrink-0" />
                <span>support@shopzone.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              Quick Links
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/products" className="hover:text-green-600 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/categories" className="hover:text-green-600 transition-colors">
                  Browse Categories
                </Link>
              </li>
              <li>
                <Link href="/brands" className="hover:text-green-600 transition-colors">
                  Official Brand Stores
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="hover:text-green-600 transition-colors">
                  My Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-green-600 transition-colors">
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Account */}
          <div className="lg:col-span-3 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              Customer Account
            </h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/allorders" className="hover:text-green-600 transition-colors">
                  Track My Orders
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-green-600 transition-colors">
                  Account Dashboard
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-green-600 transition-colors">
                  Sign In
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-green-600 transition-colors">
                  Register Account
                </Link>
              </li>
              <li>
                <Link href="/forgot-password" className="hover:text-green-600 transition-colors">
                  Password Recovery
                </Link>
              </li>
            </ul>
          </div>

          {/* Accepted Payments */}
          <div className="lg:col-span-2 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-900">
              Payment Methods
            </h3>
            <p className="text-xs text-gray-500">
              We accept safe and convenient payment options:
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <span className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-bold text-gray-700">
                Cash
              </span>
              <span className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-bold text-blue-600">
                Visa
              </span>
              <span className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-bold text-red-500">
                Mastercard
              </span>
              <span className="rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-[11px] font-bold text-green-600">
                Stripe
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between border-t border-gray-100 pt-6 text-xs text-gray-400 gap-4">
          <p>© {CURRENT_YEAR} ShopZone E-Commerce. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-gray-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-600 cursor-pointer">Terms of Service</span>
            <span className="hover:text-gray-600 cursor-pointer">Return Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
