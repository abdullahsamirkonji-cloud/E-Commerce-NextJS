"use client";

import { verifyResetCode } from "@/api/auth.api";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, CheckCircle2, Loader2, ShieldAlert } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const verifySchema = z.object({
  resetCode: z.string().min(4, "Please enter the code sent to your email"),
});

type VerifyFormValues = z.infer<typeof verifySchema>;

export default function VerifyCodePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<VerifyFormValues>({
    resolver: zodResolver(verifySchema),
  });

  async function onSubmit(values: VerifyFormValues) {
    try {
      setIsLoading(true);
      setErrorMessage(null);
      const res = await verifyResetCode(values.resetCode.trim());
      if (res.status === "Success" || res.statusMsg === "success") {
        toast.add({
          type: "success",
          description: "Code verified successfully! Set your new password.",
        });
        router.push("/reset-password");
      } else {
        const errorText = res.message || "Invalid or expired reset code.";
        setErrorMessage(errorText);
        toast.add({ type: "error", description: errorText });
      }
    } catch {
      setErrorMessage("Something went wrong. Please check your code and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-120px)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-8 shadow-xl">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600">
            <CheckCircle2 size={24} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Verify Code</h1>
          <p className="mt-1 text-sm text-gray-500">
            Enter the reset verification code sent to your email address.
          </p>
        </div>

        {errorMessage && (
          <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Field>
            <FieldLabel htmlFor="resetCode">Verification Code</FieldLabel>
            <Input
              id="resetCode"
              placeholder="e.g. 123456"
              className="text-center tracking-widest text-lg font-bold"
              {...register("resetCode")}
            />
            {errors.resetCode && <FieldError>{errors.resetCode.message}</FieldError>}
          </Field>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white hover:bg-green-700 py-2.5 rounded-lg font-semibold transition duration-200 mt-2"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                Verifying...
              </span>
            ) : (
              "Verify Code"
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-green-600 transition-colors"
          >
            <ArrowLeft size={14} /> Resend or change email
          </Link>
        </div>
      </div>
    </div>
  );
}
