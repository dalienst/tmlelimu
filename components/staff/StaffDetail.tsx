"use client";

import { useFetchEmployee } from "@/hooks/accounts/actions";
import { 
  Mail, 
  ShieldCheck, 
  Building2, 
  User as UserIcon, 
  Calendar, 
  Briefcase,
  Clock,
  IdCard,
  Hash,
  X,
  MapPin,
  Phone,
  FileText
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface StaffDetailProps {
  reference: string;
  onClose: () => void;
}

export default function StaffDetail({ reference, onClose }: StaffDetailProps) {
  const { data: employee, isLoading, isError } = useFetchEmployee(reference);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-6 p-2">
          <div className="flex items-center gap-4">
            <Skeleton className="h-20 w-20 rounded" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <Separator />
          <div className="grid grid-cols-2 gap-6">
            <Skeleton className="h-24 rounded" />
            <Skeleton className="h-24 rounded" />
            <Skeleton className="h-24 rounded" />
            <Skeleton className="h-24 rounded" />
          </div>
        </div>
      );
    }

    if (isError || !employee) {
      return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="bg-red-50 p-4 rounded mb-4">
            <ShieldCheck className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-xl font-semibold text-zinc-900">Profile Unavailable</h3>
          <p className="text-zinc-500 mt-2 max-w-xs mx-auto">We encountered an issue while retrieving the staff details. Please try again later.</p>
        </div>
      );
    }

    const initials = `${employee.first_name?.[0] || ""}${employee.last_name?.[0] || ""}`.toUpperCase();

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Profile Identity Section */}
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative">
          <div className="relative group">
            <div className="w-12 h-12 bg-gradient-to-br from-[#004d40] to-[#002d25] text-white rounded flex items-center justify-center border-4 border-white transform transition-transform group-hover:scale-105 duration-300">
              {initials || <UserIcon className="w-6 h-6" />}
            </div>
            {employee.is_active && (
              <div className="absolute -bottom-2 -right-2 bg-emerald-500 border-4 border-white w-4 h-4 rounded-full shadow-lg" title="Active Account" />
            )}
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-2 pt-2">
            <div>
              <h2 className="text-xl font-semibold text-[#004d40] flex flex-wrap items-center justify-center md:justify-start gap-3">
                {employee.first_name} {employee.last_name}
                <Badge variant={employee.is_active ? "outline" : "destructive"} className={employee.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-100 rounded px-3 py-0.5 text-[10px] font-semibold  " : "rounded text-[10px] font-semibold"}>
                  {employee.is_active ? "ACTIVE" : "INACTIVE"}
                </Badge>
              </h2>
              <p className="text-zinc-400 font-semibold   text-[10px] mt-1.5 flex items-center justify-center md:justify-start gap-2">
                <Hash className="w-3 h-3" />
                REF: {employee.reference}
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3">
              <div className="flex items-center justify-center md:justify-start gap-3 text-zinc-600 font-medium text-sm">
                <div className="w-8 h-8 rounded bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4 text-[#004d40]" />
                </div>
                <span className="truncate">{employee.email}</span>
              </div>
              <div className="flex items-center justify-center md:justify-start gap-3 text-zinc-600 font-medium text-sm">
                <div className="w-8 h-8 rounded bg-zinc-50 border border-zinc-100 flex items-center justify-center shrink-0">
                  <IdCard className="w-4 h-4 text-amber-600" />
                </div>
                <span>{employee.payroll_no}</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-2">
              {employee.is_manager && <Badge className="bg-[#004d40] text-white rounded-sm font-semibold text-[9px] px-2 py-0.5">MANAGER</Badge>}
              {employee.is_hr && <Badge className="bg-amber-600 text-white rounded-sm font-semibold text-[9px] px-2 py-0.5">HR</Badge>}
              {employee.is_hod && <Badge className="bg-blue-600 text-white rounded-sm font-semibold text-[9px] px-2 py-0.5">HOD</Badge>}
              {employee.is_trainer && <Badge className="bg-purple-600 text-white rounded-sm font-semibold text-[9px] px-2 py-0.5">TRAINER</Badge>}
              {employee.is_employee && <Badge className="bg-gray-600 text-white rounded-sm font-semibold text-[9px] px-2 py-0.5">EMPLOYEE</Badge>}
            </div>
          </div>
        </div>

        <Separator className="bg-zinc-100" />

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-[#004d40]   flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Department Matrix
            </h3>
            <div className="space-y-3">
              {employee.departments && employee.departments.length > 0 ? (
                employee.departments.map((dept) => (
                  <Card key={dept.reference} className="p-4 border-zinc-100 shadow-sm rounded group hover:border-[#004d40] transition-colors bg-white">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-zinc-900 group-hover:text-[#004d40] transition-colors">{dept.name}</p>
                        <p className="text-[10px] font-semibold text-zinc-400">{dept.code}</p>
                      </div>
                      <Badge variant="secondary" className="bg-zinc-50 text-zinc-500 border-none text-[9px] font-semibold px-2 py-0 rounded">MEMBER</Badge>
                    </div>
                  </Card>
                ))
              ) : (
                <div className="bg-zinc-50 rounded border border-dashed border-zinc-200 p-6 text-center">
                  <p className="text-xs text-zinc-400 font-medium italic">No direct department assignments found.</p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-amber-600 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Administrative Data
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-4 bg-zinc-50 p-4 rounded border border-zinc-100">
                <div className="w-10 h-10 rounded bg-white border border-zinc-200 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-zinc-400   leading-none mb-1">Joined Organizational Portal</p>
                  <p className="text-sm font-semibold text-zinc-800">
                    {new Date(employee.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-zinc-50 p-4 rounded border border-zinc-100">
                <div className="w-10 h-10 rounded bg-white border border-zinc-200 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold text-zinc-400   leading-none mb-1">Last Profile Sync</p>
                  <p className="text-sm font-semibold text-zinc-800">
                    {new Date(employee.updated_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Footer Branding */}
        <Card className="bg-[#004d40] border-none shadow-xl overflow-hidden rounded">
          <div className="p-4 flex flex-col md:flex-row items-center justify-between gap-6 relative">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <ShieldCheck className="w-16 h-16 text-white" />
            </div>
            <div className="space-y-1 text-center md:text-left relative z-10">
              <p className="text-emerald-300/60 text-[9px] font-semibold">Institutional Verification</p>
              <h4 className="text-xl font-semibold text-white">Verified Staff Identity</h4>
              <p className="text-xs text-emerald-100/60 font-medium">This profile is authorized and synchronized within the Elimu operational database.</p>
            </div>
            <div className="relative z-10">
              <Badge className="bg-white text-[#004d40] hover:bg-zinc-100 border-none px-4 py-1 font-semibold text-xs rounded-sm shadow-lg   cursor-default">
                SECURED
              </Badge>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
      {/* Backdrop with aggressive blur and dark tint */}
      <div 
        className="absolute inset-0 bg-zinc-950/70 backdrop-blur-md cursor-pointer" 
        onClick={onClose}
      />
      
      {/* Modal Container: Robust sizing and shadow */}
      <div className="relative w-full max-w-4xl bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] rounded overflow-hidden border border-zinc-200 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Modal Header: Deep Emerald & Distinct */}
        <div className="bg-[#004d40] px-8 py-6 flex items-center justify-between shrink-0 border-b border-emerald-900/20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-white/10 rounded flex items-center justify-center border border-white/10 backdrop-blur-sm">
              <UserIcon className="w-5 h-5 text-white opacity-80" />
            </div>
            <div>
              <span className="text-[10px] font-semibold text-emerald-200/60 block leading-none mb-1">Institutional Profile</span>
              <span className="text-lg font-semibold text-white">Employee Insight</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-white/40 hover:text-white hover:bg-white/10 transition-all p-2 rounded group"
          >
            <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
          </button>
        </div>
        
        {/* Modal Content: Deep padding and vertical scrolling */}
        <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar bg-[#fafafa]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}