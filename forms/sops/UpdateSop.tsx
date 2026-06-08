"use client";

import { useState } from "react";
import { Formik, Form } from "formik";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { UpdateSopSchema } from "@/validation";
import { Sops, SopsMinified, updateSops } from "@/services/sops";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { FilePicker } from "@/components/ui/file-picker";
import { Checkbox } from "@/components/ui/checkbox";
import { useFetchDepartments } from "@/hooks/departments/actions";
import { Building2 } from "lucide-react";

export default function UpdateSop({
  sopData,
  onSuccess
}: {
  sopData: Sops | SopsMinified;
  onSuccess: () => void;
}) {
  const { data: session } = useSession();
  const [fileError, setFileError] = useState("");
  const { data: departments, isLoading: isLoadingDepartments } = useFetchDepartments();

  const initialValues = {
    title: sopData.title || "",
    description: sopData.description || "",
    file: null,
    is_active: sopData.is_active !== undefined ? sopData.is_active : true,
    is_all_departments: 'is_all_departments' in sopData ? sopData.is_all_departments : false,
    department_names: 'departments' in sopData && Array.isArray(sopData.departments) 
      ? sopData.departments.map((d: any) => d.name) 
      : [] as string[],
  };

  const headers = useAxiosAuth()

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("is_active", String(values.is_active));
      formData.append("is_all_departments", String(values.is_all_departments));
      
      values.department_names.forEach((name: string) => {
        formData.append("department_names", name);
      });

      // Only append file if changed
      if (values.file) {
        formData.append("file", values.file);
      }

      await updateSops(sopData.reference, formData as any, headers);

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
                errors.title && touched.title ? "border-red-500 focus-visible:ring-red-500" : "border-zinc-200 focus-visible:ring-[#004d40]"
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
              rows={3}
              className={`resize-none min-h-[80px] ${errors.description && touched.description
                  ? "border-red-500 focus-visible:ring-red-500"
                  : "border-zinc-200 focus-visible:ring-[#004d40]"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-row items-center justify-between rounded border border-zinc-200 bg-zinc-50 p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label htmlFor="is_active" className="text-sm text-zinc-700 font-semibold">
                  Active Status
                </Label>
                <p className="text-[11px] text-zinc-500 leading-tight pr-2">
                  Visible to employees immediately.
                </p>
              </div>
              <Switch
                id="is_active"
                checked={values.is_active}
                onCheckedChange={(checked) => setFieldValue("is_active", checked)}
                className="data-[state=checked]:bg-[#004d40]"
              />
            </div>

            <div className="flex flex-row items-center justify-between rounded border border-zinc-200 bg-zinc-50 p-3 shadow-sm">
              <div className="space-y-0.5">
                <Label htmlFor="is_all_departments" className="text-sm text-zinc-700 font-semibold">
                  All Departments
                </Label>
                <p className="text-[11px] text-zinc-500 leading-tight pr-2">
                  Link to all departments automatically.
                </p>
              </div>
              <Switch
                id="is_all_departments"
                checked={values.is_all_departments}
                onCheckedChange={(checked) => setFieldValue("is_all_departments", checked)}
                className="data-[state=checked]:bg-[#004d40]"
              />
            </div>
          </div>

          {!values.is_all_departments && (
            <div className="space-y-3">
              <Label className="text-zinc-700 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#004d40]" />
                Target Departments
              </Label>
              <div className="max-h-40 overflow-y-auto border border-zinc-200 rounded p-2 bg-zinc-50/50 space-y-1">
                {isLoadingDepartments ? (
                  <p className="text-sm text-zinc-500 p-2 text-center">Loading departments...</p>
                ) : departments && departments.length > 0 ? (
                  departments.map((dept) => (
                    <label key={dept.reference} className="flex items-center space-x-3 p-2 hover:bg-white rounded cursor-pointer transition-colors border border-transparent hover:border-zinc-200 shadow-sm hover:shadow">
                      <Checkbox
                        checked={values.department_names.includes(dept.name)}
                        onCheckedChange={(checked) => {
                          const current = values.department_names;
                          if (checked) {
                            setFieldValue("department_names", [...current, dept.name]);
                          } else {
                            setFieldValue("department_names", current.filter((name: string) => name !== dept.name));
                          }
                        }}
                        className="data-[state=checked]:bg-[#004d40] data-[state=checked]:border-[#004d40]"
                      />
                      <span className="text-sm font-medium text-zinc-700">{dept.name}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-zinc-500 p-2 text-center">No departments available.</p>
                )}
              </div>
            </div>
          )}

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
