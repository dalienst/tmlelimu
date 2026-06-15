"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useFormik } from "formik";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Mail, ArrowLeft, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { forgotPassword } from "@/services/accounts";
import { ForgotPasswordSchema } from "@/validation";
import Image from "next/image";

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
    <div className="min-h-screen bg-white flex flex-col md:flex-row font-sans">
      {/* Left Column: Visual branding and details */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-[#004d40] to-emerald-950 relative overflow-hidden items-center justify-center p-12 text-white">
        {/* Background abstract decorations */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-12 -translate-x-12 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-3 mb-8">
            <Image src="/logo.png" alt="Tamarind Logo" width={55} height={55} className="object-contain invert brightness-0" />
            <div>
              <span className="font-bold text-2xl tracking-tight block leading-none">TAMARIND</span>
              <span className="text-[11px] tracking-wider text-white/70 font-bold uppercase">Elimu System</span>
            </div>
          </div>

          <h2 className="text-3xl font-bold mb-6 leading-tight">
            Streamlined Learning & Knowledge Mastery
          </h2>
          <p className="text-sm font-medium text-white/80 leading-relaxed mb-8">
            The official learning portal for Tamarind Group staff. Access world-class courses, master company SOPs, and accelerate your career.
          </p>

          {/* Role guides */}
          <div className="space-y-4 pt-6 border-t border-white/10">
            <h4 className="text-xs font-bold text-white/60 uppercase tracking-wider">Platform Capabilities</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
                <span className="text-emerald-400 font-bold">Employee Portal</span>
                <span className="text-white/60">Complete courses & track progress</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
                <span className="text-amber-400 font-bold">Manager View</span>
                <span className="text-white/60">Monitor team compliance</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
                <span className="text-blue-400 font-bold">Trainer Center</span>
                <span className="text-white/60">Manage content & assessments</span>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex flex-col gap-1">
                <span className="text-purple-400 font-bold">HR Console</span>
                <span className="text-white/60">Full organizational overview</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Forgot Password Form */}
      <div className="flex-grow md:w-1/2 flex items-center justify-center p-8 bg-zinc-50">
        <div className="w-full max-w-md bg-white rounded-2xl border border-zinc-200 p-8 shadow-xl relative">
          
          {/* Logo Header for Mobile */}
          <div className="flex md:hidden items-center gap-3 mb-6 justify-center">
            <Image src="/logo.png" alt="Tamarind Logo" width={40} height={40} className="object-contain" />
            <div>
              <span className="font-bold text-lg text-[#004d40] tracking-tight block leading-none">TAMARIND</span>
              <span className="text-[10px] tracking-wider text-zinc-500 font-bold uppercase">Elimu System</span>
            </div>
          </div>

          <div className="text-center md:text-left mb-8">
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">Reset Password</h1>
            <p className="text-xs font-medium text-zinc-500">Enter your email to receive recovery instructions</p>
          </div>

          {isSuccess ? (
            <div className="flex flex-col items-center justify-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="w-20 h-20 bg-emerald-100/50 rounded-full flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10 text-[#004d40]" />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-zinc-900">Check Your Inbox</h3>
                <p className="text-zinc-500 text-xs px-4">
                  We've sent password reset instructions to <span className="font-bold text-zinc-700">{formik.values.email}</span>. Please check your spam folder if it doesn't arrive within 5 minutes.
                </p>
              </div>
              <button
                onClick={() => router.push("/reset-password")}
                className="w-full bg-[#004d40] hover:bg-[#00332b] active:scale-[0.99] text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md mt-4"
              >
                Enter Reset Code
              </button>
            </div>
          ) : (
            <form onSubmit={formik.handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs font-bold text-zinc-700">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    placeholder="name@tamarind.co.ke"
                    className={`w-full bg-white border ${
                      formik.touched.email && formik.errors.email
                        ? "border-red-500 focus:border-red-500"
                        : "border-zinc-200 focus:border-[#004d40]"
                    } rounded-xl py-3 pl-11 pr-4 text-sm font-medium outline-none transition-all placeholder:text-zinc-400`}
                  />
                  <Mail className="absolute left-4 top-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>
                {formik.touched.email && formik.errors.email ? (
                  <span className="text-[11px] font-bold text-red-500 flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    {formik.errors.email}
                  </span>
                ) : null}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#004d40] hover:bg-[#00332b] active:scale-[0.99] disabled:opacity-50 disabled:active:scale-100 disabled:pointer-events-none text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Recovery Link"
                )}
              </button>
            </form>
          )}

          {/* Back Link */}
          <div className="mt-8 text-center border-t border-zinc-100 pt-6">
            <Link
              href="/login"
              className="text-xs font-medium text-zinc-500 hover:text-[#004d40] transition-colors flex items-center justify-center gap-1 group"
            >
              <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" />
              Back to Login
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}