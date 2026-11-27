"use client";

import TrustFooter from "@/components/Footer";
import TrustHeader from "@/components/Trust-Islam/Header";
import ScrollToTop from "@/components/ScrollToTop";
import { Inter } from "next/font/google";
import "../../styles/index.css";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      {children}
    </div>
  );
}

