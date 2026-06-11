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
    <div className="p-3 md:p-4 mx-auto space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700 h-[calc(100vh-64px)] flex flex-col">
      {/* Strategic Header */}
      <div className="flex justify-between items-end flex-shrink-0">
        <div>
          <div className="flex items-center gap-3 mb-1.5">
            <button 
              onClick={() => router.back()} 
              className="text-zinc-400 hover:text-[#004d40] flex items-center text-[10px] font-semibold uppercase tracking-widest transition-colors group"
            >
              <div className="w-5 h-5 rounded bg-zinc-100 flex items-center justify-center mr-1.5 group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">
                <ArrowLeft className="h-3 w-3" />
              </div>
              Back
            </button>
            <div className="h-3 w-px bg-zinc-200"></div>
            <Badge className="bg-emerald-50 text-[#004d40] border-emerald-100 font-bold uppercase tracking-wider text-[9px] px-1.5 py-0 rounded">
              Viewer
            </Badge>
            <span className="text-[10px] font-semibold text-zinc-400 uppercase tracking-widest">
              {sop.code}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <h1 className="text-lg font-semibold tracking-tight text-[#004d40] leading-none">
              {sop.title}
            </h1>
            <p className="text-zinc-500 font-medium text-xs truncate max-w-sm hidden md:block">
              {sop.description}
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3 bg-white px-3 py-1.5 border border-zinc-100 rounded shadow-sm hover:shadow-md transition-all">
          <div className="w-8 h-8 bg-amber-50 text-amber-600 rounded flex items-center justify-center font-semibold border border-amber-100">
            <FileText className="w-4 h-4" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] uppercase font-bold text-zinc-400 tracking-wider mb-0.5 leading-none">
              Progress
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-extrabold text-[#004d40] leading-none">{currentPercent}%</span>
              {currentPercent === 100 && (
                <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
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