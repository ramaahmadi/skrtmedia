'use client';

import { useState } from 'react';
import ThemeToggler from '@/components/Header/ThemeToggler';

export default function QurbanRegistration() {
  const [activeTab, setActiveTab] = useState<'registration' | 'donation'>('registration');
  const [selectedAnimal, setSelectedAnimal] = useState<'kelasC' | 'kelasB' | 'kelasA' | 'istimewa'>('kelasC');
  const [formData, setFormData] = useState({
    fullName: '',
    whatsapp: '',
    notes: ''
  });

  const getAnimalLabel = (value: typeof selectedAnimal) => {
    switch (value) {
      case 'kelasC':
        return 'Domba Kelas C (Rp 2.600.000, bobot ± 23kg)';
      case 'kelasB':
        return 'Domba Kelas B (Rp 3.000.000, bobot ± 28kg)';
      case 'kelasA':
        return 'Domba Kelas A (Rp 3.400.000, bobot ± 33kg)';
      case 'istimewa':
        return 'Domba Istimewa (Rp 5.800.000, bobot ± 55kg)';
      default:
        return '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fullName = formData.fullName.trim();
    const whatsapp = formData.whatsapp.trim();
    const notes = formData.notes.trim() || 'Tidak ada';

    let message = '';

    if (activeTab === 'registration') {
      message = [
        '*Pendaftaran Qurban Bersama SKRT*',
        '',
        '*Detail Pendaftar:*',
        `Nama: ${fullName}`,
        `WhatsApp: ${whatsapp}`,
        '',
        '*Pilihan Hewan Qurban:*',
        getAnimalLabel(selectedAnimal),
        '',
        '*Catatan:*',
        notes,
      ].join('\n');
    } else {
      message = [
        '*Donasi Qurban Bersama SKRT*',
        '',
        '*Detail Donatur:*',
        `Nama: ${fullName}`,
        `WhatsApp: ${whatsapp}`,
        '',
        '*Jenis Donasi:*',
        'Donasi Qurban Umum',
        '',
        '*Catatan:*',
        notes,
      ].join('\n');
    }

    const whatsappUrl = `https://wa.me/62895338683425?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-slate-50 text-slate-900 dark:bg-black dark:text-white">
      {/* Left Sidebar - Always shows Green Model + Bank Info & Transfer Instructions */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-slate-950 via-emerald-900 to-emerald-700 text-white p-6 lg:p-12 flex flex-col justify-between overflow-y-auto">
        {/* Green Marketing Section */}
        <div>
          <div className="mb-6 lg:mb-8">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-emerald-200">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <path d="M12 5l7 7-7 7" />
                </svg>
              </div>
              <span>QurbanConnect</span>
            </div>
          </div>
          
          <div className="mb-8 lg:mb-12">
            <h2 className="text-3xl lg:text-5xl font-bold tracking-tight leading-tight mb-4">
              Sempurnakan <span className="text-emerald-200">Ibadah Anda.</span>
            </h2>
            <p className="text-base lg:text-lg text-slate-200 leading-relaxed max-w-xl">
              Penyaluran hewan qurban dan donasi menjadi lebih mudah, transparan, dan tepat sasaran bersama kami.
            </p>
          </div>
          
          <div className="space-y-4 lg:space-y-5">
            <div className="flex items-start gap-3 rounded-3xl border border-white/15 bg-white/10 p-4 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-200/20 text-emerald-100">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>
              </div>
              <div>
                <h3 className="font-semibold text-base lg:text-lg text-white">Amanah & Terpercaya</h3>
                <p className="text-slate-200 text-sm lg:text-base">Distribusi terjamin dan transparan.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 rounded-3xl border border-white/15 bg-white/10 p-4 shadow-sm">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-200/20 text-emerald-100">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14" /></svg>
              </div>
              <div>
                <h3 className="font-semibold text-base lg:text-lg text-white">Distribusi Pelosok Negeri</h3>
                <p className="text-slate-200 text-sm lg:text-base">Menjangkau daerah terpencil.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Info & Transfer Instructions Section */}
        <div className="mt-8 pt-8 border-t border-white/20">
          {/* Information Rekening Card */}
          <div className="mb-8">
            <div className="rounded-[32px] bg-black/40 backdrop-blur-sm border border-white/10 text-white p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-300">Bank Mandiri</p>
                  <h4 className="mt-3 text-2xl font-semibold">Transfer Bank</h4>
                </div>
                <div className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
                  Rekening
                </div>
              </div>
              <div className="space-y-4 text-sm text-slate-200">
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">No. Rekening</p>
                  <p className="mt-2 text-lg font-semibold tracking-tight">1730020561313</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Atas Nama</p>
                  <p className="mt-2 text-lg font-semibold tracking-tight">Denta Herdiansyah</p>
                </div>
                <div className="rounded-3xl bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-200">Kontak</p>
                  <p className="mt-2 text-lg font-semibold tracking-tight">0895-3386-83425 (Denta)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Cara Transfer Section */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-emerald-100">Cara Transfer</h4>
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl border border-emerald-400/50 bg-emerald-500/20 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-emerald-200">01</p>
                  <p className="text-sm text-emerald-100">Buka aplikasi m-Banking kamu</p>
                </div>
                <div className="rounded-3xl border border-emerald-400/50 bg-emerald-500/20 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-emerald-200">02</p>
                  <p className="text-sm text-emerald-100">Pilih menu Transfer</p>
                </div>
                <div className="rounded-3xl border border-emerald-400/50 bg-emerald-500/20 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-emerald-200">03</p>
                  <p className="text-sm text-emerald-100">Masukkan no. rek 1730020561313</p>
                </div>
                <div className="rounded-3xl border border-emerald-400/50 bg-emerald-500/20 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-emerald-200">04</p>
                  <p className="text-sm text-emerald-100">Tambahkan kode 001 di akhir nominal</p>
                </div>
                <div className="rounded-3xl border border-emerald-400/50 bg-emerald-500/20 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-emerald-200">05</p>
                  <p className="text-sm text-emerald-100">Contoh: Rp 500.001</p>
                </div>
                <div className="rounded-3xl border border-emerald-400/50 bg-emerald-500/20 p-4 backdrop-blur-sm">
                  <p className="text-2xl font-bold text-emerald-200">06</p>
                  <p className="text-sm text-emerald-100">Kirim bukti transfer ke nomor CP</p>
                </div>
              </div>
              <div className="rounded-3xl bg-black/40 backdrop-blur-sm border border-white/10 p-4 text-white">
                <p className="text-sm">Jika transfer berhasil, segera konfirmasi dengan mengirim bukti transfer ke nomor:</p>
                <p className="mt-3 text-base font-semibold">0895-3386-83425 (Denta) | 0896-0340-5077 (Hilmy)</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 lg:mt-8">
          <p className="text-green-100 text-sm lg:text-base">
            Butuh bantuan?{' '}
            <a href="#" className="text-white font-semibold hover:underline">
              Hubungi Customer Service
            </a>
          </p>
        </div>
      </div>

      {/* Right Section - Form */}
      <div className="w-full lg:w-1/2 p-6 lg:p-12 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-xl rounded-[40px] bg-white p-6 lg:p-8 shadow-[0_40px_120px_-40px_rgba(15,23,42,0.35)] border border-slate-200 dark:bg-gray-dark dark:border-white/10">
          {/* Tabs + Theme Toggler */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-6 lg:mb-8">
            <div className="inline-flex gap-2 rounded-full bg-slate-100 p-1 dark:bg-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('registration')}
                className={`rounded-full px-5 py-2 text-sm lg:text-base font-semibold transition ${
                  activeTab === 'registration'
                    ? 'bg-white text-slate-950 shadow-sm dark:bg-emerald-600 dark:text-white'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                Pendaftaran Qurban
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('donation')}
                className={`rounded-full px-5 py-2 text-sm lg:text-base font-semibold transition ${
                  activeTab === 'donation'
                    ? 'bg-white text-slate-950 shadow-sm dark:bg-emerald-600 dark:text-white'
                    : 'text-slate-500 hover:text-slate-700 dark:text-slate-300 dark:hover:text-white'
                }`}
              >
                Infaq &amp; Donasi
              </button>
            </div>
            <ThemeToggler />
          </div>

          {activeTab === 'registration' ? (
            <form onSubmit={handleSubmit}>
              {/* Detail Pendaftar Section */}
              <div className="mb-6 lg:mb-8">
                <h3 className="text-lg lg:text-xl font-bold mb-2 text-slate-900 dark:text-white">Detail Pendaftar</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4 lg:mb-6 text-sm lg:text-base">Lengkapi data di bawah untuk proses administrasi.</p>
                
                <div className="space-y-3 lg:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      NAMA LENGKAP
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                        placeholder="Sesuai KTP"
                        className="w-full pl-10 pr-3 lg:pr-4 py-2 lg:py-3 border border-gray-300 bg-white text-slate-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm lg:text-base dark:border-white/15 dark:bg-black/40 dark:text-white dark:placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      NO. WHATSAPP
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <input
                        type="tel"
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                        placeholder="0812xxxx"
                        className="w-full pl-10 pr-3 lg:pr-4 py-2 lg:py-3 border border-gray-300 bg-white text-slate-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm lg:text-base dark:border-white/15 dark:bg-black/40 dark:text-white dark:placeholder-gray-400"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pilih Hewan Qurban Section */}
              <div className="mb-6 lg:mb-8">
                <h3 className="text-lg lg:text-xl font-bold mb-3 lg:mb-4 text-slate-900 dark:text-white">PILIH HEWAN QURBAN</h3>
                
                <div className="space-y-3">
                  {(
                    [
                      { key: 'kelasC', name: 'Domba Kelas C', price: 'Rp 2.600.000 (± 23kg)' },
                      { key: 'kelasB', name: 'Domba Kelas B', price: 'Rp 3.000.000 (± 28kg)' },
                      { key: 'kelasA', name: 'Domba Kelas A', price: 'Rp 3.400.000 (± 33kg)' },
                      { key: 'istimewa', name: 'Domba Istimewa', price: 'Rp 5.800.000 (± 55kg)' },
                    ] as const
                  ).map((animal) => {
                    const isSelected = selectedAnimal === animal.key;
                    return (
                      <div
                        key={animal.key}
                        onClick={() => setSelectedAnimal(animal.key)}
                        className={`rounded-3xl p-4 cursor-pointer transition-all ${
                          isSelected
                            ? 'border border-emerald-600 bg-emerald-50 dark:bg-emerald-500/15 dark:border-emerald-400'
                            : 'border border-slate-200 bg-slate-50 hover:border-slate-300 dark:border-white/10 dark:bg-white/5 dark:hover:border-white/25'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-2xl border-2 ${
                                isSelected
                                  ? 'border-emerald-600 bg-emerald-600 text-white'
                                  : 'border-slate-200 bg-slate-100 text-slate-500 dark:border-white/15 dark:bg-white/10 dark:text-slate-300'
                              }`}
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isSelected ? 3 : 2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                            <span className="font-medium text-base lg:text-lg text-slate-900 dark:text-white">{animal.name}</span>
                          </div>
                          <span className="text-slate-500 dark:text-slate-300 text-sm lg:text-base">{animal.price}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Catatan Tambahan */}
              <div className="mb-6 lg:mb-8">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  CATATAN TAMBAHAN (OPSIONAL)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Misal: Qurban atas nama Ayah (Fulan bin Fulan)"
                  rows={3}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 bg-white text-slate-900 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm lg:text-base dark:border-white/15 dark:bg-black/40 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-slate-950 text-white py-4 px-6 rounded-3xl font-semibold text-base lg:text-lg hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>Konfirmasi &amp; Lanjut ke WhatsApp</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
                <h3 className="text-xl lg:text-2xl font-semibold mb-2 text-slate-900 dark:text-white">Salurkan Kebaikan</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm lg:text-base max-w-2xl">
                  Donasi Anda akan kami gunakan untuk operasional dan memperluas manfaat qurban kepada lebih banyak penerima.
                </p>
              </div>

              <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-white/5">
                <h4 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Informasi Tambahan</h4>
                <div className="space-y-4 text-sm text-slate-600 dark:text-slate-300">
                  <div className="rounded-3xl bg-slate-50 p-4 dark:bg-black/30">
                    <p className="font-semibold text-slate-900 dark:text-white">Denta</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">0895-3386-83425</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4 dark:bg-black/30">
                    <p className="font-semibold text-slate-900 dark:text-white">Hilmy</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">0896-0340-5077</p>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4 dark:bg-black/30">
                    <p className="font-semibold text-slate-900 dark:text-white">Dana</p>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-300">0853538683425 (a.n. Denta Herdiansyah)</p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  const message = [
                    '*Konfirmasi Donasi Qurban Bersama SKRT*',
                    '',
                    'Saya sudah melakukan transfer donasi.',
                    '',
                    'Mohon konfirmasi dan update status donasi saya.',
                    '',
                    'Terima kasih.',
                  ].join('\n');
                  const whatsappUrl = `https://wa.me/62895338683425?text=${encodeURIComponent(message)}`;
                  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
                }}
                className="w-full bg-slate-950 text-white py-4 px-6 rounded-3xl font-semibold text-lg hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-colors flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>Konfirmasi Donasi via WhatsApp</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
