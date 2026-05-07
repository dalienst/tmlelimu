"use client";

import { useState } from "react";
import { Formik, Form } from "formik";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { UpdateSopSchema } from "@/validation";
import { Sops, updateSops } from "@/services/sops";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { FilePicker } from "@/components/ui/file-picker";

export default function UpdateSop({ 
  sopData, 
  onSuccess 
}: { 
  sopData: Sops;
  onSuccess: () => void;
}) {
  const { data: session } = useSession();
  const [fileError, setFileError] = useState("");

  const initialValues = {
    title: sopData.title || "",
    description: sopData.description || "",
    file: null,
    is_active: sopData.is_active !== undefined ? sopData.is_active : true,
  };

  const headers = useAxiosAuth()

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("is_active", String(values.is_active));
      
      // Only append file if changed
      if (values.file) {
        formData.append("file", values.file);
      }

      await updateSops(sopData.reference, formData, headers);
      
      toast.success("SOP updated successfully");
      onSuccess();
    } catch (error: any) {
      toast.error(error?.response?.data?.detail || "Failed to update SOP");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={UpdateSopSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        isSubmitting,
        setFieldValue,
      }) => (
        <Form className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-zinc-700">
              Title
            </Label>
            <Input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Employee Code of Conduct"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.title}
              className={
                errors.title && touched.title ? "border-red-500" : "border-zinc-300"
              }
            />
            {errors.title && touched.title && (
              <p className="text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-zinc-700">
              Description
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Brief overview of the SOP..."
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.description}
              rows={4}
              className={`resize-none ${
                errors.description && touched.description
                  ? "border-red-500"
                  : "border-zinc-300"
              }`}
            />
            {errors.description && touched.description && (
              <p className="text-sm text-red-500">{errors.description}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="file" className="text-zinc-700">
              Replace SOP Document (Optional)
            </Label>
            <FilePicker
              id="file"
              name="file"
              accept=".pdf,.doc,.docx"
              value={values.file}
              onChange={(file) => {
                setFieldValue("file", file);
                setFileError("");
              }}
              error={fileError || (errors.file && touched.file ? String(errors.file) : "")}
            />
            <p className="text-xs text-zinc-500">Leave blank to keep current document.</p>
            {fileError && <p className="text-sm text-red-500">{fileError}</p>}
            {errors.file && touched.file && (
              <p className="text-sm text-red-500">{String(errors.file)}</p>
            )}
          </div>

          <div className="flex flex-row items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 p-4">
            <div className="space-y-0.5">
              <Label htmlFor="is_active" className="text-base text-zinc-700 font-medium">
                Active Status
              </Label>
              <p className="text-sm text-zinc-500">
                Determine if this SOP should be visible to employees immediately.
              </p>
            </div>
            <Switch
              id="is_active"
              checked={values.is_active}
              onCheckedChange={(checked) => setFieldValue("is_active", checked)}
              className="data-[state=checked]:bg-[#004d40]"
            />
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#004d40] hover:bg-[#00332b] text-white py-2.5 shadow-md transition-all"
            >
              {isSubmitting ? "Updating..." : "Update SOP"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
