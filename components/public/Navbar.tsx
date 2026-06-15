"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "/#features" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-zinc-950/80 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-white/5 p-2 rounded-xl border border-white/10 backdrop-blur-md transition-all duration-500 group-hover:bg-white/10 group-hover:scale-105 shadow-inner">
            <Image src="/logo.png" alt="Tamarind Group Logo" width={36} height={36} className="object-contain brightness-0 invert" priority />
          </div>
          <span className="text-xl font-bold tracking-tight text-white">
            Tamarind <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600">Elimu</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <Link href="/login" className="px-6 py-2.5 text-sm font-bold text-zinc-950 bg-white rounded-full hover:bg-zinc-200 transition-all hover:scale-105 shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]">
            Log In
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center justify-end md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-zinc-950 border-b border-white/10 md:hidden animate-in slide-in-from-top-2 duration-200 shadow-2xl">
          <div className="px-6 pt-4 pb-8 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-base font-semibold text-zinc-300 hover:bg-white/5 hover:text-white transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-white/10">
              <Link
                href="/login"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center w-full px-5 py-4 text-base font-bold text-zinc-950 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-xl shadow-[0_0_20px_-5px_rgba(16,185,129,0.4)]"
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
