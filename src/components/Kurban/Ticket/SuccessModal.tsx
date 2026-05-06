"use client";

import React from "react";
import { FaCheckCircle, FaCopy, FaHome, FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

interface SuccessModalProps {
  successTicket: any;
  setSuccessTicket: (ticket: any) => void;
  copyTicket: () => void;
  setToast: (toast: { message: string; type: "success" | "error" }) => void;
}

const SuccessModal: React.FC<SuccessModalProps> = ({
  successTicket,
  setSuccessTicket,
  copyTicket,
  setToast,
}) => {
  if (!successTicket) return null;

  return (
    <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 sm:p-8 text-white shadow-2xl">
      <div className="text-center mb-6">
        <div className="bg-white/20 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <FaCheckCircle className="w-8 h-8 sm:w-10 sm:h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">Pendaftaran Berhasil!</h2>
        <p className="text-green-100 text-sm sm:text-base">
          Terima kasih atas partisipasi Anda dalam program kurban
        </p>
      </div>

      {/* Ticket Details */}
      <div className="bg-white rounded-xl p-4 sm:p-6 text-gray-800 mb-6">
        <div className="space-y-3 sm:space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm sm:text-base text-gray-600">Nomor Tiket:</span>
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-lg sm:text-xl text-green-600">
                {successTicket.ticket_number}
              </span>
              <button
                onClick={copyTicket}
                className="text-green-600 hover:text-green-700 p-1"
                title="Salin nomor tiket"
              >
                <FaCopy className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
          
          {successTicket.data && (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-600">Nama:</span>
                <span className="font-semibold text-sm sm:text-base">
                  {successTicket.data.name}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base text-gray-600">Jenis Kurban:</span>
                <span className="font-semibold text-sm sm:text-base capitalize">
                  {successTicket.data.kurban_type}
                </span>
              </div>
              {successTicket.data.donation_amount && (
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600">Nominal:</span>
                  <span className="font-semibold text-sm sm:text-base text-green-600">
                    Rp {successTicket.data.donation_amount.toLocaleString('id-ID')}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Important Notice */}
      <div className="bg-white/10 rounded-lg p-4 mb-6">
        <p className="text-sm text-white text-center">
          <strong>Penting:</strong> Simpan nomor tiket Anda. Anda akan menerima detail lebih lanjut melalui WhatsApp.
        </p>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Link
          href="/kurban"
          className="flex items-center justify-center gap-2 bg-white text-green-600 hover:bg-green-50 font-bold py-3 px-6 rounded-xl transition-colors w-full"
        >
          <FaHome className="w-5 h-5" />
          Kembali ke Halaman Utama
        </Link>
        <a
          href="https://wa.me/6289647011970"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 bg-green-700 hover:bg-green-800 text-white font-semibold py-3 px-6 rounded-xl transition-colors w-full"
        >
          <FaWhatsapp className="w-5 h-5" />
          Hubungi Admin via WhatsApp
        </a>
      </div>
    </div>
  );
};

export default SuccessModal;
