'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Activity, ACTIVITIES_STORAGE_KEY, autoUpdateActivityStatus } from '@/lib/types';

export default function KegiatanPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load activities from localStorage
    const savedActivities = localStorage.getItem(ACTIVITIES_STORAGE_KEY);
    if (savedActivities) {
      let activities = JSON.parse(savedActivities);
      // Auto-update status based on date
      activities = autoUpdateActivityStatus(activities);
      localStorage.setItem(ACTIVITIES_STORAGE_KEY, JSON.stringify(activities));
      setActivities(activities);
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
          <p className="text-gray-600 dark:text-gray-400">Memuat kegiatan...</p>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'ongoing':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'completed':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming':
        return 'Akan Datang';
      case 'ongoing':
        return 'Berlangsung';
      case 'completed':
        return 'Selesai';
      default:
        return status;
    }
  };

  // Generate random gradient colors for each activity
  const getRandomGradient = (id: string) => {
    const gradients = [
      'from-blue-600 to-cyan-600',
      'from-purple-600 to-pink-600',
      'from-green-600 to-teal-600',
      'from-orange-600 to-amber-600',
      'from-red-600 to-rose-600',
      'from-indigo-600 to-violet-600',
      'from-emerald-600 to-green-600',
      'from-cyan-600 to-blue-600',
      'from-pink-600 to-purple-600',
      'from-amber-600 to-orange-600',
    ];
    // Use activity ID to get consistent random gradient
    const index = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % gradients.length;
    return gradients[index];
  };

  // Add Trust Islam as a default activity if not already in activities
  const defaultTrustIslamActivity: Activity = {
    id: 'trust-islam',
    title: 'Trust Islam - Temukan Kembali Arahmu',
    description: 'Di tengah arus informasi yang tak terbendung, mudah sekali kita merasa bingung dan kehilangan pegangan. Kami hadir untuk menciptakan sebuah ruang jeda—sebuah jembatan untuk terhubung kembali dengan nilai-nilai yang memberi ketenangan dan tujuan hidup.',
    date: '2025-06-15',
    time: '16:00',
    location: 'Jakarta Convention Center',
    status: 'upcoming',
    featured: true,
    category: 'Kajian',
    ticket_price: 50000,
    registration_link: '/trust-islam',
    contact_person: 'Admin SKRT',
    contact_phone: '6281234567890',
    max_participants: 100
  };

  // Use Trust Islam from localStorage if available, otherwise use default
  const trustIslamActivity = activities.find(a => a.id === 'trust-islam') || defaultTrustIslamActivity;

  const allActivities = activities.length > 0 ? activities : [defaultTrustIslamActivity];

  return (
    <>
      <section className="pt-[100px] sm:pt-[120px] pb-[80px] sm:pb-[120px]">
        <div className="container px-4 sm:px-6">
          {/* Header Section */}
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Kegiatan <span className="text-primary">SKRT MEDIA</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Ikuti berbagai kegiatan dan acara yang kami selenggarakan untuk berkembang bersama
            </p>
          </div>

          {/* Trust Islam Activity */}
          <div className="mb-8 sm:mb-12">
            <Link href="/trust-islam" className="block">
              <div className={`bg-gradient-to-r ${getRandomGradient('trust-islam')} rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2`}>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                      {trustIslamActivity.category && (
                        <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                          {trustIslamActivity.category}
                        </span>
                      )}
                      <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                        {getStatusText(trustIslamActivity.status)}
                      </span>
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">{trustIslamActivity.title}</h2>
                    <p className="text-white/90 mb-4 sm:mb-6 max-w-2xl text-sm sm:text-base">
                      {trustIslamActivity.description}
                    </p>
                    <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6 text-xs sm:text-sm">
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(trustIslamActivity.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        {trustIslamActivity.time && <span className="text-white/70">• {trustIslamActivity.time}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span className="truncate max-w-[150px]">{trustIslamActivity.location}</span>
                      </div>
                      {trustIslamActivity.ticket_price !== undefined && (
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12 a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span>{trustIslamActivity.ticket_price > 0 ? `Rp ${trustIslamActivity.ticket_price.toLocaleString('id-ID')}` : 'Gratis'}</span>
                        </div>
                      )}
                    </div>
                    <div
                      className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                    >
                      Lihat Detail
                      <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="bg-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm text-center min-w-[120px] sm:min-w-[150px]">
                      <div className="text-4xl sm:text-6xl md:text-7xl font-bold mb-1 sm:mb-2">{new Date(trustIslamActivity.date).getDate()}</div>
                      <div className="text-base sm:text-xl md:text-2xl">{new Date(trustIslamActivity.date).toLocaleString('id-ID', { month: 'long' })}</div>
                      <div className="text-xs sm:text-sm text-white/80">{new Date(trustIslamActivity.date).getFullYear()}</div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>

          {/* All Activities Grid */}
          {activities.length > 0 && (
            <>
              <div className="flex flex-col gap-4 sm:gap-6">
                {activities.filter(a => a.id !== 'trust-islam').map((activity) => (
                  <Link key={activity.id} href={`/kegiatan/${activity.id}`} className="block">
                    <div className={`bg-gradient-to-r ${getRandomGradient(activity.id)} rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-white shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-2`}>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 sm:gap-6">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-3 sm:mb-4">
                            {activity.category && (
                              <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                                {activity.category}
                              </span>
                            )}
                            <span className="bg-white/20 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                              {getStatusText(activity.status)}
                            </span>
                          </div>
                          <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-4 line-clamp-2">{activity.title}</h3>
                          <p className="text-white/90 mb-4 sm:mb-6 max-w-2xl text-sm sm:text-base line-clamp-3">{activity.description}</p>
                          
                          <div className="flex flex-wrap gap-3 sm:gap-4 mb-4 sm:mb-6 text-xs sm:text-sm">
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>{new Date(activity.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                              {activity.time && <span className="text-white/70">• {activity.time}</span>}
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="truncate max-w-[150px]">{activity.location}</span>
                            </div>
                            {activity.ticket_price !== undefined && (
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12 a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{activity.ticket_price > 0 ? `Rp ${activity.ticket_price.toLocaleString('id-ID')}` : 'Gratis'}</span>
                              </div>
                            )}
                          </div>
                          <div
                            className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-bold py-2 sm:py-3 px-4 sm:px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg text-sm sm:text-base"
                          >
                            Lihat Detail
                            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          <div className="bg-white/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-sm text-center min-w-[120px] sm:min-w-[150px]">
                            <div className="text-4xl sm:text-6xl md:text-7xl font-bold mb-1 sm:mb-2">{new Date(activity.date).getDate()}</div>
                            <div className="text-base sm:text-xl md:text-2xl">{new Date(activity.date).toLocaleString('id-ID', { month: 'long' })}</div>
                            <div className="text-xs sm:text-sm text-white/80">{new Date(activity.date).getFullYear()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Empty State */}
          {activities.length === 0 && (
            <div className="text-center py-12 sm:py-20 bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-lg">
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Belum Ada Kegiatan Lain
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 px-4 text-sm sm:text-base">
                Silakan login ke dashboard panitia untuk menambahkan kegiatan baru
              </p>
              <Link
                href="/skrt-army"
                className="inline-block rounded-lg bg-primary px-6 py-3 text-white hover:bg-primary/90 transition"
              >
                Login Dashboard
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
