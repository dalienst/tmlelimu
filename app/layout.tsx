"use client";

import "./globals.css";

import NextAuthProvider from "@/providers/NextAuthProvider";
import TanstackQueryProvider from "@/providers/TanstackQueryProvider";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <title>
          Tamarind Elimu System | Empowering Excellence
        </title>
        <meta
          name="description"
          content="The official learning and development platform for Tamarind Group employees. Access training courses, SOPs, and company resources."
        />
      </head>
      <body className="min-h-screen antialiased">
        <Toaster position="top-center" />
        <NextAuthProvider>
          <TanstackQueryProvider>
           
            <main className="relative">{children}</main>
            
          </TanstackQueryProvider>
        </NextAuthProvider>
        <Analytics />
      </body>
    </html>
  );
}
