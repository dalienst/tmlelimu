"use client";

import { useState } from "react";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { 
  Building2, 
  FileText, 
  Users, 
  Download, 
  ExternalLink,
  User as UserIcon,
  Mail,
  ShieldCheck,
  TrendingUp,
  Search,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import SOPSTable from "@/components/sops/SOPSTable";
import { createSOPReadRecord } from "@/services/sopsreadrecords";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import toast from "react-hot-toast";
import { SopsMinified } from "@/services/sops";

export default function EmployeeDashboard() {
  const headers = useAxiosAuth();
  const { data: employee, isLoading: isLoadingEmployee, refetch: refetchAccount } = useFetchAccount();
  const [sopSearch, setSopSearch] = useState("");
  const [sopReadFilter, setSopReadFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [sopPage, setSopPage] = useState(1);
  const pageSize = 5;

  if (isLoadingEmployee) {
    return (
      <div className="p-8 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64 rounded" />
          <Skeleton className="h-4 w-96 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-96 rounded" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 rounded" />
            <Skeleton className="h-64 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const department = employee?.departments?.[0];
  const sops = department?.sops || [];
  const team = department?.staff || [];
  const userInitial = employee?.first_name?.[0] || "U";

  const filteredSops = sops.filter((s: any) => {
    const matchesSearch = s.title.toLowerCase().includes(sopSearch.toLowerCase()) ||
                          s.code.toLowerCase().includes(sopSearch.toLowerCase());
    const matchesRead = sopReadFilter === 'all' ? true : 
                        sopReadFilter === 'read' ? s.has_read : !s.has_read;
    return matchesSearch && matchesRead;
  });

  const paginatedSops = filteredSops.slice((sopPage - 1) * pageSize, sopPage * pageSize);

  const handleMarkAsRead = async (sop: SopsMinified) => {
    try {
      await createSOPReadRecord(headers, { sop: sop.title });
      toast.success("SOP marked as read successfully!");
      refetchAccount();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to mark SOP as read.");
    }
  };

  return (
    <div className="p-6 w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Strategic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-emerald-50 text-[#004d40] border-emerald-100 font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded">
              Employee Portal
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Standard View
            </span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-[#004d40]">
            Welcome Back, <span className="text-amber-600">{employee?.first_name}</span>.
          </h1>
          <p className="text-zinc-500 font-medium mt-1">
            Operational Excellence • <span className="text-zinc-900 font-semibold">{department?.name || "No Assigned Department"}</span>
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 pr-5 border border-zinc-100 rounded shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-gradient-to-br from-[#004d40] to-[#00332b] text-white rounded flex items-center justify-center font-semibold text-lg shadow-lg shadow-emerald-900/10">
            {userInitial}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-900 leading-tight">
              {employee?.first_name} {employee?.last_name}
            </span>
            <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider mt-0.5">
              {employee?.payroll_no}
            </span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        {/* Assigned Department */}
        <div className="bg-white border border-zinc-150 rounded p-4 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-300 flex items-center gap-3.5 group">
          <div className="p-2.5 rounded bg-emerald-50 text-[#004d40] group-hover:scale-105 transition-transform duration-300">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest leading-none">Assigned Department</p>
            <h3 className="text-xl font-semibold text-zinc-800 mt-1 truncate max-w-[200px]" title={department?.name}>
              {department?.name || "N/A"}
            </h3>
          </div>
        </div>

        {/* Available SOPs */}
        <div className="bg-white border border-zinc-150 rounded p-4 shadow-sm hover:shadow-md hover:border-teal-100 transition-all duration-300 flex items-center gap-3.5 group">
          <div className="p-2.5 rounded bg-teal-50 text-teal-600 group-hover:scale-105 transition-transform duration-300">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest leading-none">Available SOPs</p>
            <h3 className="text-xl font-semibold text-zinc-800 mt-1">{sops.length}</h3>
          </div>
        </div>

        {/* Collaborators */}
        <div className="bg-white border border-zinc-150 rounded p-4 shadow-sm hover:shadow-md hover:border-amber-100 transition-all duration-300 flex items-center gap-3.5 group">
          <div className="p-2.5 rounded bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform duration-300">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest leading-none">Collaborators</p>
            <h3 className="text-xl font-semibold text-zinc-800 mt-1">{team.length}</h3>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SOP Oversight Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-zinc-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#004d40]" />
              Departmental Procedures
            </h2>
          </div>

          <Card className="border-zinc-100 shadow-xl rounded overflow-hidden bg-white">
            <SOPSTable
              data={paginatedSops}
              isLoading={false}
              search={sopSearch}
              onSearch={(val) => {
                setSopSearch(val);
                setSopPage(1);
              }}
              page={sopPage}
              onPageChange={setSopPage}
              totalCount={filteredSops.length}
              pageSize={pageSize}
              onMarkAsRead={handleMarkAsRead}
              readFilter={sopReadFilter}
              onReadFilterChange={setSopReadFilter}
              detailBasePath="/employee/sops"
            />
          </Card>
        </div>

        {/* Sidebar Sections */}
        <div className="space-y-8">
          {/* Department Profile */}
          <Card className="border-zinc-100 shadow-lg rounded overflow-hidden bg-white">
            <CardHeader className="bg-[#004d40] text-white pt-8 pb-8 px-8">
              <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center mb-4 backdrop-blur-md border border-white/10">
                <Building2 className="w-6 h-6 text-emerald-100" />
              </div>
              <CardTitle className="text-xl font-semibold leading-tight">
                {department?.name || "Department Info"}
              </CardTitle>
              <CardDescription className="text-emerald-100/60 font-medium text-xs mt-1">
                Your primary operational base
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 px-8 pb-8 space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Mission Statement</p>
                <p className="text-sm text-zinc-600 leading-relaxed italic">
                  &quot;{department?.description || "Dedicated to operational excellence and organizational growth."}&quot;
                </p>
              </div>
              
              <div className="pt-6 border-t border-zinc-100 space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-10 h-10 bg-zinc-50 rounded flex items-center justify-center border border-zinc-100">
                    <Mail className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest">Support Contact</span>
                    <span className="text-zinc-900 font-medium truncate max-w-[150px]">{department?.email || "N/A"}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-10 h-10 bg-amber-50 rounded flex items-center justify-center border border-amber-100/30">
                    <UserIcon className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest">Department Head</span>
                    <span className="text-zinc-900 font-semibold">{department?.head || "N/A"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2 uppercase tracking-wider">
                <Users className="w-4 h-4 text-amber-600" />
                Team Members
              </h3>
              <Badge className="bg-zinc-100 text-zinc-500 border-none font-semibold text-[10px] rounded">
                {team.length}
              </Badge>
            </div>
            <div className="space-y-3">
              {team.slice(0, 8).map((member: any) => (
                <div 
                  key={member.reference} 
                  className="flex items-center gap-3 p-3 bg-white border border-zinc-100 rounded hover:border-emerald-100 hover:shadow-md transition-all group"
                >
                  <div className="w-9 h-9 bg-zinc-50 text-zinc-500 group-hover:bg-[#004d40] group-hover:text-white rounded flex items-center justify-center font-semibold text-xs transition-all border border-zinc-100">
                    {member.first_name?.[0] || "U"}
                  </div>
                  <div className="flex flex-col overflow-hidden">
                    <span className="text-xs font-semibold text-zinc-900 truncate group-hover:text-[#004d40] transition-colors">
                      {member.first_name} {member.last_name}
                    </span>
                    <span className="text-[10px] font-medium text-zinc-400 truncate mt-0.5 uppercase tracking-tighter">
                      {member.reference}
                    </span>
                  </div>
                </div>
              ))}
              {team.length > 8 && (
                <p className="text-[10px] text-center text-zinc-400 font-semibold uppercase tracking-widest pt-2">
                  + {team.length - 8} more members
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}