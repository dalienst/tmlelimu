"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft, SearchX, Compass } from "lucide-react";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center relative overflow-hidden bg-zinc-50 px-4">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-[#004d40]/10 rounded-full blur-[100px] animate-pulse pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] bg-amber-500/10 rounded-full blur-[80px] animate-pulse delay-1000 pointer-events-none" />

      <div className="relative z-10 w-full max-w-lg text-center space-y-8">
        
        {/* Animated Icon Container */}
        <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
          <div className="absolute w-full h-full bg-emerald-100 rounded-full animate-ping opacity-20" />
          <div className="absolute w-full h-full bg-emerald-50 rounded-full shadow-inner" />
          <Compass className="w-16 h-16 text-[#004d40] relative z-10 animate-bounce" />
        </div>

        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-8xl font-black tracking-tighter text-zinc-900">
            4<span className="text-[#004d40]">0</span>4
          </h1>
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-800 tracking-tight">
            Looks like you're lost.
          </h2>
          <p className="text-zinc-500 font-medium max-w-md mx-auto">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button 
            onClick={() => router.back()} 
            variant="outline" 
            className="w-full sm:w-auto h-12 px-6 rounded-xl border-zinc-200 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 font-semibold transition-all"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>

          <Link href="/" className="w-full sm:w-auto">
            <Button className="w-full h-12 px-6 rounded-xl bg-[#004d40] hover:bg-[#00332b] text-white font-semibold shadow-lg shadow-[#004d40]/20 transition-all hover:scale-105 active:scale-95">
              <Home className="w-4 h-4 mr-2" />
              Return Home
            </Button>
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-8 text-xs font-bold text-zinc-400 tracking-widest uppercase">
        Tamarind Group Learning & Development
      </div>
    </div>
  );
}
