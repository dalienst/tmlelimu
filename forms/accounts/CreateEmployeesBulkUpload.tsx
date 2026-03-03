"use client"

import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { createBulkEmployeeByHRCSV } from "@/services/accounts";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import toast from "react-hot-toast";
import { Loader2, UploadCloud, FileType2, X, DownloadCloud } from "lucide-react";
import { useState, useRef } from "react";
import { downloadTemplate } from "@/services/accounts";

interface CreateEmployeeBulkUploadProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function CreateEmployeeBulkUpload({ onSuccess, onCancel }: CreateEmployeeBulkUploadProps) {
  const token = useAxiosAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadTemplate = async () => {
    try {
      setIsDownloading(true);
      const blob = await downloadTemplate(token);
      
      // Create a blob URL and trigger download
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'employee_bulk_upload_template.csv');
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("Failed to download template. Please try again.");
      console.error(error);
    } finally {
      setIsDownloading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      file: null as File | null,
    },
    onSubmit: async (values, { setSubmitting }) => {
      if (!values.file) {
        toast.error("Please select a CSV file to upload.");
        setSubmitting(false);
        return;
      }

      try {
        await createBulkEmployeeByHRCSV({ file: values.file }, token);
        toast.success("Employees uploaded and created successfully");
        formik.resetForm();
        if (onSuccess) onSuccess();
      } catch (error: any) {
        if (error.response?.data && typeof error.response.data === "object" && !error.response.data.message) {
          const firstErrorKey = Object.keys(error.response.data)[0];
          const firstErrorMsg = error.response.data[firstErrorKey];
          toast.error(`${firstErrorKey}: ${Array.isArray(firstErrorMsg) ? firstErrorMsg[0] : firstErrorMsg}`);
        } else {
          toast.error(error.response?.data?.message || "Failed to upload employees");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const isPending = formik.isSubmitting;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file: File) => {
    if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
      toast.error("Please upload a valid CSV file.");
      return;
    }
    formik.setFieldValue("file", file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    formik.setFieldValue("file", null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between mb-2">
          <Label>Upload CSV File</Label>
          <Button 
            type="button" 
            variant="outline" 
            size="sm" 
            onClick={handleDownloadTemplate}
            disabled={isDownloading || isPending}
            className="text-[#004d40] border-[#004d40]/20 hover:bg-emerald-50 h-8 text-xs"
          >
            {isDownloading ? (
              <Loader2 className="w-3 h-3 mr-2 animate-spin" />
            ) : (
              <DownloadCloud className="w-3 h-3 mr-2" />
            )}
            Download Template
          </Button>
        </div>
        
        {!formik.values.file ? (
          <div
            className={`relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-xl transition-colors ${
              dragActive ? "border-[#004d40] bg-emerald-50/50" : "border-zinc-300 bg-zinc-50 hover:bg-zinc-100"
            } ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !isPending && fileInputRef.current?.click()}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6 text-zinc-500">
              <UploadCloud className={`w-10 h-10 mb-3 ${dragActive ? "text-[#004d40]" : "text-zinc-400"}`} />
              <p className="mb-2 text-sm">
                <span className="font-semibold text-[#004d40]">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-zinc-500">CSV files only</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv, text/csv"
              className="hidden"
              onChange={handleChange}
              disabled={isPending}
            />
          </div>
        ) : (
          <div className="flex items-center justify-between p-4 border border-zinc-200 rounded-xl bg-white shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <FileType2 className="w-6 h-6 text-[#004d40]" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-zinc-900 truncate max-w-[200px] sm:max-w-[300px]">
                  {formik.values.file.name}
                </span>
                <span className="text-xs text-zinc-500">
                  {(formik.values.file.size / 1024).toFixed(2)} KB
                </span>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={removeFile}
              disabled={isPending}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-zinc-100">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
            Cancel
          </Button>
        )}
        <Button 
          type="submit" 
          disabled={isPending || !formik.values.file} 
          className="bg-[#004d40] hover:bg-[#004d40]/90 text-white"
        >
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Upload Employees
        </Button>
      </div>
    </form>
  );
}