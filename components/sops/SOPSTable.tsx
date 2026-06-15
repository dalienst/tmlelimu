import { Pencil, EyeOff, Eye, MoreHorizontal, Settings2, Search, ChevronLeft, ChevronRight, Download, Trash2, CheckCircle2, Loader2, Users, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Sops, SopsMinified } from "@/services/sops";
import { StaffMinified } from "@/services/accounts";
import SOPReadersModal from "@/components/sops/SOPReadersModal";
import { downloadSOPCertificate } from "@/services/sopcertificates";
import useAxiosAuth from "@/hooks/authentication/useAxiosAuth";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

interface SOPSTableProps<T extends Sops | SopsMinified> {
  data: T[] | undefined;
  isLoading: boolean;
  onEdit?: (sop: T) => void;
  onToggle?: (sop: T) => void;
  onRemove?: (sop: T) => void;
  onMarkAsRead?: (sop: T) => Promise<void>;
  readFilter?: 'all' | 'read' | 'unread';
  onReadFilterChange?: (val: 'all' | 'read' | 'unread') => void;
  showReaders?: boolean;
  departmentStaff?: StaffMinified[];
  // Search & Pagination
  search: string;
  onSearch: (value: string) => void;
  page: number;
  onPageChange: (page: number) => void;
  totalCount: number;
  pageSize: number;
  detailBasePath?: string;
}

