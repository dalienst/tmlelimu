"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { getSession, signIn } from "next-auth/react";
import Link from "next/link";
import { Session, User } from "next-auth";
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
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useFormik } from "formik";
import { LoginSchema } from "@/validation";

interface CustomUser extends User {
  is_employee?: boolean;
  is_manager?: boolean;
  is_trainer?: boolean;
  is_hod?: boolean;
  is_hr?: boolean;
  is_superuser?: boolean;
}

interface CustomSession extends Session {
  user?: CustomUser;
}

export default function Login() {
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      setLoading(true);

      const response = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      const session = (await getSession()) as CustomSession | null;

      setLoading(false);

      if (response?.error) {
        toast.error("Invalid email or password");
      } else {
        toast.success("Login successful! Redirecting...");

        if (session?.user?.is_hr === true) {
          router.push("/hr/dashboard");
        } else if (session?.user?.is_manager === true) {
          router.push("/manager/dashboard");
        } else if (session?.user?.is_employee === true) {
          router.push("/employee/dashboard");
        } else if (session?.user?.is_hod === true) {
          router.push("/hod/dashboard");
        } else if (session?.user?.is_trainer === true) {
          router.push("/trainer/dashboard");
        } else if (session?.user?.is_superuser === true) {
          router.push("/admin/dashboard");
        } else {
          router.push("/");
        }
      }
    },
  });

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-zinc-50 px-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-10" />
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[#004d40]/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-amber-500/10 rounded-full blur-[100px] animate-pulse delay-1000" />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-emerald-50 text-[#004d40] border-emerald-100 font-medium uppercase tracking-widest py-1.5 px-4 shadow-sm hover:bg-emerald-50">
            Tamarind Elimu System
          </Badge>
          <h1 className="text-4xl font-bold tracking-tighter text-zinc-900 mb-2">
            Welcome <span className="text-[#004d40]">Back.</span>
          </h1>
          <p className="text-zinc-500 font-medium">
            Secure access to the Tamarind Learning Portal.
          </p>
        </div>

        <Card className="border-zinc-200 shadow-2xl rounded-2xl overflow-hidden bg-white/80 backdrop-blur-md">
          <CardHeader className="pt-8 px-8">
            <CardTitle className="text-2xl font-bold text-zinc-900 tracking-tight text-center">
              Login
            </CardTitle>
            <CardDescription className="text-center font-medium text-zinc-500">
              Enter your credentials to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
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
                    className={`pl-10 transition-all ${formik.touched.email && formik.errors.email
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

              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-bold uppercase tracking-widest text-[#004d40]/60">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    title="Forgot Password"
                    className="text-xs font-bold text-[#004d40] hover:text-amber-600 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                </div>
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
                    className={`pl-10 pr-10 transition-all ${formik.touched.password && formik.errors.password
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
                  <p className="text-xs text-red-500 font-medium ml-1">
                    {formik.errors.password}
                  </p>
                )}
              </div>

              <Button
                disabled={loading}
                type="submit"
                className="w-full h-14 bg-[#004d40] hover:bg-[#00332b] text-white rounded-xl text-lg font-bold shadow-lg shadow-[#004d40]/20 transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
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
