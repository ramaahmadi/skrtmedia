'use client';

import React, { useState, useEffect, Component } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Activity, autoUpdateActivityStatus } from '@/lib/types';
import ConfirmDialog from '@/components/ConfirmDialog';

// Error boundary to catch client-side errors
class ErrorBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function KegiatanPageContent() {
  const router = useRouter();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activityForm, setActivityForm] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    locations: [''],
    mapEmbed: '',
    status: 'upcoming' as 'upcoming' | 'ongoing' | 'completed',
    featured: false,
    contact_person: '',
    contact_phone: '',
    max_participants: '',
    registration_link: '',
    ticket_price: '',
    category: '',
    // UI customization fields
    hero_title: '',
    hero_subtitle: '',
    hero_quote: '',
    about_background: '',
    about_goals: '',
    // Sponsor fields
    sponsors: '',
    media_partners: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/kegiatan');
      const data = await response.json();
      
      // Auto-update status based on date
      let updatedActivities = data;
      try {
        updatedActivities = autoUpdateActivityStatus(data);
      } catch (statusError) {
        console.error('Error updating activity status:', statusError);
        // If status update fails, use data as-is
        updatedActivities = data;
      }
      setActivities(updatedActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
      setError('Gagal memuat kegiatan. Silakan refresh halaman.');
    } finally {
      setLoading(false);
    }
  };

  const handleActivityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setActivityForm({
      ...activityForm,
      [e.target.name]: value
    });
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setActivityForm(prev => ({
            ...prev,
            locations: [`${lat}, ${lng}`],
            mapEmbed: `<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.0!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${lat}!5e0!3m2!1sen!2sid!4v1" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy"></iframe>`
          }));
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Gagal mendapatkan lokasi. Pastikan Anda telah memberikan izin lokasi.');
        }
      );
    } else {
      alert('Browser Anda tidak mendukung geolocation.');
    }
  };

  const handleAddLocation = () => {
    if (activityForm.locations.length < 5) {
      setActivityForm(prev => ({
        ...prev,
        locations: [...prev.locations, '']
      }));
    } else {
      alert('Maksimal 5 lokasi.');
    }
  };

  const handleRemoveLocation = (index: number) => {
    if (activityForm.locations.length > 1) {
      setActivityForm(prev => ({
        ...prev,
        locations: prev.locations.filter((_, i) => i !== index)
      }));
    } else {
      alert('Minimal 1 lokasi.');
    }
  };

  const handleLocationChange = (index: number, value: string) => {
    setActivityForm(prev => ({
      ...prev,
      locations: prev.locations.map((loc, i) => i === index ? value : loc)
    }));
  };

  const handleEditActivity = (activity: Activity) => {
    setActivityForm({
      title: activity.title,
      description: activity.description,
      date: activity.date,
      time: activity.time || '',
      locations: activity.locations || [''],
      mapEmbed: activity.mapEmbed || '',
      status: activity.status,
      featured: activity.featured || false,
      contact_person: activity.contact_person || '',
      contact_phone: activity.contact_phone || '',
      max_participants: activity.max_participants?.toString() || '',
      registration_link: activity.registration_link || '',
      ticket_price: activity.ticket_price?.toString() || '',
      category: activity.category || '',
      // UI customization fields
      hero_title: activity.hero_title || '',
      hero_subtitle: activity.hero_subtitle || '',
      hero_quote: activity.hero_quote || '',
      about_background: activity.about_section?.background || '',
      about_goals: activity.about_section?.goals?.join('\n') || '',
      // Sponsor fields
      sponsors: activity.sponsors ? activity.sponsors.map(s => `${s.name}|${s.logo}`).join('\n') : '',
      media_partners: activity.media_partners ? activity.media_partners.map(s => `${s.name}|${s.logo}`).join('\n') : ''
    });
    setEditingId(activity.id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleSubmitActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const activityData = {
        id: isEditing && editingId ? editingId : Date.now().toString(),
        title: activityForm.title,
        description: activityForm.description,
        date: activityForm.date,
        time: activityForm.time,
        locations: activityForm.locations.filter(l => l.trim()),
        mapEmbed: activityForm.mapEmbed || undefined,
        status: activityForm.status,
        featured: activityForm.featured,
        contact_person: activityForm.contact_person || undefined,
        contact_phone: activityForm.contact_phone || undefined,
        max_participants: activityForm.max_participants ? parseInt(activityForm.max_participants) : undefined,
        registration_link: activityForm.registration_link || undefined,
        ticket_price: activityForm.ticket_price ? parseInt(activityForm.ticket_price) : undefined,
        category: activityForm.category || undefined,
        // UI customization fields
        hero_title: activityForm.hero_title || undefined,
        hero_subtitle: activityForm.hero_subtitle || undefined,
        hero_quote: activityForm.hero_quote || undefined,
        about_section: {
          background: activityForm.about_background || undefined,
          goals: activityForm.about_goals ? activityForm.about_goals.split('\n').filter(g => g.trim()) : undefined
        },
        // Sponsor fields
        sponsors: activityForm.sponsors ? activityForm.sponsors.split('\n').filter(s => s.trim()).map(s => {
          const [name, logo] = s.split('|');
          return { name: name || '', logo: logo || '' };
        }) : undefined,
        media_partners: activityForm.media_partners ? activityForm.media_partners.split('\n').filter(s => s.trim()).map(s => {
          const [name, logo] = s.split('|');
          return { name: name || '', logo: logo || '' };
        }) : undefined
      };

      if (isEditing && editingId) {
        // Update existing activity via API
        const response = await fetch('/api/kegiatan', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(activityData)
        });

        if (response.ok) {
          await loadActivities();
        }
      } else {
        // Create new activity via API
        const response = await fetch('/api/kegiatan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(activityData)
        });

        if (response.ok) {
          const newActivity = await response.json();
          await loadActivities();
          // Redirect to the newly created activity page
          router.push(`/kegiatan/${newActivity.id}`);
        }
      }
      
      handleCloseModal();
    } catch (error) {
      console.error('Gagal menyimpan kegiatan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteActivity = (id: string) => {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteActivity = async () => {
    if (itemToDelete) {
      try {
        const response = await fetch(`/api/kegiatan?id=${itemToDelete}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await loadActivities();
        }
      } catch (error) {
        console.error('Error deleting activity:', error);
      }
    }
    setShowDeleteDialog(false);
    setItemToDelete(null);
  };

  const cancelDeleteActivity = () => {
    setShowDeleteDialog(false);
    setItemToDelete(null);
  };

  const handleUpdateStatus = async (id: string, status: 'upcoming' | 'ongoing' | 'completed') => {
    try {
      const response = await fetch('/api/kegiatan', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });

      if (response.ok) {
        await loadActivities();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setEditingId(null);
    setActivityForm({
      title: '',
      description: '',
      date: '',
      time: '',
      locations: [''],
      mapEmbed: '',
      status: 'upcoming',
      featured: false,
      contact_person: '',
      contact_phone: '',
      max_participants: '',
      registration_link: '',
      ticket_price: '',
      category: '',
      // UI customization fields
      hero_title: '',
      hero_subtitle: '',
      hero_quote: '',
      about_background: '',
      about_goals: '',
      // Sponsor fields
      sponsors: '',
      media_partners: ''
    });
  };

  const sortedActivities = [...activities].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FCFCFC] dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="text-gray-600 dark:text-gray-400">Memuat kegiatan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FCFCFC] dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={loadActivities}
            className="rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFCFC] dark:bg-black">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link
              href="/skrt-army"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary dark:text-gray-400 mb-2"
            >
              ← Kembali ke Dashboard
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              🎯 Jadwal Kegiatan
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Kelola dan pantau kegiatan organisasi
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/kegiatan"
              className="rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              Lihat Halaman
            </Link>
            <button
              onClick={() => setShowModal(true)}
              className="rounded-lg bg-primary px-4 sm:px-6 py-2 font-medium text-white transition hover:bg-primary/90 shadow-btn hover:shadow-btn-hover"
            >
              + Tambah
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 grid-cols-2 md:grid-cols-4">
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-dark">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Kegiatan</p>
            <p className="text-2xl font-bold text-dark dark:text-white">{activities.length}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-dark">
            <p className="text-sm text-gray-600 dark:text-gray-400">Akan Datang</p>
            <p className="text-2xl font-bold text-primary">{activities.filter(a => a.status === 'upcoming').length}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-dark">
            <p className="text-sm text-gray-600 dark:text-gray-400">Berlangsung</p>
            <p className="text-2xl font-bold text-primary">{activities.filter(a => a.status === 'ongoing').length}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-dark">
            <p className="text-sm text-gray-600 dark:text-gray-400">Selesai</p>
            <p className="text-2xl font-bold text-primary">{activities.filter(a => a.status === 'completed').length}</p>
          </div>
        </div>

        {/* Timeline */}
        {activities.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
            <span className="text-6xl">📅</span>
            <h3 className="mt-4 text-xl font-semibold text-dark dark:text-white">
              Belum ada kegiatan
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Mulai dengan menambahkan kegiatan pertama untuk organisasi
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 rounded-lg bg-primary px-6 py-2 font-medium text-white transition hover:bg-primary/90 shadow-btn hover:shadow-btn-hover"
            >
              Tambah Kegiatan Pertama
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {sortedActivities.map((activity, index) => (
              <div key={activity.id} className="relative">
                {/* Timeline Line */}
                {index < sortedActivities.length - 1 && (
                  <div className="absolute left-6 top-16 h-full w-0.5 bg-gray-200 dark:bg-gray-700"></div>
                )}
                
                <div className="flex gap-4 sm:gap-6">
                  {/* Timeline Dot */}
                  <div className={`flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-full ${
                    activity.status === 'upcoming' ? 'bg-yellow-100 text-yellow-600' :
                    activity.status === 'ongoing' ? 'bg-green-100 text-green-600' :
                    'bg-gray-100 text-gray-600'
                  }`}>
                    <span className="text-lg sm:text-xl">{activity.status === 'upcoming' ? '📅' :
                     activity.status === 'ongoing' ? '🔴' : '✅'}</span>
                  </div>
                  
                  {/* Activity Card */}
                  <div className={`flex-1 rounded-lg p-4 sm:p-6 shadow-sm ${
                    activity.featured ? 'bg-gradient-to-r from-primary/10 to-primary/20 dark:from-primary/20 dark:to-primary/30 border-2 border-primary/30 dark:border-primary/50' :
                    'bg-white dark:bg-gray-dark'
                  }`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          {activity.category && (
                            <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary dark:bg-primary/20 dark:text-primary">
                              {activity.category}
                            </span>
                          )}
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            📅 {activity.date}
                          </span>
                          {activity.time && (
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                              🕐 {activity.time}
                            </span>
                          )}
                        </div>
                        <h3 className="mb-2 text-xl font-semibold text-dark dark:text-white">
                          {activity.title}
                        </h3>
                        <p className="mb-3 text-gray-600 dark:text-gray-400">
                          {activity.description}
                        </p>
                        {activity.mapEmbed && (
                          <div className="mb-3 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                            <div className="bg-gray-50 dark:bg-gray-800 p-2 text-xs text-gray-500 dark:text-gray-400">📍 Lokasi:</div>
                            <div className="h-48" dangerouslySetInnerHTML={{ __html: activity.mapEmbed }} />
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                          <span className="flex items-center gap-1">📍 {Array.isArray(activity.locations) ? activity.locations.join(', ') : activity.locations || ''}</span>
                          {activity.max_participants !== undefined && (
                            <span className="flex items-center gap-1">👥 {activity.max_participants === 0 ? 'Unlimited' : activity.max_participants}</span>
                          )}
                          {activity.ticket_price && activity.ticket_price > 0 ? (
                            <span className="flex items-center gap-1">💰 Rp {activity.ticket_price.toLocaleString('id-ID')}</span>
                          ) : (
                            <span className="flex items-center gap-1">💰 Gratis</span>
                          )}
                          {activity.contact_person && (
                            <span className="flex items-center gap-1">📞 {activity.contact_person}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-row sm:flex-col gap-2 ml-2 sm:ml-4">
                        <select
                          value={activity.status}
                          onChange={(e) => handleUpdateStatus(activity.id, e.target.value as 'upcoming' | 'ongoing' | 'completed')}
                          className="rounded-lg border border-gray-300 px-2 py-1 text-xs sm:text-sm focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                        >
                          <option value="upcoming">Akan Datang</option>
                          <option value="ongoing">Berlangsung</option>
                          <option value="completed">Selesai</option>
                        </select>
                        <button
                          onClick={() => handleEditActivity(activity)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDeleteActivity(activity.id)}
                          className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-lg bg-white p-4 sm:p-6 shadow-xl dark:bg-gray-dark">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-dark dark:text-white">
                  {isEditing ? 'Edit Kegiatan' : 'Tambah Kegiatan Baru'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmitActivity} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nama Kegiatan
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={activityForm.title}
                    onChange={handleActivityChange}
                    placeholder="Masukkan nama kegiatan..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Deskripsi Kegiatan
                  </label>
                  <textarea
                    name="description"
                    value={activityForm.description}
                    onChange={handleActivityChange}
                    placeholder="Jelaskan detail kegiatan..."
                    rows={4}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tanggal Kegiatan
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={activityForm.date}
                    onChange={handleActivityChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Waktu Kegiatan
                  </label>
                  <input
                    type="time"
                    name="time"
                    value={activityForm.time}
                    onChange={handleActivityChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Lokasi ({activityForm.locations.length}/5)
                  </label>
                  <div className="space-y-2">
                    {activityForm.locations.map((loc, index) => (
                      <div key={index} className="flex gap-2">
                        <input
                          type="text"
                          value={loc}
                          onChange={(e) => handleLocationChange(index, e.target.value)}
                          placeholder="Masukkan lokasi kegiatan..."
                          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                          required
                        />
                        {activityForm.locations.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveLocation(index)}
                            className="rounded-lg bg-red-100 px-3 py-2 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 transition"
                          >
                            ✕
                          </button>
                        )}
                        {index === 0 && (
                          <button
                            type="button"
                            onClick={handleGetCurrentLocation}
                            className="rounded-lg bg-primary/10 px-4 py-2 text-primary hover:bg-primary/20 dark:bg-primary/20 dark:text-primary dark:hover:bg-primary/30 transition"
                            title="Dapatkan lokasi saat ini"
                          >
                            📍
                          </button>
                        )}
                      </div>
                    ))}
                    {activityForm.locations.length < 5 && (
                      <button
                        type="button"
                        onClick={handleAddLocation}
                        className="w-full rounded-lg border border-dashed border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 transition"
                      >
                        + Tambah Lokasi
                      </button>
                    )}
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Embed Map (Opsional)
                  </label>
                  <textarea
                    name="mapEmbed"
                    value={activityForm.mapEmbed}
                    onChange={handleActivityChange}
                    placeholder='Paste Google Maps embed code di sini. Contoh: <iframe src="..." ...></iframe>'
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white font-mono text-xs"
                  />
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                    Buka Google Maps, klik "Share" &gt; "Embed a map", lalu copy HTML code di sini
                  </p>
                  {activityForm.mapEmbed && (
                    <div className="mt-3 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 dark:bg-gray-800 p-2 text-xs text-gray-500 dark:text-gray-400">Preview:</div>
                      <div className="h-48" dangerouslySetInnerHTML={{ __html: activityForm.mapEmbed }} />
                    </div>
                  )}
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Kategori
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={activityForm.category}
                    onChange={handleActivityChange}
                    placeholder="Contoh: Kajian, Workshop, Lomba"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                {/* UI Customization Section */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">Kustomisasi UI</h3>
                  
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Judul Hero (Opsional)
                    </label>
                    <input
                      type="text"
                      name="hero_title"
                      value={activityForm.hero_title}
                      onChange={handleActivityChange}
                      placeholder="Judul kustom untuk hero section"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Subtitle Hero (Opsional)
                    </label>
                    <textarea
                      name="hero_subtitle"
                      value={activityForm.hero_subtitle}
                      onChange={handleActivityChange}
                      placeholder="Subtitle untuk hero section"
                      rows={2}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Quote Hero (Opsional)
                    </label>
                    <input
                      type="text"
                      name="hero_quote"
                      value={activityForm.hero_quote}
                      onChange={handleActivityChange}
                      placeholder="Quote untuk hero section"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Latar Belakang (Opsional)
                    </label>
                    <textarea
                      name="about_background"
                      value={activityForm.about_background}
                      onChange={handleActivityChange}
                      placeholder="Deskripsi latar belakang kegiatan"
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Tujuan Kegiatan (Opsional - satu per baris)
                    </label>
                    <textarea
                      name="about_goals"
                      value={activityForm.about_goals}
                      onChange={handleActivityChange}
                      placeholder="Tujuan 1&#10;Tujuan 2&#10;Tujuan 3"
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>

                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Kapasitas Peserta
                    </label>
                    <input
                      type="number"
                      name="max_participants"
                      value={activityForm.max_participants}
                      onChange={handleActivityChange}
                      placeholder="Kosongkan atau 0 untuk unlimited"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Harga Tiket (Rp)
                    </label>
                    <input
                      type="number"
                      name="ticket_price"
                      value={activityForm.ticket_price}
                      onChange={handleActivityChange}
                      placeholder="0 untuk gratis"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Link Pendaftaran
                  </label>
                  <input
                    type="url"
                    name="registration_link"
                    value={activityForm.registration_link}
                    onChange={handleActivityChange}
                    placeholder="https://form.google.com/..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nama Kontak
                    </label>
                    <input
                      type="text"
                      name="contact_person"
                      value={activityForm.contact_person}
                      onChange={handleActivityChange}
                      placeholder="Nama PIC"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      No. Telepon Kontak
                    </label>
                    <input
                      type="tel"
                      name="contact_phone"
                      value={activityForm.contact_phone}
                      onChange={handleActivityChange}
                      placeholder="628xxx"
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Status
                  </label>
                  <select
                    name="status"
                    value={activityForm.status}
                    onChange={handleActivityChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="upcoming">Akan Datang</option>
                    <option value="ongoing">Sedang Berlangsung</option>
                    <option value="completed">Selesai</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={activityForm.featured}
                      onChange={handleActivityChange}
                      className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Jadikan Event Utama
                    </span>
                  </label>
                </div>

                {/* Sponsor Section */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="text-lg font-semibold text-dark dark:text-white mb-4">Sponsor & Media Partner</h3>

                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Sponsor (Opsional - format: nama|url-logo, satu per baris)
                    </label>
                    <textarea
                      name="sponsors"
                      value={activityForm.sponsors}
                      onChange={handleActivityChange}
                      placeholder="Sponsor 1|https://example.com/logo1.png&#10;Sponsor 2|https://example.com/logo2.png"
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Format: nama|url-logo. Satu sponsor per baris.
                    </p>
                  </div>

                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Media Partner (Opsional - format: nama|url-logo, satu per baris)
                    </label>
                    <textarea
                      name="media_partners"
                      value={activityForm.media_partners}
                      onChange={handleActivityChange}
                      placeholder="Media Partner 1|https://example.com/logo1.png&#10;Media Partner 2|https://example.com/logo2.png"
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    />
                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                      Format: nama|url-logo. Satu media partner per baris.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-white transition hover:bg-primary/90 disabled:opacity-50 shadow-btn hover:shadow-btn-hover"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Simpan'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmDialog
          isOpen={showDeleteDialog}
          title="Hapus Kegiatan"
          message="Apakah Anda yakin ingin menghapus kegiatan ini?"
          onConfirm={confirmDeleteActivity}
          onCancel={cancelDeleteActivity}
        />
      </div>
    </div>
  );
}

export default function KegiatanPage() {
  return (
    <ErrorBoundary
      fallback={
        <div className="min-h-screen bg-[#FCFCFC] dark:bg-black flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 mb-4">Terjadi kesalahan. Silakan refresh halaman.</p>
            <button
              onClick={() => window.location.reload()}
              className="rounded-lg bg-primary px-6 py-2 text-white hover:bg-primary/90"
            >
              Refresh
            </button>
          </div>
        </div>
      }
    >
      <KegiatanPageContent />
    </ErrorBoundary>
  );
}
