"use client";

import { useEffect, useState, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import { getAuthSop, Sops } from "@/services/sops";
import { updateSOPProgressBySOP } from "@/services/sopprogress";
import { ArrowLeft, Loader2, CheckCircle } from "lucide-react";
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
    <div className="max-w-5xl mx-auto p-4 md:p-8 flex flex-col h-[calc(100vh-64px)]">
      {/* Header & Progress */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6 flex-shrink-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <button 
              onClick={() => router.push('/employee/dashboard')} 
              className="text-gray-500 hover:text-gray-900 mb-2 flex items-center text-sm transition-colors"
            >
              <ArrowLeft className="mr-1 h-4 w-4" /> Back to Dashboard
            </button>
            <h1 className="text-2xl font-bold text-gray-900">{sop.title}</h1>
            <p className="text-gray-500 text-sm mt-1">{sop.description}</p>
          </div>
          
          <div className="flex items-center gap-3">
            {currentPercent === 100 && (
              <div className="flex items-center text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-1.5" /> Completed
              </div>
            )}
            <div className="text-right">
              <span className="text-sm font-medium text-gray-700">{currentPercent}% Read</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-[#004d40] h-2.5 rounded-full transition-all duration-500 ease-out"
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
  );
}