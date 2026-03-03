"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { Menu, X, LogOut, User, LayoutDashboard, FileText, ChevronDown, CheckCircle, Users } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const profileRef = useRef<HTMLDivElement>(null);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine user roles from session (assuming Django backend maps these)
  const isHR = session?.user?.is_hr || pathname.startsWith("/hr");
  const isEmployee = session?.user?.is_employee || pathname.startsWith("/employee");

  // Dynamic navigation links based on role
  // We can build links based on their role
  let navLinks = [];
  
  if (isHR) {
    navLinks = [
      { name: "Dashboard", href: "/hr/dashboard", icon: LayoutDashboard },
      { name: "Employees", href: "/hr/employees", icon: Users },
      { name: "SOP Management", href: "/hr/sops", icon: FileText },
    ];
  } else {
    // Default employee or fallback links
    navLinks = [
      { name: "Dashboard", href: "/employee", icon: LayoutDashboard },
      { name: "SOP Library", href: "/sops", icon: FileText },
      { name: "My Progress", href: "#", icon: CheckCircle }, // Placeholder for future
    ];
  }

  const userInitial = session?.user?.first_name ? session.user.first_name.charAt(0).toUpperCase() : "U";
  const userName = session?.user?.first_name ? `${session.user.first_name} ` : "Tamarind User";
  const userEmail = session?.user?.email || session?.user?.username || "";

  return (
    <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side: Logo and Desktop Links */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#004d40] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg leading-none">T</span>
                </div>
                <span className="text-lg font-bold tracking-tight text-[#004d40] hidden sm:block">
                  Tamarind <span className="text-amber-600">Elimu</span>
                </span>
              </Link>
            </div>
            
            <div className="hidden sm:ml-8 sm:flex sm:space-x-4">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all h-10 mt-3 ${
                      isActive
                        ? "bg-emerald-50 text-[#004d40]"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                    }`}
                  >
                    <Icon className={`w-4 h-4 mr-2 ${isActive ? "text-emerald-600" : "text-zinc-400"}`} />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side: Profile and Mobile menu button */}
          <div className="flex items-center">
            {/* Desktop Profile Dropdown */}
            <div className="hidden sm:ml-6 sm:flex sm:items-center relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-zinc-50 transition-colors focus:outline-none focus:ring-2 focus:ring-[#004d40] focus:ring-offset-2"
              >
                <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-sm">
                  {userInitial}
                </div>
                <span className="text-sm font-medium text-zinc-700 max-w-[120px] truncate">
                  {userName}
                </span>
                <ChevronDown className="w-4 h-4 text-zinc-400" />
              </button>

              {/* Plain Tailwind Dropdown (No Shadcn) */}
              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 top-12 mt-2 w-56 rounded-2xl shadow-lg bg-white border border-zinc-100 ring-1 ring-black ring-opacity-5 py-1 focus:outline-none animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-3 border-b border-zinc-100">
                    <p className="text-sm font-medium text-zinc-900 truncate">{userName}</p>
                    {userEmail && (
                      <p className="text-xs font-medium text-zinc-500 truncate mt-0.5">{userEmail}</p>
                    )}
                  </div>
                  
                  <div className="p-2">
                    <Link
                      href="/profile"
                      className="flex items-center px-3 py-2 text-sm text-zinc-700 rounded-lg hover:bg-zinc-50 hover:text-zinc-900 transition-colors"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <User className="w-4 h-4 mr-2 text-zinc-400" />
                      Your Profile
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/login" })}
                      className="flex w-full items-center px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 transition-colors mt-1"
                    >
                      <LogOut className="w-4 h-4 mr-2 text-red-500" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center justify-center sm:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-xl text-zinc-400 hover:text-zinc-500 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#004d40]"
              >
                <span className="sr-only">Open main menu</span>
                {isMobileMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`sm:hidden ${isMobileMenuOpen ? "block border-b border-zinc-200" : "hidden"}`}>
        <div className="pt-2 pb-3 space-y-1 px-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2.5 rounded-xl text-base font-medium transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-[#004d40]"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${isActive ? "text-emerald-600" : "text-zinc-400"}`} />
                {link.name}
              </Link>
            );
          })}
        </div>
        
        <div className="pt-4 pb-4 border-t border-zinc-200">
          <div className="flex items-center px-5">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-lg">
                {userInitial}
              </div>
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-zinc-800">{userName}</div>
              {userEmail && <div className="text-sm font-medium text-zinc-500">{userEmail}</div>}
            </div>
          </div>
          <div className="mt-4 space-y-1 px-4">
            <Link
              href="/profile"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center px-3 py-2.5 rounded-xl text-base font-medium text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
            >
              <User className="w-5 h-5 mr-3 text-zinc-400" />
              Your Profile
            </Link>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="flex w-full items-center px-3 py-2.5 rounded-xl text-base font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-5 h-5 mr-3 text-red-500" />
              Sign out
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}