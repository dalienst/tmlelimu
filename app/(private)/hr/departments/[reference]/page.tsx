"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { useFetchAuthDepartment } from "@/hooks/departments/actions";
import { addHeadToDepartment, addStaffToDepartment } from "@/services/departments";
import { useFetchEmployees } from "@/hooks/accounts/actions";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import toast from "react-hot-toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Building2, Users, Shield, Pencil, Check, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

import UpdateDepartment from "@/forms/departments/UpdateDepartment";

export default function DepartmentDetailsPage({ params }: { params: Promise<{ reference: string }> }) {
  const router = useRouter();
  const token = useAxiosAuth();
  const { reference } = use(params);

  const { data: department, isLoading: isLoadingDept, refetch: refetchDept } = useFetchAuthDepartment(reference);
  const { data: employees, isLoading: isLoadingEmployees } = useFetchEmployees();
  
  const [isAddingHead, setIsAddingHead] = useState(false);
  const [isAddingStaff, setIsAddingStaff] = useState(false);

  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedHead, setSelectedHead] = useState<string>("");
  
  // Local state for tracking checked staff members
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);

  // Initialize selected staff when department data loads
  const handleAssignHead = async () => {
    if (!selectedHead) return;
    setIsAddingHead(true);
    try {
      await addHeadToDepartment(reference, { head: selectedHead }, token);
      toast.success("Department head updated successfully");
      refetchDept();
      setSelectedHead("");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to assign head");
    } finally {
      setIsAddingHead(false);
    }
  };

  const handleUpdateStaff = async () => {
    setIsAddingStaff(true);
    try {
      await addStaffToDepartment(reference, { staff: selectedStaff }, token);
      toast.success("Department staff updated successfully");
      refetchDept();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to update staff");
    } finally {
      setIsAddingStaff(false);
    }
  };

  const toggleStaff = (userReference: string) => {
    setSelectedStaff(prev => 
      prev.includes(userReference) 
        ? prev.filter(ref => ref !== userReference)
        : [...prev, userReference]
    );
  };

  // Sync initial staff state when editing
  const handleEditStaffClick = () => {
    if (department?.staff) {
      // In a real app, department.staff would be an array of references or objects.
      // Adjust based on your API structure. Assuming it's an array of references. 
      setSelectedStaff(department.staff);
    }
  };

  if (isLoadingDept || isLoadingEmployees) {
    return (
      <div className="p-8 mx-auto space-y-8">
        <Skeleton className="h-10 w-32 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <Skeleton className="h-[400px] w-full lg:col-span-2 rounded-3xl" />
          <Skeleton className="h-[400px] w-full rounded-3xl" />
        </div>
      </div>
    );
  }

  if (!department) {
    return (
      <div className="p-8 mx-auto text-center space-y-4">
        <Building2 className="mx-auto h-12 w-12 text-zinc-300" />
        <h2 className="text-2xl font-bold text-zinc-700">Department Not Found</h2>
        <Button onClick={() => router.back()} variant="outline">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="p-8 mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold text-[#004d40]">{department.name}</h1>
            <Badge variant="outline" className={department.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-red-50 text-red-700 border-red-200'}>
              {department.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          {department.email && <p className="text-zinc-500">{department.email}</p>}
        </div>
        <Button 
          variant="outline" 
          onClick={() => setIsUpdateOpen(true)}
          className="border-[#004d40]/20 text-[#004d40] hover:bg-emerald-50"
        >
          <Pencil className="mr-2 h-4 w-4" />
          Edit Details
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Details and Staff Management */}
        <div className="lg:col-span-2 space-y-8">
          {/* Department Information */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-semibold text-zinc-900 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-[#004d40]" />
              Department Information
            </h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-zinc-500 mb-1">Description</h3>
                <p className="text-zinc-900">{department.description || "No description provided."}</p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-100">
                <div>
                  <h3 className="text-sm font-medium text-zinc-500 mb-1">Department Code</h3>
                  <p className="text-zinc-900 font-mono">{department.code || "N/A"}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-zinc-500 mb-1">Created At</h3>
                  <p className="text-zinc-900">{new Date(department.created_at).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Staff Allocation */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-zinc-900 flex items-center gap-2">
                <Users className="h-5 w-5 text-[#004d40]" />
                Staff Members ({department.staff?.length || 0})
              </h2>
              <Button 
                onClick={() => {
                  handleEditStaffClick();
                  document.getElementById("staff-management-panel")?.scrollIntoView({ behavior: 'smooth' });
                }}
                variant="outline" 
                size="sm"
              >
                Manage Staff
              </Button>
            </div>

            {/* Current Staff List (Read-only view) */}
            <div className="space-y-2">
              {employees?.filter(e => department.staff?.includes(e.email)).map(user => (
                <div key={user.reference} className="flex items-center justify-between p-3 rounded-lg border border-zinc-100 bg-zinc-50/50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-[#004d40] font-semibold text-sm">
                      {user.first_name?.[0]}{user.last_name?.[0]}
                    </div>
                    <div>
                      <p className="font-medium text-sm text-zinc-900">{user.first_name} {user.last_name}</p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                    </div>
                  </div>
                </div>
              ))}
              {(!department.staff || department.staff.length === 0) && (
                <div className="text-center p-6 border border-dashed rounded-xl border-zinc-200 text-zinc-500">
                  No staff members currently assigned to this department.
                </div>
              )}
            </div>

            {/* Manage Staff Panel */}
            <div id="staff-management-panel" className="pt-6 border-t border-zinc-100 space-y-4">
              <h3 className="font-medium text-zinc-900">Add or Remove Staff</h3>
              <div className="max-h-[300px] overflow-y-auto space-y-1 border rounded-lg p-2">
                {employees?.filter(emp => emp.email !== department.head && !emp.is_manager).map(user => (
                  <label key={user.reference} className="flex items-center gap-3 p-3 rounded-lg hover:bg-zinc-50 cursor-pointer transition-colors">
                    <Checkbox 
                      checked={selectedStaff.includes(user.email)}
                      onCheckedChange={() => toggleStaff(user.email)}
                    />
                    <div>
                      <p className="font-medium text-sm text-zinc-900">{user.first_name} {user.last_name}</p>
                      <p className="text-xs text-zinc-500">{user.email}</p>
                    </div>
                    {user.email === department.head && (
                      <Badge variant="outline" className="ml-auto bg-amber-50 text-amber-700 border-amber-200">Department Head</Badge>
                    )}
                  </label>
                ))}
              </div>
              <div className="flex justify-end pt-2">
                <Button 
                  onClick={handleUpdateStaff}
                  disabled={isAddingStaff}
                  className="bg-[#004d40] hover:bg-[#004d40]/90 text-white"
                >
                  {isAddingStaff && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Staff Changes
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Department Head Assignment */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-6 space-y-6">
            <h2 className="text-xl font-semibold text-zinc-900 flex items-center gap-2">
              <Shield className="h-5 w-5 text-amber-600" />
              Department Head
            </h2>

            <div className="space-y-4">
              {department.head ? (
                <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/50 flex items-center gap-4">
                   <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">
                     H
                   </div>
                   <div>
                     <p className="font-semibold text-amber-900">Current Head</p>
                     <p className="text-sm text-amber-700/80 break-all">{department.head}</p>
                   </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 text-center text-sm text-zinc-500">
                  No department head assigned
                </div>
              )}

              <div className="pt-4 border-t border-zinc-100 space-y-3">
                <label className="text-sm font-medium text-zinc-700">Assign New Head</label>
                <div className="flex flex-col gap-3">
                  <Select value={selectedHead} onValueChange={setSelectedHead}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select an employee..." />
                    </SelectTrigger>
                    <SelectContent>
                      {employees?.filter(emp => emp.is_manager).map(emp => (
                        <SelectItem key={emp.reference} value={emp.email}>
                          {emp.first_name} {emp.last_name} ({emp.email})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    onClick={handleAssignHead} 
                    disabled={!selectedHead || isAddingHead}
                    className="w-full"
                  >
                    {isAddingHead && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Assign
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Update Dialog */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Department Details</DialogTitle>
            <DialogDescription>
              Update general information for {department.name}.
            </DialogDescription>
          </DialogHeader>
          <UpdateDepartment 
            department={department}
            onSuccess={() => { setIsUpdateOpen(false); refetchDept(); }}
            onCancel={() => setIsUpdateOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}