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
import { 
  PlusCircle, Search, Users, Building2, FileText, EyeOff, CheckCircle, 
  ChevronRight, TrendingUp, UserPlus, FileSpreadsheet, ListTodo, ShieldCheck,
  ChevronRightSquare
} from "lucide-react";
import Link from "next/link";
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

  const complianceRate = useMemo(() => {
    if (!hrSops || hrSops.length === 0) return 0;
    const readCount = hrSops.filter((s: any) => s.has_read).length;
    return Math.round((readCount / hrSops.length) * 100);
  }, [hrSops]);

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
    <div className="p-6 md:p-8 w-full space-y-8 animate-in fade-in duration-500">
      
      {/* Top Breadcrumb & Header row */}
      <div className="space-y-4">
        <div className="flex items-center gap-1 text-xs text-zinc-400 font-semibold uppercase tracking-wider">
          <span>Home</span>
          <ChevronRight className="w-3.5 h-3.5 text-zinc-300" />
          <span className="text-[#004d40]">HR Dashboard</span>
        </div>

        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 border-b border-zinc-100 pb-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight text-zinc-900 leading-tight">
              Dashboard
            </h1>
            <p className="text-sm text-zinc-500 mt-1 font-medium">
              Gain real-time insights into Tamarind Group&apos;s training compliance, departments, and activities.
            </p>
          </div>
          <div className="flex items-center gap-3 self-start md:self-auto">
            <Badge className="bg-emerald-50 text-[#004d40] border border-emerald-100 hover:bg-emerald-50 px-3 py-1.5 rounded text-xs font-semibold">
              <ShieldCheck className="w-3.5 h-3.5 mr-1 inline-block" />
              HR Administrator
            </Badge>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-[#004d40] hover:bg-[#004d40]/90 text-white rounded px-4 h-10 shadow-sm transition-all duration-200">
                  <PlusCircle className="mr-2 h-4.5 w-4.5" />
                  Management Actions
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64 p-1.5 rounded shadow-xl border-zinc-150">
                <DropdownMenuLabel className="font-semibold text-zinc-700 text-xs px-2.5 py-2">Create Users</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-100" />
                <DropdownMenuItem onSelect={() => setIsCreateEmployeeOpen(true)} className="cursor-pointer font-semibold text-zinc-600 hover:text-zinc-900 rounded py-2">
                  <UserPlus className="w-4 h-4 mr-2 text-zinc-400" />
                  Create Single Employee
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setIsCreateBulkEmployeeOpen(true)} className="cursor-pointer font-semibold text-zinc-600 hover:text-zinc-900 rounded py-2">
                  <ListTodo className="w-4 h-4 mr-2 text-zinc-400" />
                  Bulk Create Employees (Form)
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => setIsCreateBulkUploadOpen(true)} className="cursor-pointer font-semibold text-zinc-600 hover:text-zinc-900 rounded py-2">
                  <FileSpreadsheet className="w-4 h-4 mr-2 text-zinc-400" />
                  Bulk Create Employees (CSV)
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-100" />
                <DropdownMenuLabel className="font-semibold text-zinc-700 text-xs px-2.5 py-2">Administrators</DropdownMenuLabel>
                <DropdownMenuItem onSelect={() => setIsCreateHROpen(true)} className="cursor-pointer font-semibold text-[#004d40] hover:bg-emerald-50 rounded py-2">
                  <ShieldCheck className="w-4 h-4 mr-2 text-emerald-600" />
                  Create HR Account
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* 4-Grid Stats Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Employees */}
        <div className="bg-white border border-zinc-150 rounded p-4 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-300 flex items-center gap-3.5 group">
          <div className="p-2.5 rounded bg-emerald-50 text-[#004d40] group-hover:scale-105 transition-transform duration-300">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest leading-none">Employees</p>
            {isEmployeesLoading ? (
              <Skeleton className="h-6 w-12 mt-1" />
            ) : (
              <h3 className="text-xl font-semibold text-zinc-800 mt-1">{employeesData?.length || 0}</h3>
            )}
          </div>
        </div>

        {/* Total Departments */}
        <div className="bg-white border border-zinc-150 rounded p-4 shadow-sm hover:shadow-md hover:border-amber-100 transition-all duration-300 flex items-center gap-3.5 group">
          <div className="p-2.5 rounded bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform duration-300">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest leading-none">Departments</p>
            {isDepartmentsLoading ? (
              <Skeleton className="h-6 w-12 mt-1" />
            ) : (
              <h3 className="text-xl font-semibold text-zinc-800 mt-1">{departmentsData?.length || 0}</h3>
            )}
          </div>
        </div>

        {/* Active SOPs */}
        <div className="bg-white border border-zinc-150 rounded p-4 shadow-sm hover:shadow-md hover:border-teal-100 transition-all duration-300 flex items-center gap-3.5 group">
          <div className="p-2.5 rounded bg-teal-50 text-teal-600 group-hover:scale-105 transition-transform duration-300">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest leading-none">Active SOPs</p>
            {isSopsLoading ? (
              <Skeleton className="h-6 w-12 mt-1" />
            ) : (
              <h3 className="text-xl font-semibold text-zinc-800 mt-1">{activeSops}</h3>
            )}
          </div>
        </div>

        {/* HR Dept SOPs */}
        <div className="bg-white border border-zinc-150 rounded p-4 shadow-sm hover:shadow-md hover:border-indigo-100 transition-all duration-300 flex items-center gap-3.5 group">
          <div className="p-2.5 rounded bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform duration-300">
            <ListTodo className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest leading-none">Dept SOPs</p>
            {isLoadingHr ? (
              <Skeleton className="h-6 w-12 mt-1" />
            ) : (
              <h3 className="text-xl font-semibold text-zinc-800 mt-1">{hrSops.length}</h3>
            )}
          </div>
        </div>
      </div>

      {/* Main split-layout section */}
      {!hrDept ? (
        <div className="bg-zinc-50/50 border border-zinc-200/80 rounded p-16 flex flex-col items-center justify-center text-center backdrop-blur-sm shadow-inner">
          <div className="w-16 h-16 bg-white rounded shadow-md flex items-center justify-center text-[#004d40] mb-5 border border-zinc-100">
            <Building2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-semibold text-zinc-900 mb-2">Welcome to Tamarind Elimu</h2>
          <p className="text-zinc-500 max-w-md mx-auto text-sm leading-relaxed">
            This is your central hub for managing Tamarind Group&apos;s learning courses, SOPs, and employee certifications.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Side: Department Documents list (2/3 Width) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-zinc-850 flex items-center gap-2">
                  My Department Documents
                </h2>
                <p className="text-xs text-zinc-400 font-semibold mt-1">
                  SOPs assigned to the <span className="text-[#004d40] font-semibold">{hrDept.name}</span> department
                </p>
              </div>
            </div>

            <Card className="border-zinc-200 shadow-md rounded overflow-hidden bg-white">
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
                detailBasePath="/hr/sops"
                showReaders={true}
                departmentStaff={employeesData}
              />
            </Card>
          </div>

          {/* Right Side Panels (1/3 Width) */}
          <div className="space-y-8">
            
            {/* Recent Staff list */}
            <Card className="border-zinc-200/80 shadow-md rounded overflow-hidden bg-white">
              <CardHeader className="pb-4 border-b border-zinc-100 flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-base font-semibold text-zinc-800">Recent Staff</CardTitle>
                  <p className="text-xs text-zinc-400 font-medium">Newly added team members</p>
                </div>
                <Link href="/hr/employees">
                  <Button variant="ghost" size="sm" className="text-xs text-[#004d40] hover:text-[#004d40]/80 font-semibold px-2.5 py-1.5 h-auto hover:bg-emerald-50 rounded">
                    See All
                  </Button>
                </Link>
              </CardHeader>
              <CardContent className="p-4">
                {isEmployeesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3">
                        <Skeleton className="w-9 h-9 rounded-full" />
                        <div className="space-y-1.5 flex-1">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="divide-y divide-zinc-50 space-y-3.5">
                    {employeesData?.slice(0, 5).map((employee: any) => {
                      const initial = employee.first_name ? employee.first_name.charAt(0).toUpperCase() : "U";
                      
                      // Cross-reference employee email with loaded departmentsData to find their department
                      const matchingDept = departmentsData?.find((d: any) => 
                        d.staff?.some((email: string) => email.toLowerCase() === employee.email.toLowerCase())
                      );
                      const deptName = matchingDept ? matchingDept.name : (employee.departments?.[0]?.name || "Unassigned");
                      
                      return (
                        <div key={employee.reference} className="flex items-center justify-between pt-3.5 first:pt-0 group/emp">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center font-semibold text-xs text-[#004d40] group-hover/emp:bg-[#004d40] group-hover/emp:text-white transition-all duration-350">
                              {initial}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold text-zinc-700 leading-none group-hover/emp:text-[#004d40] transition-colors">
                                {employee.first_name} {employee.last_name || ""}
                              </span>
                              <span className="text-[10px] text-zinc-400 mt-1 font-semibold leading-none">
                                {deptName}
                              </span>
                            </div>
                          </div>
                          <span className="text-[9px] bg-zinc-100 border border-zinc-150 rounded px-2.5 py-0.5 text-zinc-550 font-semibold uppercase tracking-wider">
                            Staff
                          </span>
                        </div>
                      );
                    })}
                    {(!employeesData || employeesData.length === 0) && (
                      <p className="text-xs text-zinc-400 text-center py-4">No employees registered yet.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Departments Progress Overview */}
            <Card className="border-zinc-200/80 shadow-md rounded overflow-hidden bg-white">
              <CardHeader className="pb-4 border-b border-zinc-100">
                <CardTitle className="text-base font-semibold text-zinc-800">Departments</CardTitle>
                <p className="text-xs text-zinc-400 font-medium">Compliance & training coverage</p>
              </CardHeader>
              <CardContent className="p-4">
                {isDepartmentsLoading ? (
                  <div className="space-y-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-2 w-full" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {departmentsData?.slice(0, 4).map((dept: any) => {
                      const sopsCount = dept.sops?.length || 0;
                      return (
                        <div key={dept.reference} className="flex items-center justify-between py-2 first:pt-0 border-b border-zinc-50 last:border-0 last:pb-0 group/dept">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded bg-emerald-50 text-[#004d40] flex items-center justify-center shrink-0 group-hover/dept:bg-emerald-100 transition-colors">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <span className="text-xs font-semibold text-zinc-700 group-hover/dept:text-[#004d40] transition-colors">
                              {dept.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-400 font-semibold bg-zinc-50 border border-zinc-100 rounded px-1.5 py-0.5">
                            {sopsCount} SOP{sopsCount !== 1 ? 's' : ''}
                          </span>
                        </div>
                      );
                    })}
                    {(!departmentsData || departmentsData.length === 0) && (
                      <p className="text-xs text-zinc-400 text-center py-4">No departments found.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      )}

      {/* Sibling Dialogue boxes (Un-nested for rendering stability) */}
      <Dialog open={isCreateBulkUploadOpen} onOpenChange={setIsCreateBulkUploadOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-semibold text-lg">Upload Employees via CSV</DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Upload a CSV file containing employee details. Ensure it matches the required format.
            </DialogDescription>
          </DialogHeader>
          <CreateEmployeeBulkUpload onSuccess={() => setIsCreateBulkUploadOpen(false)} onCancel={() => setIsCreateBulkUploadOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateBulkEmployeeOpen} onOpenChange={setIsCreateBulkEmployeeOpen}>
        <DialogContent className="w-[95vw] sm:max-w-[800px] md:max-w-6xl lg:max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl font-semibold">Bulk Add Employees</DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Add multiple employees at once to the Tamarind Elimu System. Fill out the rows below.
            </DialogDescription>
          </DialogHeader>
          <CreateEmployeesBulk onSuccess={() => setIsCreateBulkEmployeeOpen(false)} onCancel={() => setIsCreateBulkEmployeeOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateEmployeeOpen} onOpenChange={setIsCreateEmployeeOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-semibold text-lg">Create Employee</DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Add a single employee to the Tamarind Elimu System.
            </DialogDescription>
          </DialogHeader>
          <CreateEmployee onSuccess={() => setIsCreateEmployeeOpen(false)} onCancel={() => setIsCreateEmployeeOpen(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={isCreateHROpen} onOpenChange={setIsCreateHROpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="font-semibold text-lg">Create HR Account</DialogTitle>
            <DialogDescription className="text-xs text-zinc-400">
              Add a new HR Administrator to the system.
            </DialogDescription>
          </DialogHeader>
          <CreateHR onSuccess={() => setIsCreateHROpen(false)} onCancel={() => setIsCreateHROpen(false)} />
        </DialogContent>
      </Dialog>

    </div>
  );
}