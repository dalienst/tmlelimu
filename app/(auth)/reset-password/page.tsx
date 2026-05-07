"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Lock, ArrowLeft, Loader2, Eye, EyeOff, Hash, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { resetPassword } from "@/services/accounts";
import { ResetPasswordSchema } from "@/validation";

export default function ResetPassword() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      code: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: ResetPasswordSchema,
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await resetPassword({
          email: values.email,
          code: values.code,
          password: values.password,
          password_confirmation: values.confirmPassword,
        });
        toast.success("Password reset successfully! You can now log in.");
        router.push("/login");
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Invalid or expired reset code.");
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
            Create <span className="text-[#004d40]">New Password.</span>
          </h1>
          <p className="text-zinc-500 font-medium">
            Enter the code sent to your email and choose a strong password.
          </p>
        </div>

        <Card className="border-zinc-200 shadow-2xl rounded overflow-hidden bg-white/80 backdrop-blur-md">
          <CardHeader className="pt-8 px-8">
            <CardTitle className="text-2xl font-bold text-zinc-900 tracking-tight text-center">
              Reset Password
            </CardTitle>
            <CardDescription className="text-center font-medium text-zinc-500">
              Ensure your new password meets the security requirements.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={formik.handleSubmit} className="space-y-6">

              {/* Email Field */}
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
                    {formik.errors.email as string}
                  </p>
                )}
              </div>

              {/* Reset Code Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#004d40]/60 ml-1">
                  Reset Code
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Hash className="h-5 w-5 text-zinc-300 group-focus-within:text-[#004d40] transition-colors" />
                  </div>
                  <Input
                    name="code"
                    type="text"
                    required
                    placeholder="Enter 6-digit code"
                    value={formik.values.code}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`transition-all ${formik.touched.code && formik.errors.code
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                      }`}
                  />
                </div>
                {formik.touched.code && formik.errors.code && (
                  <p className="text-xs text-red-500 font-medium ml-1">
                    {formik.errors.code as string}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#004d40]/60 ml-1">
                  New Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-zinc-300 group-focus-within:text-[#004d40] transition-colors" />
                  </div>
                  <Input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`transition-all ${formik.touched.password && formik.errors.password
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-300 hover:text-zinc-500 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <p className="text-xs text-red-500 font-medium ml-1 leading-relaxed">
                    {formik.errors.password as string}
                  </p>
                )}
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#004d40]/60 ml-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-zinc-300 group-focus-within:text-[#004d40] transition-colors" />
                  </div>
                  <Input
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className={`transition-all ${formik.touched.confirmPassword && formik.errors.confirmPassword
                      ? "border-red-500 focus-visible:ring-red-500"
                      : ""
                      }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-300 hover:text-zinc-500 transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <p className="text-xs text-red-500 font-medium ml-1">
                    {formik.errors.confirmPassword as string}
                  </p>
                )}
              </div>

              <Button
                disabled={loading}
                type="submit"
                className="w-full h-14 bg-[#004d40] hover:bg-[#00332b] text-white rounded text-lg font-bold shadow-lg shadow-[#004d40]/20 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50 mt-8"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Resetting...</span>
                  </div>
                ) : (
                  "Reset Password"
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-zinc-100 flex justify-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm font-bold text-zinc-500 hover:text-[#004d40] transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                Cancel and return to Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}