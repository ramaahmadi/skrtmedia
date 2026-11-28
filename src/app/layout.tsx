"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollProgressBar from "@/components/Common/ScrollProgressBar";
import MobileBottomNav from "@/components/Common/MobileBottomNav";
import { usePathname } from "next/navigation";
import { Inter, Caveat } from "next/font/google";
import { Providers } from "./providers";
import "../styles/index.css";

const inter = Inter({ subsets: ["latin"] });
const caveat = Caveat({ 
  subsets: ['latin'],
  variable: '--font-caveat',
  weight: ['400', '500', '600', '700'],
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  // Trust-Islam, SKRT Army, Kurban, and Qurban Registration pages render their own custom header/footer.
  const showGlobalChrome = !pathname?.startsWith("/trust-islam") && !pathname?.startsWith("/skrt-army") && !pathname?.startsWith("/kurban") && !pathname?.startsWith("/qurban_registration");

  return (
    <html suppressHydrationWarning lang="id" className={`${inter.className} ${caveat.variable}`}>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#4a6cf7" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SKRT MEDIA" />
        <link rel="apple-touch-icon" href="/icon-192.png?v=skrt3" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png?v=skrt3" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico?v=skrt3" />
        <link rel="shortcut icon" href="/favicon.ico?v=skrt3" />
      </head>

      <body className={`bg-[#FCFCFC] text-gray-900 dark:bg-black dark:text-white ${inter.className}`}>
        <Providers>
          {showGlobalChrome && <ScrollProgressBar />}
          {showGlobalChrome && <Header />}
          {children}
          {showGlobalChrome && <Footer />}
          {showGlobalChrome && <MobileBottomNav />}
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}

