"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { addHeadToDepartment, addStaffToDepartment, addSOPToDepartment } from "@/services/departments";
import { useFetchEmployees } from "@/hooks/accounts/actions";
import { useFetchAuthSops } from "@/hooks/sops/actions";
import { Sops, updateSops } from "@/services/sops";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import toast from "react-hot-toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  Shield, 
  Pencil, 
  Check, 
  Loader2, 
  Files, 
  Plus, 
  Search, 
  ChevronDown,
  MoreHorizontal,
  EyeOff,
  Eye,
  Settings2
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import SOPSTable from "@/components/sops/SOPSTable";
import UpdateSop from "@/forms/sops/UpdateSop";
import UpdateDepartment from "@/forms/departments/UpdateDepartment";
import { useFetchDepartment } from "@/hooks/departments/actions";

export default function DepartmentDetailsPage({ params }: { params: Promise<{ reference: string }> }) {
  const router = useRouter();
  const token = useAxiosAuth();
  const { reference } = use(params);

  const { data: department, isLoading: isLoadingDept, refetch: refetchDept } = useFetchDepartment(reference);
  const { data: employees, isLoading: isLoadingEmployees } = useFetchEmployees();
  
  // All SOPs for the selection dialog
  const { data: allSopsData } = useFetchAuthSops({
    page_size: 100 
  });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const [isAddingHead, setIsAddingHead] = useState(false);
  const [isAddingStaff, setIsAddingStaff] = useState(false);

  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isAddSopOpen, setIsAddSopOpen] = useState(false);
  const [selectedHead, setSelectedHead] = useState<string>("");
  
  const [selectedSops, setSelectedSops] = useState<string[]>([]);
  const [isAddingSops, setIsAddingSops] = useState(false);
  const [addSearch, setAddSearch] = useState("");

  const [editingSop, setEditingSop] = useState<Sops | null>(null);
  const [togglingSop, setTogglingSop] = useState<Sops | null>(null);
  const [isToggling, setIsToggling] = useState(false);

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

  const handleToggleActiveSop = async () => {
    if (!togglingSop) return;
    setIsToggling(true);
    try {
      const formData = new FormData();
      formData.append("is_active", String(!togglingSop.is_active));
      
      await updateSops(togglingSop.reference, formData, token);
      toast.success(`SOP ${togglingSop.is_active ? 'deactivated' : 'activated'} successfully`);
      refetchDept();
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((e as any)?.response?.data?.detail || "Failed to update SOP status");
    } finally {
      setIsToggling(false);
      setTogglingSop(null);
    }
  };

  const handleAddSopsToDepartment = async () => {
    if (selectedSops.length === 0) return;
    setIsAddingSops(true);
    try {
      await addSOPToDepartment(reference, { sop: selectedSops }, token);
      toast.success("SOPs added to department successfully");
      setIsAddSopOpen(false);
      setSelectedSops([]);
      refetchDept();
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      toast.error((e as any)?.response?.data?.detail || "Failed to add SOPs to department");
    } finally {
      setIsAddingSops(false);
    }
  };

  const availableSops = allSopsData?.results.filter(
    (sop) => !department?.sops_detail.some(s => s.title === sop.title) && 
    sop.title.toLowerCase().includes(addSearch.toLowerCase())
  ) || [];

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
        <h2 className="text-2xl font-semibold text-zinc-700">Department Not Found</h2>
        <Button onClick={() => router.back()} variant="outline">Go Back</Button>
      </div>
    );
  }

  // Filter department.sops_detail based on search/page locally
  const filteredDeptSops: Sops[] = department.sops_detail
    .filter(sop => sop.title.toLowerCase().includes(search.toLowerCase()))
    .map(sop => ({
      id: sop.reference,
      title: sop.title,
      description: "", 
      file: "", 
      is_active: sop.is_active,
      created_at: sop.created_at,
      updated_at: sop.updated_at,
      reference: sop.reference,
      created_by: "",
      updated_by: "",
      code: sop.code || "",
      departments: [],
      categories: [],
    }));

  return (
    <div className="p-8 mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold text-[#004d40] uppercase tracking-tight">{department.name}</h1>
            <Badge variant="outline" className={department.is_active ? 'bg-emerald-50 text-emerald-700 border-emerald-200 uppercase text-[10px] font-semibold px-2.5 py-0.5 rounded-full' : 'bg-red-50 text-red-700 border-red-200 uppercase text-[10px] font-semibold px-2.5 py-0.5 rounded-full'}>
              {department.is_active ? 'Active' : 'Inactive'}
            </Badge>
          </div>
          {department.email && <p className="text-zinc-500 font-medium">Department: {department.email}</p>}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="border-[#004d40]/20 text-[#004d40] hover:bg-emerald-50 rounded-full px-6 font-semibold"
            >
              Actions
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 p-1 rounded-xl shadow-xl border-zinc-200">
             <DropdownMenuItem onClick={() => setIsUpdateOpen(true)} className="cursor-pointer font-semibold py-2">
                <Pencil className="mr-2 h-4 w-4" />
                Edit Department
             </DropdownMenuItem>
             <DropdownMenuSeparator />
             <DropdownMenuItem onClick={() => setIsAddSopOpen(true)} className="cursor-pointer font-semibold py-2 text-[#004d40] focus:text-[#004d40] focus:bg-emerald-50">
                <Plus className="mr-2 h-4 w-4" />
                Associate SOP
             </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
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
                  className="bg-[#004d40] hover:bg-[#004d40]/90 text-white rounded-full font-semibold px-6"
                >
                  {isAddingStaff && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Save Staff Changes
                </Button>
              </div>
            </div>
          </div>

          {/* Associated SOPs Table Card */}
          <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden min-h-[400px]">
            <div className="p-6 border-b border-zinc-100">
              <h2 className="text-xl font-semibold text-zinc-900 flex items-center gap-2">
                <Files className="h-5 w-5 text-[#004d40]" />
                Associated SOPs ({department.sops_detail.length})
              </h2>
            </div>
            
            <SOPSTable 
              data={filteredDeptSops} 
              isLoading={false} 
              onEdit={setEditingSop} 
              onToggle={setTogglingSop} 
              search={search}
              onSearch={setSearch}
              page={page}
              onPageChange={setPage}
              totalCount={filteredDeptSops.length}
              pageSize={pageSize}
            />
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
        <DialogContent className="sm:max-w-[500px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#004d40]">Edit Department Details</DialogTitle>
            <DialogDescription className="font-medium">
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

      {/* Associate SOP Dialog */}
      <Dialog open={isAddSopOpen} onOpenChange={setIsAddSopOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-semibold text-[#004d40]">Add SOPs to {department.name}</DialogTitle>
            <DialogDescription className="font-medium">
              Select available SOPs to associate with this department.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="relative group">
              <Input 
                placeholder="Filter available SOPs..." 
                value={addSearch}
                onChange={(e) => setAddSearch(e.target.value)}
                className="pl-10 h-11 rounded-xl border-zinc-200 focus:border-[#004d40] transition-all bg-zinc-50 group-focus-within:bg-white"
              />
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors group-focus-within:text-[#004d40]" />
            </div>
            
            <div className="max-h-80 overflow-y-auto space-y-2 border border-zinc-100 rounded-2xl p-4 bg-zinc-50/50">
              {availableSops.length > 0 ? (
                availableSops.map((sop) => (
                  <div key={sop.id} className="flex items-center space-x-3 p-3 hover:bg-white rounded-xl transition-all border border-transparent hover:border-zinc-100 group shadow-sm hover:shadow-md">
                    <Checkbox 
                      id={`sop-${sop.id}`} 
                      checked={selectedSops.includes(sop.title)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedSops([...selectedSops, sop.title]);
                        } else {
                          setSelectedSops(selectedSops.filter(id => id !== sop.title));
                        }
                      }}
                      className="rounded-md border-zinc-300 data-[state=checked]:bg-[#004d40] data-[state=checked]:border-[#004d40]"
                    />
                    <Label 
                      htmlFor={`sop-${sop.id}`}
                      className="text-sm font-semibold text-zinc-700 leading-none cursor-pointer flex-1 py-1"
                    >
                      {sop.title}
                    </Label>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center space-y-2">
                  <Files className="mx-auto h-8 w-8 text-zinc-300" />
                  <p className="text-zinc-500 font-semibold text-sm">
                    {allSopsData ? "No matching available SOPs found." : "Loading availability..."}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsAddSopOpen(false)} className="rounded-full font-semibold">Cancel</Button>
            <Button 
              onClick={handleAddSopsToDepartment}
              disabled={selectedSops.length === 0 || isAddingSops}
              className="bg-[#004d40] hover:bg-[#00332b] text-white rounded-full font-semibold px-8 shadow-lg shadow-emerald-200/50"
            >
              {isAddingSops && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isAddingSops ? "Adding..." : `Add Selected (${selectedSops.length})`}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit SOP Dialog */}
      <Dialog open={!!editingSop} onOpenChange={(open) => !open && setEditingSop(null)}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#004d40]">Edit SOP Details</DialogTitle>
            <DialogDescription className="font-medium">
              Update information for &quot;{editingSop?.title}&quot;
            </DialogDescription>
          </DialogHeader>
          {editingSop && (
            <UpdateSop 
              sopData={editingSop} 
              onSuccess={() => {
                setEditingSop(null);
                refetchDept();
              }} 
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Toggle SOP Confirmation Alert */}
      <AlertDialog open={!!togglingSop} onOpenChange={(open) => {
        if (!isToggling && !open) setTogglingSop(null);
      }}>
        <AlertDialogContent className="rounded-2xl border-none shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-xl font-semibold text-zinc-900">
              {togglingSop?.is_active ? "Deactivate SOP?" : "Activate SOP?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="font-medium">
              {togglingSop?.is_active 
                ? "This will hide the SOP from employees, but it will remain accessible to HR administrators." 
                : "This will make the SOP visible to all employees again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={isToggling} className="rounded-full border-zinc-200 font-semibold">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleActiveSop}
              disabled={isToggling}
              className={togglingSop?.is_active 
                ? "bg-amber-600 hover:bg-amber-700 text-white rounded-full font-semibold px-8 shadow-lg shadow-amber-200/50" 
                : "bg-emerald-600 hover:bg-emerald-700 text-white rounded-full font-semibold px-8 shadow-lg shadow-emerald-200/50"}
            >
              {isToggling && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isToggling ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
