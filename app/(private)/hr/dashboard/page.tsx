"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useFetchAuthSops } from "@/hooks/sops/actions";
import { useFetchAccount, useFetchEmployees } from "@/hooks/accounts/actions";
import { useFetchAuthDepartments } from "@/hooks/departments/actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import SOPSTable from "@/components/sops/SOPSTable";
import { createSOPReadRecord } from "@/services/sopsreadrecords";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import toast from "react-hot-toast";
import CreateHR from "@/forms/accounts/CreateHR";
import CreateEmployee from "@/forms/accounts/CreateEmployee";
import CreateEmployeesBulk from "@/forms/accounts/CreateEmployeesBulk";
import CreateEmployeeBulkUpload from "@/forms/accounts/CreateEmployeesBulkUpload";

export default function HRDashboard() {
  const headers = useAxiosAuth();
  const { data: hrData, isLoading: isLoadingHr, refetch: refetchAccount } = useFetchAccount();
  const { data: sopsData, isLoading: isSopsLoading } = useFetchAuthSops();
  const { data: employeesData, isLoading: isEmployeesLoading } = useFetchEmployees();
  const { data: departmentsData, isLoading: isDepartmentsLoading } = useFetchAuthDepartments();
  const [isCreateHROpen, setIsCreateHROpen] = useState(false);
  const [isCreateEmployeeOpen, setIsCreateEmployeeOpen] = useState(false);
  const [isCreateBulkEmployeeOpen, setIsCreateBulkEmployeeOpen] = useState(false);
  const [isCreateBulkUploadOpen, setIsCreateBulkUploadOpen] = useState(false);

  const { activeSops, inactiveSops } = useMemo(() => {
    if (!sopsData?.results) return { activeSops: 0, inactiveSops: 0 };
    return {
      activeSops: sopsData.results.filter((sop) => sop.is_active).length,
      inactiveSops: sopsData.results.filter((sop) => !sop.is_active).length,
    };
  }, [sopsData]);

  // HR Department SOPs logic
  const [sopSearch, setSopSearch] = useState("");
  const [sopReadFilter, setSopReadFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [sopPage, setSopPage] = useState(1);
  const pageSize = 5;

  const hrDept = hrData?.departments?.[0];
  const hrSops = hrDept?.sops || [];

  const filteredHrSops = useMemo(() => {
    return hrSops.filter((s: any) => {
      const matchesSearch = s.title.toLowerCase().includes(sopSearch.toLowerCase()) ||
                            s.code.toLowerCase().includes(sopSearch.toLowerCase());
      const matchesRead = sopReadFilter === 'all' ? true : 
                          sopReadFilter === 'read' ? s.has_read : !s.has_read;
      return matchesSearch && matchesRead;
    });
  }, [hrSops, sopSearch, sopReadFilter]);

  const paginatedHrSops = filteredHrSops.slice((sopPage - 1) * pageSize, sopPage * pageSize);

  const handleMarkAsRead = async (sop: any) => {
    try {
      await createSOPReadRecord(headers, { sop: sop.title });
      toast.success("SOP marked as read successfully!");
      refetchAccount();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to mark SOP as read.");
    }
  };

  return (
    <div className="p-8  mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-lg font-semibold text-[#004d40]">HR Dashboard</h1>
          <h2 className="text-xl font-semibold">{isLoadingHr ? "Loading..." : `${hrData?.first_name} ${hrData?.last_name}`}</h2>
          <p className="text-zinc-500">Welcome to Tamarind Elimu System Management</p>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-emerald-100 text-[#004d40] border-emerald-200 hover:bg-emerald-100 px-4 py-1.5 rounded">
            HR Administrator
          </Badge>

          <Dialog open={isCreateHROpen} onOpenChange={setIsCreateHROpen}>
            <Dialog open={isCreateEmployeeOpen} onOpenChange={setIsCreateEmployeeOpen}>
              <Dialog open={isCreateBulkEmployeeOpen} onOpenChange={setIsCreateBulkEmployeeOpen}>
                <Dialog open={isCreateBulkUploadOpen} onOpenChange={setIsCreateBulkUploadOpen}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="bg-[#004d40] hover:bg-[#004d40]/90 text-white rounded px-5">
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
                    <CreateEmployeeBulkUpload onSuccess={() => setIsCreateBulkUploadOpen(false)} onCancel={() => setIsCreateBulkUploadOpen(false)} />
                  </DialogContent>
                </Dialog>

                <DialogContent className="w-[95vw] sm:max-w-[800px] md:max-w-6xl lg:max-w-7xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader className="mb-4">
                    <DialogTitle className="text-xl">Bulk Add Employees</DialogTitle>
                    <DialogDescription>
                      Add multiple employees at once to the Tamarind Elimu System. Fill out the rows below.
                    </DialogDescription>
                  </DialogHeader>
                  <CreateEmployeesBulk onSuccess={() => setIsCreateBulkEmployeeOpen(false)} onCancel={() => setIsCreateBulkEmployeeOpen(false)} />
                </DialogContent>
              </Dialog>

              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Create Employee</DialogTitle>
                  <DialogDescription>
                    Add a single employee to the Tamarind Elimu System.
                  </DialogDescription>
                </DialogHeader>
                <CreateEmployee onSuccess={() => setIsCreateEmployeeOpen(false)} onCancel={() => setIsCreateEmployeeOpen(false)} />
              </DialogContent>
            </Dialog>

            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create HR Account</DialogTitle>
                <DialogDescription>
                  Add a new HR Administrator to the system.
                </DialogDescription>
              </DialogHeader>
              <CreateHR onSuccess={() => setIsCreateHROpen(false)} onCancel={() => setIsCreateHROpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-zinc-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Total Departments</CardTitle>
          </CardHeader>
          <CardContent>
            {isDepartmentsLoading ? (
              <Skeleton className="h-10 w-16" />
            ) : (
              <div className="text-xl font-semibold text-[#004d40]">{departmentsData?.length || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-zinc-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Total Employees</CardTitle>
          </CardHeader>
          <CardContent>
            {isEmployeesLoading ? (
              <Skeleton className="h-10 w-16" />
            ) : (
              <div className="text-xl font-semibold text-[#004d40]">{employeesData?.length || 0}</div>
            )}
          </CardContent>
        </Card>

        <Card className="border-zinc-200">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-500 uppercase tracking-wider">SOP Library Status</CardTitle>
          </CardHeader>
          <CardContent>
            {isSopsLoading ? (
              <div className="space-y-3 mt-1">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-5 w-32" />
              </div>
            ) : (
              <div>
                <div className="text-xl font-semibold text-[#004d40]">
                  {activeSops} <span className="text-xl font-medium text-emerald-600/60">Active</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="bg-red-50 text-red-600 border-red-100 px-2 py-0.5 text-xs font-semibold">
                    {inactiveSops} Inactive
                  </Badge>
                  <span className="text-xs text-zinc-400 font-medium">hidden from portal</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {!hrDept && (
        <div className="bg-zinc-50 border border-zinc-200 rounded p-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-white rounded shadow-sm flex items-center justify-center text-[#004d40] mb-4">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">Welcome, HR Manager</h2>
          <p className="text-zinc-600 max-w-md mx-auto">
            This is your central hub for managing Tamarind Group&apos;s learning courses, SOPs, and employee certifications.
          </p>
        </div>
      )}

      {hrDept && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-zinc-900 flex items-center gap-2">
                My Department Documents
              </h2>
              <p className="text-sm text-zinc-500 font-medium mt-1">
                SOPs assigned to <span className="text-[#004d40] font-semibold">{hrDept.name}</span>
              </p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input 
                placeholder="Search SOPs..." 
                value={sopSearch}
                onChange={(e) => setSopSearch(e.target.value)}
                className="pl-10 h-10 rounded bg-white border-zinc-200 focus:bg-white transition-all text-sm shadow-sm"
              />
            </div>
          </div>

          <Card className="border-zinc-200 shadow-xl rounded overflow-hidden bg-white">
            <SOPSTable
              data={paginatedHrSops}
              isLoading={isLoadingHr}
              search={sopSearch}
              onSearch={setSopSearch}
              page={sopPage}
              onPageChange={setSopPage}
              totalCount={filteredHrSops.length}
              pageSize={pageSize}
              onMarkAsRead={handleMarkAsRead}
              readFilter={sopReadFilter}
              onReadFilterChange={setSopReadFilter}
            />
          </Card>
        </div>
      )}
    </div>
  );
}