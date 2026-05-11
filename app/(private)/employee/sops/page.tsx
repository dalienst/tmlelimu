"use client";

import { useState, useMemo } from "react";
import { Files, Compass, BookOpen } from "lucide-react";
import { useFetchAuthSops } from "@/hooks/sops/actions";
import { useFetchAccount } from "@/hooks/accounts/actions";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import SOPSTable from "@/components/sops/SOPSTable";

export default function EmployeeSopsPage() {
  const { data: user, isLoading: isUserLoading } = useFetchAccount();
  const [deptSearch, setDeptSearch] = useState("");
  const [deptPage, setDeptPage] = useState(1);
  const pageSize = 5;

  const [exploreSearch, setExploreSearch] = useState("");
  const [explorePage, setExplorePage] = useState(1);
  const explorePageSize = 10;

  // 1. Get Department SOPs (Local from Account)
  const departmentSops = useMemo(() => {
    if (!user?.departments) return [];
    // Aggregate SOPs from all departments the employee belongs to
    const allSops = user.departments.flatMap(dept => dept.sops || []);
    // Remove duplicates by reference
    return Array.from(new Map(allSops.map(sop => [sop.reference, sop])).values());
  }, [user]);

  const filteredDeptSops = useMemo(() => {
    return departmentSops.filter(s => 
      s.title.toLowerCase().includes(deptSearch.toLowerCase()) ||
      s.code.toLowerCase().includes(deptSearch.toLowerCase())
    );
  }, [departmentSops, deptSearch]);

  const paginatedDeptSops = filteredDeptSops.slice((deptPage - 1) * pageSize, deptPage * pageSize);

  // 2. Get Explore SOPs (Server-side Paginated)
  const { data: exploreData, isLoading: isExploreLoading } = useFetchAuthSops({
    search: exploreSearch,
    page: explorePage,
    page_size: explorePageSize
  });

  return (
    <div className="p-6 mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Strategic Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Badge className="bg-emerald-50 text-[#004d40] border-emerald-100 font-bold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded">
            Knowledge Base
          </Badge>
          <span className="text-zinc-300">•</span>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            Employee Portal
          </span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-[#004d40]">SOP Library</h1>
        <p className="text-zinc-500 font-medium">
          Access organizational procedures, safety protocols, and operational guidelines.
        </p>
      </div>

      {/* Section 1: Departmental SOPs */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-[#004d40] flex items-center justify-center shadow-lg shadow-emerald-900/10">
            <Files className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900">My Department Documents</h2>
            <p className="text-xs text-zinc-400 font-semibold uppercase tracking-widest">Core Procedures</p>
          </div>
        </div>

        <Card className="border-zinc-100 shadow-xl rounded overflow-hidden bg-white">
          <SOPSTable
            data={paginatedDeptSops}
            isLoading={isUserLoading}
            search={deptSearch}
            onSearch={(val) => {
              setDeptSearch(val);
              setDeptPage(1);
            }}
            page={deptPage}
            onPageChange={setDeptPage}
            totalCount={filteredDeptSops.length}
            pageSize={pageSize}
          />
        </Card>
      </section>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center" aria-hidden="true">
          <Separator className="w-full bg-zinc-100" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#fafafa] px-6 text-zinc-300">
            <Compass className="w-6 h-6" />
          </span>
        </div>
      </div>

      {/* Section 2: Explore Library */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded bg-zinc-100 flex items-center justify-center border border-zinc-200">
            <BookOpen className="w-5 h-5 text-zinc-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-zinc-900">Explore Organizational Library</h2>
            <p className="text-xs text-zinc-400 font-semibold uppercase tracking-widest">Global References</p>
          </div>
        </div>

        <Card className="border-zinc-100 shadow-xl rounded overflow-hidden bg-white">
          <SOPSTable
            data={exploreData?.results}
            isLoading={isExploreLoading}
            search={exploreSearch}
            onSearch={(val) => {
              setExploreSearch(val);
              setExplorePage(1);
            }}
            page={explorePage}
            onPageChange={setExplorePage}
            totalCount={exploreData?.count || 0}
            pageSize={explorePageSize}
          />
        </Card>
      </section>

      {/* Institutional Footer */}
      <div className="pt-8 text-center border-t border-zinc-100">
        <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-[0.3em]">
          Elimu Operational Intelligence • Secured Library
        </p>
      </div>
    </div>
  );
}