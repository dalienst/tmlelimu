"use client";

import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createDepartment } from "@/services/departments";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";

interface CreateDepartmentProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateDepartment({ onSuccess, onCancel }: CreateDepartmentProps) {
  const token = useAxiosAuth();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      description: "",
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await createDepartment(values, token);
        toast.success("Department created successfully");
        formik.resetForm();
        if (onSuccess) onSuccess();
      } catch (error: any) {
        toast.error(error.response?.data?.detail || error.response?.data?.name?.[0] || "Failed to create department");
      } finally {
        setSubmitting(false);
      }
    },
  });

  const isPending = formik.isSubmitting;

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="name">Department Name*</Label>
        <Input
          id="name"
          name="name"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.name}
          required
          disabled={isPending}
          placeholder="e.g. Human Resources"
          className="w-full p-2"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Department Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          onChange={formik.handleChange}
          value={formik.values.email}
          disabled={isPending}
          placeholder="hr@tamarind.co.ke"
          className="w-full p-2"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          onChange={formik.handleChange}
          value={formik.values.description}
          disabled={isPending}
          placeholder="Brief description of the department's role..."
          className="resize-none w-full p-2"
          rows={3}
        />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          className="bg-[#004d40] hover:bg-[#004d40]/90 text-white"
          disabled={isPending || !formik.values.name}
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Department
        </Button>
      </div>
    </form>
  );
}
