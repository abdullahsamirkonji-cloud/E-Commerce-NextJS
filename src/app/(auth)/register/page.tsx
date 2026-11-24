"use client";
import { useForm } from "react-hook-form";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { registerUser } from "@/api/auth.api";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "@/components/ui/toast";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50, "Max 50 characters"),
    email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
    rePassword: z.string().min(1, "Please confirm your password"),
    phone: z.string().regex(/^01[0125][0-9]{8}$/, {
      message: "Please enter a valid Egyptian mobile number (e.g. 01012345678)",
    }),
  })
  .refine((formValues) => formValues.password === formValues.rePassword, {
    path: ["rePassword"],
    message: "Passwords do not match",
  });

type registerSchemaType = z.infer<typeof registerSchema>;

export default function Register() {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<registerSchemaType>({
    resolver: zodResolver(registerSchema),
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleRegister(values: registerSchemaType) {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const response = await registerUser(values);
      if (response.message === "success") {
        toast.add({
          type: "success",
          description: "Account created successfully! Please sign in.",
        });
        router.push(`/login?email=${encodeURIComponent(values.email)}&registered=true`);
      } else {
        const errorText = response.message || "Failed to create account. Please try again.";
        setErrorMessage(errorText);
        toast.add({
          type: "error",
          description: errorText,
          priority: "high",
        });
      }
    } catch {
      setErrorMessage("Something went wrong. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600">
            <UserPlus size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
          <p className="mt-1 text-sm text-gray-500">Sign up to start shopping on ShopZone</p>
        </div>

        {errorMessage && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(handleRegister)} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              {...register("name")}
            />
            {errors.name && <FieldError>{errors.name.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="email">Email Address</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              {...register("email")}
            />
            {errors.email && <FieldError>{errors.email.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              {...register("password")}
            />
            {errors.password && <FieldError>{errors.password.message}</FieldError>}
          </Field>

          <Field>
            <FieldLabel htmlFor="rePassword">Confirm Password</FieldLabel>
            <Input
              id="rePassword"
              type="password"
              placeholder="••••••••"
              {...register("rePassword")}
            />
            {errors.rePassword && <FieldError>{errors.rePassword.message}</FieldError>}
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

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white hover:bg-green-700 py-2.5 rounded-lg font-semibold transition duration-200 mt-2"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                Creating account...
              </span>
            ) : (
              "Create Account"
            )}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-green-600 hover:text-green-700 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
