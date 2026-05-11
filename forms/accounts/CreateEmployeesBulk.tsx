"use client"

import { useState } from "react";
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
  const [employees, setEmployees] = useState([{ ...emptyEmployee }]);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);

    // Filter out completely empty rows
    const validEmployees = employees.filter(
      (emp) => emp.first_name || emp.last_name || emp.email || emp.payroll_no
    );

    if (validEmployees.length === 0) {
      toast.error("Please add at least one employee");
      setIsPending(false);
      return;
    }

    try {
      const payload = {
        employees: validEmployees
      };

      await createBulkEmployeeByHR(payload, token);
      toast.success(`Successfully created ${validEmployees.length} employees`);
      setEmployees([{ ...emptyEmployee }]);
      if (onSuccess) onSuccess();
    } catch (error: any) {
      if (error.response?.data) {
        const data = error.response.data;

        if (Array.isArray(data)) {
          // It's likely an array of errors mapping to the employees array
          for (let i = 0; i < data.length; i++) {
            if (data[i] && Object.keys(data[i]).length > 0) {
              const firstErrorKey = Object.keys(data[i])[0];
              const firstErrorMsg = data[i][firstErrorKey];
              toast.error(`Row ${i + 1} - ${firstErrorKey}: ${Array.isArray(firstErrorMsg) ? firstErrorMsg[0] : firstErrorMsg}`);
              break; // Just show the first error in the list to avoid spamming
            }
          }
        } else if (typeof data === "object" && !data.message) {
          // General object error mapping
          // Check if it's nested under "employees"
          const errorObj = data.employees && Array.isArray(data.employees) ? data.employees[0] : data;

          if (errorObj && typeof errorObj === "object") {
            const firstErrorKey = Object.keys(errorObj)[0];
            if (firstErrorKey) {
              const firstErrorMsg = errorObj[firstErrorKey];
              toast.error(`${firstErrorKey}: ${Array.isArray(firstErrorMsg) ? firstErrorMsg[0] : firstErrorMsg}`);
            } else {
              toast.error("Validation failed for one or more employees");
            }
          } else if (typeof data.employees === "string") {
            toast.error(data.employees);
          } else {
            toast.error("Validation failed");
          }
        } else {
          toast.error(data.message || "Failed to create employees");
        }
      } else {
        toast.error("Failed to create employees");
      }
    } finally {
      setIsPending(false);
    }
  };

  const addRow = () => {
    setEmployees([...employees, { ...emptyEmployee }]);
  };

  const removeRow = (index: number) => {
    const newEmployees = [...employees];
    newEmployees.splice(index, 1);
    setEmployees(newEmployees);
  };

  const handleInputChange = (index: number, field: keyof typeof emptyEmployee, value: string) => {
    const newEmployees = [...employees];
    newEmployees[index][field] = value;
    setEmployees(newEmployees);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Desktop Header row - hidden on small screens */}
        <div className="hidden md:grid md:grid-cols-[1fr_1fr_1.5fr_1fr_auto] gap-4 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded text-xs uppercase font-medium text-zinc-500">
          <div>First Name*</div>
          <div>Last Name*</div>
          <div>Email*</div>
          <div>Payroll No*</div>
          <div className="w-10 text-center">Act</div>
        </div>

        {/* Rows Container */}
        <div className="space-y-4 md:space-y-2">
          {employees.map((employee, index) => (
            <div
              key={index}
              className="relative grid grid-cols-1 md:grid-cols-[1fr_1fr_1.5fr_1fr_auto] gap-4 p-4 md:p-2 bg-white border border-zinc-200 shadow-sm md:border-none md:shadow-none rounded md:rounded-none md:hover:bg-zinc-50/50 transition-colors"
            >
              {/* Mobile delete button (top right) */}
              <div className="absolute top-2 right-2 md:hidden">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removeRow(index)}
                  disabled={isPending || employees.length === 1}
                  className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                  aria-label="Remove row"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-1 md:space-y-0">
                <Label className="text-xs md:hidden">First Name*</Label>
                <Input
                  value={employee.first_name}
                  onChange={(e) => handleInputChange(index, "first_name", e.target.value)}
                  required
                  disabled={isPending}
                  className="h-10 px-3 w-full"
                  placeholder="John"
                />
              </div>
              <div className="space-y-1 md:space-y-0">
                <Label className="text-xs md:hidden">Last Name*</Label>
                <Input
                  value={employee.last_name}
                  onChange={(e) => handleInputChange(index, "last_name", e.target.value)}
                  required
                  disabled={isPending}
                  className="h-10 px-3 w-full"
                  placeholder="Doe"
                />
              </div>
              <div className="space-y-1 md:space-y-0">
                <Label className="text-xs md:hidden">Email*</Label>
                <Input
                  type="email"
                  value={employee.email}
                  onChange={(e) => handleInputChange(index, "email", e.target.value)}
                  required
                  disabled={isPending}
                  className="h-10 px-3 w-full"
                  placeholder="john.doe@example.com"
                />
              </div>
              <div className="space-y-1 md:space-y-0">
                <Label className="text-xs md:hidden">Payroll No*</Label>
                <Input
                  value={employee.payroll_no}
                  onChange={(e) => handleInputChange(index, "payroll_no", e.target.value)}
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
                  disabled={isPending || employees.length === 1}
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