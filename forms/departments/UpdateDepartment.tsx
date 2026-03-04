"use client";

import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { Department, updateDepartment } from "@/services/departments";
import toast from "react-hot-toast";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface UpdateDepartmentProps {
  department: Department;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function UpdateDepartment({ department, onSuccess, onCancel }: UpdateDepartmentProps) {
  const token = useAxiosAuth();

  const formik = useFormik({
    initialValues: {
      name: department.name || "",
      email: department.email || "",
      description: department.description || "",
      is_active: department.is_active ?? true,
    },
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await updateDepartment(department.reference, values, token);
        toast.success("Department updated successfully");
        if (onSuccess) onSuccess();
      } catch (error: any) {
        toast.error(error.response?.data?.detail || error.response?.data?.name?.[0] || "Failed to update department");
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
          className="resize-none w-full p-2"
          rows={3}

        />
      </div>

      <div className="flex items-center justify-between pt-2 pb-2">
        <div className="space-y-0.5">
          <Label>Active Status</Label>
          <div className="text-sm text-zinc-500">
            Determine if this department is currently active
          </div>
        </div>
        <Switch
          checked={formik.values.is_active}
          onCheckedChange={(checked) => formik.setFieldValue("is_active", checked)}
          disabled={isPending}
          className="data-[state=checked]:bg-[#004d40]"
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
          Update Department
        </Button>
      </div>
    </form>
  );
}
