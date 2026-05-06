"use client";

import React from "react";
import { FaInfoCircle, FaDonate } from "react-icons/fa";

interface RegistrationFormProps {
  form: any;
  loading: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  handleDonationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmitForm: (e: React.FormEvent) => void;
  kurbanPrices: {
    kambing: number;
    sapi: number;
    patungan: number;
  };
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  form,
  loading,
  handleChange,
  handleDonationChange,
  onSubmitForm,
  kurbanPrices,
}) => {
  return (
    <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-green-100 p-4 sm:p-6 mb-4 sm:mb-8">
      <form onSubmit={onSubmitForm} className="space-y-4 sm:space-y-6">
        {/* Personal Information */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <FaInfoCircle className="text-green-600" />
            Informasi Pribadi
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                Nama Lengkap *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Masukkan nama lengkap"
                className="w-full px-3 py-3 sm:px-4 sm:py-4 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base sm:text-lg"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                No. WhatsApp *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="Contoh: 08123456789"
                className="w-full px-3 py-3 sm:px-4 sm:py-4 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base sm:text-lg"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                Email *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="email@contoh.com"
                className="w-full px-3 py-3 sm:px-4 sm:py-4 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base sm:text-lg"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                Alamat
              </label>
              <textarea
                id="address"
                name="address"
                value={form.address}
                onChange={handleChange}
                placeholder="Masukkan alamat lengkap"
                rows={3}
                className="w-full px-3 py-3 sm:px-4 sm:py-4 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base sm:text-lg resize-none"
              />
            </div>
          </div>
        </div>

        {/* Kurban Type Selection */}
        <div>
          <h3 className="text-lg font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
            <FaDonate className="text-green-600" />
            Pilih Paket Kurban
          </h3>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="kambing"
                name="kurbanType"
                value="kambing"
                checked={form.kurbanType === "kambing"}
                onChange={handleChange}
                className="w-5 h-5 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="kambing" className="flex-1 cursor-pointer">
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Kambing/Domba</span>
                    <span className="font-bold text-green-600">Rp {kurbanPrices.kambing.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="sapi"
                name="kurbanType"
                value="sapi"
                checked={form.kurbanType === "sapi"}
                onChange={handleChange}
                className="w-5 h-5 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="sapi" className="flex-1 cursor-pointer">
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Sapi Kerbau</span>
                    <span className="font-bold text-green-600">Rp {kurbanPrices.sapi.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="patungan"
                name="kurbanType"
                value="patungan"
                checked={form.kurbanType === "patungan"}
                onChange={handleChange}
                className="w-5 h-5 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="patungan" className="flex-1 cursor-pointer">
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-green-200">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-800">Patungan Sapi (1/7)</span>
                    <span className="font-bold text-green-600">Rp {kurbanPrices.patungan.toLocaleString('id-ID')}</span>
                  </div>
                </div>
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="radio"
                id="donasiSesuai"
                name="kurbanType"
                value="donasi"
                checked={form.kurbanType === "donasi"}
                onChange={handleChange}
                className="w-5 h-5 text-green-600 focus:ring-green-500"
              />
              <label htmlFor="donasiSesuai" className="flex-1 cursor-pointer">
                <div className="bg-green-50 p-3 sm:p-4 rounded-lg sm:rounded-xl border border-green-200">
                  <div className="font-semibold text-gray-800">Donasi Sesuai Kemampuan</div>
                  <div className="text-xs sm:text-sm text-gray-600 mt-1">
                    Berdonasi sesuai kemampuan Anda
                  </div>
                </div>
              </label>
            </div>

            {form.kurbanType === "donasi" && (
              <div className="mt-3 sm:mt-4">
                <label htmlFor="donationAmount" className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                  Nominal Donasi
                </label>
                <div className="relative">
                  <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                    Rp
                  </span>
                  <input
                    id="donationAmount"
                    name="donationAmount"
                    type="text"
                    value={form.donationAmount}
                    onChange={handleDonationChange}
                    placeholder="0"
                    className="w-full pl-12 sm:pl-16 pr-3 py-3 sm:px-4 sm:py-4 border border-gray-300 rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-base sm:text-lg font-semibold"
                  />
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-2">
                  Masukkan nominal donasi dalam Rupiah
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 sm:py-4 px-6 sm:px-8 rounded-xl sm:rounded-xl text-base sm:text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? "Memproses..." : "Daftar Sekarang"}
        </button>

        <p className="text-xs sm:text-sm text-gray-500 text-center">
          * Wajib diisi
        </p>
      </form>
    </div>
  );
};

export default RegistrationForm;
