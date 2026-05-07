import { Pencil, EyeOff, Eye, MoreHorizontal, Settings2, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Sops } from "@/services/sops";
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

interface SOPSTableProps {
  data: Sops[] | undefined;
  isLoading: boolean;
  onEdit: (sop: Sops) => void;
  onToggle: (sop: Sops) => void;
  // Search & Pagination
  search: string;
  onSearch: (value: string) => void;
  page: number;
  onPageChange: (page: number) => void;
  totalCount: number;
  pageSize: number;
}

export default function SOPSTable({
  data,
  isLoading,
  onEdit,
  onToggle,
  search,
  onSearch,
  page,
  onPageChange,
  totalCount,
  pageSize
}: SOPSTableProps) {
  const [localSearch, setLocalSearch] = useState(search);

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
        <Search className="w-4 h-4 text-zinc-400" />
        <Input
          placeholder="Search SOPs by title..."
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="border-none shadow-none focus-visible:ring-0 text-sm p-0 h-auto bg-transparent placeholder:text-zinc-400"
        />
      </div>

      <div className="overflow-hidden">
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
                <TableHead className="w-[30%] px-6 py-4 font-semibold text-zinc-900">Title</TableHead>
                <TableHead className="w-[35%] px-6 py-4 font-semibold text-zinc-900">Description</TableHead>
                <TableHead className="px-6 py-4 font-semibold text-zinc-900 text-center">Status</TableHead>
                <TableHead className="px-6 py-4 font-semibold text-zinc-900">Uploaded</TableHead>
                <TableHead className="text-right px-6 py-4 font-semibold text-zinc-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data && data.length > 0 ? (
                data.map((sop: Sops) => (
                  <TableRow key={sop.id} className="group border-zinc-100 hover:bg-zinc-50/50 transition-colors">
                    <TableCell className="px-6 py-5 align-top">
                      <div className="font-bold text-[#004d40] leading-tight mb-1">
                        {sop.title}
                      </div>
                      <div className="text-[10px] text-zinc-400 font-medium uppercase tracking-wider">
                        Ref: {sop.reference.slice(0, 8)}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5 text-zinc-600 align-top">
                      <p className="line-clamp-2 text-sm leading-relaxed max-w-[400px]">
                        {sop.description || "No description provided."}
                      </p>
                    </TableCell>
                    <TableCell className="px-6 py-5 text-center align-top">
                      <Badge
                        variant="outline"
                        className={sop.is_active
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200 px-2.5 py-0.5 rounded text-[11px] font-bold"
                          : "bg-red-50 text-red-700 border-red-200 px-2.5 py-0.5 rounded text-[11px] font-bold"}
                      >
                        {sop.is_active ? "ACTIVE" : "INACTIVE"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-5 text-zinc-500 text-sm align-top font-medium">
                      {new Date(sop.created_at).toLocaleDateString(undefined, {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell className="px-6 py-5 text-right align-top">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-9 w-9 p-0 rounded hover:bg-zinc-100 transition-colors">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-5 w-5 text-zinc-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 p-1 rounded shadow-xl border-zinc-200">
                          <DropdownMenuItem
                            onClick={() => onEdit(sop)}
                            className="cursor-pointer font-medium text-zinc-700"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit details
                          </DropdownMenuItem>
                          <a href={sop.file} target="_blank" rel="noreferrer">
                            <DropdownMenuItem className="cursor-pointer font-medium text-[#004d40]">
                              <Settings2 className="mr-2 h-4 w-4" />
                              View Document
                            </DropdownMenuItem>
                          </a>
                          <DropdownMenuItem
                            onClick={() => onToggle(sop)}
                            className={sop.is_active ? "text-amber-600 focus:bg-amber-50 focus:text-amber-600 cursor-pointer font-medium" : "text-emerald-600 focus:bg-emerald-50 focus:text-emerald-600 cursor-pointer font-medium"}
                          >
                            {sop.is_active ? <EyeOff className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
                            {sop.is_active ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="h-32 text-center text-zinc-500">
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
          <div className="flex items-center justify-center h-8 px-3 rounded border border-zinc-200 bg-white text-xs font-bold text-[#004d40]">
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
    </div>
  );
}
