"use client"

import { useFormik } from "formik";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBulkEmployeeByHR } from "@/services/accounts";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import toast from "react-hot-toast";
import { Loader2, Plus, Trash2 } from "lucide-react";

interface CreateEmployeesBulkProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const emptyEmployee = {
  first_name: "",
  last_name: "",
  email: "",
  payroll_no: "",
};

export default function CreateEmployeesBulk({ onSuccess, onCancel }: CreateEmployeesBulkProps) {
  const token = useAxiosAuth();

  const formik = useFormik({
    initialValues: {
      employees: [{ ...emptyEmployee }],
    },
    onSubmit: async (values, { setSubmitting }) => {
      // Filter out completely empty rows just in case
      const validEmployees = values.employees.filter(
        (emp) => emp.first_name || emp.last_name || emp.email || emp.payroll_no
      );

      if (validEmployees.length === 0) {
        toast.error("Please add at least one employee");
        setSubmitting(false);
        return;
      }

      try {
        await createBulkEmployeeByHR({ employees: validEmployees }, token);
        toast.success(`Successfully created ${validEmployees.length} employees`);
        formik.resetForm();
        if (onSuccess) onSuccess();
      } catch (error: any) {
        console.log(error);
        
      } finally {
        setSubmitting(false);
      }
    },
  });

  const isPending = formik.isSubmitting;

  const addRow = () => {
    formik.setFieldValue("employees", [...formik.values.employees, { ...emptyEmployee }]);
  };

  const removeRow = (index: number) => {
    const newEmployees = [...formik.values.employees];
    newEmployees.splice(index, 1);
    formik.setFieldValue("employees", newEmployees);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Desktop Header row - hidden on small screens */}
        <div className="hidden md:grid md:grid-cols-[1fr_1fr_1.5fr_1fr_auto] gap-4 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-xl text-xs uppercase font-medium text-zinc-500">
          <div>First Name*</div>
          <div>Last Name*</div>
          <div>Email*</div>
          <div>Payroll No*</div>
          <div className="w-10 text-center">Act</div>
        </div>

        {/* Rows Container */}
        <div className="space-y-4 md:space-y-2">
          {formik.values.employees.map((employee, index) => (
            <div 
              key={index} 
              className="relative grid grid-cols-1 md:grid-cols-[1fr_1fr_1.5fr_1fr_auto] gap-4 p-4 md:p-2 bg-white border border-zinc-200 shadow-sm md:border-none md:shadow-none rounded-xl md:rounded-none md:hover:bg-zinc-50/50 transition-colors"
            >
              {/* Mobile delete button (top right) */}
              <div className="absolute top-2 right-2 md:hidden">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRow(index)}
                  disabled={isPending || formik.values.employees.length === 1}
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  aria-label="Remove row"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-1 md:space-y-0">
                <Label className="text-xs md:hidden">First Name*</Label>
                <Input
                  name={`employees.${index}.first_name`}
                  value={employee.first_name}
                  onChange={formik.handleChange}
                  required
                  disabled={isPending}
                  className="h-10 px-3 w-full"
                  placeholder="John"
                />
              </div>
              <div className="space-y-1 md:space-y-0">
                <Label className="text-xs md:hidden">Last Name*</Label>
                <Input
                  name={`employees.${index}.last_name`}
                  value={employee.last_name}
                  onChange={formik.handleChange}
                  required
                  disabled={isPending}
                  className="h-10 px-3 w-full"
                  placeholder="Doe"
                />
              </div>
              <div className="space-y-1 md:space-y-0">
                <Label className="text-xs md:hidden">Email*</Label>
                <Input
                  name={`employees.${index}.email`}
                  type="email"
                  value={employee.email}
                  onChange={formik.handleChange}
                  required
                  disabled={isPending}
                  className="h-10 px-3 w-full"
                  placeholder="john.doe@example.com"
                />
              </div>
              <div className="space-y-1 md:space-y-0">
                <Label className="text-xs md:hidden">Payroll No*</Label>
                <Input
                  name={`employees.${index}.payroll_no`}
                  value={employee.payroll_no}
                  onChange={formik.handleChange}
                  required
                  disabled={isPending}
                  className="h-10 px-3 w-full"
                  placeholder="PAY-001"
                />
              </div>
              
              {/* Desktop Delete button */}
              <div className="hidden md:flex items-start md:items-center justify-center pt-2 md:pt-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRow(index)}
                  disabled={isPending || formik.values.employees.length === 1}
                  className="h-10 w-10 text-red-500 hover:text-red-700 hover:bg-red-50"
                  title="Remove row"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <Button
          type="button"
          variant="outline"
          onClick={addRow}
          disabled={isPending}
          className="bg-emerald-50 text-[#004d40] border-emerald-200 hover:bg-emerald-100"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Row
        </Button>

        <div className="flex gap-3">
          {onCancel && (
            <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending}>
              Cancel
            </Button>
          )}
          <Button type="submit" disabled={isPending} className="bg-[#004d40] hover:bg-[#004d40]/90">
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Create Employees
          </Button>
        </div>
      </div>
    </form>
  );
}