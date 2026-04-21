'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/ConfirmDialog';
import ShareDialog from '@/components/ShareDialog';

interface MeetingNote {
  id: string;
  date: string;
  title: string;
  content: string;
  createdBy: string;
}

export default function NotulensiPage() {
  const router = useRouter();
  const [meetingNotes, setMeetingNotes] = useState<MeetingNote[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [meetingForm, setMeetingForm] = useState({
    date: '',
    title: '',
    content: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MeetingNote | null>(null);

  useEffect(() => {
    loadMeetingNotes();
  }, []);

  const loadMeetingNotes = async () => {
    try {
      const response = await fetch('/api/notulensi');
      const data = await response.json();
      setMeetingNotes(data);
    } catch (error) {
    }
  };

  const handleMeetingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setMeetingForm({
      ...meetingForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitMeeting = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem('user_data') || '{}');
      const note = {
        date: meetingForm.date,
        title: meetingForm.title,
        content: meetingForm.content,
        createdBy: user.name || 'Admin'
      };

      const response = await fetch('/api/notulensi', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(note)
      });

      if (response.ok) {
        await loadMeetingNotes();
        setMeetingForm({ date: '', title: '', content: '' });
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error creating meeting note:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMeeting = (id: string) => {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteMeeting = async () => {
    if (itemToDelete) {
      try {
        const response = await fetch(`/api/notulensi?id=${itemToDelete}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await loadMeetingNotes();
        }
      } catch (error) {
        console.error('Error deleting meeting note:', error);
      }
    }
    setShowDeleteDialog(false);
    setItemToDelete(null);
  };

  const cancelDeleteMeeting = () => {
    setShowDeleteDialog(false);
    setItemToDelete(null);
  };

  const filteredNotes = meetingNotes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#FCFCFC] dark:bg-black">
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link
              href="/skrt-army"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary dark:text-gray-400 mb-2"
            >
              ← Kembali ke Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              📋 Notulensi Rapat
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Catat dan kelola notulensi pertemuan
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition hover:bg-primary/90 shadow-btn hover:shadow-btn-hover"
          >
            + Tambah Notulensi
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-dark">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Notulensi</p>
            <p className="text-2xl font-bold text-dark dark:text-white">{meetingNotes.length}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-dark">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Notulensi</p>
            <p className="text-2xl font-bold text-primary">{meetingNotes.length}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-dark">
            <p className="text-sm text-gray-600 dark:text-gray-400">Bulan Ini</p>
            <p className="text-2xl font-bold text-primary">{meetingNotes.filter(n => {
              const noteDate = new Date(n.date);
              const now = new Date();
              return noteDate.getMonth() === now.getMonth() && noteDate.getFullYear() === now.getFullYear();
            }).length}</p>
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Cari notulensi berdasarkan judul atau konten..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
          />
        </div>

        {/* Notes Grid */}
        <div className="grid gap-6 md:grid-cols-2">
          {filteredNotes.length === 0 ? (
            <div className="col-span-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
              <span className="text-6xl">📝</span>
              <h3 className="mt-4 text-xl font-semibold text-dark dark:text-white">
                {searchQuery ? 'Tidak ada notulensi yang cocok' : 'Belum ada notulensi'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery ? 'Coba kata kunci lain' : 'Mulai dengan menambahkan notulensi pertama'}
              </p>
              {!searchQuery && (
                <button
                  onClick={() => setShowModal(true)}
                  className="mt-4 rounded-lg bg-primary px-6 py-2 font-medium text-white transition hover:bg-primary/90 shadow-btn hover:shadow-btn-hover"
                >
                  Tambah Notulensi Pertama
                </button>
              )}
            </div>
          ) : (
            filteredNotes.map((note) => (
              <div key={note.id} className="rounded-lg bg-white p-6 shadow-sm dark:bg-gray-dark">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {note.date}
                    </span>
                    <h3 className="text-lg font-semibold text-dark dark:text-white mt-1">
                      {note.title}
                    </h3>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedItem(note);
                        setShowShareDialog(true);
                      }}
                      className="rounded-lg p-2 text-gray-400 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/20"
                      title="Export"
                    >
                      📄
                    </button>
                    <button
                      onClick={() => handleDeleteMeeting(note.id)}
                      className="rounded-lg p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/20"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 whitespace-pre-line">
                  {note.content}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>Oleh: {note.createdBy}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div 
              className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl dark:bg-gray-dark max-h-[90vh] overflow-y-auto">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-dark dark:text-white">
                  Tambah Notulensi Baru
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmitMeeting} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tanggal Rapat
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={meetingForm.date}
                    onChange={handleMeetingChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Judul Notulensi
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={meetingForm.title}
                    onChange={handleMeetingChange}
                    placeholder="Contoh: Rapat Koordinasi Kegiatan"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Isi Notulensi
                  </label>
                  <textarea
                    name="content"
                    value={meetingForm.content}
                    onChange={handleMeetingChange}
                    placeholder="Tulis detail notulensi rapat di sini..."
                    rows={8}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
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
          title="Hapus Notulensi"
          message="Apakah Anda yakin ingin menghapus notulensi ini?"
          onConfirm={confirmDeleteMeeting}
          onCancel={cancelDeleteMeeting}
        />
        
        <ShareDialog
          isOpen={showShareDialog}
          onClose={() => {
            setShowShareDialog(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          title="Notulensi Rapat"
          itemName={selectedItem ? `notulensi-${selectedItem.title}` : 'notulensi'}
        />
      </div>
    </div>
  );
}
