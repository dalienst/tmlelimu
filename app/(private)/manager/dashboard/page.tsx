"use client";

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
  Briefcase,
  Search,
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ManagerDashboard() {

  const { data: manager, isLoading: isLoadingManager } = useFetchAccount();

  if (isLoadingManager) {
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
            <Skeleton className="h-96 rounded-3xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 rounded-3xl" />
            <Skeleton className="h-64 rounded-3xl" />
          </div>
        </div>
      </div>
    );
  }

  const managedDept = manager?.departments_headed?.[0];
  const sops = managedDept?.sops || [];
  const staff = managedDept?.staff || [];
  const managerInitial = manager?.first_name?.[0] || "M";

  return (
    <div className="p-6 mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Strategic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-emerald-50 text-[#004d40] border-emerald-100 font-bold uppercase tracking-wider text-[10px] px-2 py-0.5">
              Managerial Overview
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
              Department Head
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-[#004d40]">
            Good Day, <span className="text-amber-600">{manager?.first_name}</span>.
          </h1>
          <p className="text-zinc-500 font-medium mt-1">
            Overseeing <span className="text-zinc-900 font-bold">{managedDept?.name || "No Assigned Department"}</span> • Operational Excellence
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 pr-5 border border-zinc-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-gradient-to-br from-[#004d40] to-[#00332b] text-white rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-emerald-900/10">
            {managerInitial}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold text-zinc-900 leading-tight">
              {manager?.first_name} {manager?.last_name}
            </span>
            <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mt-0.5">
              {manager?.payroll_no}
            </span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-xl bg-gradient-to-br from-[#004d40] to-[#00332b] text-white rounded-3xl overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Building2 className="w-24 h-24" />
          </div>
          <CardContent className="pt-8 pb-8 relative z-10">
            <p className="text-emerald-100/70 text-[10px] font-bold uppercase tracking-widest mb-1">Managed Entity</p>
            <h3 className="text-xl font-bold leading-tight line-clamp-2 pr-12">{managedDept?.name || "N/A"}</h3>
            <div className="mt-6 flex items-center gap-2">
              <div className="h-1.5 flex-1 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-amber-400 w-full rounded-full" />
              </div>
              <span className="text-[10px] font-bold text-emerald-100/60 uppercase">Active</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-100 shadow-sm hover:shadow-md transition-all rounded-3xl bg-white border-2 hover:border-emerald-100 group">
          <CardContent className="pt-8 pb-8">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-1">Department Staff</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-black text-[#004d40] group-hover:text-amber-600 transition-colors">{staff.length}</h3>
                  <span className="text-xs font-bold text-zinc-400">Members</span>
                </div>
              </div>
              <div className="bg-amber-50 p-3 rounded-2xl group-hover:rotate-12 transition-transform">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4">
              <Badge variant="secondary" className="bg-zinc-50 text-zinc-500 border-none text-[9px] font-bold py-0.5">
                Full Capacity
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-100 shadow-sm hover:shadow-md transition-all rounded-3xl bg-white border-2 hover:border-emerald-100 group">
          <CardContent className="pt-8 pb-8">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-400 text-[10px] font-bold uppercase tracking-widest mb-1">Oversight SOPs</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-4xl font-black text-[#004d40] group-hover:text-emerald-600 transition-colors">{sops.length}</h3>
                  <span className="text-xs font-bold text-zinc-400">Documents</span>
                </div>
              </div>
              <div className="bg-emerald-50 p-3 rounded-2xl group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4">
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none text-[9px] font-bold py-0.5">
                Up to Date
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Team Management Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#004d40]" />
              Team Management
            </h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input 
                placeholder="Search staff..." 
                className="pl-10 h-10 rounded-xl bg-zinc-50 border-zinc-100 focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          <Card className="border-zinc-100 shadow-xl rounded-3xl overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50 border-b border-zinc-100">
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Member</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Contact</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {staff.length > 0 ? (
                    staff.map((member: any) => (
                      <tr key={member.reference} className="hover:bg-zinc-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-zinc-100 text-zinc-500 rounded-xl flex items-center justify-center font-bold text-sm border border-zinc-200 shadow-inner group-hover:bg-white transition-colors">
                              {member.first_name?.[0] || "U"}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-zinc-900 leading-tight">
                                {member.first_name} {member.last_name}
                              </span>
                              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider mt-0.5">
                                {member.reference}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-xs font-medium text-zinc-600 flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-zinc-300" />
                              {member.email}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[10px] font-bold uppercase tracking-widest text-zinc-400 hover:text-[#004d40] hover:bg-emerald-50">
                            View Profile
                            <ChevronRight className="w-3 h-3 ml-1" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-zinc-400 text-sm font-medium">
                        No team members registered under your department.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* SOP Oversight Section */}
          <div className="space-y-4 pt-4">
            <h2 className="text-xl font-bold text-zinc-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-600" />
              Department SOPs
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sops.length > 0 ? (
                sops.map((sop: any) => (
                  <Card key={sop.code} className="border-zinc-100 shadow-sm hover:border-amber-200 hover:bg-amber-50/5 transition-all rounded-3xl group">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex gap-4">
                          <div className="w-12 h-12 bg-white border border-zinc-100 rounded-2xl flex items-center justify-center shadow-sm group-hover:shadow-md transition-all">
                            <FileText className="w-6 h-6 text-[#004d40]" />
                          </div>
                          <div>
                            <h4 className="font-bold text-zinc-900 group-hover:text-[#004d40] transition-colors leading-tight">
                              {sop.title}
                            </h4>
                            <p className="text-[10px] text-zinc-500 line-clamp-2 mt-1.5 leading-relaxed">
                              {sop.description}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center justify-between border-t border-zinc-50 pt-4">
                        <span className="text-[9px] font-black text-zinc-300 uppercase tracking-widest">
                          {sop.code}
                        </span>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-lg text-zinc-400 hover:text-[#004d40] hover:bg-emerald-50">
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Button>
                          <Button size="sm" className="h-8 rounded-xl bg-zinc-900 hover:bg-black text-white text-[10px] font-bold px-3">
                            <Download className="w-3 h-3 mr-1.5" />
                            File
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-2 text-center py-12 bg-zinc-50 rounded-3xl border-2 border-dashed border-zinc-200">
                  <FileText className="w-12 h-12 text-zinc-200 mx-auto mb-3" />
                  <p className="text-zinc-500 font-medium">No department-specific SOPs found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Sections */}
        <div className="space-y-8">
          {/* Department Profile */}
          <Card className="border-zinc-100 shadow-lg rounded-[2rem] overflow-hidden bg-white">
            <CardHeader className="bg-[#004d40] text-white pt-8 pb-8 px-8">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md border border-white/10">
                <Building2 className="w-6 h-6 text-emerald-100" />
              </div>
              <CardTitle className="text-xl font-bold leading-tight">
                {managedDept?.name || "Department Profile"}
              </CardTitle>
              <CardDescription className="text-emerald-100/60 font-medium text-xs mt-1">
                Operational Identity & Strategy
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 px-8 pb-8 space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Core Mission</p>
                <p className="text-sm text-zinc-600 leading-relaxed italic">
                  &quot;{managedDept?.description || "Ensuring excellence and reliability in our department operations every day."}&quot;
                </p>
              </div>
              
              <div className="pt-6 border-t border-zinc-100 space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-10 h-10 bg-zinc-50 rounded-xl flex items-center justify-center border border-zinc-100">
                    <Mail className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Dept. Email</span>
                    <span className="text-zinc-900 font-medium truncate max-w-[150px]">{managedDept?.email || "N/A"}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center border border-amber-100/30">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Head Status</span>
                    <span className="text-zinc-900 font-bold">Verified Head</span>
                  </div>
                </div>
              </div>

              <Button className="w-full h-12 bg-zinc-900 hover:bg-black text-white rounded-2xl text-xs font-bold transition-all shadow-lg shadow-zinc-200">
                Edit Department Info
              </Button>
            </CardContent>
          </Card>

          {/* Quick Tasks Card */}
          <Card className="border-none shadow-xl bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded-[2rem]">
            <CardContent className="p-8 space-y-4">
              <h4 className="text-lg font-bold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Quick Actions
              </h4>
              <p className="text-amber-50 text-xs font-medium leading-relaxed opacity-80">
                Manage your team effectively with these quick administrative tools.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button variant="ghost" className="bg-white/10 hover:bg-white/20 border-none text-white text-[10px] font-bold h-10 rounded-xl flex flex-col items-center justify-center gap-1">
                  New SOP
                </Button>
                <Button variant="ghost" className="bg-white/10 hover:bg-white/20 border-none text-white text-[10px] font-bold h-10 rounded-xl flex flex-col items-center justify-center gap-1">
                  Announce
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}