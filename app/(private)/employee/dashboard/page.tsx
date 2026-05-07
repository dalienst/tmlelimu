"use client";

import { useFetchAccount } from "@/hooks/accounts/actions";
import { 
  Building2, 
  FileText, 
  Users, 
  Download, 
  ExternalLink,
  User as UserIcon,
  Mail
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function EmployeeDashboard() {
  const { data: employee, isLoading: isLoadingEmployee } = useFetchAccount();

  if (isLoadingEmployee) {
    return (
      <div className="p-8 space-y-8 animate-in fade-in duration-500">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-4 w-96 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 rounded-3xl" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  // Updated interface now uses arrays for departments, staff, and sops
  const department = employee?.departments?.[0];
  const sops = department?.sops || [];
  const team = department?.staff || [];
  const userInitial = employee?.first_name?.[0] || "U";

  return (
    <div className="p-4 mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#004d40]">
            Welcome Back, <span className="text-amber-600">{employee?.first_name}</span>.
          </h1>
          <p className="text-zinc-500 font-medium mt-1">
            Tamarind Elimu Portal • {department?.name || "No Department Assigned"}
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white p-2 pr-4 border border-zinc-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
          <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-xl flex items-center justify-center font-bold">
            {userInitial}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-zinc-900 leading-tight">
              {employee?.first_name} {employee?.last_name}
            </span>
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              {employee?.payroll_no}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-lg bg-gradient-to-br from-[#004d40] to-[#00332b] text-white rounded-2xl">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-emerald-100/70 text-xs font-bold uppercase tracking-widest">Your Department</p>
                <h3 className="text-lg font-bold mt-1 line-clamp-1">{department?.name || "N/A"}</h3>
              </div>
              <div className="bg-white/10 p-2 rounded-xl">
                <Building2 className="w-5 h-5 text-emerald-100" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Available SOPs</p>
                <h3 className="text-3xl font-bold text-[#004d40] mt-1">{sops.length}</h3>
              </div>
              <div className="bg-emerald-50 p-2 rounded-xl">
                <FileText className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-200 shadow-sm hover:shadow-md transition-shadow rounded-2xl bg-white">
          <CardContent className="pt-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Team Members</p>
                <h3 className="text-3xl font-bold text-[#004d40] mt-1">{team.length}</h3>
              </div>
              <div className="bg-amber-50 p-2 rounded-xl">
                <Users className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SOP Library */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-amber-600" />
              SOP Library
            </h2>
            <Badge variant="outline" className="text-[#004d40] border-emerald-100 font-bold px-3">
              Latest Documents
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {sops.length > 0 ? (
              sops.map((sop: any) => (
                <Card key={sop.code} className="border-zinc-100 shadow-sm hover:border-[#004d40]/20 hover:bg-emerald-50/10 transition-all rounded-2xl group">
                  <CardContent className="p-5">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white border border-zinc-100 rounded-xl flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform">
                          <FileText className="w-6 h-6 text-[#004d40]" />
                        </div>
                        <div>
                          <h4 className="font-bold text-zinc-900 group-hover:text-[#004d40] transition-colors leading-none">
                            {sop.title}
                          </h4>
                          <p className="text-xs text-zinc-500 line-clamp-1 mt-1.5">
                            {sop.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                        <a 
                          href={sop.file} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-zinc-400 hover:text-[#004d40] hover:bg-emerald-50 rounded-lg transition-all"
                          title="View Online"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <a 
                          href={sop.file} 
                          download 
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-zinc-50 text-zinc-700 hover:bg-[#004d40] hover:text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                        >
                          <Download className="w-3 h-3" />
                          Download
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-12 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
                <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-3" />
                <p className="text-zinc-500 font-medium">No SOPs found in your department library.</p>
              </div>
            )}
          </div>
        </div>

        {/* Department & Team Sidebar */}
        <div className="space-y-8">
          {/* Department Info */}
          <Card className="border-zinc-200 shadow-sm rounded-3xl overflow-hidden bg-white">
            <CardHeader className="bg-zinc-50/50 border-b border-zinc-100 pb-4 px-6">
              <CardTitle className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#004d40]" />
                Department Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 px-6 space-y-4">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Description</p>
                <p className="text-sm text-zinc-600 leading-relaxed">
                  {department?.description || "No description provided for this department."}
                </p>
              </div>
              
              <div className="pt-4 border-t border-zinc-50 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-emerald-600" />
                  </div>
                  <span className="text-zinc-600 truncate font-medium">{department?.email || "N/A"}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                    <UserIcon className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-zinc-900 font-bold leading-none">Head of Dept</span>
                    <span className="text-xs text-zinc-500 mt-1.5 truncate max-w-[180px]">{department?.head || "N/A"}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-bold text-zinc-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-600" />
                Team Members
              </h3>
              <span className="text-[10px] font-bold text-zinc-400 bg-zinc-100 px-2 py-0.5 rounded-full">
                {team.length}
              </span>
            </div>
            <div className="space-y-3">
              {team.length > 0 ? (
                team.map((member: any) => (
                  <div 
                    key={member.reference} 
                    className="flex items-center gap-3 p-3 bg-white border border-zinc-100 rounded-2xl hover:border-emerald-100 hover:shadow-md transition-all group"
                  >
                    <div className="w-8 h-8 bg-zinc-50 text-zinc-500 group-hover:bg-emerald-50 group-hover:text-emerald-700 rounded-lg flex items-center justify-center font-bold text-xs transition-colors">
                      {member.first_name?.[0] || "U"}
                    </div>
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-xs font-bold text-zinc-900 truncate">
                        {member.first_name} {member.last_name}
                      </span>
                      <span className="text-[10px] text-zinc-400 truncate mt-0.5">
                        {member.email}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-500 italic px-1">No other team members found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}