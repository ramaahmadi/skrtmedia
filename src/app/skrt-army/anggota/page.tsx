'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/ConfirmDialog';

interface Member {
  id: string;
  name: string;
  phone: string;
  position: string;
  email: string;
  joinDate: string;
  isAdmin: boolean;
}

export default function AnggotaPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
    phone: '',
    position: ''
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const user = localStorage.getItem('user_data');
      
      if (token && user) {
        setIsAuthenticated(true);
        loadMembers();
      } else {
        setIsAuthenticated(false);
        router.push('/skrt-army');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const loadMembers = () => {
    const savedMembers = localStorage.getItem('skrt_members');
    if (savedMembers) {
      const members = JSON.parse(savedMembers);
      setMembers(members);
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

  const handleSubmitMember = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const member: Member = {
        id: Date.now().toString(),
        name: memberForm.name,
        phone: memberForm.phone,
        position: '',
        email: '',
        joinDate: new Date().toLocaleDateString('id-ID'),
        isAdmin: false
      };

      const existingMembers = JSON.parse(localStorage.getItem('skrt_members') || '[]');
      const updatedMembers = [member, ...existingMembers];
      localStorage.setItem('skrt_members', JSON.stringify(updatedMembers));
      
      setMembers(updatedMembers);
      setMemberForm({ name: '', phone: '' });
      setShowModal(false);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = (id: string) => {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteMember = () => {
    if (itemToDelete) {
      const updatedMembers = members.filter(member => member.id !== itemToDelete);
      setMembers(updatedMembers);
      localStorage.setItem('skrt_members', JSON.stringify(updatedMembers));
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
    return user.isAdmin === true;
  };

  const handleToggleAdmin = (id: string) => {
    if (!isAdminUser()) {
      return;
    }

    const updatedMembers = members.map(member => {
      if (member.id === id) {
        return { ...member, isAdmin: !member.isAdmin };
      }
      return member;
    });
    setMembers(updatedMembers);
    localStorage.setItem('skrt_members', JSON.stringify(updatedMembers));
  };

  const handleEditMember = (member: Member) => {
    if (!isAdminUser()) {
      return;
    }
    setEditingMember(member);
    setEditForm({
      name: member.name,
      phone: member.phone,
      position: member.position
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateMember = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!editingMember) return;

      const updatedMembers = members.map(member => {
        if (member.id === editingMember.id) {
          return {
            ...member,
            name: editForm.name,
            phone: editForm.phone,
            position: editForm.position
          };
        }
        return member;
      });

      setMembers(updatedMembers);
      localStorage.setItem('skrt_members', JSON.stringify(updatedMembers));
      setShowEditModal(false);
      setEditingMember(null);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-black">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-gray-600 dark:text-gray-400">Memeriksa autentikasi...</p>
        </div>
      </div>
    );
  }

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
            <p className="text-2xl font-bold text-primary">{members.filter(m => m.isAdmin).length}</p>
          </div>
          <div className="rounded-lg bg-white p-4 shadow-sm dark:bg-gray-dark">
            <p className="text-sm text-gray-600 dark:text-gray-400">Anggota Biasa</p>
            <p className="text-2xl font-bold text-primary">{members.filter(m => !m.isAdmin).length}</p>
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
                member.isAdmin ? 'border-2 border-primary/30 dark:border-primary/50' : ''
              }`}>
                <div className={`p-6 ${member.isAdmin ? 'bg-gradient-to-br from-primary/10 to-primary/20 dark:from-primary/20 dark:to-primary/30' : ''}`}>
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80 text-2xl text-white">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    {member.isAdmin && (
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
                    {isAdminUser() && (
                      <button
                        onClick={() => handleEditMember(member)}
                        className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                      >
                        ✏️ Edit
                      </button>
                    )}
                    <button
                      onClick={() => handleToggleAdmin(member.id)}
                      className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                    >
                      {member.isAdmin ? 'Hapus Admin' : 'Jadikan Admin'}
                    </button>
                    {isAdminUser() && (
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

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Posisi/Jabatan
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={editForm.position}
                    onChange={handleEditChange}
                    placeholder="Contoh: Ketua, Sekretaris, dll"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
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
      </div>
    </div>
  );
}
