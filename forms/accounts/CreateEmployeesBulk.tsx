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
  password: "",
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
        if (error.response?.data && typeof error.response.data === "object" && !error.response.data.message) {
          const firstErrorKey = Object.keys(error.response.data)[0];
          const firstErrorMsg = error.response.data[firstErrorKey];
          toast.error(`${firstErrorKey}: ${Array.isArray(firstErrorMsg) ? firstErrorMsg[0] : firstErrorMsg}`);
        } else {
          toast.error(error.response?.data?.message || "Failed to create employees");
        }
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
      <div className="overflow-x-auto border border-zinc-200 rounded-xl">
        <table className="w-full text-sm text-left">
          <thead className="bg-zinc-50 border-b border-zinc-200 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-3 py-3 font-medium">First Name*</th>
              <th className="px-3 py-3 font-medium">Last Name*</th>
              <th className="px-3 py-3 font-medium">Email</th>
              <th className="px-3 py-3 font-medium">Payroll No*</th>
              <th className="px-3 py-3 font-medium">Password</th>
              <th className="px-3 py-3 font-medium w-12 text-center">Act</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white">
            {formik.values.employees.map((employee, index) => {
              const requiresEmail = !employee.password;
              const requiresPassword = !employee.email;

              return (
                <tr key={index} className="hover:bg-zinc-50/50">
                  <td className="p-2 align-top">
                    <Input
                      name={`employees.${index}.first_name`}
                      value={employee.first_name}
                      onChange={formik.handleChange}
                      required
                      disabled={isPending}
                      className="h-10 px-3 w-full min-w-[120px]"
                      placeholder="John"
                    />
                  </td>
                  <td className="p-2 align-top">
                    <Input
                      name={`employees.${index}.last_name`}
                      value={employee.last_name}
                      onChange={formik.handleChange}
                      required
                      disabled={isPending}
                      className="h-10 px-3 w-full min-w-[120px]"
                      placeholder="Doe"
                    />
                  </td>
                  <td className="p-2 align-top">
                    <Input
                      name={`employees.${index}.email`}
                      type="email"
                      value={employee.email}
                      onChange={formik.handleChange}
                      required={requiresEmail}
                      disabled={isPending}
                      className="h-10 px-3 w-full min-w-[180px]"
                      placeholder={requiresEmail ? "Required w/o pass" : "Optional"}
                    />
                  </td>
                  <td className="p-2 align-top">
                    <Input
                      name={`employees.${index}.payroll_no`}
                      value={employee.payroll_no}
                      onChange={formik.handleChange}
                      required
                      disabled={isPending}
                      className="h-10 px-3 w-full min-w-[120px]"
                      placeholder="PAY-001"
                    />
                  </td>
                  <td className="p-2 align-top">
                    <Input
                      name={`employees.${index}.password`}
                      type="password"
                      value={employee.password}
                      onChange={formik.handleChange}
                      required={requiresPassword}
                      disabled={isPending || (employee.email !== "" && employee.password === "")}
                      className="h-10 px-3 w-full min-w-[140px]"
                      placeholder={requiresPassword ? "Required w/o email" : "Hidden"}
                      style={{ opacity: employee.email && !employee.password ? 0.3 : 1 }}
                      title={employee.email ? "Password is not required when an email is provided." : ""}
                    />
                  </td>
                  <td className="p-2 align-top text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeRow(index)}
                      disabled={isPending || formik.values.employees.length === 1}
                      className="h-10 w-10 text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
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