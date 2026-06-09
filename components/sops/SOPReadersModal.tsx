"use client";

import { useMemo } from "react";
import { StaffMinified } from "@/services/accounts";
import { Sops, SopsMinified } from "@/services/sops";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Clock, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SOPReadersModalProps {
  isOpen: boolean;
  onClose: () => void;
  sop: Sops | SopsMinified | null;
  departmentStaff?: StaffMinified[];
}

export default function SOPReadersModal({ isOpen, onClose, sop, departmentStaff }: SOPReadersModalProps) {
  const readStaff = useMemo(() => {
    return sop?.read_by || [];
  }, [sop]);

  const pendingStaff = useMemo(() => {
    if (!departmentStaff) return [];
    const readRefs = new Set(readStaff.map(s => s.reference));
    return departmentStaff.filter(s => !readRefs.has(s.reference));
  }, [readStaff, departmentStaff]);

  if (!sop) return null;

  const renderStaffItem = (staff: StaffMinified, isRead: boolean) => (
    <div key={staff.reference} className="flex items-center justify-between p-3 bg-zinc-50 rounded border border-zinc-100 hover:bg-zinc-100/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded flex items-center justify-center text-sm font-semibold shadow-inner border ${
          isRead ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-amber-100 text-amber-700 border-amber-200"
        }`}>
          {staff.first_name?.[0] || "U"}
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-zinc-900 leading-tight">
            {staff.first_name} {staff.last_name}
          </span>
          <span className="text-xs text-zinc-500 font-medium flex items-center gap-1 mt-0.5">
            <Mail className="w-3 h-3 text-zinc-400" />
            {staff.email}
          </span>
        </div>
      </div>
      <div>
        <Badge variant="outline" className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
          isRead ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-amber-50 text-amber-700 border-amber-200"
        }`}>
          {isRead ? "Read" : "Pending"}
        </Badge>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[85vh] flex flex-col gap-0 p-0 rounded overflow-hidden">
        <DialogHeader className="p-6 pb-4 bg-white border-b border-zinc-100">
          <DialogTitle className="text-xl font-semibold text-[#004d40]">
            SOP Acknowledgements
          </DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium mt-1.5 line-clamp-1">
            Tracking read receipts for: <span className="font-semibold text-zinc-700">{sop.title}</span>
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="read" className="flex flex-col flex-1 overflow-hidden">
          <div className="px-6 pt-4 pb-2 bg-zinc-50/50">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="read" className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Read ({readStaff.length})
              </TabsTrigger>
              <TabsTrigger 
                value="pending" 
                disabled={!departmentStaff}
                className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5" />
                Pending {departmentStaff ? `(${pendingStaff.length})` : ''}
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="flex-1 overflow-hidden">
            <TabsContent value="read" className="h-full m-0 p-0">
              <div className="h-[400px] w-full overflow-y-auto p-6 pt-2">
                {readStaff.length > 0 ? (
                  <div className="space-y-2">
                    {readStaff.map(staff => renderStaffItem(staff, true))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center space-y-3">
                    <div className="w-12 h-12 rounded bg-zinc-100 flex items-center justify-center">
                      <Clock className="w-6 h-6 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-zinc-900">No Read Receipts</p>
                      <p className="text-xs text-zinc-500 max-w-[200px] mx-auto mt-1">No staff members have acknowledged reading this SOP yet.</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="pending" className="h-full m-0 p-0">
              <div className="h-[400px] w-full overflow-y-auto p-6 pt-2">
                {pendingStaff.length > 0 ? (
                  <div className="space-y-2">
                    {pendingStaff.map(staff => renderStaffItem(staff, false))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center space-y-3">
                    <div className="w-12 h-12 rounded bg-emerald-50 flex items-center justify-center border border-emerald-100">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-emerald-700">All Caught Up!</p>
                      <p className="text-xs text-zinc-500 max-w-[200px] mx-auto mt-1">Every member of the department has acknowledged this SOP.</p>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
