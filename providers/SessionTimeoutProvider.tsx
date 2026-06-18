"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Clock } from "lucide-react";

const TIMEOUT_KEY = "tamarind_last_activity";

// Configuration from environment variables, fallback to 15 minutes (900 seconds)
const TIMEOUT = (Number(process.env.NEXT_PUBLIC_SESSION_TIMEOUT) || 900) * 1000;
const WARNING_TIME = (Number(process.env.NEXT_PUBLIC_SESSION_WARNING_TIMEOUT) || 60) * 1000;

export default function SessionTimeoutProvider({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(WARNING_TIME / 1000);
  const lastActiveRef = useRef<number>(Date.now());
  const throttleRef = useRef<boolean>(false);

  // Function to update the last activity timestamp
  const updateActivity = () => {
    if (throttleRef.current) return;
    
    // Throttle updates to localstorage to avoid excessive writes (every 1 second max)
    throttleRef.current = true;
    setTimeout(() => {
      throttleRef.current = false;
    }, 1000);

    const now = Date.now();
    lastActiveRef.current = now;
    if (typeof window !== "undefined") {
      localStorage.setItem(TIMEOUT_KEY, now.toString());
    }
  };

  // Reset activity function (manually triggered when user clicks "Keep Session Active")
  const keepSessionActive = () => {
    const now = Date.now();
    lastActiveRef.current = now;
    if (typeof window !== "undefined") {
      localStorage.setItem(TIMEOUT_KEY, now.toString());
    }
    setShowWarning(false);
  };

  useEffect(() => {
    // Listen to standard interaction events unconditionally.
    // This ensures that user activity (like typing credentials on the login page)
    // is tracked, so when they log in, the timeout key is fresh.
    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart"];
    const handleActivity = () => updateActivity();
    
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  useEffect(() => {
    // If the user is unauthenticated (e.g., logged out manually or via timeout),
    // clear the timeout key so the next login gets a fresh timer.
    if (status === "unauthenticated") {
      if (typeof window !== "undefined") {
        localStorage.removeItem(TIMEOUT_KEY);
      }
      return;
    }

    // Only track activity for authenticated users
    if (status !== "authenticated") {
      return;
    }

    // Initialize local storage timestamp
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(TIMEOUT_KEY);
      if (stored) {
        lastActiveRef.current = Number(stored);
      } else {
        const now = Date.now();
        localStorage.setItem(TIMEOUT_KEY, now.toString());
        lastActiveRef.current = now;
      }
    }

    // Main polling interval (runs every 1 second)
    const interval = setInterval(() => {
      if (typeof window === "undefined") return;

      const storedTime = Number(localStorage.getItem(TIMEOUT_KEY) || lastActiveRef.current);
      const elapsed = Date.now() - storedTime;

      // If inactivity time exceeds total timeout, log out
      if (elapsed >= TIMEOUT) {
        clearInterval(interval);
        signOut({ callbackUrl: "/login?reason=timeout" });
        return;
      }

      // If inactivity time exceeds threshold, show warning modal
      const warningThreshold = TIMEOUT - WARNING_TIME;
      if (elapsed >= warningThreshold) {
        setShowWarning(true);
        const remainingSeconds = Math.max(0, Math.ceil((TIMEOUT - elapsed) / 1000));
        setTimeLeft(remainingSeconds);
      } else {
        // If user became active in another tab, close the warning modal
        setShowWarning(false);
      }
    }, 1000);

    // Clean up
    return () => {
      clearInterval(interval);
    };
  }, [status]);

  return (
    <>
      {children}

      {showWarning && (
        <>
          {/* Overlay background */}
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" />

          {/* Custom modal positioned at center */}
          <div 
            role="dialog"
            aria-modal="true"
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[calc(100%-2rem)] max-w-md bg-white border border-zinc-150 rounded-xl p-5 sm:p-6 shadow-2xl animate-in zoom-in-95 duration-300 focus:outline-none"
          >
            <div className="flex flex-col items-center text-center space-y-4">
              
              {/* Warning Icon Container */}
              <div className="p-3 bg-amber-50 text-amber-600 rounded-full animate-bounce">
                <AlertTriangle className="w-8 h-8" />
              </div>

              {/* Content info */}
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-zinc-900 leading-tight">
                  Session Expiring Soon
                </h3>
                <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                  You have been inactive for a while. For your security, you will be automatically logged out in:
                </p>
              </div>

              {/* Countdown Display */}
              <div className="flex items-center gap-2 bg-zinc-50 border border-zinc-100 rounded-lg px-4 py-2 font-semibold text-zinc-800">
                <Clock className="w-4 h-4 text-zinc-400" />
                <span className="text-sm tabular-nums">{timeLeft} seconds</span>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 gap-3 w-full pt-2">
                <Button
                  onClick={keepSessionActive}
                  className="w-full h-11 sm:h-10 bg-[#004d40] hover:bg-[#004d40]/90 text-white rounded-lg font-semibold text-xs uppercase tracking-wider"
                >
                  Keep Active
                </Button>
                <Button
                  onClick={() => signOut({ callbackUrl: "/login" })}
                  variant="outline"
                  className="w-full h-11 sm:h-10 border-zinc-200 text-zinc-600 hover:text-zinc-900 rounded-lg font-semibold text-xs uppercase tracking-wider"
                >
                  Log Out
                </Button>
              </div>

            </div>
          </div>
        </>
      )}
    </>
  );
}
