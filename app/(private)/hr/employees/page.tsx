"use client";

import { useState } from "react";
import { MoreHorizontal, ShieldAlert, ShieldCheck, PlusCircle, KeyRound } from "lucide-react";
import { useFetchEmployees } from "@/hooks/accounts/actions";
import { User, updateUserByHR, resetMemberPassword } from "@/services/accounts";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import toast from "react-hot-toast";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import CreateHR from "@/forms/accounts/CreateHR";
import CreateEmployee from "@/forms/accounts/CreateEmployee";
import CreateEmployeesBulk from "@/forms/accounts/CreateEmployeesBulk";
import CreateEmployeeBulkUpload from "@/forms/accounts/CreateEmployeesBulkUpload";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

export default function EmployeeManagementPage() {
  const { data: employeesData, isLoading, refetch } = useFetchEmployees();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [togglingRole, setTogglingRole] = useState<{ user: User, role: keyof User, label: string } | null>(null);
  const [isToggling, setIsToggling] = useState(false);

  const [resetPasswordUser, setResetPasswordUser] = useState<User | null>(null);
  const [resetPasswordForm, setResetPasswordForm] = useState({ password: '', password_confirmation: '' });

  const [isCreateHROpen, setIsCreateHROpen] = useState(false);
  const [isCreateEmployeeOpen, setIsCreateEmployeeOpen] = useState(false);
  const [isCreateBulkEmployeeOpen, setIsCreateBulkEmployeeOpen] = useState(false);
  const [isCreateBulkUploadOpen, setIsCreateBulkUploadOpen] = useState(false);

  const headers = useAxiosAuth();

  const handleToggleRole = async () => {
    if (!togglingRole) return;
    setIsToggling(true);
    try {
      // Toggle the specific Boolean role
      const newValue = !togglingRole.user[togglingRole.role];
      const payload = {
        [togglingRole.role]: newValue
      };

      await updateUserByHR(togglingRole.user.reference, payload, headers);
      
      toast.success(`${togglingRole.user.first_name}'s ${togglingRole.label} role ${newValue ? 'granted' : 'revoked'}`);
      refetch();
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Failed to update employee role");
    } finally {
      setIsToggling(false);
      setTogglingRole(null);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPasswordUser) return;
    
    if (resetPasswordForm.password !== resetPasswordForm.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }

    if (resetPasswordForm.password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }

    setIsToggling(true);
    try {
      await resetMemberPassword(resetPasswordUser.reference, resetPasswordForm, headers);
      toast.success(`Password reset successfully for ${resetPasswordUser.first_name}`);
      setResetPasswordUser(null);
      setResetPasswordForm({ password: '', password_confirmation: '' });
    } catch (e: any) {
      toast.error(e?.response?.data?.detail || "Failed to reset password");
    } finally {
      setIsToggling(false);
    }
  };

  const filteredEmployees = employeesData?.filter((emp) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      emp.first_name?.toLowerCase().includes(searchLower) ||
      emp.last_name?.toLowerCase().includes(searchLower) ||
      emp.email?.toLowerCase().includes(searchLower) ||
      emp.payroll_no?.toLowerCase().includes(searchLower)
    );
  }) || [];

  return (
    <div className="p-8 mx-auto space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#004d40]">Employee Management</h1>
          <p className="text-zinc-500">View and manage roles for Tamarind Group employees</p>
        </div>
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Input 
            placeholder="Search name, email, or payroll no..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="rounded-full bg-white md:w-72 p-2"
          />

          <Dialog open={isCreateHROpen} onOpenChange={setIsCreateHROpen}>
            <Dialog open={isCreateEmployeeOpen} onOpenChange={setIsCreateEmployeeOpen}>
              <Dialog open={isCreateBulkEmployeeOpen} onOpenChange={setIsCreateBulkEmployeeOpen}>
                <Dialog open={isCreateBulkUploadOpen} onOpenChange={setIsCreateBulkUploadOpen}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="bg-[#004d40] hover:bg-[#004d40]/90 text-white rounded-full px-5">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64">
                      <DropdownMenuLabel>Management Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => setIsCreateEmployeeOpen(true)} className="cursor-pointer">
                        Create Single Employee
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setIsCreateBulkEmployeeOpen(true)} className="cursor-pointer">
                        Bulk Create Employees (Manual form)
                      </DropdownMenuItem>
                      <DropdownMenuItem onSelect={() => setIsCreateBulkUploadOpen(true)} className="cursor-pointer">
                        Bulk Create Employees (CSV upload)
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onSelect={() => setIsCreateHROpen(true)} className="cursor-pointer">
                        Create HR Account
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Upload Employees via CSV</DialogTitle>
                      <DialogDescription>
                        Upload a CSV file containing employee details. Ensure it matches the required format.
                      </DialogDescription>
                    </DialogHeader>
                    <CreateEmployeeBulkUpload 
                      onSuccess={() => { setIsCreateBulkUploadOpen(false); refetch(); }} 
                      onCancel={() => setIsCreateBulkUploadOpen(false)} 
                    />
                  </DialogContent>
                </Dialog>
                
                <DialogContent className="w-[95vw] sm:max-w-[800px] md:max-w-6xl lg:max-w-7xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl">Bulk Add Employees</DialogTitle>
                    <DialogDescription>
                      Add multiple employees at once to the Tamarind Elimu System. Fill out the rows below.
                    </DialogDescription>
                  </DialogHeader>
                  <CreateEmployeesBulk 
                    onSuccess={() => { setIsCreateBulkEmployeeOpen(false); refetch(); }} 
                    onCancel={() => setIsCreateBulkEmployeeOpen(false)} 
                  />
                </DialogContent>
              </Dialog>

              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create Employee</DialogTitle>
                  <DialogDescription>
                    Add a single employee to the Tamarind Elimu System.
                  </DialogDescription>
                </DialogHeader>
                <CreateEmployee 
                  onSuccess={() => { setIsCreateEmployeeOpen(false); refetch(); }} 
                  onCancel={() => setIsCreateEmployeeOpen(false)} 
                />
              </DialogContent>
            </Dialog>

            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create HR Account</DialogTitle>
                <DialogDescription>
                  Add a new HR Administrator to the system.
                </DialogDescription>
              </DialogHeader>
              <CreateHR 
                onSuccess={() => { setIsCreateHROpen(false); refetch(); }} 
                onCancel={() => setIsCreateHROpen(false)} 
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-12 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-zinc-50">
                <TableRow>
                  <TableHead className="w-[15%]">Name</TableHead>
                  <TableHead className="w-[20%]">Email</TableHead>
                  <TableHead className="w-[10%]">Payroll No</TableHead>
                  <TableHead className="w-[40%]">Active Roles</TableHead>
                  <TableHead className="w-[15%] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((user: User) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium text-zinc-900">
                        {user.first_name} {user.last_name}
                      </TableCell>
                      <TableCell className="text-zinc-500">
                        {user.email}
                      </TableCell>
                      <TableCell className="text-zinc-500">
                        {user.payroll_no || "-"}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-2">
                          {user.is_superuser && <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-200 border-none">Superuser</Badge>}
                          {user.is_hr && <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 border-none">HR</Badge>}
                          {user.is_manager && <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-200 border-none">Manager</Badge>}
                          {user.is_trainer && <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-200 border-none">Trainer</Badge>}
                          {user.is_hod && <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-200 border-none">HOD</Badge>}
                          {user.is_employee && <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 border-none">Employee</Badge>}
                          {/* Fallback if no roles */}
                          {!user.is_superuser && !user.is_hr && !user.is_manager && !user.is_trainer && !user.is_hod && !user.is_employee && (
                            <span className="text-xs text-zinc-400 italic">No roles assigned</span>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>Manage Roles</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setTogglingRole({ user, role: 'is_employee', label: 'Employee' })}
                              className="cursor-pointer font-medium"
                            >
                              {user.is_employee ? <ShieldAlert className="mr-2 h-4 w-4 text-red-500" /> : <ShieldCheck className="mr-2 h-4 w-4 text-emerald-500" />}
                              {user.is_employee ? "Revoke Employee" : "Grant Employee"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setTogglingRole({ user, role: 'is_manager', label: 'Manager' })}
                              className="cursor-pointer font-medium"
                            >
                              {user.is_manager ? <ShieldAlert className="mr-2 h-4 w-4 text-red-500" /> : <ShieldCheck className="mr-2 h-4 w-4 text-emerald-500" />}
                              {user.is_manager ? "Revoke Manager" : "Grant Manager"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setTogglingRole({ user, role: 'is_trainer', label: 'Trainer' })}
                              className="cursor-pointer font-medium"
                            >
                              {user.is_trainer ? <ShieldAlert className="mr-2 h-4 w-4 text-red-500" /> : <ShieldCheck className="mr-2 h-4 w-4 text-emerald-500" />}
                              {user.is_trainer ? "Revoke Trainer" : "Grant Trainer"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setTogglingRole({ user, role: 'is_hod', label: 'HOD' })}
                              className="cursor-pointer font-medium"
                            >
                              {user.is_hod ? <ShieldAlert className="mr-2 h-4 w-4 text-red-500" /> : <ShieldCheck className="mr-2 h-4 w-4 text-emerald-500" />}
                              {user.is_hod ? "Revoke HOD" : "Grant HOD"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => setTogglingRole({ user, role: 'is_hr', label: 'HR Admin' })}
                              className="cursor-pointer font-medium"
                            >
                              {user.is_hr ? <ShieldAlert className="mr-2 h-4 w-4 text-red-500" /> : <ShieldCheck className="mr-2 h-4 w-4 text-emerald-500" />}
                              {user.is_hr ? "Revoke HR Admin" : "Grant HR Admin"}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => setResetPasswordUser(user)}
                              className="cursor-pointer font-medium text-amber-600"
                            >
                              <KeyRound className="mr-2 h-4 w-4 text-amber-600" />
                              Reset Password
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-32 text-center text-zinc-500">
                      {searchTerm ? "No employees matched your search." : "No employees found in the system."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Role Toggle Confirmation */}
      <AlertDialog open={!!togglingRole} onOpenChange={(open) => {
        if (!isToggling && !open) setTogglingRole(null);
      }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {togglingRole?.user[togglingRole.role] ? `Revoke ${togglingRole?.label} Role?` : `Grant ${togglingRole?.label} Role?`}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {togglingRole?.user[togglingRole.role] 
                ? `Are you sure you want to remove the ${togglingRole?.label} privileges from ${togglingRole?.user.first_name}? They will lose access to associated features.`
                : `Are you sure you want to promote ${togglingRole?.user.first_name} to ${togglingRole?.label}? They will gain new privileges.`
              }
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isToggling}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleToggleRole}
              disabled={isToggling}
              className={togglingRole?.user[togglingRole?.role] ? "bg-red-600 hover:bg-red-700 text-white" : "bg-emerald-600 hover:bg-emerald-700 text-white"}
            >
              {isToggling ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Dialog */}
      <Dialog open={!!resetPasswordUser} onOpenChange={(open) => {
        if (!isToggling && !open) {
          setResetPasswordUser(null);
          setResetPasswordForm({ password: '', password_confirmation: '' });
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Set a new password for {resetPasswordUser?.first_name} {resetPasswordUser?.last_name}. They will be able to log in immediately with this new password.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleResetPassword} className="space-y-4 pt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <Input
                type="password"
                required
                value={resetPasswordForm.password}
                onChange={(e) => setResetPasswordForm({ ...resetPasswordForm, password: e.target.value })}
                disabled={isToggling}
                placeholder="Enter new password"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <Input
                type="password"
                required
                value={resetPasswordForm.password_confirmation}
                onChange={(e) => setResetPasswordForm({ ...resetPasswordForm, password_confirmation: e.target.value })}
                disabled={isToggling}
                placeholder="Confirm new password"
              />
            </div>
            <div className="pt-4 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setResetPasswordUser(null);
                  setResetPasswordForm({ password: '', password_confirmation: '' });
                }}
                disabled={isToggling}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isToggling} className="bg-amber-600 hover:bg-amber-700 text-white">
                {isToggling ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}