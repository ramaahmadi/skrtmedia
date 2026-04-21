'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/ConfirmDialog';
import ShareDialog from '@/components/ShareDialog';

interface Member {
  id: string;
  name: string;
  phone: string;
  position: string;
  email: string;
  joinDate: string;
  is_admin: boolean;
}

export default function AnggotaPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [memberForm, setMemberForm] = useState({
    name: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    phone: ''
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Member | null>(null);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    try {
      const response = await fetch('/api/anggota');
      const data = await response.json();
      
      // Check if response is an error object
      if (data.error) {
        console.error('Error loading members:', data.error, data.details);
        setMembers([]);
        return;
      }
      
      setMembers(Array.isArray(data) ? data : []);
      
      // If no members, initialize with admin user
      if (Array.isArray(data) && data.length === 0) {
        const adminMember = {
          name: 'RAMA',
          phone: '082122451622',
          position: 'Admin',
          email: '082122451622@skrtmedia.com',
          joinDate: new Date().toLocaleDateString('id-ID'),
          is_admin: true
        };
        const response = await fetch('/api/anggota', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(adminMember)
        });
        if (response.ok) {
          await loadMembers();
        }
      }
    } catch (error) {
      console.error('Error loading members:', error);
    }
  };

  const handleMemberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    setMemberForm({
      ...memberForm,
      [e.target.name]: value
    });
  };

  const handleSubmitMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const member = {
        name: memberForm.name,
        phone: memberForm.phone,
        position: '',
        email: '',
        joinDate: new Date().toLocaleDateString('id-ID'),
        is_admin: false
      };

      const response = await fetch('/api/anggota', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(member)
      });

      if (response.ok) {
        await loadMembers();
        setMemberForm({ name: '', phone: '' });
        setShowModal(false);
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Gagal menambah anggota');
      }
    } catch (error) {
      console.error('Error creating member:', error);
      setErrorMessage('Gagal menambah anggota. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = (id: string) => {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteMember = async () => {
    if (itemToDelete) {
      try {
        const response = await fetch(`/api/anggota?id=${itemToDelete}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await loadMembers();
        }
      } catch (error) {
        console.error('Error deleting member:', error);
      }
    }
    setShowDeleteDialog(false);
    setItemToDelete(null);
  };

  const cancelDeleteMember = () => {
    setShowDeleteDialog(false);
    setItemToDelete(null);
  };

  const isAdminUser = () => {
    const user = JSON.parse(localStorage.getItem('user_data') || '{}');
    return user.is_admin === true;
  };

  const getCurrentUserId = () => {
    const user = JSON.parse(localStorage.getItem('user_data') || '{}');
    return user.id;
  };

  const isCurrentUser = (memberId: string) => {
    return getCurrentUserId() === memberId;
  };

  const canEditMember = (member: Member) => {
    // Sementara buat selalu true untuk testing
    // Nanti bisa dikembalikan ke: return isAdminUser();
    return true;
  };

  const canDeleteMember = (member: Member) => {
    // Sementara buat selalu true untuk testing (kecuali diri sendiri)
    // Nanti bisa dikembalikan ke logic admin
    if (isCurrentUser(member.id)) return false;
    return true;
  };

  const handleToggleAdmin = async (id: string) => {
    if (!isAdminUser()) {
      return;
    }

    const member = members.find(m => m.id === id);
    if (!member) return;

    try {
      const response = await fetch('/api/anggota', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: id,
          is_admin: !member.is_admin
        })
      });

      if (response.ok) {
        await loadMembers();
      }
    } catch (error) {
      console.error('Error toggling admin:', error);
    }
  };

  const handleEditMember = (member: Member) => {
    if (!canEditMember(member)) {
      return;
    }
    setEditingMember(member);
    setEditForm({
      name: member.name,
      phone: member.phone
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!editingMember) return;

      const response = await fetch('/api/anggota', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingMember.id,
          name: editForm.name,
          phone: editForm.phone
        })
      });

      if (response.ok) {
        await loadMembers();
        setShowEditModal(false);
        setEditingMember(null);
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Gagal mengupdate anggota');
      }
    } catch (error) {
      console.error('Error updating member:', error);
      setErrorMessage('Gagal mengupdate anggota. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };


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
              👥 Direktori Anggota
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Kelola data anggota dan hak akses
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition hover:bg-primary/90 shadow-btn hover:shadow-btn-hover"
          >
            + Tambah Anggota
          </button>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-dark">
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Anggota</p>
            <p className="text-2xl font-bold text-dark dark:text-white">{members.length}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-dark">
            <p className="text-sm text-gray-600 dark:text-gray-400">Admin</p>
            <p className="text-2xl font-bold text-primary">{members.filter(m => m.is_admin).length}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-dark">
            <p className="text-sm text-gray-600 dark:text-gray-400">Anggota Biasa</p>
            <p className="text-2xl font-bold text-primary">{members.filter(m => !m.is_admin).length}</p>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {members.length === 0 ? (
            <div className="col-span-full rounded-lg border-2 border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
              <span className="text-6xl">👥</span>
              <h3 className="mt-4 text-xl font-semibold text-dark dark:text-white">
                Belum ada anggota
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Mulai dengan menambahkan anggota pertama untuk organisasi
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 rounded-lg bg-primary px-6 py-2 font-medium text-white transition hover:bg-primary/90 shadow-btn hover:shadow-btn-hover"
              >
                Tambah Anggota Pertama
              </button>
            </div>
          ) : (
            members.map((member) => (
              <div key={member.id} className={`rounded-lg bg-white shadow-sm dark:bg-gray-dark overflow-hidden ${
                member.is_admin ? 'border-2 border-primary/30 dark:border-primary/50' : ''
              }`}>
                <div className={`p-6 ${member.is_admin ? 'bg-gradient-to-br from-primary/10 to-primary/20 dark:from-primary/20 dark:to-primary/30' : ''}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-2xl text-white">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    {member.is_admin && (
                      <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-medium text-primary dark:bg-primary/20 dark:text-primary">
                        👑 Admin
                      </span>
                    )}
                  </div>
                  
                  <h3 className="mb-2 text-xl font-semibold text-dark dark:text-white">
                    {member.name}
                  </h3>
                  
                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      📱 {member.phone}
                    </div>
                    <div className="flex items-center gap-2">
                       Bergabung: {member.joinDate}
                    </div>
                  </div>
                  
                  <div className="mt-4 flex gap-2">
                    {canEditMember(member) && (
                      <button
                        onClick={() => handleEditMember(member)}
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        ✏️ Edit
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedItem(member);
                        setShowShareDialog(true);
                      }}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      📄 Export
                    </button>
                    {canDeleteMember(member) && (
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        className="flex-1 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900/20"
                      >
                        🗑️ Hapus
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-dark">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-dark dark:text-white">
                  Tambah Anggota Baru
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmitMember} className="space-y-4">
                {errorMessage && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {errorMessage}
                  </div>
                )}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={memberForm.name}
                    onChange={handleMemberChange}
                    placeholder="Masukkan nama lengkap..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nomor Handphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={memberForm.phone}
                    onChange={handleMemberChange}
                    placeholder="Contoh: 08123456789"
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

        {/* Edit Modal */}
        {showEditModal && editingMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-dark">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-dark dark:text-white">
                  Edit Anggota
                </h2>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingMember(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleUpdateMember} className="space-y-4">
                {errorMessage && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {errorMessage}
                  </div>
                )}
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editForm.name}
                    onChange={handleEditChange}
                    placeholder="Masukkan nama lengkap..."
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nomor Handphone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={editForm.phone}
                    onChange={handleEditChange}
                    placeholder="Contoh: 08123456789"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>


                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingMember(null);
                    }}
                    className="flex-1 rounded-lg border border-gray-300 px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 rounded-lg bg-primary px-4 py-2 font-medium text-white transition hover:bg-primary/90 disabled:opacity-50 shadow-btn hover:shadow-btn-hover"
                  >
                    {isSubmitting ? 'Menyimpan...' : 'Update'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <ConfirmDialog
          isOpen={showDeleteDialog}
          title="Hapus Anggota"
          message="Apakah Anda yakin ingin menghapus anggota ini?"
          onConfirm={confirmDeleteMember}
          onCancel={cancelDeleteMember}
        />
        
        <ShareDialog
          isOpen={showShareDialog}
          onClose={() => {
            setShowShareDialog(false);
            setSelectedItem(null);
          }}
          item={selectedItem}
          title="Data Anggota"
          itemName={selectedItem ? `anggota-${selectedItem.name}` : 'anggota'}
        />
      </div>
    </div>
  );
}
