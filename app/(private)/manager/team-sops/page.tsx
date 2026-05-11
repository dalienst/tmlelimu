"use client";

import { useState, useMemo } from "react";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Search, 
  ArrowUpDown,
  Calendar,
  User as UserIcon,
  Tag,
  Building2,
  MoreVertical
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export default function TeamSopsPage() {
  const { data: manager, isLoading: isLoadingManager } = useFetchAccount();
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"title" | "date">("title");

  // Aggregate SOPs from all departments headed by the manager
  const allSops = useMemo(() => {
    if (!manager?.departments_headed) return [];
    
    return manager.departments_headed.flatMap(dept => 
      (dept.sops || []).map(sop => ({
        ...sop,
        departmentName: dept.name,
        departmentCode: dept.code
      }))
    );
  }, [manager]);

  // Filter and sort SOPs
  const filteredSops = useMemo(() => {
    let results = allSops.filter(sop => 
      sop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sop.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sop.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (sortBy === "title") {
      results.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "date") {
      results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return results;
  }, [allSops, searchQuery, sortBy]);

  if (isLoadingManager) {
    return (
      <div className="p-6 space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64 rounded" />
          <Skeleton className="h-10 w-48 rounded" />
        </div>
        <Card className="border-zinc-100 shadow-xl rounded overflow-hidden">
          <div className="p-0">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full rounded-none border-b border-zinc-50" />
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[#004d40]">Team SOP Library</h1>
          <p className="text-zinc-500 font-medium mt-1">
            Managing <span className="text-zinc-900 font-bold">{allSops.length}</span> standard operating procedures across your departments
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input 
              placeholder="Search by title, code or description..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-11 rounded bg-white border-zinc-200 focus:border-[#004d40] transition-all"
            />
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 rounded border-zinc-200 gap-2 font-bold text-xs uppercase tracking-wider">
                <ArrowUpDown className="w-4 h-4 text-zinc-400" />
                Sort: {sortBy === "title" ? "A-Z" : "Latest"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded">
              <DropdownMenuItem onClick={() => setSortBy("title")} className="font-medium">
                Sort by Title (A-Z)
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortBy("date")} className="font-medium">
                Sort by Date (Newest)
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* SOP Table */}
      {filteredSops.length > 0 ? (
        <Card className="border-zinc-100 shadow-xl rounded overflow-hidden bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-zinc-50/50 border-b border-zinc-100">
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Document</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Code</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Department</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Description</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-50">
                {filteredSops.map((sop) => (
                  <tr key={sop.code} className="hover:bg-zinc-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-emerald-50 text-[#004d40] rounded flex items-center justify-center border border-emerald-100 shadow-inner group-hover:bg-[#004d40] group-hover:text-white transition-all">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-zinc-900 leading-tight group-hover:text-[#004d40] transition-colors">
                            {sop.title}
                          </span>
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mt-0.5">
                            {new Date(sop.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="outline" className="bg-zinc-50 text-zinc-500 border-zinc-200 text-[10px] font-bold py-0.5 rounded px-2">
                        {sop.code}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className="bg-amber-50 text-amber-700 border-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded">
                        {sop.departmentCode}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-zinc-500 line-clamp-1 max-w-[300px]">
                        {sop.description}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded text-zinc-400 hover:text-[#004d40] hover:bg-emerald-50">
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-3 rounded text-[10px] font-bold uppercase tracking-widest text-[#004d40] hover:bg-emerald-50">
                          <Download className="w-3.5 h-3.5 mr-1.5" />
                          File
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded text-zinc-400 hover:bg-zinc-100">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="rounded">
                            <DropdownMenuItem className="gap-2 font-medium text-xs">
                              <Tag className="w-3.5 h-3.5" /> Assign Category
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2 font-medium text-xs text-zinc-500">
                              <Building2 className="w-3.5 h-3.5" /> Move Dept
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center text-center bg-zinc-50 rounded border-2 border-dashed border-zinc-200 animate-in fade-in duration-1000">
          <div className="w-20 h-20 bg-white rounded flex items-center justify-center text-zinc-200 mb-6 shadow-sm border border-zinc-100">
            <Search className="w-10 h-10" />
          </div>
          <h3 className="text-xl font-bold text-zinc-900 mb-2">No SOPs Found</h3>
          <p className="text-zinc-500 max-w-sm mx-auto font-medium leading-relaxed">
            {searchQuery 
              ? `We couldn't find any documents matching "${searchQuery}". Please try a different search term.`
              : "There are currently no standard operating procedures assigned to your departments."
            }
          </p>
          {searchQuery && (
            <Button 
              variant="link" 
              onClick={() => setSearchQuery("")}
              className="mt-4 text-[#004d40] font-bold"
            >
              Clear Search
            </Button>
          )}
        </div>
      )}
    </div>
  );
}