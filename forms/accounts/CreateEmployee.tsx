"use client"

import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createEmployeeByHR } from "@/services/accounts";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface CreateEmployeeProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateEmployee({ onSuccess, onCancel }: CreateEmployeeProps) {
  const token = useAxiosAuth();

  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      payroll_no: "",
      password: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await createEmployeeByHR(values, token);
        toast.success("Employee created successfully");
        formik.resetForm();
        if (onSuccess) onSuccess();
      } catch (error: any) {
        if (error.response?.data && typeof error.response.data === "object" && !error.response.data.message) {
          const firstErrorKey = Object.keys(error.response.data)[0];
          const firstErrorMsg = error.response.data[firstErrorKey];
          toast.error(`${firstErrorKey}: ${Array.isArray(firstErrorMsg) ? firstErrorMsg[0] : firstErrorMsg}`);
        } else {
          toast.error(error.response?.data?.message || "Failed to create employee");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const isPending = formik.isSubmitting;

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">First Name</Label>
          <Input
            id="first_name"
            name="first_name"
            value={formik.values.first_name}
            onChange={formik.handleChange}
            required
            disabled={isPending}
            className="w-full p-2"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="last_name">Last Name</Label>
          <Input
            id="last_name"
            name="last_name"
            value={formik.values.last_name}
            onChange={formik.handleChange}
            required
            disabled={isPending}
            className="w-full p-2"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            required={!formik.values.password}
            disabled={isPending}
            className="w-full p-2"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="payroll_no">Payroll Number</Label>
          <Input
            id="payroll_no"
            name="payroll_no"
            value={formik.values.payroll_no}
            onChange={formik.handleChange}
            required
            disabled={isPending}
            className="w-full p-2"
          />
        </div>
      </div>

      {!formik.values.email && (
        <div className="space-y-2">
          <Label htmlFor="password">
            Password 
            <span className="text-zinc-400 font-normal text-xs ml-1">
              (Required since no email provided)
            </span>
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            required={!formik.values.email}
            disabled={isPending}
            className="w-full p-2"
          />
        </div>
      )}

      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isPending} className="bg-[#004d40] hover:bg-[#004d40]/90">
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Employee
        </Button>
      </div>
    </form>
  );
}