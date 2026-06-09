"use client";

import { useState, useMemo } from "react";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { 
  Building2, 
  FileText, 
  Users, 
  Download, 
  ExternalLink,
  Mail,
  ShieldCheck,
  Briefcase,
  Search,
  ChevronRight,
  TrendingUp,
  Pencil,
  EyeOff,
  Eye,
  PlusCircle,
  MoreVertical,
  UserIcon,
  Loader2,
  CheckCircle2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import CreateSop from "@/forms/sops/CreateSop";
import UpdateSop from "@/forms/sops/UpdateSop";
import StaffDetail from "@/components/staff/StaffDetail";
import { updateSops, Sops, SopsMinified } from "@/services/sops";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { createSOPReadRecord } from "@/services/sopsreadrecords";
import toast from "react-hot-toast";
import Link from "next/link";

export default function ManagerDashboard() {
  const { data: manager, isLoading: isLoadingManager, refetch: refetchAccount } = useFetchAccount();
  const [staffQuery, setStaffQuery] = useState("");
  const [sopQuery, setSopQuery] = useState("");
  const [sopReadFilter, setSopReadFilter] = useState<'all' | 'read' | 'unread'>('all');
  
  const [loadingReadSops, setLoadingReadSops] = useState<Set<string>>(new Set());
  const [viewedSops, setViewedSops] = useState<Set<string>>(new Set());

  // Management State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingSop, setEditingSop] = useState<SopsMinified | null>(null);
  const [togglingSop, setTogglingSop] = useState<SopsMinified | null>(null);
  const [isToggling, setIsToggling] = useState(false);

  // Staff Detail State
  const [selectedStaffReference, setSelectedStaffReference] = useState<string | null>(null);

  const headers = useAxiosAuth();

  const managedDept = manager?.departments_headed?.[0];
  const sops = managedDept?.sops || [];
  const staff = managedDept?.staff || [];
  const managerInitial = manager?.first_name?.[0] || "M";

  const filteredStaff = useMemo(() => {
    return staff.filter((m: any) => 
      `${m.first_name} ${m.last_name}`.toLowerCase().includes(staffQuery.toLowerCase()) ||
      m.reference?.toLowerCase().includes(staffQuery.toLowerCase()) ||
      m.email?.toLowerCase().includes(staffQuery.toLowerCase())
    );
  }, [staff, staffQuery]);

  const filteredSops = useMemo(() => {
    return sops.filter((s: any) => {
      const matchesSearch = s.title.toLowerCase().includes(sopQuery.toLowerCase()) ||
                            s.code.toLowerCase().includes(sopQuery.toLowerCase()) ||
                            s.description.toLowerCase().includes(sopQuery.toLowerCase());
      const matchesRead = sopReadFilter === 'all' ? true : 
                          sopReadFilter === 'read' ? s.has_read : !s.has_read;
      return matchesSearch && matchesRead;
    });
  }, [sops, sopQuery, sopReadFilter]);

  const handleToggleActive = async () => {
    if (!togglingSop) return;
    setIsToggling(true);
    try {
      const formData = new FormData();
      formData.append("is_active", String(!togglingSop.is_active));

      await updateSops(togglingSop.reference, formData, headers);
      toast.success(`SOP ${togglingSop.is_active ? 'deactivated' : 'activated'} successfully`);
      refetchAccount();
    } catch (e) {
      toast.error((e as any)?.response?.data?.detail || "Failed to update SOP status");
    } finally {
      setIsToggling(false);
      setTogglingSop(null);
    }
  };

  const handleMarkAsReadClick = async (sop: any) => {
    try {
      setLoadingReadSops(prev => new Set(prev).add(sop.reference));
      await createSOPReadRecord(headers, { sop: sop.title });
      toast.success("SOP marked as read successfully!");
      refetchAccount();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to mark SOP as read.");
    } finally {
      setLoadingReadSops(prev => {
        const next = new Set(prev);
        next.delete(sop.reference);
        return next;
      });
    }
  };

  if (isLoadingManager) {
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

  return (
    <div className="p-6 mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Strategic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-emerald-50 text-[#004d40] border-emerald-100 font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded">
              Managerial Overview
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              Department Head
            </span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-[#004d40]">
            Good Day, <span className="text-amber-600">{manager?.first_name}</span>.
          </h1>
          <p className="text-zinc-500 font-medium mt-1">
            Overseeing <span className="text-zinc-900 font-semibold">{managedDept?.name || "No Assigned Department"}</span> • Operational Excellence
          </p>
        </div>
        
        <div className="flex items-center gap-3 bg-white p-2 pr-5 border border-zinc-100 rounded shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-gradient-to-br from-[#004d40] to-[#00332b] text-white rounded flex items-center justify-center font-semibold text-xl shadow-lg shadow-emerald-900/10">
            {managerInitial}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-zinc-900 leading-tight">
              {manager?.first_name} {manager?.last_name}
            </span>
            <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider mt-0.5">
              {manager?.payroll_no}
            </span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-xl bg-gradient-to-br from-[#004d40] to-[#00332b] text-white rounded overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Building2 className="w-24 h-24" />
          </div>
          <CardContent className="pt-8 pb-8 relative z-10">
            <p className="text-emerald-100/70 text-[10px] font-semibold uppercase tracking-widest mb-1">Managed Entity</p>
            <h3 className="text-xl font-semibold leading-tight line-clamp-2 pr-12">{managedDept?.name || "N/A"}</h3>
            <div className="mt-6 flex items-center gap-2">
              <div className="h-1.5 flex-1 bg-white/10 rounded overflow-hidden">
                <div className="h-full bg-amber-400 w-full rounded" />
              </div>
              <span className="text-[10px] font-semibold text-emerald-100/60 uppercase">Active</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-100 shadow-sm hover:shadow-md transition-all rounded bg-white border-2 hover:border-emerald-100 group">
          <CardContent className="pt-8 pb-8">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-400 text-[10px] font-semibold uppercase tracking-widest mb-1">Department Staff</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-xl font-semibold text-[#004d40] group-hover:text-amber-600 transition-colors">{staff.length}</h3>
                  <span className="text-xs font-semibold text-zinc-400">Members</span>
                </div>
              </div>
              <div className="bg-amber-50 p-3 rounded group-hover:rotate-12 transition-transform">
                <Users className="w-6 h-6 text-amber-600" />
              </div>
            </div>
            <div className="mt-4">
              <Badge variant="secondary" className="bg-zinc-50 text-zinc-500 border-none text-[9px] font-semibold py-0.5 rounded">
                Full Capacity
              </Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-zinc-100 shadow-sm hover:shadow-md transition-all rounded bg-white border-2 hover:border-emerald-100 group">
          <CardContent className="pt-8 pb-8">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-zinc-400 text-[10px] font-semibold uppercase tracking-widest mb-1">Oversight SOPs</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-xl font-semibold text-[#004d40] group-hover:text-emerald-600 transition-colors">{sops.length}</h3>
                  <span className="text-xs font-semibold text-zinc-400">Documents</span>
                </div>
              </div>
              <div className="bg-emerald-50 p-3 rounded group-hover:scale-110 transition-transform">
                <FileText className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
            <div className="mt-4">
              <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-none text-[9px] font-semibold py-0.5 rounded">
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
            <h2 className="text-xl font-semibold text-zinc-900 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#004d40]" />
              Team Management
            </h2>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <Input 
                placeholder="Search staff..." 
                value={staffQuery}
                onChange={(e) => setStaffQuery(e.target.value)}
                className="pl-10 h-10 rounded bg-zinc-50 border-zinc-100 focus:bg-white transition-all text-sm"
              />
            </div>
          </div>

          <Card className="border-zinc-100 shadow-xl rounded overflow-hidden bg-white">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50/50 border-b border-zinc-100">
                    <th className="px-6 py-4 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Member</th>
                    <th className="px-6 py-4 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Contact</th>
                    <th className="px-6 py-4 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-50">
                  {filteredStaff.length > 0 ? (
                    filteredStaff.map((member: any) => (
                      <tr key={member.reference} className="hover:bg-zinc-50/30 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-zinc-100 text-zinc-500 rounded flex items-center justify-center font-semibold text-sm border border-zinc-200 shadow-inner group-hover:bg-white transition-colors">
                              {member.first_name?.[0] || "U"}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-semibold text-zinc-900 leading-tight">
                                {member.first_name} {member.last_name}
                              </span>
                              <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-wider mt-0.5">
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
                          <Button 
                            onClick={() => setSelectedStaffReference(member.reference)}
                            variant="ghost" 
                            size="sm" 
                            className="h-8 rounded text-[10px] font-semibold uppercase tracking-widest text-zinc-400 hover:text-[#004d40] hover:bg-emerald-50"
                          >
                            View Profile
                            <ChevronRight className="w-3 h-3 ml-1" />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={3} className="px-6 py-12 text-center text-zinc-400 text-sm font-medium">
                        {staffQuery ? `No results for "${staffQuery}"` : "No team members registered under your department."}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* SOP Oversight Section */}
          <div className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h2 className="text-xl font-semibold text-zinc-900 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-amber-600" />
                Department SOPs
              </h2>
              <div className="flex items-center gap-3">
                <div className="flex bg-zinc-100/80 p-0.5 rounded border border-zinc-200/60 shadow-sm">
                  <button
                    onClick={() => setSopReadFilter('all')}
                    className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded transition-all ${sopReadFilter === 'all' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setSopReadFilter('unread')}
                    className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded transition-all ${sopReadFilter === 'unread' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                  >
                    Unread
                  </button>
                  <button
                    onClick={() => setSopReadFilter('read')}
                    className={`px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider rounded transition-all ${sopReadFilter === 'read' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
                  >
                    Read
                  </button>
                </div>
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                  <Input 
                    placeholder="Search SOPs..." 
                    value={sopQuery}
                    onChange={(e) => setSopQuery(e.target.value)}
                    className="pl-10 h-10 rounded bg-zinc-50 border-zinc-100 focus:bg-white transition-all text-sm"
                  />
                </div>
                <Button 
                  onClick={() => setIsCreateOpen(true)}
                  size="sm" 
                  className="bg-[#004d40] hover:bg-[#00332b] text-white h-10 px-4 rounded shadow-md gap-2 font-semibold text-[10px] uppercase tracking-wider"
                >
                  <PlusCircle className="w-4 h-4" />
                  New SOP
                </Button>
              </div>
            </div>
            
            <Card className="border-zinc-100 shadow-xl rounded overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50/50 border-b border-zinc-100">
                      <th className="px-6 py-4 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Document</th>
                      <th className="px-6 py-4 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Code</th>
                      <th className="px-6 py-4 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Status</th>
                      <th className="px-6 py-4 text-[10px] font-semibold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-50">
                    {filteredSops.length > 0 ? (
                      filteredSops.map((sop: any) => (
                        <tr key={sop.code} className="hover:bg-zinc-50/30 transition-colors group">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-emerald-50 text-[#004d40] rounded flex items-center justify-center border border-emerald-100 shadow-inner group-hover:bg-[#004d40] group-hover:text-white transition-all">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-zinc-900 leading-tight group-hover:text-[#004d40] transition-colors">
                                  {sop.title}
                                </span>
                                <span className="text-[10px] font-medium text-zinc-400 mt-0.5">
                                  {new Date(sop.created_at).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <Badge variant="outline" className="bg-zinc-50 text-zinc-500 border-zinc-200 text-[10px] font-semibold py-0.5 rounded px-2">
                              {sop.code}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant="outline"
                              className={sop.is_active 
                                ? "bg-emerald-50 text-emerald-700 border-emerald-100 px-2 py-0.5 rounded text-[10px] font-semibold" 
                                : "bg-red-50 text-red-700 border-red-100 px-2 py-0.5 rounded text-[10px] font-semibold"}
                            >
                              {sop.is_active ? "ACTIVE" : "INACTIVE"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <a 
                                href={sop.file} 
                                target="_blank" 
                                rel="noreferrer"
                                onClick={() => setViewedSops(prev => new Set(prev).add(sop.reference))}
                              >
                                <Button variant="ghost" size="sm" className="h-8 px-2 rounded text-zinc-400 hover:text-[#004d40] hover:bg-emerald-50 text-[10px] uppercase font-semibold">
                                  <Download className="w-3.5 h-3.5 mr-1" /> View
                                </Button>
                              </a>

                              {!sop.has_read ? (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={`h-8 px-2 rounded font-semibold text-[10px] uppercase tracking-wider transition-colors ${
                                    viewedSops.has(sop.reference)
                                      ? "border-emerald-600 text-emerald-700 hover:bg-emerald-50"
                                      : "border-zinc-200 text-zinc-400"
                                  }`}
                                  disabled={!viewedSops.has(sop.reference) || loadingReadSops.has(sop.reference)}
                                  onClick={() => handleMarkAsReadClick(sop)}
                                >
                                  {loadingReadSops.has(sop.reference) ? (
                                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                  ) : (
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                  )}
                                  Mark
                                </Button>
                              ) : (
                                <Badge className="h-8 px-2 bg-emerald-50 text-emerald-700 border-emerald-200 pointer-events-none text-[10px] uppercase tracking-wider font-semibold rounded flex items-center justify-center">
                                  <CheckCircle2 className="w-3 h-3 mr-1" /> Read
                                </Badge>
                              )}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded text-zinc-400 hover:bg-zinc-100">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48 p-1 rounded shadow-xl border-zinc-200">
                                  <DropdownMenuItem
                                    onClick={() => setEditingSop(sop)}
                                    className="cursor-pointer font-medium text-zinc-700 text-xs"
                                  >
                                    <Pencil className="mr-2 h-4 w-4" />
                                    Edit details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => setTogglingSop(sop)}
                                    className={sop.is_active ? "text-amber-600 focus:bg-amber-50 focus:text-amber-600 cursor-pointer font-medium text-xs" : "text-emerald-600 focus:bg-emerald-50 focus:text-emerald-600 cursor-pointer font-medium text-xs"}
                                  >
                                    {sop.is_active ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                                    {sop.is_active ? "Deactivate" : "Activate"}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center text-zinc-400 text-sm font-medium">
                          {sopQuery ? `No results for "${sopQuery}"` : "No department-specific SOPs found."}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
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
                {managedDept?.name || "Department Profile"}
              </CardTitle>
              <CardDescription className="text-emerald-100/60 font-medium text-xs mt-1">
                Operational Identity & Strategy
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-8 px-8 pb-8 space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">Core Mission</p>
                <p className="text-sm text-zinc-600 leading-relaxed italic">
                  &quot;{managedDept?.description || "Ensuring excellence and reliability in our department operations every day."}&quot;
                </p>
              </div>
              
              <div className="pt-6 border-t border-zinc-100 space-y-4">
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-10 h-10 bg-zinc-50 rounded flex items-center justify-center border border-zinc-100">
                    <Mail className="w-4 h-4 text-zinc-400" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest">Dept. Email</span>
                    <span className="text-zinc-900 font-medium truncate max-w-[150px]">{managedDept?.email || "N/A"}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4 text-sm">
                  <div className="w-10 h-10 bg-amber-50 rounded flex items-center justify-center border border-amber-100/30">
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest">Head Status</span>
                    <span className="text-zinc-900 font-semibold">Verified Head</span>
                  </div>
                </div>
              </div>

              <Button className="w-full h-12 bg-zinc-900 hover:bg-black text-white rounded text-xs font-semibold transition-all shadow-lg shadow-zinc-200">
                Edit Department Info
              </Button>
            </CardContent>
          </Card>

          {/* Quick Tasks Card */}
          <Card className="border-none shadow-xl bg-gradient-to-br from-amber-600 to-amber-700 text-white rounded">
            <CardContent className="p-8 space-y-4">
              <h4 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Quick Actions
              </h4>
              <p className="text-amber-50 text-xs font-medium leading-relaxed opacity-80">
                Manage your team effectively with these quick administrative tools.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <Button 
                  onClick={() => setIsCreateOpen(true)}
                  variant="ghost" 
                  className="bg-white/10 hover:bg-white/20 border-none text-white text-[10px] font-semibold h-10 rounded flex flex-col items-center justify-center gap-1"
                >
                  New SOP
                </Button>
                <Button variant="ghost" className="bg-white/10 hover:bg-white/20 border-none text-white text-[10px] font-semibold h-10 rounded flex flex-col items-center justify-center gap-1">
                  Announce
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* MODALS */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md rounded">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#004d40] font-semibold">New SOP Document</DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium">
              Upload a new Standard Operating Procedure.
            </DialogDescription>
          </DialogHeader>
          <CreateSop
            onSuccess={() => {
              setIsCreateOpen(false);
              refetchAccount();
            }}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingSop} onOpenChange={(open) => !open && setEditingSop(null)}>
        <DialogContent className="sm:max-w-md rounded">
          <DialogHeader>
            <DialogTitle className="text-xl text-[#004d40] font-semibold">Edit SOP</DialogTitle>
            <DialogDescription className="text-zinc-500 font-medium">
              Update the details for this SOP.
            </DialogDescription>
          </DialogHeader>
          {editingSop && (
            <UpdateSop
              sopData={editingSop}
              onSuccess={() => {
                setEditingSop(null);
                refetchAccount();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!togglingSop} onOpenChange={(open) => {
        if (!isToggling && !open) setTogglingSop(null);
      }}>
        <AlertDialogContent className="rounded">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-semibold">
              {togglingSop?.is_active ? "Deactivate SOP?" : "Activate SOP?"}
            </AlertDialogTitle>
            <AlertDialogDescription className="font-medium">
              {togglingSop?.is_active
                ? "This will hide the SOP from employees."
                : "This will make the SOP visible again."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isToggling} className="rounded">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleToggleActive}
              disabled={isToggling}
              className={togglingSop?.is_active 
                ? "bg-amber-600 hover:bg-amber-700 text-white rounded font-semibold" 
                : "bg-emerald-600 hover:bg-emerald-700 text-white rounded font-semibold"}
            >
              {isToggling ? "Updating..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Staff Profile Modal */}
      {selectedStaffReference && (
        <StaffDetail 
          reference={selectedStaffReference} 
          onClose={() => setSelectedStaffReference(null)} 
        />
      )}
    </div>
  );
}