import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/public/Navbar";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navigation */}
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative px-6 py-20 md:px-12 lg:py-32 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-5">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#004d40] rounded blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-600 rounded blur-[120px]"></div>
          </div>

          <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-12">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center rounded px-3 py-1 text-sm font-medium bg-amber-50 text-amber-700 border border-amber-100 mb-6">
                Official Learning Portal
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold text-[#004d40] leading-tight mb-6">
                Excellence Through <span className="text-amber-600 underline decoration-amber-200">Knowledge</span>
              </h1>
              <p className="text-lg md:text-xl text-zinc-600 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Welcome to Tamarind Elimu System. Access world-class courses, master company SOPs, and accelerate your career within the Tamarind Group.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/login" className="w-full sm:w-auto px-8 py-4 text-lg font-bold text-white bg-[#004d40] rounded hover:bg-[#00332b] transition-all shadow-xl hover:-translate-y-1">
                  Start Learning Now
                </Link>
                <Link href="#features" className="w-full sm:w-auto px-8 py-4 text-lg font-semibold text-[#004d40] border-2 border-[#004d40]/10 rounded hover:bg-zinc-50 transition-all">
                  Explore Courses
                </Link>
              </div>
            </div>

            <div className="flex-1 relative">
              <div className="relative z-10 rounded overflow-hidden shadow-2xl border-8 border-white">
                <div className="aspect-[4/3] bg-zinc-100 flex items-center justify-center group">
                  {/* Placeholder for Hero Image */}
                  <div className="flex flex-col items-center gap-4 text-[#004d40]/40 group-hover:scale-105 transition-transform duration-500">
                    <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <span className="font-medium">Tamarind Academy</span>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-amber-100 rounded -z-10 animate-pulse"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-emerald-50 rounded -z-10 animate-bounce transition-all duration-1000"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-zinc-50">
          <div className="max-w-6xl mx-auto px-6 md:px-12 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-zinc-900 mb-16">
              Everything You Need to <span className="text-[#004d40]">Excel</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-emerald-100 rounded flex items-center justify-center text-[#004d40] mb-6 mx-auto">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">Professional Courses</h3>
                <p className="text-zinc-600">Specially curated content for hospitality, management, and food safety standards.</p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white p-8 rounded shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-amber-100 rounded flex items-center justify-center text-amber-700 mb-6 mx-auto">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">Company SOPs</h3>
                <p className="text-zinc-600">Access and master all Standard Operating Procedures to ensure consistent excellence.</p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white p-8 rounded shadow-sm border border-zinc-100 hover:shadow-md transition-shadow">
                <div className="w-14 h-14 bg-blue-100 rounded flex items-center justify-center text-blue-700 mb-6 mx-auto">
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-3">Real-time Progress</h3>
                <p className="text-zinc-600">Track your learning journey and earn certificates as you complete training modules.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-12 border-t border-zinc-100">
        <div className="max-w-6xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-[#004d40]">
            <div className="w-8 h-8 bg-[#004d40] rounded flex items-center justify-center text-white font-bold">T</div>
            <span className="font-bold tracking-tight">Tamarind Elimu System</span>
          </div>
          <div className="text-zinc-400 text-sm">
            &copy; {new Date().getFullYear()} Tamarind Group. All rights reserved.
          </div>
          <div className="flex gap-6">
            <Link href="#" className="text-zinc-400 hover:text-[#004d40] transition-colors">Privacy</Link>
            <Link href="#" className="text-zinc-400 hover:text-[#004d40] transition-colors">Terms</Link>
            <Link href="#" className="text-zinc-400 hover:text-[#004d40] transition-colors">Help</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
