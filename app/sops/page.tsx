"use client";

import { useState, useMemo } from "react";
import { Search, FileText, Download, Clock } from "lucide-react";
import { useFetchSops } from "@/hooks/sops/actions";
import { Sops } from "@/services/sops";

import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import Navbar from "@/components/public/Navbar";

export default function SOpsPortal() {
  const { data: sopsData, isLoading } = useFetchSops();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSops = useMemo(() => {
    if (!sopsData) return [];
    if (!searchTerm) return sopsData;

    return sopsData.filter(
      (sop) =>
        sop.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sop.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sopsData, searchTerm]);

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col">
      <Navbar />
      <div className="flex-1 pb-20">
        {/* Hero Banner Section */}
        <div className="bg-[#004d40] text-white pt-24 pb-16 px-6 md:px-12 relative overflow-hidden">
          {/* Abstract Background Design */}
          <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-amber-500 rounded blur-[100px]" />
            <div className="absolute bottom-[-20%] left-[-10%] w-[40%] h-[100%] bg-emerald-400 rounded blur-[120px]" />
          </div>

          <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center rounded px-3 py-1 text-sm font-medium bg-white/10 text-emerald-100 border border-white/20 mb-6 backdrop-blur-sm">
                Tamarind Group Official Docs
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
                Standard Operating Procedures
              </h1>
              <p className="text-lg text-emerald-100 font-medium">
                Access the official documentation to ensure consistent excellence across all Tamarind operations.
              </p>
            </div>

            <div className="w-full md:w-80 space-y-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                <Input
                  type="text"
                  placeholder="Search SOPs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 h-12 bg-white text-zinc-900 border-none rounded shadow-lg placeholder:text-zinc-500 focus-visible:ring-2 focus-visible:ring-amber-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-6 md:px-12 -mt-8 relative z-20">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white rounded p-6 shadow-sm">
                  <Skeleton className="h-10 w-10 rounded mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-3" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                  <div className="mt-8 pt-4 border-t border-zinc-100">
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredSops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSops.map((sop: Sops) => (
                <div
                  key={sop.id}
                  className="bg-white rounded p-6 shadow-md shadow-zinc-200/50 border border-zinc-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  <div className="flex-grow">
                    <div className="w-12 h-12 bg-amber-50 rounded flex items-center justify-center text-amber-600 mb-5 relative group-hover:scale-110 transition-transform">
                      <FileText className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-bold text-zinc-900 mb-3 line-clamp-2">
                      {sop.title}
                    </h3>
                    <p className="text-zinc-600 text-sm leading-relaxed mb-6 line-clamp-3">
                      {sop.description}
                    </p>
                  </div>

                  <div className="mt-auto">
                    <div className="flex items-center text-xs text-zinc-400 font-medium mb-4 gap-1.5">
                      <Clock className="w-4 h-4" />
                      Updated {new Date(sop.updated_at || sop.created_at).toLocaleDateString()}
                    </div>
                    <a
                      href={sop.file}
                      target="_blank"
                      rel="noreferrer"
                      className="flex w-full items-center justify-center gap-2 bg-zinc-50 hover:bg-[#004d40] text-zinc-700 hover:text-white border border-zinc-200 hover:border-[#004d40] rounded py-3 font-semibold transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded p-16 text-center shadow-sm border border-zinc-100 mt-8">
              <div className="w-20 h-20 bg-zinc-50 rounded flex items-center justify-center text-zinc-400 mx-auto mb-6">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-zinc-900 mb-2">No results found</h3>
              <p className="text-zinc-500 max-w-md mx-auto">
                We couldn't find any Standard Operating Procedures matching your search criteria. Try using different keywords.
              </p>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="mt-6 text-[#004d40] font-semibold hover:underline"
                >
                  Clear Search
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}