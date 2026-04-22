'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ConfirmDialog from '@/components/ConfirmDialog';
import ShareDialog from '@/components/ShareDialog';
import ExportFormatDialog from '@/components/ExportFormatDialog';

interface FinancialRecord {
  id: string;
  date: string;
  type: 'income' | 'expense';
  category: string;
  amount: number;
  description: string;
  created_by: string;
}

export default function PembukuanPage() {
  const router = useRouter();
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
  const [errorMessage, setErrorMessage] = useState('');
  const [showShareDialog, setShowShareDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FinancialRecord | FinancialRecord[] | null>(null);
  const [showFormatDialog, setShowFormatDialog] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState<'excel' | 'pdf' | 'text'>('text');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);

  useEffect(() => {
    loadFinancialRecords();
  }, []);

  const loadFinancialRecords = async () => {
    try {
      const response = await fetch('/api/pembukuan');
      const data = await response.json();
      
      // Check if response is an error object
      if (data.error) {
        console.error('Error loading financial records:', data.error, data.details);
        setFinancialRecords([]);
        return;
      }
      
      setFinancialRecords(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading financial records:', error);
      setFinancialRecords([]);
    }
  };

  const handleFinancialChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFinancialForm({
      ...financialForm,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmitFinancial = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const user = JSON.parse(localStorage.getItem('user_data') || '{}');
      const record = {
        date: financialForm.date,
        type: financialForm.type,
        category: financialForm.category,
        amount: parseFloat(financialForm.amount),
        description: financialForm.description,
        created_by: user.name || 'Admin'
      };

      const response = await fetch('/api/pembukuan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record)
      });

      if (response.ok) {
        await loadFinancialRecords();
        setFinancialForm({ date: '', type: 'income', category: '', amount: '', description: '' });
        setShowModal(false);
        setErrorMessage('');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Gagal menambah transaksi');
      }
    } catch (error) {
      console.error('Error creating financial record:', error);
      setErrorMessage('Gagal menambah transaksi. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteFinancial = (id: string) => {
    setItemToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteFinancial = async () => {
    if (itemToDelete) {
      try {
        const response = await fetch(`/api/pembukuan?id=${itemToDelete}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          await loadFinancialRecords();
        }
      } catch (error) {
        console.error('Error deleting financial record:', error);
      }
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

  const filteredRecords = financialRecords.filter(record => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      record.date.toLowerCase().includes(query) ||
      record.type.toLowerCase().includes(query) ||
      record.category.toLowerCase().includes(query) ||
      record.description.toLowerCase().includes(query) ||
      record.amount.toString().includes(query) ||
      record.created_by.toLowerCase().includes(query)
    );
  });

  const categoryFilteredRecords = selectedCategory 
    ? filteredRecords.filter(r => r.category === selectedCategory)
    : filteredRecords;

  const sortedRecords = [...categoryFilteredRecords].sort((a, b) => {
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

  const categories = [...new Set(financialRecords.map(r => r.category))];

  const totalIncome = financialRecords.filter(r => r.type === 'income').reduce((sum, r) => sum + r.amount, 0);
  const totalExpense = financialRecords.filter(r => r.type === 'expense').reduce((sum, r) => sum + r.amount, 0);
  const balance = totalIncome - totalExpense;

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

        {/* Search and Filter */}
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div>
            <input
              type="text"
              placeholder="Cari transaksi (tanggal, jenis, kategori, deskripsi, jumlah, pembuat)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            >
              <option value="">Semua Kategori</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {selectedCategory && (
              <button
                onClick={() => {
                  setSelectedItem(categoryFilteredRecords);
                  setShowFormatDialog(true);
                }}
                className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-700"
                title="Export kategori ini"
              >
                📄 Export Kategori
              </button>
            )}
          </div>
        </div>

        {/* Transaction Table */}
        <div className="rounded-lg bg-white shadow-sm dark:bg-gray-dark overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-bold text-dark dark:text-white">
              Riwayat Transaksi {sortedRecords.length !== financialRecords.length && `(${sortedRecords.length} dari ${financialRecords.length})`}
            </h2>
          </div>
          
          {sortedRecords.length === 0 ? (
            <div className="p-12 text-center">
              <span className="text-6xl">💸</span>
              <h3 className="mt-4 text-xl font-semibold text-dark dark:text-white">
                Belum ada transaksi
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {searchQuery || selectedCategory ? 'Tidak ada transaksi yang cocok dengan filter' : 'Mulai dengan mencatat transaksi pertama'}
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
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                      Export
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
                        {record.created_by}
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
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => {
                            setSelectedItem(record);
                            setShowFormatDialog(true);
                          }}
                          className="text-gray-400 hover:text-blue-600 transition"
                          title="Export"
                        >
                          📄
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
                {errorMessage && (
                  <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {errorMessage}
                  </div>
                )}
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
        
        <ShareDialog
          isOpen={showShareDialog}
          onClose={() => {
            setShowShareDialog(false);
            setSelectedItem(null);
            setSelectedCategory('');
          }}
          item={selectedItem}
          title={Array.isArray(selectedItem) ? `Data Transaksi - ${selectedItem[0]?.category}` : 'Data Transaksi'}
          itemName={Array.isArray(selectedItem) ? `kategori-${selectedItem[0]?.category}-${selectedItem.length}transaksi` : (selectedItem ? `transaksi-${selectedItem.date}-${selectedItem.category}` : 'transaksi')}
          format={selectedFormat}
        />
        
        <ExportFormatDialog
          isOpen={showFormatDialog}
          onClose={() => setShowFormatDialog(false)}
          onFormatSelect={(format) => {
            setSelectedFormat(format);
            setShowFormatDialog(false);
            setShowShareDialog(true);
          }}
        />
      </div>
    </div>
  );
}
