"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

interface PDFViewerProps {
  file: string;
  numPages: number;
  pageNumber: number;
  windowWidth: number;
  isUpdatingProgress: boolean;
  onDocumentLoadSuccess: (info: { numPages: number }) => void;
  handlePageChange: (newPage: number) => void;
}

export default function PDFViewer({
  file,
  numPages,
  pageNumber,
  windowWidth,
  isUpdatingProgress,
  onDocumentLoadSuccess,
  handlePageChange
}: PDFViewerProps) {
  return (
    <div className="flex-1 bg-gray-50 rounded-2xl shadow-inner border border-gray-200 overflow-hidden flex flex-col relative">
      <div className="flex-1 overflow-auto flex justify-center p-4">
        <Document
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center h-full text-gray-400">
              <Loader2 className="h-6 w-6 animate-spin mr-2" /> Loading Document...
            </div>
          }
          error={
            <div className="text-red-500 p-4 bg-red-50 rounded-lg border border-red-100">
              Failed to load the PDF. It may be corrupt or missing. (404 Error indicates the file doesn't exist at the given URL).
            </div>
          }
        >
          {numPages > 0 && (
            <Page 
              pageNumber={pageNumber} 
              className="shadow-xl rounded-lg overflow-hidden bg-white"
              renderTextLayer={true}
              renderAnnotationLayer={true}
              width={windowWidth}
            />
          )}
        </Document>
      </div>

      {/* Pagination Controls */}
      <div className="bg-white border-t border-gray-200 p-4 flex items-center justify-between z-10 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => handlePageChange(pageNumber - 1)}
          disabled={pageNumber <= 1}
          className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg disabled:opacity-50 disabled:hover:bg-gray-100 transition-colors"
        >
          <ChevronLeft className="w-5 h-5 mr-1" /> Previous
        </button>
        
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-600">
            Page {pageNumber} of {numPages || '-'}
          </span>
          {isUpdatingProgress && <Loader2 className="w-3 h-3 animate-spin text-[#004d40]" />}
        </div>

        <button
          onClick={() => handlePageChange(pageNumber + 1)}
          disabled={pageNumber >= numPages || numPages === 0}
          className="flex items-center px-4 py-2 bg-[#004d40] hover:bg-[#00332b] text-white rounded-lg disabled:opacity-50 disabled:hover:bg-[#004d40] transition-colors shadow-sm"
        >
          Next <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
}
