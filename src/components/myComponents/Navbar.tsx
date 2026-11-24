"use client";

import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { Button } from "../ui/button";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { getLoggedInUserCart } from "@/actions/cart.action";
import { useRouter } from "next/navigation";
import {
  ShoppingCart,
  ShoppingBag,
  LogIn,
  UserPlus,
  LogOut,
  Menu,
  X,
  Heart,
  Package,
  Search,
} from "lucide-react";

export default function Navbar() {
  const { status, data: session } = useSession();
  const { numOfCartItems, setNumOfCartItems } = useContext(CartContext);
  const { wishlistCount } = useWishlist();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (status !== "authenticated") {
      setNumOfCartItems(0);
      return;
    }
    if (status === "authenticated") {
      getLoggedInUserCart().then((response) => {
        if (
          response.status === "success" &&
          typeof response.data?.numOfCartItems === "number"
        ) {
          setNumOfCartItems(response.data?.numOfCartItems);
        }
      });
    }
  }, [status, setNumOfCartItems]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  }

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Categories", href: "/categories" },
    { name: "Brands", href: "/brands" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-100 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8 gap-4">
        {/* Brand Logo */}
        <Link
          href="/"
          onClick={() => setIsMenuOpen(false)}
          className="flex items-center gap-2 text-xl font-extrabold text-green-600 transition-transform duration-300 hover:scale-105 sm:text-2xl shrink-0"
        >
          <ShoppingBag size={26} />
          <span>ShopZone</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-6 text-sm font-semibold text-gray-600 md:flex lg:gap-8">
          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="relative transition-colors duration-300 hover:text-green-600 after:absolute after:-bottom-2 after:left-0 after:h-0.5 after:w-0 after:bg-green-500 after:transition-all after:duration-300 hover:after:w-full"
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Global Search Bar */}
        <form
          onSubmit={handleSearchSubmit}
          className="hidden lg:flex items-center relative flex-1 max-w-xs"
        >
          <input
            type="search"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-9 pr-4 rounded-full bg-gray-100 text-xs font-medium text-gray-800 placeholder-gray-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 transition-all border border-transparent focus:border-green-500"
          />
          <Search size={15} className="absolute left-3 text-gray-400" />
        </form>

        {/* Right Actions */}
        <div className="hidden items-center gap-3 md:flex">
          {status === "authenticated" && (
            <>
              {/* Wishlist Link */}
              <Link
                href="/wishlist"
                aria-label="Wishlist"
                className="relative rounded-full bg-gray-50 p-2.5 text-gray-600 transition-all duration-300 hover:bg-red-50 hover:text-red-500"
              >
                <Heart size={20} />
                {wishlistCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart Link */}
              <Link
                href="/cart"
                aria-label="Cart"
                className="relative rounded-full bg-green-50 p-2.5 text-green-600 transition-all duration-300 hover:bg-green-500 hover:text-white"
              >
                <ShoppingCart size={20} />
                <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {numOfCartItems}
                </span>
              </Link>

              {/* Orders Link */}
              <Link
                href="/allorders"
                aria-label="My Orders"
                className="rounded-full bg-gray-50 p-2.5 text-gray-600 transition-all duration-300 hover:bg-gray-100 hover:text-green-600"
                title="My Orders"
              >
                <Package size={20} />
              </Link>

              {/* User Profile Pill */}
              <Link
                href="/profile"
                className="flex items-center gap-1.5 rounded-full bg-gray-50 hover:bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-800 transition-colors border border-gray-100"
                title="Account Settings"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-[10px]">
                  {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span className="max-w-[80px] truncate">{session?.user?.name || "Account"}</span>
              </Link>

              {/* Sign Out */}
              <Button
                onClick={() => signOut({ callbackUrl: "/login" })}
                variant="destructive"
                size="sm"
                className="gap-1.5 rounded-full px-3 text-xs"
              >
                <LogOut size={14} />
                Sign Out
              </Button>
            </>
          )}

          {status === "unauthenticated" && (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold text-gray-700 transition-all duration-300 hover:bg-green-50 hover:text-green-600"
              >
                <LogIn size={16} />
                Login
              </Link>

              <Link
                href="/register"
                className="flex items-center gap-1.5 rounded-full bg-green-500 px-4 py-2 text-xs font-semibold text-white transition-all duration-300 hover:scale-105 hover:bg-green-600 hover:shadow-md hover:shadow-green-200"
              >
                <UserPlus size={16} />
                Register
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu hamburger button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="rounded-lg p-2 text-gray-700 transition-all duration-300 hover:bg-green-50 hover:text-green-600 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={25} /> : <Menu size={25} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div
        className={`overflow-hidden bg-white transition-all duration-300 ease-in-out md:hidden ${
          isMenuOpen
            ? "max-h-[500px] border-t border-gray-100 opacity-100"
            : "max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-2 px-5 py-4">
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative mb-2">
            <input
              type="search"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-gray-100 text-sm font-medium text-gray-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-green-500 border border-transparent"
            />
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
          </form>

          {navLinks.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-lg px-4 py-2.5 font-medium text-gray-600 transition-all duration-300 hover:bg-green-50 hover:text-green-600"
            >
              {item.name}
            </Link>
          ))}

          <div className="my-1 border-t border-gray-100" />

          {status === "authenticated" && (
            <>
              <Link
                href="/wishlist"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-2.5 font-medium text-gray-600 transition-all duration-300 hover:bg-red-50 hover:text-red-500"
              >
                <Heart size={20} />
                Wishlist
                <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-bold text-red-600">
                  {wishlistCount}
                </span>
              </Link>

              <Link
                href="/cart"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-2.5 font-medium text-gray-600 transition-all duration-300 hover:bg-green-50 hover:text-green-600"
              >
                <ShoppingCart size={20} />
                Cart
                <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-600">
                  {numOfCartItems}
                </span>
              </Link>

              <Link
                href="/allorders"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-2.5 font-medium text-gray-600 transition-all duration-300 hover:bg-green-50 hover:text-green-600"
              >
                <Package size={20} />
                My Orders
              </Link>

              <Link
                href="/profile"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-2.5 font-medium text-gray-600 transition-all duration-300 hover:bg-gray-50 hover:text-green-600"
              >
                <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-100 text-green-700 text-[10px]">
                  {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <span>Profile Settings</span>
              </Link>

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut({ callbackUrl: "/login" });
                }}
                className="flex items-center gap-3 rounded-lg px-4 py-2.5 text-left font-medium text-red-500 transition-all duration-300 hover:bg-red-50"
              >
                <LogOut size={20} />
                Sign Out
              </button>
            </>
          )}

          {status === "unauthenticated" && (
            <>
              <Link
                href="/login"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-4 py-2.5 font-medium text-gray-600 transition-all duration-300 hover:bg-green-50 hover:text-green-600"
              >
                <LogIn size={20} />
                Login
              </Link>

              <Link
                href="/register"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 font-semibold text-white transition-all duration-300 hover:bg-green-600"
              >
                <UserPlus size={20} />
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
