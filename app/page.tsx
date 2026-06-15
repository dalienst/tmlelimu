import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/public/Navbar";
import { BookOpen, TrendingUp, ShieldCheck, ArrowRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white selection:bg-emerald-500/30">
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden px-6 pt-20 pb-32">
          {/* Background Image & Overlay */}
          <div className="absolute inset-0 z-0">
            <Image 
              src="/tamarind_hero_bg.png" 
              alt="Tamarind Academy" 
              fill 
              className="object-cover opacity-50 scale-105 animate-[pulse_20s_ease-in-out_infinite]"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-[#004d40]/40 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/40 to-zinc-950"></div>
            <div className="absolute inset-0 bg-[#004d40]/10 backdrop-blur-[2px]"></div>
          </div>

          <div className="relative z-10 max-w-5xl mx-auto w-full flex flex-col items-center text-center space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 mt-12">
            {/* Tagline */}
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-emerald-950/40 border border-emerald-500/20 backdrop-blur-md shadow-2xl">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_10px_rgba(245,158,11,1)]"></span>
              <span className="text-sm font-semibold tracking-widest text-emerald-300 uppercase">The Official Knowledge Portal</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter text-white leading-[1.1] drop-shadow-2xl">
              Excellence Through <br className="hidden md:block"/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-500 to-amber-600 drop-shadow-none">
                Knowledge
              </span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg md:text-2xl text-zinc-300 max-w-2xl font-light leading-relaxed drop-shadow-lg">
              Master company standards, accelerate your career, and deliver world-class hospitality with Tamarind Group.
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center gap-6 pt-6 w-full sm:w-auto">
              <Link 
                href="/login" 
                className="w-full sm:w-auto px-10 py-5 text-lg font-bold text-zinc-950 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-xl hover:from-emerald-300 hover:to-emerald-500 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] hover:shadow-[0_0_60px_-15px_rgba(16,185,129,0.7)] hover:-translate-y-1 flex items-center justify-center gap-3 group"
              >
                Log In Securely
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative z-20 -mt-24 px-6 max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-zinc-900/60 backdrop-blur-2xl border border-zinc-800/80 rounded-3xl p-8 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]">
            <div className="text-center space-y-2 p-2">
              <p className="text-4xl md:text-5xl font-bold text-white tracking-tight">100<span className="text-amber-500">+</span></p>
              <p className="text-xs md:text-sm text-zinc-400 uppercase tracking-widest font-semibold">Active SOPs</p>
            </div>
            <div className="text-center space-y-2 p-2 border-l border-zinc-800/50">
              <p className="text-4xl md:text-5xl font-bold text-white tracking-tight">12</p>
              <p className="text-xs md:text-sm text-zinc-400 uppercase tracking-widest font-semibold">Departments</p>
            </div>
            <div className="text-center space-y-2 p-2 border-l-0 md:border-l border-zinc-800/50">
              <p className="text-4xl md:text-5xl font-bold text-white tracking-tight">24<span className="text-amber-500">/</span>7</p>
              <p className="text-xs md:text-sm text-zinc-400 uppercase tracking-widest font-semibold">Secure Access</p>
            </div>
            <div className="text-center space-y-2 p-2 border-l border-zinc-800/50">
              <p className="text-4xl md:text-5xl font-bold text-white tracking-tight">99<span className="text-amber-500">%</span></p>
              <p className="text-xs md:text-sm text-zinc-400 uppercase tracking-widest font-semibold">Compliance</p>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-32 px-6 relative bg-zinc-950">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[600px] bg-[#004d40]/20 blur-[150px] rounded-full pointer-events-none"></div>
          
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center mb-24 space-y-6">
              <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
                Empowering the <br className="hidden sm:block"/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600">Tamarind standard</span>
              </h2>
              <p className="text-zinc-400 max-w-2xl mx-auto text-lg md:text-xl font-light">
                Everything you need to master your role, centralized in one premium learning platform designed for excellence.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="group relative bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 hover:border-emerald-500/50 p-10 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(16,185,129,0.15)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center text-emerald-400 mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="relative z-10 text-2xl font-bold text-white mb-4">SOP Mastery</h3>
                <p className="relative z-10 text-zinc-400 leading-relaxed text-lg">
                  Access and master Standard Operating Procedures securely. Ensure you are always aligned with the latest company standards.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="group relative bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 hover:border-amber-500/50 p-10 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(245,158,11,0.15)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center text-amber-500 mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  <TrendingUp className="w-8 h-8" />
                </div>
                <h3 className="relative z-10 text-2xl font-bold text-white mb-4">Real-time Progress</h3>
                <p className="relative z-10 text-zinc-400 leading-relaxed text-lg">
                  Track your learning journey accurately. Management can monitor compliance and identify areas for team improvement instantly.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="group relative bg-zinc-900/40 backdrop-blur-md border border-zinc-800/80 hover:border-blue-500/50 p-10 rounded-3xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(59,130,246,0.15)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 w-16 h-16 bg-zinc-950 border border-zinc-800 rounded-2xl flex items-center justify-center text-blue-400 mb-8 group-hover:scale-110 transition-transform duration-500 shadow-inner">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="relative z-10 text-2xl font-bold text-white mb-4">Enterprise Security</h3>
                <p className="relative z-10 text-zinc-400 leading-relaxed text-lg">
                  All documents are protected with dynamic watermarking, restricted downloads, and secure authenticated access protocols.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 py-16 border-t border-zinc-900 relative z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="bg-white/5 p-2 rounded-xl border border-white/10 backdrop-blur-md shadow-inner">
              <Image src="/logo.png" alt="Tamarind Group Logo" width={36} height={36} className="object-contain brightness-0 invert" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">Tamarind Elimu</span>
          </div>
          <div className="text-zinc-500 text-sm font-medium">
            &copy; {new Date().getFullYear()} Tamarind Group. All rights reserved.
          </div>
          <div className="flex gap-8">
            <Link href="#" className="text-sm font-medium text-zinc-500 hover:text-emerald-400 transition-colors">Privacy</Link>
            <Link href="#" className="text-sm font-medium text-zinc-500 hover:text-emerald-400 transition-colors">Terms</Link>
            <Link href="#" className="text-sm font-medium text-zinc-500 hover:text-emerald-400 transition-colors">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
