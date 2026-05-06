'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Activity, ACTIVITIES_STORAGE_KEY, autoUpdateActivityStatus } from '@/lib/types';
import { FaHandHoldingHeart, FaMicrophone, FaLightbulb, FaArrowUp, FaUsers, FaHeart, FaShieldAlt, FaHandsHelping, FaQuoteLeft, FaStar } from 'react-icons/fa';

export default function ActivityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [activity, setActivity] = useState<Activity | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivity = async () => {
      try {
        const response = await fetch('/api/kegiatan');
        const data = await response.json();
        
        // Auto-update status based on date
        let activities = data;
        try {
          activities = autoUpdateActivityStatus(data);
        } catch (statusError) {
          console.error('Error updating activity status:', statusError);
          activities = data;
        }
        
        const foundActivity = activities.find((a: Activity) => a.id === params.slug);
        if (foundActivity) {
          setActivity(foundActivity);
        } else {
          router.push('/kegiatan');
        }
      } catch (error) {
        console.error('Error loading activity:', error);
        router.push('/kegiatan');
      } finally {
        setLoading(false);
      }
    };

    loadActivity();
  }, [params.slug, router]);

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

  if (!activity) {
    return null;
  }

  return (
    <>
      {/* Beranda Section - Dynamic based on activity UI customization */}
      <section id="beranda" className="h-[650px] flex items-center relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
        </div>

        <div className="container mx-auto px-0 text-center relative z-10">
          {/* Activity Title */}
          <div className="px-6">
            <h1 
              className="text-4xl xxs:text-5xl xs:text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black mb-4"
              style={{ 
                fontFamily: "Poppins, sans-serif",
                background: "linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text"
              }}
            >
              {activity.hero_title || activity.title}
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-sm xxs:text-sm sm:text-lg md:text-xl sm:mh-10 mt-6 max-w-2xl mx-auto text-[#0F172A] font-medium px-4">
            {activity.hero_subtitle || activity.description}
          </p>
          <br />
          <br />
          <p className="text-sm text-gray-500 italic sm:text-lg">{activity.hero_quote ? `"${activity.hero_quote}"` : `"${activity.category || 'Kegiatan'}"`}</p>

          {/* CTA Button */}
          <div className="mt-12">
            <a 
              href="#detail-acara" 
              className="inline-block bg-gradient-to-r from-[#0EA5E9] to-[#0369A1] text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 hover:scale-105"
            >
              Lihat Detail & Daftar
            </a>
          </div>
        </div>
      </section>

      {/* Tentang Section - Dynamic based on activity UI customization */}
      <section id="tentang-acara" className="py-20 bg-gradient-to-b from-white to-blue-50/30 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-15"></div>
        </div>

        <div className="container mx-auto xxs:px-0 sm:px-4 md:px-6 relative z-10">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <FaLightbulb className="w-4 h-4" />
              <span>{activity.category || "Mengapa Penting?"}</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {activity.title} <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Penting?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {activity.about_section?.background || activity.description}
            </p>
          </div>

          {/* Goals Section */}
          {activity.about_section?.goals && activity.about_section.goals.length > 0 && (
            <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl border border-green-100 transition-all duration-500 transform hover:-translate-y-2 max-w-4xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-2xl">
                  <FaArrowUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Tujuan Kami</h3>
                  <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-2"></div>
                </div>
              </div>

              <div className="space-y-6">
                {activity.about_section.goals.map((goal, index) => {
                  const icons = [FaShieldAlt, FaHeart, FaLightbulb, FaHandsHelping];
                  const colors = ["from-blue-500 to-cyan-500", "from-red-500 to-pink-500", "from-amber-500 to-orange-500", "from-green-500 to-emerald-500"];
                  const Icon = icons[index % icons.length];
                  const color = colors[index % colors.length];
                  
                  return (
                    <div key={index} className="flex items-start gap-4 group/item hover:bg-gray-50 p-3 rounded-2xl transition-all duration-300">
                      <div className={`bg-gradient-to-r ${color} p-2 rounded-xl flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 text-lg mb-1">{goal}</h4>
                      </div>
                      <FaStar className="w-4 h-4 text-amber-400 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex-shrink-0 mt-1" />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* CTA Bottom */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-3xl p-8 text-white max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Siap Bergabung dengan {activity.title}?</h3>
              <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
                {activity.description}
              </p>
              <a 
                href="#detail-acara" 
                className="inline-flex items-center gap-2 bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaHeart className="w-5 h-5" />
                <span>Daftar Sekarang</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Detail Section */}
      <section id="detail-acara" className="bg-blue-50/30 py-16">
        <div className="container mx-auto xxs:px-0 sm:px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Semua yang Perlu Kamu Tahu
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="space-y-6">
                {/* Date & Time */}
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <div>
                    <p className="text-gray-600 text-xs">Tanggal & Waktu</p>
                    <p className="font-semibold text-gray-900">
                      {new Date(activity.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      {activity.time && ` • ${activity.time}`}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <div>
                    <p className="text-gray-600 text-xs">Lokasi</p>
                    <p className="font-semibold text-gray-900">{activity.locations.join(', ')}</p>
                  </div>
                </div>

                {/* Embedded Map */}
                {activity.locations && activity.locations.length > 0 && (
                  <div className="mt-6">
                    <p className="text-gray-600 text-xs mb-2">Peta Lokasi</p>
                    <div className="rounded-lg overflow-hidden shadow-md">
                      <iframe
                        width="100%"
                        height="300"
                        style={{ border: 0 }}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(activity.locations.join(', '))}&t=&z=13&ie=UTF8&iwloc=&output=embed`}
                      />
                    </div>
                  </div>
                )}

                {/* Ticket Price */}
                {activity.ticket_price !== undefined && (
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p className="text-gray-600 text-xs">Harga Tiket</p>
                      <p className="font-semibold text-gray-900">
                        {activity.ticket_price > 0 ? `Rp ${activity.ticket_price.toLocaleString('id-ID')}` : 'Gratis'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Capacity */}
                {activity.max_participants !== undefined && (
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <div>
                      <p className="text-gray-600 text-xs">Kapasitas</p>
                      <p className="font-semibold text-gray-900">{activity.max_participants === 0 ? 'Unlimited' : `${activity.max_participants} Peserta`}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Registration Button */}
              {activity.registration_link && (
                <div className="mt-8">
                  <a
                    href={activity.registration_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-[#0EA5E9] to-[#0369A1] text-white hover:bg-blue-50 font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Daftar Sekarang
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              )}

              {/* Contact Information */}
              {(activity.contact_person || activity.contact_phone) && (
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Informasi Kontak</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activity.contact_person && (
                      <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <div>
                          <p className="text-gray-600 text-xs">Nama Kontak</p>
                          <p className="font-semibold text-gray-900">{activity.contact_person}</p>
                        </div>
                      </div>
                    )}
                    {activity.contact_phone && (
                      <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        <div>
                          <p className="text-gray-600 text-xs">No. Telepon</p>
                          <p className="font-semibold text-gray-900">{activity.contact_phone}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
