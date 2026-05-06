'use client';

import { useState } from 'react';

export default function QurbanRegistration() {
  const [activeTab, setActiveTab] = useState<'registration' | 'donation'>('registration');
  const [selectedAnimal, setSelectedAnimal] = useState<'kambing' | 'domba'>('kambing');
  const [isQrisOpen, setIsQrisOpen] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    whatsapp: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format WhatsApp message based on active tab
    let message = '';
    
    if (activeTab === 'registration') {
      message = `*Pendaftaran Qurban QurbanConnect*%0A%0A` +
        `*Detail Pendaftar:*%0A` +
        `Nama: ${formData.fullName}%0A` +
        `WhatsApp: ${formData.whatsapp}%0A%0A` +
        `*Pilihan Hewan Qurban:*%0A` +
        `${selectedAnimal === 'kambing' ? 'Kambing' : 'Domba'}%0A` +
        `Harga: ${selectedAnimal === 'kambing' ? 'Mulai Rp 2.5 Juta' : 'Mulai Rp 3.0 Juta'}%0A%0A` +
        `*Catatan:*%0A${formData.notes || 'Tidak ada'}`;
    } else {
      message = `*Donasi QurbanConnect*%0A%0A` +
        `*Detail Donatur:*%0A` +
        `Nama: ${formData.fullName}%0A` +
        `WhatsApp: ${formData.whatsapp}%0A%0A` +
        `*Jenis Donasi:*%0A` +
        `${selectedAnimal === 'kambing' ? 'Donasi Umum' : 'Donasi Pendidikan'}%0A%0A` +
        `*Catatan:*%0A${formData.notes || 'Tidak ada'}`;
    }
    
    // Open WhatsApp with pre-filled message
    const whatsappUrl = `https://wa.me/628123456789?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Sidebar - Green Background */}
      <div className="w-full lg:w-1/2 bg-gradient-to-br from-green-600 to-green-700 text-white p-6 lg:p-12 flex flex-col justify-between">
        <div>
          <div className="mb-6 lg:mb-8">
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">QurbanConnect</h1>
          </div>
          
          <div className="mb-8 lg:mb-12">
            <h2 className="text-2xl lg:text-4xl font-bold mb-4">Sempurnakan Ibadah Anda.</h2>
            <p className="text-base lg:text-lg text-green-100 leading-relaxed">
              Penyaluran hewan qurban dan donasi menjadi lebih mudah, transparan, dan tepat sasaran bersama kami.
            </p>
          </div>
          
          <div className="space-y-3 lg:space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-base lg:text-lg">Amanah & Terpercaya</h3>
                <p className="text-green-100 text-sm lg:text-base">Distribusi terjamin dan transparan</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 lg:w-12 lg:h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 lg:w-6 lg:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-base lg:text-lg">Distribusi Pelosok Negeri</h3>
                <p className="text-green-100 text-sm lg:text-base">Menjangkau daerah terpencil</p>
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
      <div className="w-full lg:w-1/2 bg-white p-6 lg:p-12 relative">
        <div className="max-w-md mx-auto">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6 lg:mb-8">
            <button
              onClick={() => setActiveTab('registration')}
              className={`pb-3 lg:pb-4 px-1 font-semibold text-base lg:text-lg ${
                activeTab === 'registration'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Pendaftaran Qurban
            </button>
            <button
              onClick={() => setActiveTab('donation')}
              className={`pb-3 lg:pb-4 px-1 font-semibold text-base lg:text-lg ml-6 lg:ml-8 ${
                activeTab === 'donation'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Infaq & Donasi
            </button>
          </div>

          {activeTab === 'registration' ? (
            <form onSubmit={handleSubmit}>
              {/* Detail Pendaftar Section */}
              <div className="mb-6 lg:mb-8">
                <h3 className="text-lg lg:text-xl font-bold mb-2">Detail Pendaftar</h3>
                <p className="text-gray-600 mb-4 lg:mb-6 text-sm lg:text-base">Lengkapi data di bawah untuk proses administrasi.</p>
                
                <div className="space-y-3 lg:space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="w-full pl-10 pr-3 lg:pr-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm lg:text-base"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                        className="w-full pl-10 pr-3 lg:pr-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm lg:text-base"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pilih Hewan Qurban Section */}
              <div className="mb-6 lg:mb-8">
                <h3 className="text-lg lg:text-xl font-bold mb-3 lg:mb-4">PILIH HEWAN QURBAN</h3>
                
                <div className="space-y-3">
                  <div
                    onClick={() => setSelectedAnimal('kambing')}
                    className={`border-2 rounded-lg p-3 lg:p-4 cursor-pointer transition-all ${
                      selectedAnimal === 'kambing'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 lg:w-5 lg:h-5 rounded-full border-2 mr-3 flex-shrink-0 ${
                          selectedAnimal === 'kambing'
                            ? 'border-green-500 bg-green-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedAnimal === 'kambing' ? (
                            <svg className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                            </svg>
                          ) : (
                            <svg className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <rect x="4" y="4" width="16" height="16" strokeWidth={2} />
                            </svg>
                          )}
                        </div>
                        <span className="font-medium text-base lg:text-lg">Kambing</span>
                      </div>
                      <span className="text-gray-600 text-sm lg:text-base">Mulai Rp 2.5 Juta</span>
                    </div>
                  </div>
                  
                  <div
                    onClick={() => setSelectedAnimal('domba')}
                    className={`border-2 rounded-lg p-3 lg:p-4 cursor-pointer transition-all ${
                      selectedAnimal === 'domba'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`w-4 h-4 lg:w-5 lg:h-5 rounded-full border-2 mr-3 flex-shrink-0 ${
                          selectedAnimal === 'domba'
                            ? 'border-green-500 bg-green-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedAnimal === 'domba' ? (
                            <svg className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-white mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                            </svg>
                          ) : (
                            <svg className="w-2.5 h-2.5 lg:w-3 lg:h-3 text-gray-400 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <rect x="4" y="4" width="16" height="16" strokeWidth={2} />
                            </svg>
                          )}
                        </div>
                        <span className="font-medium text-base lg:text-lg">Domba</span>
                      </div>
                      <span className="text-gray-600 text-sm lg:text-base">Mulai Rp 3.0 Juta</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Catatan Tambahan */}
              <div className="mb-6 lg:mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CATATAN TAMBAHAN (OPSIONAL)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Misal: Qurban atas nama Ayah (Fulan bin Fulan)"
                  rows={3}
                  className="w-full px-3 lg:px-4 py-2 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm lg:text-base"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-900 text-white py-3 lg:py-4 px-6 rounded-lg font-semibold text-base lg:text-lg hover:bg-blue-800 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Konfirmasi & Lanjut ke WhatsApp</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </form>
          ) : (
            <div className="space-y-6">
              {/* Salurkan Kebaikan Section */}
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                  </div>
                </div>
                <h3 className="text-xl lg:text-2xl font-bold mb-3">Salurkan Kebaikan</h3>
                <p className="text-gray-600 text-sm lg:text-base max-w-md mx-auto">
                  Donasi Anda akan kami gunakan untuk keperluan operasional dan memperluas manfaat qurban bagi lebih banyak penerima.
                </p>
              </div>

              {/* Bank Transfer Section */}
              <div className="bg-gray-900 text-white rounded-xl p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold">TRANSFER BANK JAGO (442)</h4>
                  <div className="flex space-x-2">
                    <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button className="p-2 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m9.032 4.026a9.001 9.001 0 01-7.432 0m9.032-4.026A9.001 9.001 0 0112 3c-4.474 0-8.268 3.12-9.032 7.326m0 0A9.001 9.001 0 0012 21c4.474 0 8.268-3.12 9.032-7.326" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between py-2 border-b border-gray-800">
                    <span className="text-gray-400">No. Rekening</span>
                    <span className="font-mono text-lg">1234 5678 9012</span>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-400">A.N.</span>
                    <span>Yayasan Amal Sejahtera</span>
                  </div>
                </div>
              </div>

              {/* QRIS Section */}
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  onClick={() => setIsQrisOpen(!isQrisOpen)}
                  className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h4 className="text-lg font-semibold text-gray-900">Bayar Praktis via QRIS</h4>
                  <svg 
                    className={`w-6 h-6 text-green-600 transition-transform duration-200 ${
                      isQrisOpen ? 'rotate-180' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {isQrisOpen && (
                  <div className="px-6 pb-6 border-t border-gray-200">
                    <div className="bg-gray-100 rounded-lg p-8 text-center mt-4">
                      <div className="w-32 h-32 bg-gray-300 mx-auto mb-4 rounded-lg flex items-center justify-center">
                        <svg className="w-16 h-16 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M3 11h8V3H3v8zm2-6h4v4H5V5zm8-2v8h8V3h-8zm6 6h-4V5h4v4zM3 21h8v-8H3v8zm2-6h4v4H5v-4z"/>
                        </svg>
                      </div>
                      <p className="text-gray-600 text-sm">Scan QR Code untuk pembayaran</p>
                      <div className="mt-4 space-y-2">
                        <p className="text-xs text-gray-500">Atau scan kode QR berikut:</p>
                        <div className="bg-white p-2 rounded border border-gray-300">
                          <div className="w-24 h-24 bg-gray-200 mx-auto rounded"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Button */}
              <button
                onClick={() => {
                  const message = `*Konfirmasi Donasi QurbanConnect*%0A%0A` +
                    `Saya sudah melakukan transfer donasi.%0A%0A` +
                    `Mohon konfirmasi dan update status donasi saya.%0A%0A` +
                    `Terima kasih.`;
                  const whatsappUrl = `https://wa.me/628123456789?text=${message}`;
                  window.open(whatsappUrl, '_blank');
                }}
                className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
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
