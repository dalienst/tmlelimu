"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Features", href: "/#features" },
    { name: "About", href: "/#about" },
  ];

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-zinc-200/50 md:px-12 backdrop-blur-md sticky top-0 z-50 bg-white/80 transition-all duration-300">
      <div className="flex flex-1 items-center gap-2">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#004d40] rounded-xl flex items-center justify-center transform transition hover:scale-105 shadow-sm">
            <span className="text-white font-bold text-xl leading-none">T</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight text-[#004d40]">
            Tamarind <span className="text-amber-600">Elimu</span>
          </span>
        </Link>
      </div>
      
      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + "/") && link.href !== "/#features" && link.href !== "/#about";
          return (
            <Link 
              key={link.name} 
              href={link.href} 
              className={`text-sm font-semibold transition-colors hover:text-[#004d40] ${isActive ? 'text-[#004d40]' : 'text-zinc-500'}`}
            >
              {link.name}
            </Link>
          );
        })}
        <Link href="/login" className="px-6 py-2.5 text-sm font-bold text-white bg-[#004d40] rounded-full hover:bg-[#00332b] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
          Log In
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="flex items-center justify-end md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="inline-flex items-center justify-center p-2 rounded-xl text-zinc-500 hover:text-[#004d40] hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#004d40] transition-colors"
        >
          <span className="sr-only">Open main menu</span>
          {isMobileMenuOpen ? (
            <X className="block h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="block h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white border-b border-zinc-100 shadow-xl md:hidden animate-in slide-in-from-top-2 duration-200">
          <div className="px-5 pt-4 pb-6 space-y-3">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || pathname.startsWith(link.href + "/") && link.href !== "/#features" && link.href !== "/#about";
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-xl text-base font-bold transition-colors ${isActive ? 'bg-emerald-50 text-[#004d40]' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}`}
                >
                  {link.name}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-zinc-100">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center w-full px-5 py-4 text-base font-bold text-white bg-[#004d40] rounded-xl hover:bg-[#00332b] shadow-md transition-all active:scale-[0.98]"
              >
                Log In Securely
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