export default function SOPSTable<T extends Sops | SopsMinified>({
  data,
  isLoading,
  onEdit,
  onToggle,
  onRemove,
  onMarkAsRead,
  readFilter,
  onReadFilterChange,
  showReaders,
  departmentStaff,
  search,
  onSearch,
  page,
  onPageChange,
  totalCount,
  pageSize,
  detailBasePath
}: SOPSTableProps<T>) {
  const headers = useAxiosAuth();
  const [downloadingCert, setDownloadingCert] = useState<string | null>(null);
  const [localSearch, setLocalSearch] = useState(search);
  const [loadingReadSops, setLoadingReadSops] = useState<Set<string>>(new Set());
  const [viewedSops, setViewedSops] = useState<Set<string>>(new Set());
  const [viewingReaders, setViewingReaders] = useState<T | null>(null);

  const handleDownloadCertificate = async (reference: string) => {
    setDownloadingCert(reference);
    try {
      await downloadSOPCertificate(reference, headers);
    } catch (err) {
      console.error("Failed to download certificate:", err);
    } finally {
      setDownloadingCert(null);
    }
  };

  const handleMarkAsReadClick = async (sop: T) => {
    if (!onMarkAsRead) return;
    setLoadingReadSops((prev) => new Set(prev).add(sop.reference));
    try {
      await onMarkAsRead(sop);
    } finally {
      setLoadingReadSops((prev) => {
        const next = new Set(prev);
        next.delete(sop.reference);
        return next;
      });
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(localSearch);
    }, 500);
    return () => clearTimeout(timer);
  }, [localSearch, onSearch]);

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-zinc-100 bg-zinc-50/30">
        <Search className="w-4 h-4 text-zinc-400 shrink-0" />
        <Input
          placeholder="Search SOPs by title..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="border-none shadow-none focus-visible:ring-0 text-sm p-0 h-auto bg-transparent placeholder:text-zinc-400 flex-1"
        />
        {onReadFilterChange && (
          <div className="flex items-center gap-1 ml-auto shrink-0 bg-zinc-200/50 p-1 rounded border border-zinc-200/50">
            <button
              onClick={() => {
                onReadFilterChange('all');
                onPageChange(1);
              }}
              className={`px-3 py-1.5 rounded text-[10px] font-semibold uppercase tracking-wider transition-all ${readFilter === 'all' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              All
            </button>
            <button
              onClick={() => {
                onReadFilterChange('unread');
                onPageChange(1);
              }}
              className={`px-3 py-1.5 rounded text-[10px] font-semibold uppercase tracking-wider transition-all ${readFilter === 'unread' ? 'bg-white text-amber-700 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              Unread
            </button>
            <button
              onClick={() => {
                onReadFilterChange('read');
                onPageChange(1);
              }}
              className={`px-3 py-1.5 rounded text-[10px] font-semibold uppercase tracking-wider transition-all ${readFilter === 'read' ? 'bg-white text-emerald-700 shadow-sm' : 'text-zinc-500 hover:text-zinc-700'}`}
            >
              Read
            </button>
          </div>
        )}
      </div>

      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded" />
            ))}
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-zinc-50/50">
              <TableRow className="hover:bg-transparent border-zinc-100">
                <TableHead className="w-[50%] px-6 py-4 font-semibold text-zinc-900">Title</TableHead>
                <TableHead className="px-6 py-4 font-semibold text-zinc-900 text-center">Status</TableHead>
                {(onEdit || onToggle || onRemove || onMarkAsRead) ? (
                  <TableHead className="text-right px-6 py-4 font-semibold text-zinc-900">Actions</TableHead>
                ) : (
                  <TableHead className="text-right px-6 py-4 font-semibold text-zinc-900">Document</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((sop: T) => (
                  <TableRow key={sop.reference} className="group border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                    <TableCell className="px-6 py-5 align-top">
                      <div className="font-semibold text-[#004d40] leading-tight mb-1">
                        {detailBasePath ? (
                          <Link href={`${detailBasePath}/${sop.reference}`} className="hover:text-amber-600 hover:underline transition-colors flex items-center gap-1 group/link">
                            {sop.title}
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover/link:opacity-100 transition-opacity" />
                          </Link>
                        ) : (
                          sop.title
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wider bg-zinc-50 px-1.5 py-0.5 rounded border border-zinc-100 inline-block">
                        {sop.code}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5 text-center align-top">
                      <div className="flex flex-col items-center gap-2">
                        <Badge
                          variant="outline"
                          className={sop.is_active
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 px-2.5 py-0.5 rounded text-[11px] font-semibold"
                            : "bg-red-50 text-red-700 border-red-200 px-2.5 py-0.5 rounded text-[11px] font-semibold"}
                        >
                          {sop.is_active ? "ACTIVE" : "INACTIVE"}
                        </Badge>
                        {showReaders && sop.read_by && (
                          <div 
                            className="flex items-center -space-x-2 mt-1 cursor-pointer hover:scale-105 transition-transform bg-zinc-50 border border-zinc-100 rounded-full px-1.5 py-0.5"
                            onClick={() => setViewingReaders(sop)}
                            title="View Readers"
                          >
                            {sop.read_by.length === 0 && (
                              <div className="text-[9px] text-zinc-400 font-semibold uppercase tracking-widest px-1">0 Reads</div>
                            )}
                            {sop.read_by.slice(0, 3).map((staff, i) => (
                              <div 
                                key={staff.reference} 
                                className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 border border-white flex items-center justify-center text-[8px] font-bold z-10 relative shadow-sm"
                                style={{ zIndex: 10 - i }}
                                title={`${staff.first_name} ${staff.last_name}`}
                              >
                                {staff.first_name?.[0] || 'U'}
                              </div>
                            ))}
                            {sop.read_by.length > 3 && (
                              <div className="w-5 h-5 rounded-full bg-zinc-200 text-zinc-600 border border-white flex items-center justify-center text-[8px] font-bold z-0 relative shadow-sm">
                                +{sop.read_by.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5 text-right align-top">
                      <div className="flex items-center justify-end gap-2">
                        {detailBasePath && (
                          sop.progress?.status === "Completed" ? (
                            <div className="flex items-center gap-2">
                              <div className="w-28 flex flex-col gap-1 justify-center select-none text-left">
                                <div className="flex justify-between items-center text-[10px] text-emerald-700 font-semibold leading-none mb-0.5">
                                  <span>Completed</span>
                                  <span>100%</span>
                                </div>
                                <div className="w-full bg-emerald-100 rounded-full h-1.5 overflow-hidden">
                                  <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: "100%" }} />
                                </div>
                              </div>
                              {sop.progress?.certificate_reference && (
                                <button 
                                  onClick={() => handleDownloadCertificate(sop.progress?.certificate_reference!)}
                                  disabled={downloadingCert === sop.progress?.certificate_reference}
                                  className="h-8 w-8 bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 disabled:opacity-50 transition-colors rounded flex items-center justify-center shrink-0"
                                  title="Download Certificate"
                                >
                                  {downloadingCert === sop.progress?.certificate_reference ? (
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                  ) : (
                                    <Download className="w-4 h-4" />
                                  )}
                                </button>
                              )}
                            </div>
                          ) : sop.progress?.status === "Reading" ? (
                            <div className="w-28 flex flex-col gap-1 justify-center select-none text-left">
                              <div className="flex justify-between items-center text-[10px] text-[#004d40] font-semibold leading-none mb-0.5">
                                <span>Reading</span>
                                <span>{sop.progress.max_scroll_percent}%</span>
                              </div>
                              <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="bg-emerald-600 h-1.5 rounded-full transition-all duration-300"
                                  style={{ width: `${Math.min(100, Math.max(0, sop.progress.max_scroll_percent))}%` }}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="w-28 flex flex-col gap-1 justify-center select-none text-left">
                              <div className="flex justify-between items-center text-[10px] text-amber-700 font-semibold leading-none mb-0.5">
                                <span>Pending</span>
                                <span>0%</span>
                              </div>
                              <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                                <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: "0%" }} />
                              </div>
                            </div>
                          )
                        )}

                        {(onEdit || onToggle || onRemove) && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-9 w-9 p-0 rounded hover:bg-zinc-100 transition-colors">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-5 w-5 text-zinc-500" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 p-1 rounded shadow-xl border-zinc-200">
                              {onEdit && (
                                <DropdownMenuItem
                                  onClick={() => onEdit(sop)}
                                  className="cursor-pointer font-medium text-zinc-700"
                                >
                                  <Pencil className="mr-2 h-4 w-4" />
                                  Edit details
                                </DropdownMenuItem>
                              )}
                              {showReaders && (
                                <DropdownMenuItem
                                  onClick={() => setViewingReaders(sop)}
                                  className="cursor-pointer font-medium text-[#004d40]"
                                >
                                  <Users className="mr-2 h-4 w-4" />
                                  View Readers
                                </DropdownMenuItem>
                              )}
                              {!onMarkAsRead && (
                                <a href={sop.file} target="_blank" rel="noreferrer">
                                  <DropdownMenuItem className="cursor-pointer font-medium text-[#004d40]">
                                    <Settings2 className="mr-2 h-4 w-4" />
                                    View Document
                                  </DropdownMenuItem>
                                </a>
                              )}
                              {onToggle && (
                                <DropdownMenuItem
                                  onClick={() => onToggle(sop)}
                                  className={sop.is_active ? "text-amber-600 focus:bg-amber-50 focus:text-amber-600 cursor-pointer font-medium" : "text-emerald-600 focus:bg-emerald-50 focus:text-emerald-600 cursor-pointer font-medium"}
                                >
                                  {sop.is_active ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                                  {sop.is_active ? "Deactivate" : "Activate"}
                                </DropdownMenuItem>
                              )}
                              {onRemove && (
                                <DropdownMenuItem
                                  onClick={() => onRemove(sop)}
                                  className="text-red-600 focus:bg-red-50 focus:text-red-600 cursor-pointer font-medium"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Remove
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </TableCell>

                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-32 text-center text-zinc-500">
                    No Standard Operating Procedures found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="flex items-center justify-between px-6 py-4 border-t border-zinc-100 bg-zinc-50/50">
        <p className="text-xs text-zinc-500 font-medium whitespace-nowrap">
          Showing <span className="text-[#004d40]">{data?.length || 0}</span> of <span className="text-[#004d40]">{totalCount}</span> SOPs
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1 || isLoading}
            className="h-8 w-8 p-0 rounded text-zinc-500 border-zinc-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center justify-center h-8 px-3 rounded border border-zinc-200 bg-white text-xs font-semibold text-[#004d40]">
            Page {page} of {totalPages || 1}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages || isLoading}
            className="h-8 w-8 p-0 rounded text-zinc-500 border-zinc-200"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {showReaders && viewingReaders && (
        <SOPReadersModal
          isOpen={!!viewingReaders}
          onClose={() => setViewingReaders(null)}
          sop={viewingReaders}
          departmentStaff={departmentStaff}
        />
      )}
    </div>
  );
}
