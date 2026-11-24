"use client";

import { getUserAddresses } from "@/actions/addresses.action";
import {
  cashOrder,
  createCheckoutSession,
  ShippingAddress,
} from "@/actions/orders.action";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { CartContext } from "@/context/CartContext";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreditCard,
  DollarSign,
  Home,
  Loader2,
  MapPin,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { Suspense, useContext, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const shippingSchema = z.object({
  details: z.string().min(5, "Delivery address must be at least 5 characters"),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, {
    message: "Please enter a valid Egyptian mobile number (e.g. 01012345678)",
  }),
  city: z.string().min(2, "City is required"),
});

type ShippingFormValues = z.infer<typeof shippingSchema>;

interface SavedAddress {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

function ShippingForm() {
  const { setNumOfCartItems } = useContext(CartContext);
  const router = useRouter();
  const params = useParams();
  const cartId =
    (Array.isArray(params?.cartId) ? params?.cartId[0] : params?.cartId) || "";

  const [paymentMethod, setPaymentMethod] = useState<"cash" | "visa">("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);

  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm<ShippingFormValues>({
    resolver: zodResolver(shippingSchema),
  });

  useEffect(() => {
    async function fetchAddresses() {
      const res = await getUserAddresses();
      if (res.status === "success" && Array.isArray(res.data)) {
        setSavedAddresses(res.data);
      }
    }
    fetchAddresses();
  }, []);

  function applySavedAddress(addr: SavedAddress) {
    setValue("details", addr.details, { shouldValidate: true });
    setValue("phone", addr.phone, { shouldValidate: true });
    setValue("city", addr.city, { shouldValidate: true });
    toast.add({
      type: "info",
      description: `Applied address: ${addr.name}`,
    });
  }

  async function onSubmit(values: ShippingFormValues) {
    if (!cartId) {
      toast.add({
        type: "error",
        description: "Invalid cart ID. Please return to your cart.",
        priority: "high",
      });
      return;
    }

    try {
      setIsSubmitting(true);
      const shippingAddress: ShippingAddress = {
        details: values.details,
        phone: values.phone,
        city: values.city,
      };

      if (paymentMethod === "cash") {
        const result = await cashOrder(cartId, shippingAddress);
        if (result.status === "success") {
          toast.add({
            type: "success",
            description: "Order placed successfully with Cash on Delivery!",
          });
          setNumOfCartItems(0);
          router.push("/allorders");
        } else {
          toast.add({
            type: "error",
            description: result.message || "Failed to place order.",
            priority: "high",
          });
        }
      } else {
        const origin =
          typeof window !== "undefined" ? window.location.origin : undefined;
        const result = await createCheckoutSession(
          cartId,
          shippingAddress,
          origin,
        );
        if (result.status === "success" && result.session?.url) {
          toast.add({
            type: "info",
            description: "Redirecting to secure online payment...",
          });
          window.location.href = result.session.url;
        } else {
          toast.add({
            type: "error",
            description:
              result.message || "Failed to initialize online payment.",
            priority: "high",
          });
        }
      }
    } catch {
      toast.add({
        type: "error",
        description: "An unexpected error occurred. Please try again.",
        priority: "high",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-gray-100 bg-white p-6 sm:p-8 shadow-sm">
      <div className="mb-6 flex items-center gap-3 border-b border-gray-100 pb-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-600">
          <Truck size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Shipping & Payment
          </h2>
          <p className="text-sm text-gray-500">
            Enter your delivery address and choose how to pay
          </p>
        </div>
      </div>

      {/* Saved addresses selector */}
      {savedAddresses.length > 0 && (
        <div className="mb-6 p-4 rounded-xl border border-gray-100 bg-gray-50/70">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2 flex items-center gap-1.5">
            <MapPin size={13} className="text-green-600" /> Use Saved Address
          </p>
          <div className="flex flex-wrap gap-2">
            {savedAddresses.map((addr) => (
              <button
                key={addr._id}
                type="button"
                onClick={() => applySavedAddress(addr)}
                className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:border-green-500 hover:bg-green-50 text-xs font-medium text-gray-700 transition-colors flex items-center gap-1.5"
              >
                <Home size={12} className="text-gray-400" />
                <span>
                  {addr.name} ({addr.city})
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <Field>
            <FieldLabel htmlFor="details">Street Address / Details</FieldLabel>
            <Input
              id="details"
              placeholder="Apartment, suite, unit, building, floor, etc."
              {...register("details")}
            />
            {errors.details && (
              <FieldError>{errors.details.message}</FieldError>
            )}
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="city">City</FieldLabel>
              <Input
                id="city"
                placeholder="e.g. Cairo, Giza, Alexandria"
                {...register("city")}
              />
              {errors.city && <FieldError>{errors.city.message}</FieldError>}
            </Field>

            <Field>
              <FieldLabel htmlFor="phone">Phone Number</FieldLabel>
              <Input
                id="phone"
                type="tel"
                placeholder="01012345678"
                {...register("phone")}
              />
              {errors.phone && <FieldError>{errors.phone.message}</FieldError>}
            </Field>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div>
          <label className="text-sm font-semibold text-gray-700 block mb-3">
            Payment Method
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod("cash")}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                paymentMethod === "cash"
                  ? "border-green-600 bg-green-50/50 text-green-900 shadow-sm"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  paymentMethod === "cash"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <DollarSign size={22} />
              </div>
              <div>
                <p className="font-semibold text-sm">Cash on Delivery</p>
                <p className="text-xs text-gray-500">
                  Pay in cash upon arrival
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod("visa")}
              className={`flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                paymentMethod === "visa"
                  ? "border-green-600 bg-green-50/50 text-green-900 shadow-sm"
                  : "border-gray-200 hover:border-gray-300 text-gray-700"
              }`}
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  paymentMethod === "visa"
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                <CreditCard size={22} />
              </div>
              <div>
                <p className="font-semibold text-sm">Card / Online Payment</p>
                <p className="text-xs text-gray-500">
                  Visa, Mastercard, Stripe
                </p>
              </div>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
          <ShieldCheck size={16} className="text-green-600 shrink-0" />
          <span>
            Your personal details and payments are securely encrypted.
          </span>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-green-600 text-white hover:bg-green-700 py-3 rounded-xl font-semibold text-base transition-all duration-200 shadow-sm hover:shadow"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 size={18} className="animate-spin" />
              Processing Order...
            </span>
          ) : paymentMethod === "cash" ? (
            "Confirm Cash Order"
          ) : (
            "Proceed to Card Payment"
          )}
        </Button>
      </form>
    </div>
  );
}

export default function CreateOrder() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-24 text-gray-500">
            <Loader2 className="animate-spin mr-2" /> Loading checkout...
          </div>
        }
      >
        <ShippingForm />
      </Suspense>
    </div>
  );
}
