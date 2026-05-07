"use client";

import { useRouter, useParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Eye, EyeOff, Loader2, Lock } from "lucide-react";
import { useFormik } from "formik";
import { activateAccount } from "@/services/accounts";

export default function ActivateAccount() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

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
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-zinc-50 px-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-10" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#004d40]/10 rounded blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded blur-[100px] animate-pulse delay-1000" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-emerald-50 text-[#004d40] border-emerald-100 font-medium uppercase tracking-widest py-1.5 px-4 shadow-sm hover:bg-emerald-50">
            Tamarind Elimu System
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter text-zinc-900 mb-2">
            Activate <span className="text-[#004d40]">Account.</span>
          </h1>
          <p className="text-zinc-500 font-medium">
            Set your password to secure your account.
          </p>
        </div>

        <Card className="border-zinc-200 shadow-2xl rounded overflow-hidden bg-white/80 backdrop-blur-md">
          <CardHeader className="pt-8 px-8">
            <CardTitle className="text-2xl font-bold text-zinc-900 tracking-tight text-center">
              Create Password
            </CardTitle>
            <CardDescription className="text-center font-medium text-zinc-500">
              Please enter and confirm your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={formik.handleSubmit} className="space-y-6">
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
                    className="transition-all"
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
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-[#004d40]/60 ml-1">
                  Confirm Password
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-zinc-300 group-focus-within:text-[#004d40] transition-colors" />
                  </div>
                  <Input
                    name="password_confirmation"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formik.values.password_confirmation}
                    onChange={formik.handleChange}
                    className="transition-all"
                  />
                </div>
              </div>

              <Button
                disabled={loading}
                type="submit"
                className="w-full h-14 bg-[#004d40] hover:bg-[#00332b] text-white rounded text-lg font-bold shadow-lg shadow-[#004d40]/20 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Activating...</span>
                  </div>
                ) : (
                  "Activate Account"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="bg-zinc-50 border-t border-zinc-100 py-6 flex flex-col items-center">
            <p className="text-xs font-bold text-zinc-400 tracking-wide">
              TAMARIND GROUP LEARNING & DEVELOPMENT
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}