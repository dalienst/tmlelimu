"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { getAuthSop, Sops } from "@/services/sops";
import { updateSOPProgressBySOP } from "@/services/sopprogress";
import { ArrowLeft, Loader2, CheckCircle, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(() => import("@/components/sops/PDFViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 border border-gray-200">
      <Loader2 className="h-6 w-6 animate-spin mr-2" /> Initializing PDF Viewer...
    </div>
  )
});

interface CustomSession {
  user?: {
    token?: string;
  };
}

export default function SopDetailPage() {
  const { sop_reference } = useParams();
  const { data: session } = useSession() as { data: CustomSession | null };
  const router = useRouter();

  const [sop, setSop] = useState<Sops | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [highestRead, setHighestRead] = useState<number>(0);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [windowWidth, setWindowWidth] = useState<number>(800);

  useEffect(() => {
    // Handle resize for PDF width
    const handleResize = () => setWindowWidth(Math.min(window.innerWidth - 64, 800));
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchSop = async () => {
      if (!session?.user?.token || !sop_reference) return;
      try {
        const data = await getAuthSop(sop_reference as string, {
          headers: { Authorization: `Token ${session.user.token}` },
        });
        setSop(data);
        
        // Initialize progress
        const initialProgress = data.progress?.highest_page_read || 0;
        setHighestRead(initialProgress);
        
        // Start them on the page they left off, or page 1.
        const startPage = initialProgress > 0 && initialProgress < data.total_pages ? initialProgress + 1 : 1;
        setPageNumber(startPage);

      } catch (err) {
        console.error(err);
        setError("Failed to load SOP details.");
      } finally {
        setLoading(false);
      }
    };
    fetchSop();
  }, [session, sop_reference]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > numPages) return;
    setPageNumber(newPage);

    // If they've reached a new highest page, update the backend
    if (newPage > highestRead && session?.user?.token && sop) {
      setHighestRead(newPage);
      setIsUpdatingProgress(true);
      try {
        await updateSOPProgressBySOP(
          sop.reference,
          { highest_page_read: newPage },
          { headers: { Authorization: `Token ${session.user.token}` } }
        );
      } catch (err) {
        console.error("Failed to sync progress:", err);
      } finally {
        setIsUpdatingProgress(false);
      }
    }
  };

  const currentPercent = useMemo(() => {
    if (numPages === 0) return 0;
    return Math.min(100, Math.round((Math.max(highestRead, pageNumber) / numPages) * 100));
  }, [numPages, highestRead, pageNumber]);

  if (loading) {
    return (
      <div className="flex h-[calc(100vh-64px)] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#004d40]" />
      </div>
    );
  }

  if (error || !sop) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-64px)] text-center">
        <p className="text-red-500 mb-4">{error || "SOP not found."}</p>
        <button onClick={() => router.back()} className="text-[#004d40] hover:underline flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700 h-[calc(100vh-64px)] flex flex-col">
      {/* Strategic Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 flex-shrink-0">
        <div>
          <button 
            onClick={() => router.back()} 
            className="text-zinc-400 hover:text-[#004d40] mb-3 flex items-center text-[10px] font-semibold uppercase tracking-widest transition-colors group"
          >
            <div className="w-6 h-6 rounded bg-zinc-100 flex items-center justify-center mr-2 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5" />
            </div>
            Return to Library
          </button>
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-emerald-50 text-[#004d40] border-emerald-100 font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded">
              Document Viewer
            </Badge>
            <span className="text-zinc-300">•</span>
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
              {sop.code}
            </span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight text-[#004d40]">
            {sop.title}
          </h1>
          <p className="text-zinc-500 font-medium mt-1 text-sm">
            {sop.description}
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-white p-3 pr-5 border border-zinc-100 rounded shadow-sm hover:shadow-md transition-all">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded flex items-center justify-center font-semibold text-xl border border-amber-100">
            <FileText className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-zinc-400 tracking-wider mb-0.5">
              Reading Progress
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-[#004d40] leading-tight">{currentPercent}%</span>
              {currentPercent === 100 && (
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded border border-zinc-100 shadow-xl overflow-hidden flex flex-col flex-1 relative">
        {/* Progress Bar Header */}
        <div className="bg-zinc-50/80 border-b border-zinc-100 p-3 flex-shrink-0">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[9px] font-semibold text-zinc-400 uppercase tracking-widest">Completion Tracker</span>
            <span className="text-[9px] font-bold text-[#004d40]">{currentPercent}%</span>
          </div>
          <div className="w-full bg-zinc-200/50 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-amber-500 h-1.5 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${currentPercent}%` }}
            ></div>
          </div>
        </div>

        {/* PDF Viewer */}
        <PDFViewer 
          file={sop.file}
          numPages={numPages}
          pageNumber={pageNumber}
          windowWidth={windowWidth}
          isUpdatingProgress={isUpdatingProgress}
          onDocumentLoadSuccess={onDocumentLoadSuccess}
          handlePageChange={handlePageChange}
        />
      </div>
    </div>
  );
}