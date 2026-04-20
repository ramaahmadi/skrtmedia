"use client";

import React from "react";
import { FaUniversity, FaCopy } from "react-icons/fa";

interface DonationModalProps {
  showDonationDialog: boolean;
  donationAmount: string;
  bank: string;
  loading: boolean;
  handleDonationChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  setBank: (bank: string) => void;
  setShowDonationDialog: (show: boolean) => void;
  confirmRegistration: (amount: number) => void;
  setDonationAmount: (amount: string) => void;
}

const DonationModal: React.FC<DonationModalProps> = ({
  showDonationDialog,
  donationAmount,
  bank,
  loading,
  handleDonationChange,
  setBank,
  setShowDonationDialog,
  confirmRegistration,
  setDonationAmount,
}) => {
  const banks = [
    { name: "Bank Jago", account: "1029384756", holder: "SKRT MEDIA" },
    { name: "BCA", account: "1234567890", holder: "SKRT MEDIA" },
    { name: "Mandiri", account: "0987654321", holder: "SKRT MEDIA" },
    { name: "BRI", account: "5678901234", holder: "SKRT MEDIA" },
  ];

  const getNumericValue = (): number => {
    if (!donationAmount) return 0;
    return parseInt(donationAmount.replace(/\./g, '')) || 0;
  };

  const copyAccount = (account: string) => {
    navigator.clipboard?.writeText(account);
  };

  if (!showDonationDialog) return null;

  const selectedBank = banks.find(b => b.name === bank) || banks[0];

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Konfirmasi Donasi</h2>
        
        <div className="space-y-4">
          {/* Amount Display */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Nominal Donasi
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">
                Rp
              </span>
              <input
                type="text"
                value={donationAmount}
                onChange={handleDonationChange}
                placeholder="0"
                className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-lg font-bold"
              />
            </div>
          </div>

          {/* Bank Selection */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Pilih Bank
            </label>
            <div className="space-y-2">
              {banks.map((b) => (
                <button
                  key={b.name}
                  type="button"
                  onClick={() => setBank(b.name)}
                  className={`w-full p-3 rounded-xl border-2 text-left transition-all ${
                    bank === b.name
                      ? "border-green-500 bg-green-50"
                      : "border-gray-200 hover:border-green-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FaUniversity className="text-green-600 w-5 h-5" />
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800">{b.name}</div>
                      <div className="text-sm text-gray-600">{b.account}</div>
                    </div>
                    {bank === b.name && (
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-gray-700">No. Rekening:</span>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-gray-800">{selectedBank.account}</span>
                <button
                  onClick={() => copyAccount(selectedBank.account)}
                  className="text-green-600 hover:text-green-700 p-1"
                  title="Salin nomor rekening"
                >
                  <FaCopy className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Atas Nama:</span>
              <span className="font-bold text-gray-800">{selectedBank.holder}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowDonationDialog(false)}
              className="flex-1 px-4 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              onClick={() => confirmRegistration(getNumericValue())}
              disabled={loading || getNumericValue() === 0}
              className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Memproses..." : "Konfirmasi"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationModal;
