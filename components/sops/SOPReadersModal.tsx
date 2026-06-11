"use client";

import { useMemo, useState, useEffect } from "react";
import { StaffMinified } from "@/services/accounts";
import { Sops, SopsMinified } from "@/services/sops";
import { getSOPsProgresses, SOPProgress } from "@/services/sopprogress";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, Clock, Mail, BookOpen, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SOPReadersModalProps {
  isOpen: boolean;
  onClose: () => void;
  sop: Sops | SopsMinified | null;
  departmentStaff?: StaffMinified[];
}

export default function SOPReadersModal({ isOpen, onClose, sop, departmentStaff }: SOPReadersModalProps) {
  const [progresses, setProgresses] = useState<SOPProgress[]>([]);
  const [loading, setLoading] = useState(false);
  const headers = useAxiosAuth();

  useEffect(() => {
    if (isOpen && sop?.reference) {
      setLoading(true);
      getSOPsProgresses(headers, { sop_reference: sop.reference })
        .then((data) => setProgresses(data))
        .catch((err) => console.error("Failed to fetch SOP progresses:", err))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, sop?.reference]);

  const completed = useMemo(() => progresses.filter((p) => p.status === "Completed"), [progresses]);
  const inProgress = useMemo(() => progresses.filter((p) => p.status === "Reading"), [progresses]);
  
  const unreadStaff = useMemo(() => {
    if (!departmentStaff) return [];
    const progressEmails = new Set(progresses.map((p) => p.user));
    return departmentStaff.filter((s) => !progressEmails.has(s.email));
  }, [progresses, departmentStaff]);

  if (!sop) return null;

  const renderStaffItem = (staff: StaffMinified) => (
    <div key={staff.reference} className="flex items-center justify-between p-3 bg-zinc-50 rounded border border-zinc-100 hover:bg-zinc-100/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded flex items-center justify-center text-sm font-semibold shadow-inner border bg-zinc-100 text-zinc-700 border-zinc-200">
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
        <Badge variant="outline" className="px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider bg-zinc-50 text-zinc-500 border-zinc-200">
          Unread
        </Badge>
      </div>
    </div>
  );

  const renderProgressItem = (prog: SOPProgress) => {
    const isCompleted = prog.status === "Completed";
    return (
      <div key={prog.id} className="flex flex-col p-4 bg-zinc-50 rounded border border-zinc-100 hover:bg-zinc-100/50 transition-colors gap-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded flex items-center justify-center text-sm font-semibold shadow-inner border ${
              isCompleted ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-[#e0f2f1] text-[#004d40] border-[#b2dfdb]"
            }`}>
              {prog.first_name?.[0] || prog.user?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-zinc-900 leading-tight">
                {prog.first_name} {prog.last_name}
              </span>
              <span className="text-xs text-zinc-500 font-medium flex items-center gap-1 mt-0.5">
                <Mail className="w-3 h-3 text-zinc-400" />
                {prog.user}
              </span>
            </div>
          </div>
          <div>
            <Badge variant="outline" className={`px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
              isCompleted ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-[#e0f2f1] text-[#004d40] border-[#b2dfdb]"
            }`}>
              {isCompleted ? "Completed" : "Reading"}
            </Badge>
          </div>
        </div>

        {/* Progress Bar for Reading Status */}
        {!isCompleted && (
          <div className="w-full">
            <div className="flex justify-between text-[10px] text-zinc-500 font-semibold uppercase tracking-wider mb-1.5">
              <span>{prog.max_scroll_percent}% Read</span>
              {sop.total_pages > 0 && <span>Page {prog.highest_page_read} of {sop.total_pages}</span>}
            </div>
            <div className="w-full bg-zinc-200 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-[#004d40] h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, Math.max(0, prog.max_scroll_percent))}%` }}
              ></div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-xl max-h-[85vh] flex flex-col gap-0 p-0 rounded overflow-hidden">
        <DialogHeader className="p-6 pb-4 bg-white border-b border-zinc-100">
          <DialogTitle className="text-xl font-semibold text-[#004d40]">
            SOP Tracking & Progress
          </DialogTitle>
          <DialogDescription className="text-zinc-500 font-medium mt-1.5 line-clamp-1">
            Tracking employee progress for: <span className="font-semibold text-zinc-700">{sop.title}</span>
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center h-[400px] gap-2">
            <Loader2 className="w-8 h-8 animate-spin text-[#004d40]" />
            <p className="text-sm font-medium text-zinc-500">Loading progress records...</p>
          </div>
        ) : (
          <Tabs defaultValue="in-progress" className="flex flex-col flex-1 overflow-hidden">
            <div className="px-6 pt-4 pb-2 bg-zinc-50/50">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="completed" className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Completed ({completed.length})
                </TabsTrigger>
                <TabsTrigger value="in-progress" className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  In Progress ({inProgress.length})
                </TabsTrigger>
                <TabsTrigger 
                  value="unread" 
                  disabled={!departmentStaff}
                  className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5" />
                  Unread {departmentStaff ? `(${unreadStaff.length})` : ''}
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="completed" className="h-full m-0 p-0">
                <div className="h-[400px] w-full overflow-y-auto p-6 pt-2">
                  {completed.length > 0 ? (
                    <div className="space-y-3">
                      {completed.map(prog => renderProgressItem(prog))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center space-y-3">
                      <div className="w-12 h-12 rounded bg-zinc-100 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">No Completions</p>
                        <p className="text-xs text-zinc-500 max-w-[200px] mx-auto mt-1">No staff members have finished reading this SOP yet.</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="in-progress" className="h-full m-0 p-0">
                <div className="h-[400px] w-full overflow-y-auto p-6 pt-2">
                  {inProgress.length > 0 ? (
                    <div className="space-y-3">
                      {inProgress.map(prog => renderProgressItem(prog))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center space-y-3">
                      <div className="w-12 h-12 rounded bg-zinc-100 flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-zinc-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-zinc-900">No One Currently Reading</p>
                        <p className="text-xs text-zinc-500 max-w-[200px] mx-auto mt-1">There are no employees partially through this SOP.</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="unread" className="h-full m-0 p-0">
                <div className="h-[400px] w-full overflow-y-auto p-6 pt-2">
                  {unreadStaff.length > 0 ? (
                    <div className="space-y-2">
                      {unreadStaff.map(staff => renderStaffItem(staff))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-48 text-center space-y-3">
                      <div className="w-12 h-12 rounded bg-emerald-50 flex items-center justify-center border border-emerald-100">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-emerald-700">100% Engagement!</p>
                        <p className="text-xs text-zinc-500 max-w-[200px] mx-auto mt-1">Every member of the department has started or finished this SOP.</p>
                      </div>
                    </div>
                  )}
                </div>
              </TabsContent>
            </div>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  );
}
