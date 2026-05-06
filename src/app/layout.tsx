"use client";

import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ScrollToTop from "@/components/ScrollToTop";
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
  const showGlobalChrome = !pathname?.startsWith("/trust-islam") && !pathname?.startsWith("/skrt-army") && !pathname?.startsWith("/kurban") && !pathname?.startsWith("/qurban-registration");

  return (
    <html suppressHydrationWarning lang="en" className={`${inter.className} ${caveat.variable}`}>
      {/*
        <head /> will contain the components returned by the nearest parent
        head.js. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="SKRT" />
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <link rel="icon" href="/favicon.ico" />
      </head>

      <body className={`bg-[#FCFCFC] dark:bg-black ${inter.className}`}>
        <Providers>
          {showGlobalChrome && <Header />}
          {children}
          {showGlobalChrome && <Footer />}
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}

