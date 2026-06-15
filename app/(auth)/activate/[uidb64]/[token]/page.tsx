"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import { Lock, Loader2, Eye, EyeOff, AlertCircle, ArrowRight } from "lucide-react";
import { useFormik } from "formik";
import { activateAccount } from "@/services/accounts";
import Image from "next/image";

export default function ActivateAccount() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const params = useParams();
  const router = useRouter();

  const uidb64 = params.uidb64 as string;
  const token = params.token as string;

  const formik = useFormik({
    initialValues: {
      password: "",
      password_confirmation: "",
    },
    onSubmit: async (values) => {
      if (values.password !== values.password_confirmation) {
        toast.error("Passwords do not match");
        return;
      }

      setLoading(true);

      try {
        await activateAccount({
          uidb64,
          token,
          password: values.password,
          password_confirmation: values.password_confirmation,
        });

        toast.success("Account activated successfully! You can now log in.");
        router.push("/login");
      } catch (error: any) {
        // Handle Django REST framework errors generically
        if (error.response?.data && typeof error.response.data === "object" && !error.response.data.message) {
          const firstErrorKey = Object.keys(error.response.data)[0];
          const firstErrorMsg = error.response.data[firstErrorKey];
          toast.error(`${firstErrorKey}: ${Array.isArray(firstErrorMsg) ? firstErrorMsg[0] : firstErrorMsg}`);
        } else {
          toast.error(error.response?.data?.message || "Failed to activate account. The link may have expired.");
        }
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

      {/* Right Column: Activate Account Form */}
      <div className="flex-grow md:w-1/2 flex items-center justify-center p-8 bg-zinc-50 overflow-y-auto">
        <div className="w-full max-w-md bg-white rounded-2xl border border-zinc-200 p-8 shadow-xl relative my-8">
          
          {/* Logo Header for Mobile */}
          <div className="flex md:hidden items-center gap-3 mb-6 justify-center">
            <Image src="/logo.png" alt="Tamarind Logo" width={40} height={40} className="object-contain" />
            <div>
              <span className="font-bold text-lg text-[#004d40] tracking-tight block leading-none">TAMARIND</span>
              <span className="text-[10px] tracking-wider text-zinc-500 font-bold uppercase">Elimu System</span>
            </div>
          </div>

          <div className="text-center md:text-left mb-8">
            <h1 className="text-2xl font-bold text-zinc-900 mb-2">Activate Account</h1>
            <p className="text-xs font-medium text-zinc-500">Set your password to secure and activate your account.</p>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Password Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-xs font-bold text-zinc-700">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  placeholder="••••••••"
                  className="w-full bg-white border border-zinc-200 focus:border-[#004d40] rounded-xl py-3 pl-11 pr-11 text-sm font-medium outline-none transition-all placeholder:text-zinc-400"
                />
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-zinc-400 hover:text-[#004d40] transition-colors outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-zinc-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="flex flex-col gap-2">
              <label htmlFor="password_confirmation" className="text-xs font-bold text-zinc-700">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="password_confirmation"
                  name="password_confirmation"
                  type={showConfirmPassword ? "text" : "password"}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password_confirmation}
                  placeholder="••••••••"
                  className="w-full bg-white border border-zinc-200 focus:border-[#004d40] rounded-xl py-3 pl-11 pr-11 text-sm font-medium outline-none transition-all placeholder:text-zinc-400"
                />
                <Lock className="absolute left-4 top-3.5 w-4 h-4 text-zinc-400 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-3.5 text-zinc-400 hover:text-[#004d40] transition-colors outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 text-zinc-400" />
                  ) : (
                    <Eye className="w-4 h-4 text-zinc-400" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#004d40] hover:bg-[#00332b] active:scale-[0.99] disabled:opacity-50 disabled:active:scale-100 disabled:pointer-events-none text-white font-bold text-sm py-3.5 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Activating...
                </>
              ) : (
                <>
                  Activate Account
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}