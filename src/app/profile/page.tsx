"use client";

import { addUserAddress, getUserAddresses, removeUserAddress } from "@/actions/addresses.action";
import { changeUserPassword, updateUserData } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Heart,
  Home,
  Loader2,
  Lock,
  MapPin,
  Package,
  Plus,
  ShoppingCart,
  Trash2,
  User,
  UserCheck,
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, {
    message: "Valid Egyptian mobile number required (e.g. 01012345678)",
  }),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

const passwordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    password: z.string().min(6, "New password must be at least 6 characters"),
    rePassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.password === data.rePassword, {
    path: ["rePassword"],
    message: "New passwords do not match",
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

const addressSchema = z.object({
  name: z.string().min(1, "Label is required (e.g. Home, Work)"),
  details: z.string().min(5, "Address details must be at least 5 characters"),
  phone: z.string().regex(/^01[0125][0-9]{8}$/, {
    message: "Valid Egyptian mobile number required",
  }),
  city: z.string().min(2, "City is required"),
});

type AddressFormValues = z.infer<typeof addressSchema>;

interface AddressItem {
  _id: string;
  name: string;
  details: string;
  phone: string;
  city: string;
}

export default function ProfilePage() {
  const { data: session, status, update: updateSession } = useSession();
  const [isProfileSubmitting, setIsProfileSubmitting] = useState(false);
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false);
  const [isAddressSubmitting, setIsAddressSubmitting] = useState(false);
  const [addresses, setAddresses] = useState<AddressItem[]>([]);
  const [showAddressForm, setShowAddressForm] = useState(false);

  // Profile Details Form
  const {
    handleSubmit: handleProfileSubmit,
    register: registerProfile,
    setValue: setProfileValue,
    formState: { errors: profileErrors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: session?.user?.name || "",
      email: session?.user?.email || "",
      phone: "01000000000",
    },
  });

  // Password Form
  const {
    handleSubmit: handlePasswordSubmit,
    register: registerPassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  // Address Form
  const {
    handleSubmit: handleAddressSubmit,
    register: registerAddress,
    reset: resetAddress,
    formState: { errors: addressErrors },
  } = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
  });

  useEffect(() => {
    if (session?.user) {
      if (session.user.name) setProfileValue("name", session.user.name);
      if (session.user.email) setProfileValue("email", session.user.email);
    }
  }, [session, setProfileValue]);

  useEffect(() => {
    async function loadAddresses() {
      if (status === "authenticated") {
        const res = await getUserAddresses();
        if (res.status === "success" && Array.isArray(res.data)) {
          setAddresses(res.data);
        }
      }
    }
    loadAddresses();
  }, [status]);

  async function onUpdateProfile(values: ProfileFormValues) {
    if (!session?.accessToken) {
      toast.add({ type: "error", description: "Authentication required" });
      return;
    }
    try {
      setIsProfileSubmitting(true);
      const res = await updateUserData(session.accessToken, values);
      if (res.message === "success" || res.user) {
        toast.add({
          type: "success",
          description: "Profile information updated successfully!",
        });
        if (updateSession) {
          await updateSession({
            ...session,
            user: {
              ...session.user,
              name: values.name,
              email: values.email,
            },
          });
        }
      } else {
        toast.add({
          type: "error",
          description: res.message || "Failed to update profile",
        });
      }
    } catch {
      toast.add({ type: "error", description: "Something went wrong" });
    } finally {
      setIsProfileSubmitting(false);
    }
  }

  async function onChangePassword(values: PasswordFormValues) {
    if (!session?.accessToken) {
      toast.add({ type: "error", description: "Authentication required" });
      return;
    }
    try {
      setIsPasswordSubmitting(true);
      const res = await changeUserPassword(session.accessToken, {
        currentPassword: values.currentPassword,
        password: values.password,
        rePassword: values.rePassword,
      });

      if (res.message === "success" || res.token) {
        toast.add({
          type: "success",
          description: "Password changed successfully!",
        });
        resetPassword();
      } else {
        toast.add({
          type: "error",
          description: res.message || "Failed to update password",
        });
      }
    } catch {
      toast.add({ type: "error", description: "Something went wrong" });
    } finally {
      setIsPasswordSubmitting(false);
    }
  }

  async function onAddAddress(values: AddressFormValues) {
    try {
      setIsAddressSubmitting(true);
      const res = await addUserAddress(values);
      if (res.status === "success") {
        toast.add({
          type: "success",
          description: "New address saved!",
        });
        resetAddress();
        setShowAddressForm(false);
        const refreshed = await getUserAddresses();
        if (refreshed.data) setAddresses(refreshed.data);
      } else {
        toast.add({
          type: "error",
          description: res.message || "Failed to add address",
        });
      }
    } finally {
      setIsAddressSubmitting(false);
    }
  }

  async function onDeleteAddress(id: string) {
    const res = await removeUserAddress(id);
    if (res.status === "success") {
      toast.add({ type: "info", description: "Address removed" });
      setAddresses((prev) => prev.filter((a) => a._id !== id));
    }
  }

  if (status === "loading") {
    return (
      <div className="container mx-auto px-4 py-20 text-center text-gray-500">
        <Loader2 className="animate-spin mx-auto mb-2 text-green-600" /> Loading profile...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8 border-b border-gray-100 pb-5">
        <h1 className="text-3xl font-extrabold text-gray-900">Account Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your personal details, delivery addresses, and security settings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Profile Card & Shortcuts */}
        <div className="lg:col-span-4 space-y-6">
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-green-700 text-2xl font-bold">
              {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : <User size={36} />}
            </div>
            <h2 className="text-xl font-bold text-gray-900">{session?.user?.name || "Shopper"}</h2>
            <p className="text-xs text-gray-500 mt-1">{session?.user?.email}</p>
            <div className="mt-3 inline-block rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700 capitalize">
              Role: {session?.user?.role || "Customer"}
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm divide-y divide-gray-100">
            <Link
              href="/allorders"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                <Package size={18} className="text-green-600" />
                <span>My Orders</span>
              </div>
              <span className="text-xs text-gray-400">→</span>
            </Link>

            <Link
              href="/wishlist"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                <Heart size={18} className="text-red-500" />
                <span>My Wishlist</span>
              </div>
              <span className="text-xs text-gray-400">→</span>
            </Link>

            <Link
              href="/cart"
              className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-3 text-sm font-semibold text-gray-700">
                <ShoppingCart size={18} className="text-blue-500" />
                <span>Shopping Cart</span>
              </div>
              <span className="text-xs text-gray-400">→</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Forms & Settings */}
        <div className="lg:col-span-8 space-y-8">
          {/* Personal Information Form */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5 border-b border-gray-100 pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <UserCheck size={18} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Personal Information</h3>
                <p className="text-xs text-gray-500">Update your name, email, and primary phone number</p>
              </div>
            </div>

            <form onSubmit={handleProfileSubmit(onUpdateProfile)} className="space-y-4">
              <Field>
                <FieldLabel htmlFor="profileName">Full Name</FieldLabel>
                <Input
                  id="profileName"
                  placeholder="John Doe"
                  {...registerProfile("name")}
                />
                {profileErrors.name && <FieldError>{profileErrors.name.message}</FieldError>}
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="profileEmail">Email Address</FieldLabel>
                  <Input
                    id="profileEmail"
                    type="email"
                    placeholder="name@example.com"
                    {...registerProfile("email")}
                  />
                  {profileErrors.email && <FieldError>{profileErrors.email.message}</FieldError>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="profilePhone">Phone Number</FieldLabel>
                  <Input
                    id="profilePhone"
                    type="tel"
                    placeholder="01012345678"
                    {...registerProfile("phone")}
                  />
                  {profileErrors.phone && <FieldError>{profileErrors.phone.message}</FieldError>}
                </Field>
              </div>

              <Button
                type="submit"
                disabled={isProfileSubmitting}
                className="bg-green-600 text-white hover:bg-green-700 py-2.5 rounded-lg font-semibold text-xs transition duration-200"
              >
                {isProfileSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 size={14} className="animate-spin" /> Saving changes...
                  </span>
                ) : (
                  "Save Personal Info"
                )}
              </Button>
            </form>
          </div>

          {/* Delivery Addresses Section */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-5 border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
                  <MapPin size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-base">Delivery Addresses</h3>
                  <p className="text-xs text-gray-500">Manage saved shipping addresses</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowAddressForm(!showAddressForm)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 hover:bg-green-100 text-xs font-semibold transition-colors"
              >
                <Plus size={14} /> {showAddressForm ? "Cancel" : "Add Address"}
              </button>
            </div>

            {/* Add Address Form */}
            {showAddressForm && (
              <form
                onSubmit={handleAddressSubmit(onAddAddress)}
                className="mb-6 p-4 rounded-xl border border-gray-100 bg-gray-50/70 space-y-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel htmlFor="addrName">Label</FieldLabel>
                    <Input id="addrName" placeholder="e.g. Home, Office" {...registerAddress("name")} />
                    {addressErrors.name && <FieldError>{addressErrors.name.message}</FieldError>}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="addrCity">City</FieldLabel>
                    <Input id="addrCity" placeholder="e.g. Cairo" {...registerAddress("city")} />
                    {addressErrors.city && <FieldError>{addressErrors.city.message}</FieldError>}
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Field>
                    <FieldLabel htmlFor="addrDetails">Street Details</FieldLabel>
                    <Input id="addrDetails" placeholder="Building, Apt, Street" {...registerAddress("details")} />
                    {addressErrors.details && <FieldError>{addressErrors.details.message}</FieldError>}
                  </Field>

                  <Field>
                    <FieldLabel htmlFor="addrPhone">Phone</FieldLabel>
                    <Input id="addrPhone" placeholder="01012345678" {...registerAddress("phone")} />
                    {addressErrors.phone && <FieldError>{addressErrors.phone.message}</FieldError>}
                  </Field>
                </div>

                <Button
                  type="submit"
                  disabled={isAddressSubmitting}
                  className="bg-green-600 text-white hover:bg-green-700 text-xs"
                >
                  {isAddressSubmitting ? <Loader2 size={14} className="animate-spin mr-1" /> : null}
                  Save Address
                </Button>
              </form>
            )}

            {/* List of Addresses */}
            {addresses.length === 0 ? (
              <p className="text-xs text-gray-500 py-3 text-center">
                No saved addresses yet. Add an address for faster checkout.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className="p-3.5 rounded-xl border border-gray-200 bg-white flex items-start justify-between shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-xs text-gray-900">
                        <Home size={13} className="text-green-600" />
                        <span>{addr.name}</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{addr.details}</p>
                      <p className="text-xs text-gray-400 mt-0.5">{addr.city} • {addr.phone}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onDeleteAddress(addr._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors p-1"
                      title="Delete address"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Change Password Section */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2.5 mb-5 border-b border-gray-100 pb-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-50 text-green-600">
                <Lock size={18} />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 text-base">Change Password</h3>
                <p className="text-xs text-gray-500">Keep your account secure with a strong password</p>
              </div>
            </div>

            <form onSubmit={handlePasswordSubmit(onChangePassword)} className="space-y-4">
              <Field>
                <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="••••••••"
                  {...registerPassword("currentPassword")}
                />
                {passwordErrors.currentPassword && (
                  <FieldError>{passwordErrors.currentPassword.message}</FieldError>
                )}
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="password">New Password</FieldLabel>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...registerPassword("password")}
                  />
                  {passwordErrors.password && (
                    <FieldError>{passwordErrors.password.message}</FieldError>
                  )}
                </Field>

                <Field>
                  <FieldLabel htmlFor="rePassword">Confirm New Password</FieldLabel>
                  <Input
                    id="rePassword"
                    type="password"
                    placeholder="••••••••"
                    {...registerPassword("rePassword")}
                  />
                  {passwordErrors.rePassword && (
                    <FieldError>{passwordErrors.rePassword.message}</FieldError>
                  )}
                </Field>
              </div>

              <Button
                type="submit"
                disabled={isPasswordSubmitting}
                className="bg-green-600 text-white hover:bg-green-700 py-2.5 rounded-lg font-semibold transition duration-200 mt-2 text-xs"
              >
                {isPasswordSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" />
                    Updating password...
                  </span>
                ) : (
                  "Update Password"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
