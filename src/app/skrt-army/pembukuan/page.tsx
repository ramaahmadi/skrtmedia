'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/ConfirmDialog';

interface FinancialRecord {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  createdBy: string;
}

export default function PembukuanPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [financialRecords, setFinancialRecords] = useState<FinancialRecord[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [financialForm, setFinancialForm] = useState({
    date: '',
    type: 'income' as 'income' | 'expense',
    category: '',
    amount: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortColumn, setSortColumn] = useState<keyof FinancialRecord>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      const user = localStorage.getItem('user_data');
      
      if (token && user) {
        setIsAuthenticated(true);
        loadFinancialRecords();
      } else {
        setIsAuthenticated(false);
        router.push('/skrt-army');
      }
      setIsLoading(false);
    };

    checkAuth();
  }, [router]);

  const loadFinancialRecords = () => {
    const savedRecords = localStorage.getItem('skrt_financial_records');
    if (savedRecords) {
      setFinancialRecords(JSON.parse(savedRecords));
    }
  };

  const handleFinancialChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFinancialForm({
      ...financialForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitFinancial = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem('user_data') || '{}');
      const record: FinancialRecord = {
        id: Date.now().toString(),
        date: financialForm.date,
        type: financialForm.type,
        category: financialForm.category,
        amount: parseFloat(financialForm.amount),
        description: financialForm.description,
        createdBy: user.name || 'Admin'
      };

      const existingRecords = JSON.parse(localStorage.getItem('skrt_financial_records') || '[]');
      const updatedRecords = [record, ...existingRecords];
      localStorage.setItem('skrt_financial_records', JSON.stringify(updatedRecords));
      
      setFinancialRecords(updatedRecords);
      setFinancialForm({ date: '', type: 'income', category: '', amount: '', description: '' });
      setShowModal(false);
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFinancial = (id: string) => {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteFinancial = () => {
    if (itemToDelete) {
      const updatedRecords = financialRecords.filter(record => record.id !== itemToDelete);
      setFinancialRecords(updatedRecords);
      localStorage.setItem('skrt_financial_records', JSON.stringify(updatedRecords));
    }
    setShowDeleteDialog(false);
    setItemToDelete(null);
  };

  const cancelDeleteFinancial = () => {
    setShowDeleteDialog(false);
    setItemToDelete(null);
  };

  const handleSort = (column: keyof FinancialRecord) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedRecords = [...financialRecords].sort((a, b) => {
    let aValue = a[sortColumn];
    let bValue = b[sortColumn];

    if (sortColumn === 'amount') {
      aValue = Number(aValue);
      bValue = Number(bValue);
    }

    if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  const totalIncome = financialRecords.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = financialRecords.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
  const balance = totalIncome - totalExpense;

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
              💰 Pembukuan Keuangan
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Kelola pemasukan dan pengeluaran organisasi
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-primary px-6 py-3 font-medium text-white transition hover:bg-primary/90 shadow-btn hover:shadow-btn-hover"
          >
            + Tambah Transaksi
          </button>
        </div>

        {/* Summary Cards */}
        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-gradient-to-br from-primary to-primary/80 p-6 text-white shadow-lg">
            <p className="text-sm font-medium opacity-90">Total Pemasukan</p>
            <p className="text-3xl font-bold">
              Rp {totalIncome.toLocaleString('id-ID')}
            </p>
            <p className="text-sm mt-2 opacity-75">
              {financialRecords.filter(r => r.type === 'income').length} transaksi
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-primary to-primary/80 p-6 text-white shadow-lg">
            <p className="text-sm font-medium opacity-90">Total Pengeluaran</p>
            <p className="text-3xl font-bold">
              Rp {totalExpense.toLocaleString('id-ID')}
            </p>
            <p className="text-sm mt-2 opacity-75">
              {financialRecords.filter(r => r.type === 'expense').length} transaksi
            </p>
          </div>
          <div className="rounded-lg bg-gradient-to-br from-primary to-primary/80 p-6 text-white shadow-lg">
            <p className="text-sm font-medium opacity-90">Saldo</p>
            <p className="text-3xl font-bold">
              Rp {balance.toLocaleString('id-ID')}
            </p>
            <p className="text-sm mt-2 opacity-75">
              {balance >= 0 ? 'Surplus' : 'Defisit'}
            </p>
          </div>
        </div>

        {/* Transaction Table */}
        <div className="rounded-lg bg-white shadow-sm dark:bg-gray-dark overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-dark dark:text-white">
              Riwayat Transaksi
            </h2>
          </div>
          
          {financialRecords.length === 0 ? (
            <div className="p-12 text-center">
              <span className="text-6xl">💸</span>
              <h3 className="mt-4 text-xl font-semibold text-dark dark:text-white">
                Belum ada transaksi
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Mulai dengan mencatat transaksi pertama
              </p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 rounded-lg bg-primary px-6 py-2 font-medium text-white transition hover:bg-primary/90 shadow-btn hover:shadow-btn-hover"
              >
                Tambah Transaksi Pertama
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Jenis
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Kategori
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Deskripsi
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Jumlah
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Dibuat Oleh
                    </th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-dark divide-y divide-gray-200 dark:divide-gray-700">
                  {sortedRecords.map((record, index) => (
                    <tr key={record.id} className={index % 2 === 0 ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-750'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dark dark:text-white">
                        {record.date}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          record.type === 'income' 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                        }`}>
                          {record.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-dark dark:text-white">
                        {record.category}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 max-w-xs truncate">
                        {record.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-semibold">
                        <span className={record.type === 'income' ? 'text-primary' : 'text-red-600'}>
                          {record.type === 'income' ? '+' : '-'} Rp {record.amount.toLocaleString('id-ID')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                        {record.createdBy}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => handleDeleteFinancial(record.id)}
                          className="text-gray-400 hover:text-red-600 transition"
                          title="Hapus"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl dark:bg-gray-dark">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold text-dark dark:text-white">
                  Tambah Transaksi Baru
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              
              <form onSubmit={handleSubmitFinancial} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tanggal
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={financialForm.date}
                    onChange={handleFinancialChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Jenis
                  </label>
                  <select
                    name="type"
                    value={financialForm.type}
                    onChange={handleFinancialChange}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="income">Pemasukan</option>
                    <option value="expense">Pengeluaran</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Kategori
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={financialForm.category}
                    onChange={handleFinancialChange}
                    placeholder="Contoh: Donasi, Sewa Tempat, Konsumsi"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Jumlah (Rp)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={financialForm.amount}
                    onChange={handleFinancialChange}
                    placeholder="Contoh: 500000"
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Deskripsi
                  </label>
                  <textarea
                    name="description"
                    value={financialForm.description}
                    onChange={handleFinancialChange}
                    placeholder="Jelaskan detail transaksi..."
                    rows={3}
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
          title="Hapus Catatan"
          message="Apakah Anda yakin ingin menghapus catatan ini?"
          onConfirm={confirmDeleteFinancial}
          onCancel={cancelDeleteFinancial}
        />
      </div>
    </div>
  );
}
