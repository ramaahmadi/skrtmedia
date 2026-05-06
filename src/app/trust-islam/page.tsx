'use client';

import { useEffect, useState, Suspense } from 'react';
import dynamic from 'next/dynamic';
import Header from "@/components/Trust-Islam/Header";
import Beranda from "@/components/Trust-Islam/Beranda";
import Tentang from "@/components/Trust-Islam/Tentang";
import Footer from "@/components/Trust-Islam/Footer";
import Link from 'next/link';
import { Activity, ACTIVITIES_STORAGE_KEY, autoUpdateActivityStatus } from '@/lib/types';

// Lazy load Detail component
const Detail = dynamic(() => import('@/components/Trust-Islam/Detail'), {
  loading: () => <div className="py-20 text-center">Loading...</div>
});

export default function Home() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load activities from API
    const loadActivities = async () => {
      try {
        const response = await fetch('/api/kegiatan');
        const data = await response.json();
        // Auto-update status based on date
        let updatedActivities = data;
        try {
          updatedActivities = autoUpdateActivityStatus(data);
        } catch (statusError) {
          console.error('Error updating activity status:', statusError);
          updatedActivities = data;
        }
        setActivities(updatedActivities);
      } catch (error) {
        console.error('Error loading activities:', error);
        setActivities([]);
      } finally {
        setLoading(false);
      }
    };

    loadActivities();
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
