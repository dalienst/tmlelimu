"use client";

import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { User, updateAccount } from "@/services/accounts";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  User as UserIcon, 
  Mail, 
  ShieldCheck, 
  BadgeCheck, 
  Fingerprint,
  Save,
  Building2
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

const ProfileSchema = Yup.object().shape({
  first_name: Yup.string().required("First name is required"),
  last_name: Yup.string().required("Last name is required"),
});

export default function ProfileUpdate({ user, onUpdate }: { user: User; onUpdate: () => void }) {
  const { update } = useSession();
  const headers = useAxiosAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const initialValues = {
    first_name: user.first_name || "",
    last_name: user.last_name || "",
  };

  const handleSubmit = async (values: { first_name: string; last_name: string }) => {
    setIsSubmitting(true);
    try {
      const updatedUser = await updateAccount(user.reference, values, headers);
      
      // Update next-auth session
      await update({
        ...user,
        first_name: values.first_name,
        last_name: values.last_name,
      });

      toast.success("Profile updated successfully");
      onUpdate();
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Institutional Identity Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 bg-gradient-to-br from-[#004d40] to-[#00332b] text-white rounded flex items-center justify-center font-bold text-3xl shadow-xl shadow-emerald-900/20 border-4 border-white">
            {user.first_name?.[0]}{user.last_name?.[0]}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-emerald-50 text-[#004d40] border-emerald-100 font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded">
                Personal Identity
              </Badge>
              <span className="text-zinc-300">•</span>
              <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Account Hub</span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              {user.first_name} {user.last_name}
            </h1>
            <p className="text-zinc-500 font-medium mt-1">
              {user.payroll_no} • Managed Digital Identity
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-zinc-100 shadow-xl rounded overflow-hidden bg-white">
            <CardHeader className="border-b border-zinc-50 bg-zinc-50/30">
              <CardTitle className="text-lg font-bold text-[#004d40] flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Identity Details
              </CardTitle>
              <CardDescription className="text-xs font-medium">Update your name as it appears in company records.</CardDescription>
            </CardHeader>
            <CardContent className="pt-8 px-8 pb-8">
              <Formik
                initialValues={initialValues}
                validationSchema={ProfileSchema}
                onSubmit={handleSubmit}
              >
                {({ values, errors, touched, handleChange, handleBlur }) => (
                  <Form className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="first_name" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">First Name</Label>
                        <Input
                          id="first_name"
                          name="first_name"
                          value={values.first_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`h-11 rounded border-zinc-200 focus:border-[#004d40] focus:ring-[#004d40] transition-all ${
                            errors.first_name && touched.first_name ? "border-red-500" : ""
                          }`}
                        />
                        {errors.first_name && touched.first_name && (
                          <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.first_name}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="last_name" className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Last Name</Label>
                        <Input
                          id="last_name"
                          name="last_name"
                          value={values.last_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`h-11 rounded border-zinc-200 focus:border-[#004d40] focus:ring-[#004d40] transition-all ${
                            errors.last_name && touched.last_name ? "border-red-500" : ""
                          }`}
                        />
                        {errors.last_name && touched.last_name && (
                          <p className="text-[10px] text-red-500 font-bold uppercase tracking-wider">{errors.last_name}</p>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-zinc-50 flex justify-end">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-[#004d40] hover:bg-[#00332b] text-white px-8 h-11 rounded shadow-lg shadow-emerald-900/10 gap-2 font-bold text-xs uppercase tracking-wider"
                      >
                        <Save className="w-4 h-4" />
                        {isSubmitting ? "Updating..." : "Save Changes"}
                      </Button>
                    </div>
                  </Form>
                )}
              </Formik>
            </CardContent>
          </Card>

          {/* Department Access (Read Only) */}
          <Card className="border-zinc-100 shadow-lg rounded overflow-hidden bg-white">
            <CardHeader className="border-b border-zinc-50 bg-zinc-50/30">
              <CardTitle className="text-lg font-bold text-zinc-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-amber-600" />
                Departmental Associations
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-zinc-50">
                {user.departments?.map((dept) => (
                  <div key={dept.reference} className="p-6 flex items-center justify-between group hover:bg-zinc-50/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded bg-amber-50 flex items-center justify-center border border-amber-100/30">
                        <ShieldCheck className="w-5 h-5 text-amber-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-zinc-900">{dept.name}</h4>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">{dept.code}</p>
                      </div>
                    </div>
                    <Badge className="bg-zinc-100 text-zinc-500 border-none font-bold text-[9px] uppercase tracking-wider rounded">
                      Primary Member
                    </Badge>
                  </div>
                ))}
                {(!user.departments || user.departments.length === 0) && (
                  <div className="p-8 text-center text-zinc-400 text-sm italic">
                    No departmental associations found.
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Institutional Data Sidebar */}
        <div className="space-y-6">
          <Card className="border-none shadow-xl bg-gradient-to-br from-zinc-900 to-zinc-800 text-white rounded overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="text-sm font-bold uppercase tracking-[0.2em] opacity-60">System Registry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-2 pb-8">
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                    <Mail className="w-4 h-4 text-emerald-300" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Email Address</span>
                    <span className="text-xs font-bold truncate opacity-90">{user.email}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                    <Fingerprint className="w-4 h-4 text-amber-300" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">Employee Payroll</span>
                    <span className="text-xs font-bold truncate opacity-90">{user.payroll_no}</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                    <BadgeCheck className="w-4 h-4 text-blue-300" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">System Reference</span>
                    <span className="text-xs font-mono font-bold truncate opacity-60">{user.reference}</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <div className="bg-emerald-500/10 border border-emerald-500/20 rounded p-4">
                  <p className="text-[10px] text-emerald-100/70 leading-relaxed">
                    Institutional data is managed by HR. Contact your administrator to update restricted fields.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats or Footer */}
          <div className="bg-zinc-50 rounded border border-dashed border-zinc-200 p-6 text-center">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.2em] mb-2">Member Since</p>
            <p className="text-sm font-bold text-zinc-900">
              {new Date(user.created_at).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
