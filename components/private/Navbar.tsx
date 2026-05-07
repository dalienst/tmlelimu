"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  Menu, X, LogOut, User, LayoutDashboard, FileText,
  ChevronDown, CheckCircle, Users, Building2,
  Shield, GraduationCap, Briefcase, BarChart3, Settings
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function Navbar() {
  const { data: session } = useSession();
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

  // Determine user roles from session
  const isHR = session?.user?.is_hr;
  const isManager = session?.user?.is_manager;
  const isEmployee = session?.user?.is_employee;
  const isHOD = session?.user?.is_hod;
  const isTrainer = session?.user?.is_trainer;
  const isSuperuser = session?.user?.is_superuser;

  const roleName = isSuperuser ? "Administrator" :
    isHR ? "HR Manager" :
      isManager ? "Manager" :
        isHOD ? "Head of Dept" :
          isTrainer ? "Trainer" :
            isEmployee ? "Employee" : "User";

  const rolePrefix = isSuperuser ? "admin" :
    isHR ? "hr" :
      isManager ? "manager" :
        isHOD ? "hod" :
          isTrainer ? "trainer" :
            isEmployee ? "employee" : "portal";

  // Dynamic navigation links based on role
  let navLinks = [];

  if (isSuperuser) {
    navLinks = [
      { name: "Dashboard", href: "/hr/dashboard", icon: LayoutDashboard },
      { name: "User Management", href: "/hr/employees", icon: Users },
      { name: "System Settings", href: "/hr/settings", icon: Settings },
    ];
  } else if (isHR) {
    navLinks = [
      { name: "Dashboard", href: "/hr/dashboard", icon: LayoutDashboard },
      { name: "Departments", href: "/hr/departments", icon: Building2 },
      { name: "Employees", href: "/hr/employees", icon: Users },
      { name: "SOP Management", href: "/hr/sops", icon: FileText },
    ];
  } else if (isManager) {
    navLinks = [
      { name: "Dashboard", href: "/manager/dashboard", icon: LayoutDashboard },
      { name: "Team SOPs", href: "/manager/team-sops", icon: Briefcase },
      { name: "Approvals", href: "/manager/approvals", icon: CheckCircle },
    ];
  } else if (isHOD) {
    navLinks = [
      { name: "Dashboard", href: "/hod/dashboard", icon: LayoutDashboard },
      { name: "Dept Analytics", href: "/hod/analytics", icon: BarChart3 },
      { name: "Resources", href: "/hod/resources", icon: FileText },
    ];
  } else if (isTrainer) {
    navLinks = [
      { name: "Dashboard", href: "/trainer/dashboard", icon: LayoutDashboard },
      { name: "Courses", href: "/trainer/courses", icon: GraduationCap },
      { name: "Students", href: "/trainer/students", icon: Users },
    ];
  } else {
    // Default employee or fallback links
    navLinks = [
      { name: "Dashboard", href: "/employee/dashboard", icon: LayoutDashboard },
      { name: "SOP Library", href: "/sops", icon: FileText },
      { name: "My Progress", href: "/employee/progress", icon: CheckCircle },
    ];
  }

  const userInitial = session?.user?.first_name ? session.user.first_name.charAt(0).toUpperCase() : "U";
  const userName = session?.user?.first_name ? `${session.user.first_name} ${session.user.last_name || ""}` : "Tamarind User";
  const userEmail = session?.user?.email || session?.user?.username || "";

  return (
    <nav className="bg-white border-b border-zinc-200 sticky top-0 z-50">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left side: Logo and Desktop Links */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href={`/${rolePrefix}/dashboard`} className="flex items-center gap-2">
                <div className="w-8 h-8 bg-[#004d40] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg leading-none">T</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold tracking-tight text-[#004d40] leading-tight hidden sm:block">
                    Tamarind <span className="text-amber-600">Elimu</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider leading-tight hidden sm:block">
                    {roleName}
                  </span>
                </div>
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
                    className={cn(
                      "inline-flex items-center px-3 py-2 text-sm font-medium rounded-xl transition-all h-10 mt-3",
                      isActive
                        ? "bg-emerald-50 text-[#004d40]"
                        : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                    )}
                  >
                    <Icon className={cn("w-4 h-4 mr-2", isActive ? "text-emerald-600" : "text-zinc-400")} />
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
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm",
                  isSuperuser ? "bg-zinc-900 text-white" : "bg-amber-100 text-amber-700"
                )}>
                  {userInitial}
                </div>
                <div className="flex flex-col items-start ml-1">
                  <span className="text-sm font-medium text-zinc-700 max-w-[120px] truncate leading-none">
                    {userName}
                  </span>
                  <span className="text-[10px] text-zinc-400 font-bold uppercase mt-0.5 leading-none">
                    {roleName}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-zinc-400 ml-1" />
              </button>

              {isProfileOpen && (
                <div className="origin-top-right absolute right-0 top-12 mt-2 w-64 rounded-2xl shadow-2xl bg-white border border-zinc-100 ring-1 ring-black ring-opacity-5 py-1 focus:outline-none animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-4 py-4 border-b border-zinc-100">
                    <p className="text-sm font-bold text-zinc-900 truncate">{userName}</p>
                    {userEmail && (
                      <p className="text-xs font-medium text-zinc-500 truncate mt-0.5">{userEmail}</p>
                    )}
                    <div className={cn(
                      "mt-3 inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                      isSuperuser ? "bg-zinc-100 text-zinc-800 border-zinc-200" :
                        isHR ? "bg-emerald-50 text-emerald-700 border-emerald-100" :
                          isManager ? "bg-blue-50 text-blue-700 border-blue-100" :
                            "bg-amber-50 text-amber-700 border-amber-100"
                    )}>
                      {isSuperuser && <Shield className="w-3 h-3 mr-1" />}
                      {roleName}
                    </div>
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
                      Sign out Securely
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
      <div className={cn("sm:hidden", isMobileMenuOpen ? "block border-b border-zinc-200" : "hidden")}>
        <div className="pt-2 pb-3 space-y-1 px-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(link.href + "/");
            const Icon = link.icon;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-xl text-base font-medium transition-colors",
                  isActive
                    ? "bg-emerald-50 text-[#004d40]"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                )}
              >
                <Icon className={cn("w-5 h-5 mr-3", isActive ? "text-emerald-600" : "text-zinc-400")} />
                {link.name}
              </Link>
            );
          })}
        </div>

        <div className="pt-4 pb-4 border-t border-zinc-200">
          <div className="flex items-center px-5">
            <div className="flex-shrink-0">
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg",
                isSuperuser ? "bg-zinc-900 text-white" : "bg-amber-100 text-amber-700"
              )}>
                {userInitial}
              </div>
            </div>
            <div className="ml-3">
              <div className="text-base font-bold text-zinc-800 leading-tight">{userName}</div>
              <div className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider mt-0.5">{roleName}</div>
              {userEmail && <div className="text-sm font-medium text-zinc-500 mt-1">{userEmail}</div>}
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
              Sign out Securely
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
