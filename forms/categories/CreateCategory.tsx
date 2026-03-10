"use client";

import { Formik, Form } from "formik";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { createCategory } from "@/services/categories";
import { Loader2 } from "lucide-react";

export default function CreateCategory({ onSuccess }: { onSuccess: () => void }) {
  const initialValues = {
    name: "",
    description: "",
    is_active: true,
  };

  const headers = useAxiosAuth();

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      await createCategory(values, headers);
      toast.success("Category created successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Failed to create category");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
    >
      {({
        values,
        handleChange,
        handleBlur,
        isSubmitting,
        setFieldValue,
      }) => (
        <Form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-700">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              type="text"
              placeholder="e.g. Health & Safety"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
              required
              disabled={isSubmitting}
              className="border-zinc-300 p-2"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-zinc-700">
              Description (Optional)
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Brief overview of the category..."
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.description}
              rows={4}
              disabled={isSubmitting}
              className="resize-none border-zinc-300 p-2"
            />
          </div>

          <div className="flex flex-row items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="is_active" className="text-base text-zinc-700 font-medium">
                Active Status
              </Label>
              <p className="text-sm text-zinc-500">
                Determine if this category should be visible immediately.
              </p>
            </div>
            <Switch
              id="is_active"
              checked={values.is_active}
              onCheckedChange={(checked) => setFieldValue("is_active", checked)}
              disabled={isSubmitting}
              className="data-[state=checked]:bg-[#004d40]"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#004d40] hover:bg-[#00332b] text-white py-2.5 shadow-md transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Category"
              )}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}