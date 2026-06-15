"use client";

import { useFetchSOPCertificates } from "@/hooks/sopcertificates/actions";
import { getSOPCertificateDownloadUrl } from "@/services/sopcertificates";
import { Award, Download, FileText, Calendar, ShieldCheck, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function SOPCertificatesPage() {
  const { data: certificates, isLoading } = useFetchSOPCertificates();

  if (isLoading) {
    return (
      <div className="p-8 mx-auto max-w-7xl space-y-8 animate-in fade-in duration-500">
        <div className="space-y-3">
          <Skeleton className="h-10 w-64 rounded" />
          <Skeleton className="h-4 w-96 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-28 rounded" />
          <Skeleton className="h-28 rounded" />
          <Skeleton className="h-28 rounded" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-64 rounded" />
          ))}
        </div>
      </div>
    );
  }

  const certList = certificates || [];

  const latestCertDate = certList.length > 0
    ? new Date(Math.max(...certList.map(c => new Date(c.issued_at).getTime()))).toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : "No issuances";

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 mb-1">
          <Badge className="bg-amber-50 text-amber-700 border-amber-100 font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded">
            Credentials
          </Badge>
          <span className="text-zinc-300">•</span>
          <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
            Achievements
          </span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-[#004d40]">My Certificates</h1>
        <p className="text-zinc-500 font-medium max-w-2xl">
          View and download dynamic high-fidelity certificates representing your standard operating procedure completions and compliance clearances.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Total Earned */}
        <div className="bg-white border border-zinc-150 rounded p-4 shadow-sm hover:shadow-md hover:border-amber-100 transition-all duration-300 flex items-center gap-3.5 group">
          <div className="p-2.5 rounded bg-amber-50 text-amber-600 group-hover:scale-105 transition-transform duration-300">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest leading-none">Total Certificates</p>
            <h3 className="text-xl font-bold text-zinc-800 mt-1">{certList.length} Earned</h3>
          </div>
        </div>

        {/* Latest Completed */}
        <div className="bg-white border border-zinc-150 rounded p-4 shadow-sm hover:shadow-md hover:border-emerald-100 transition-all duration-300 flex items-center gap-3.5 group">
          <div className="p-2.5 rounded bg-emerald-50 text-[#004d40] group-hover:scale-105 transition-transform duration-300">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest leading-none">Latest Issuance</p>
            <h3 className="text-xl font-bold text-zinc-800 mt-1">{latestCertDate}</h3>
          </div>
        </div>
      </div>

      {/* Certificates Grid */}
      {certList.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certList.map((cert) => (
            <Card key={cert.id} className="border border-zinc-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden bg-white group hover:border-amber-200">
              <div className="p-5 flex-1 flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="p-2.5 bg-amber-50 rounded text-amber-600 border border-amber-100 group-hover:bg-amber-100 transition-colors">
                    <Award className="w-6 h-6" />
                  </div>
                  <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 px-2 py-0.5 rounded text-[9px] font-semibold uppercase tracking-wider">
                    Verified
                  </Badge>
                </div>

                <div className="space-y-1">
                  <h3 className="text-base font-bold text-zinc-900 line-clamp-1 group-hover:text-[#004d40] transition-colors" title={cert.sop.title}>
                    {cert.sop.title}
                  </h3>
                  <p className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest leading-none">
                    Code: {cert.sop.code}
                  </p>
                </div>

                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed flex-1">
                  {cert.sop.description || "No description provided for this SOP document."}
                </p>

                <div className="pt-3 border-t border-zinc-100 flex flex-col gap-1 text-[10px] text-zinc-400 font-semibold uppercase tracking-wider">
                  <div className="flex justify-between items-center">
                    <span>Issued Date</span>
                    <span className="text-zinc-600 font-medium">
                      {new Date(cert.issued_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Verification Code</span>
                    <span className="text-zinc-600 font-mono font-medium truncate max-w-[150px]">
                      {cert.code}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-5 pb-5 pt-0">
                <a
                  href={getSOPCertificateDownloadUrl(cert.reference)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full h-10 bg-[#004d40] hover:bg-[#00332b] text-white rounded text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-900/10 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Download PDF Certificate
                </a>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-zinc-50/50 border-2 border-dashed border-zinc-200 rounded-2xl p-16 text-center space-y-4 max-w-3xl mx-auto">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-zinc-100 flex items-center justify-center text-zinc-400 mx-auto">
            <Award className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-zinc-900">No Certificates Earned Yet</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Once you complete reading an assigned SOP up to 100%, your certificate of completion will be generated and shown here.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
