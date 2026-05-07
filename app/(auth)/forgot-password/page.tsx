"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { forgotPassword } from "@/services/accounts";
import { ForgotPasswordSchema } from "@/validation";

export default function ForgotPassword() {
  const [loading, setLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: ForgotPasswordSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await forgotPassword({ email: values.email });
        setIsSuccess(true);
        toast.success("Recovery instructions sent to your email.");
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "An error occurred. Please try again.");
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-zinc-50 px-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-10" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#004d40]/10 rounded blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded blur-[100px] animate-pulse delay-1000" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-emerald-50 text-[#004d40] border-emerald-100 font-medium uppercase tracking-widest py-1.5 px-4 shadow-sm">
            Tamarind Elimu System
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter text-zinc-900 mb-2">
            Reset <span className="text-[#004d40]">Password.</span>
          </h1>
          <p className="text-zinc-500 font-medium">
            Enter your email to receive recovery instructions.
          </p>
        </div>

        <Card className="border-zinc-200 shadow-2xl rounded overflow-hidden bg-white/80 backdrop-blur-md">
          <CardHeader className="pt-8 px-8">
            <CardTitle className="text-2xl font-bold text-zinc-900 tracking-tight text-center">
              Forgot Password
            </CardTitle>
            <CardDescription className="text-center font-medium text-zinc-500">
              We will send you a secure code to reset your password.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            {isSuccess ? (
              <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="w-20 h-20 bg-emerald-100/50 rounded flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-zinc-900">Check Your Inbox</h3>
                  <p className="text-zinc-500 text-sm px-4">
                    We've sent password reset instructions to <span className="font-semibold text-zinc-700">{formik.values.email}</span>. Please check your spam folder if it doesn't arrive within 5 minutes.
                  </p>
                </div>
                <Button
                  onClick={() => router.push("/reset-password")}
                  className="w-full h-14 bg-[#004d40] hover:bg-[#00332b] text-white rounded text-lg font-bold shadow-lg shadow-[#004d40]/20 transition-all hover:scale-[1.01] active:scale-95"
                >
                  Enter Reset Code
                </Button>
              </div>
            ) : (
              <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#004d40]/60 ml-1">
                    Email Address
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-zinc-300 group-focus-within:text-[#004d40] transition-colors" />
                    </div>
                    <Input
                      name="email"
                      type="email"
                      required
                      placeholder="name@tamarind.co.ke"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className={`transition-all ${formik.touched.email && formik.errors.email
                        ? "border-red-500 focus-visible:ring-red-500"
                        : ""
                        }`}
                    />
                  </div>
                  {formik.touched.email && formik.errors.email && (
                    <p className="text-xs text-red-500 font-medium ml-1">
                      {formik.errors.email}
                    </p>
                  )}
                </div>

                <Button
                  disabled={loading}
                  type="submit"
                  className="w-full h-14 bg-[#004d40] hover:bg-[#00332b] text-white rounded text-lg font-bold shadow-lg shadow-[#004d40]/20 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Sending...</span>
                    </div>
                  ) : (
                    "Send Recovery Link"
                  )}
                </Button>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-[#004d40] transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Back to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}