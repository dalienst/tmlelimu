"use client";

import * as React from "react";
import { Upload, FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface FilePickerProps {
  id?: string;
  name?: string;
  accept?: string;
  onChange: (file: File | null) => void;
  value?: File | null;
  className?: string;
  error?: string;
}

export function FilePicker({
  id,
  name,
  accept,
  onChange,
  value,
  className,
  error,
}: FilePickerProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onChange(null);
  };

  return (
    <div className={cn("group relative", className)}>
      <input
        type="file"
        id={id}
        name={name}
        accept={accept}
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      
      <div
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex min-h-[120px] cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50/50 p-6 transition-all hover:border-[#004d40] hover:bg-[#004d40]/5",
          value && "border-[#004d40] bg-[#004d40]/5",
          error && "border-red-500 bg-red-50"
        )}
      >
        {!value ? (
          <>
            <div className="mb-3 rounded-full bg-zinc-100 p-3 text-zinc-500 group-hover:bg-[#004d40]/10 group-hover:text-[#004d40]">
              <Upload className="h-6 w-6" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-700">
                Click to upload or drag and drop
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {accept ? `Supported: ${accept.split(',').map(ext => ext.trim().replace('.', '').toUpperCase()).join(', ')}` : 'Select a file'}
              </p>
            </div>
          </>
        ) : (
          <div className="flex w-full items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-[#004d40] p-2 text-white">
                <FileText className="h-5 w-5" />
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-sm font-medium text-zinc-700">
                  {value.name}
                </p>
                <p className="text-xs text-zinc-500">
                  {(value.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="rounded-full p-1 text-zinc-400 hover:bg-zinc-200 hover:text-zinc-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
