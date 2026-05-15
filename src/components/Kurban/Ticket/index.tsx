"use client";

import React, { useState } from "react";
import { FaHome, FaTicketAlt, FaArrowLeft, FaWhatsapp, FaCopy, FaDonate, FaCheckCircle } from "react-icons/fa";
import Link from "next/link";
import Header from "@/components/Kurban/Header";
import Footer from "@/components/Kurban/Footer";
import RegistrationForm from "./RegistrationForm";
import DonationModal from "./DonationModal";
import SuccessModal from "./SuccessModal";
// Supabase connection removed

// Supabase connection removed

interface FormState {
  name: string;
  phone: string;
  email: string;
  address: string;
  kurbanType: "kambing" | "sapi" | "patungan" | "donasi";
  donationAmount: string;
  donationBank: string;
}

const Ticket = () => {
  const [showForm, setShowForm] = useState(true);
  const [showDonationDialog, setShowDonationDialog] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "",
    phone: "",
    email: "",
    address: "",
    kurbanType: "kambing",
    donationAmount: "",
    donationBank: "Bank Jago",
  });
  const [loading, setLoading] = useState(false);
  const [successTicket, setSuccessTicket] = useState<any>(null);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);

  const kurbanPrices = {
    kambing: 2500000,
    sapi: 18000000,
    patungan: 3500000,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setForm((s) => ({ ...s, [name]: checked } as FormState));
    } else {
      setForm((s) => ({ ...s, [name]: value } as FormState));
    }
  };

  const formatRupiah = (value: string): string => {
    const cleanValue = value.replace(/\D/g, '');
    if (cleanValue === '') return '';
    return cleanValue.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleDonationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatRupiah(e.target.value);
    setForm((s) => ({ ...s, donationAmount: formattedValue }));
  };

  const getNumericValue = (): number => {
    if (!form.donationAmount) return 0;
    return parseInt(form.donationAmount.replace(/\./g, '')) || 0;
  };

  const onSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.name.trim() || !form.phone.trim() || !form.email.trim()) {
      setToast({ type: "error", message: "Nama, No HP, dan Email wajib diisi" });
      return;
    }

    if (form.kurbanType === "donasi") {
      setShowDonationDialog(true);
    } else {
      confirmRegistration(kurbanPrices[form.kurbanType]);
    }
  };

  const confirmRegistration = async (donationAmount: number) => {
    setLoading(true);
    setToast(null);

    const ticketNumber = "K-" + (crypto.randomUUID?.().slice(0, 8) || Math.random().toString(36).slice(2, 10));

    const basePrice = form.kurbanType === "donasi" ? donationAmount : kurbanPrices[form.kurbanType];

    const payload = {
      ticket_number: ticketNumber,
      name: form.name,
      phone: form.phone,
      email: form.email,
      address: form.address,
      kurban_type: form.kurbanType,
      donation_amount: basePrice,
      donation_bank: form.donationBank,
      want_to_donate: form.kurbanType === "donasi",
      created_at: new Date().toISOString(),
    };

    try {
      // Supabase connection removed - simulate successful registration
      const mockData = { id: Date.now(), ...payload };
      setSuccessTicket({ ticket_number: ticketNumber, data: mockData });
      setShowDonationDialog(false);
      setShowForm(false);
      setToast({ type: "success", message: "Pendaftaran berhasil!" });

      setForm({ 
        name: "", phone: "", email: "", address: "", 
        kurbanType: "kambing", donationAmount: "", donationBank: "Bank Jago"
      });

    } catch (err) {
      console.error("Error:", err);
      setToast({ type: "error", message: "Terjadi kesalahan saat mendaftar." });
    } finally {
      setLoading(false);
    }
  };

  const copyTicket = () => {
    if (!successTicket) return;
    navigator.clipboard?.writeText(successTicket.ticket_number)
      .then(() => setToast({ type: "success", message: "Nomor tiket disalin!" }))
      .catch(() => setToast({ type: "error", message: "Gagal menyalin" }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      <Header />

      <main className="container mx-auto px-3 py-4 sm:px-6 sm:py-8">
        <div className="mt-24 max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-6 sm:mb-12">
            <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-8 shadow-lg border border-green-100">
              <div className="bg-green-100 w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                <FaDonate className="w-6 h-6 sm:w-8 sm:h-8 text-green-600" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">Pendaftaran Kurban</h1>
              <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                Lengkapi formulir di bawah untuk mendaftar program kurban. Anda dapat memilih paket kurban atau berdonasi sesuai kemampuan.
              </p>
            </div>
          </div>

          {/* Registration Form */}
          {showForm && (
            <RegistrationForm
              form={form}
              loading={loading}
              handleChange={handleChange}
              handleDonationChange={handleDonationChange}
              onSubmitForm={onSubmitForm}
              kurbanPrices={kurbanPrices}
            />
          )}

          {/* Success Ticket */}
          {successTicket && (
            <SuccessModal
              successTicket={successTicket}
              setSuccessTicket={setSuccessTicket}
              copyTicket={copyTicket}
              setToast={setToast}
            />
          )}
        </div>
      </main>

      <Footer />

      {/* Donation Modal */}
      <DonationModal
        showDonationDialog={showDonationDialog}
        donationAmount={form.donationAmount}
        bank={form.donationBank}
        loading={loading}
        handleDonationChange={handleDonationChange}
        setBank={(bank) => setForm((s) => ({ ...s, donationBank: bank }))}
        setShowDonationDialog={setShowDonationDialog}
        confirmRegistration={confirmRegistration}
        setDonationAmount={(amount) => setForm((s) => ({ ...s, donationAmount: amount }))}
      />

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-4 left-4 right-4 sm:bottom-6 sm:right-6 sm:left-auto z-[99999] px-4 py-3 sm:px-6 sm:py-4 rounded-lg sm:rounded-xl shadow-lg transform transition-all duration-300 ${
          toast.type === "success" ? "bg-green-600" : "bg-red-600"
        } text-white`}>
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-medium flex-1 text-center sm:text-left">{toast.message}</div>
            <button 
              className="text-white/80 hover:text-white transition-colors flex-shrink-0" 
              onClick={() => setToast(null)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Ticket;
