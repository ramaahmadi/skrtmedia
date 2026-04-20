'use client';

import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Header from "@/components/Trust-Islam/Header";
import Beranda from "@/components/Trust-Islam/Beranda";
import Tentang from "@/components/Trust-Islam/Tentang";
import Footer from "@/components/Trust-Islam/Footer";
import Link from 'next/link';
import { Activity, ACTIVITIES_STORAGE_KEY } from '@/lib/types';

// Lazy load Detail component
const Detail = dynamic(() => import('@/components/Trust-Islam/Detail'), {
  loading: () => <div className="py-20 text-center">Loading...</div>
});

export default function Home() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load activities from localStorage
    const savedActivities = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
    if (savedActivities) {
      setActivities(JSON.parse(savedActivities));
    }
    setLoading(false);

    // Listen for localStorage changes (sync across tabs/pages)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ACTIVITIES_STORAGE_KEY && e.newValue) {
        setActivities(JSON.parse(e.newValue));
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Memuat...</p>
        </div>
      </div>
    );
  }

  return (
    <>
    <main>
      {/* <ScrollUp /> */}
      <Header />
      <Beranda />
      <Tentang />
      <Detail />
      <Footer />
    </main>
    </>
  );
}
