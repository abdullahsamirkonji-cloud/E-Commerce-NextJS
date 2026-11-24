import { getUserOrders } from "@/actions/orders.action";
import { auth } from "@/auth";
import {
  Calendar,
  CheckCircle2,
  Clock,
  CreditCard,
  DollarSign,
  MapPin,
  Package,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

interface OrderItem {
  _id: string;
  count: number;
  price: number;
  product?: {
    _id: string;
    title: string;
    imageCover: string;
    category?: { name: string };
    brand?: { name: string };
  };
}

interface Order {
  _id: string;
  createdAt: string;
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  isDelivered: boolean;
  shippingAddress?: {
    details?: string;
    phone?: string;
    city?: string;
  };
  cartItems: OrderItem[];
}

export default async function AllOrdersPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/allorders");
  }

  const result = await getUserOrders(session.user.id);
  const orders: Order[] = Array.isArray(result?.data) ? result.data : [];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 border-b border-gray-100 pb-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3.5 py-1 text-xs font-semibold text-green-700 mb-2">
          <Package size={14} /> Order Tracking
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900">Order History</h1>
        <p className="mt-1 text-sm text-gray-500">
          Review past purchases, delivery progress, and item details.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="mx-auto max-w-md text-center py-16">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <Package size={36} />
          </div>
          <h2 className="text-xl font-bold text-gray-900">No orders yet</h2>
          <p className="mt-2 text-sm text-gray-500">
            You haven&apos;t placed any orders yet. Discover our latest collection and start shopping today!
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-green-700"
          >
            <ShoppingBag size={18} />
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const formattedDate = new Date(order.createdAt).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
              },
            );

            return (
              <div
                key={order._id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-200 hover:shadow-md"
              >
                {/* Order Summary Bar */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 bg-gray-50/70 p-4 sm:p-5 text-xs text-gray-600">
                  <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                    <div>
                      <p className="font-medium text-gray-400">ORDER PLACED</p>
                      <p className="font-bold text-gray-800 flex items-center gap-1 mt-0.5">
                        <Calendar size={13} className="text-gray-400" />
                        {formattedDate}
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-gray-400">TOTAL</p>
                      <p className="font-bold text-green-600 mt-0.5 text-sm">
                        {order.totalOrderPrice} EGP
                      </p>
                    </div>

                    <div>
                      <p className="font-medium text-gray-400">PAYMENT</p>
                      <span className="inline-flex items-center gap-1 font-semibold text-gray-800 mt-0.5 capitalize">
                        {order.paymentMethodType === "card" ? (
                          <>
                            <CreditCard size={13} className="text-blue-500" /> Card
                          </>
                        ) : (
                          <>
                            <DollarSign size={13} className="text-green-600" /> Cash
                          </>
                        )}
                      </span>
                    </div>

                    {order.shippingAddress?.city && (
                      <div>
                        <p className="font-medium text-gray-400">SHIP TO</p>
                        <p className="font-semibold text-gray-800 flex items-center gap-1 mt-0.5">
                          <MapPin size={13} className="text-gray-400" />
                          {order.shippingAddress.city}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Status Badges */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-bold text-xs ${
                        order.isPaid
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {order.isPaid ? (
                        <>
                          <CheckCircle2 size={12} /> Paid
                        </>
                      ) : (
                        <>
                          <Clock size={12} /> Unpaid
                        </>
                      )}
                    </span>

                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 font-bold text-xs ${
                        order.isDelivered
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {order.isDelivered ? "Delivered" : "In Transit"}
                    </span>
                  </div>
                </div>

                {/* Order Itemized Products */}
                <div className="divide-y divide-gray-100 p-4 sm:p-5">
                  {order.cartItems?.map((item) => {
                    const product = item.product;
                    if (!product) return null;

                    return (
                      <div
                        key={item._id}
                        className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
                      >
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                          {product.imageCover && (
                            <Image
                              src={product.imageCover}
                              alt={product.title || "Product item"}
                              fill
                              sizes="64px"
                              className="object-contain p-1"
                            />
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <Link
                            href={`/products/${product._id}`}
                            className="font-bold text-sm text-gray-900 hover:text-green-600 transition-colors truncate block"
                          >
                            {product.title}
                          </Link>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Qty: <span className="font-semibold text-gray-700">{item.count}</span> × {item.price} EGP
                          </p>
                        </div>

                        <div className="text-right">
                          <p className="font-extrabold text-sm text-gray-900">
                            {item.price * item.count} EGP
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
