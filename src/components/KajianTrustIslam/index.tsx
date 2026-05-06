"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, ChevronRight, Send, Camera, Users, 
  BookOpen, Coffee, Instagram, MessageCircle, Heart,
  Mic, MessageSquare, PenTool, Lightbulb, Mail, Check,
  Star, AlertCircle, ThumbsUp, HelpCircle,
  Sparkles, ArrowRight, Sun, Moon, Cloud
} from "lucide-react";
import { FaPray } from "react-icons/fa";

// --- Tipe Data ---
type FeedbackData = {
  name?: string;
  emoji_rating: number;
  category: string;
  message: string;
  timestamp: string;
};

type TabType = "target" | "discussion" | "resources" | "prayer";

// --- Data Dummy ---
const feedbackData: FeedbackData[] = [
  {
    name: "Ahmad Rizki",
    emoji_rating: 5,
    category: "target",
    message: "Kajian ini sangat membantu saya dalam memahami esensi sejati Islam. Terima kasih!",
    timestamp: "2024-01-15 14:30"
  },
  {
    name: "Siti Nurhaliza",
    emoji_rating: 4,
    category: "discussion", 
    message: "Diskusi yang sangat menarik, semoga bisa lebih banyak lagi kajian seperti ini.",
    timestamp: "2024-01-15 15:45"
  },
  {
    name: "Muhammad Fadli",
    emoji_rating: 5,
    category: "prayer",
    message: "Doa-doa yang dipanjatkan sangat berkesan dan menyentuh hati. Jazakillah khair.",
    timestamp: "2024-01-15 16:20"
  }
];

const resourcesData = [
  {
    title: "Al-Qur'an Digital",
    description: "Akses Al-Qur'an dengan terjemahan dan tafsir",
    icon: <BookOpen className="w-8 h-8" />,
    link: "#"
  },
  {
    title: "Hadis Collection",
    description: "Kumpulan hadis pilihan sehari-hari",
    icon: <MessageCircle className="w-8 h-8" />,
    link: "#"
  },
  {
    title: "Prayer Times",
    description: "Jadwal sholat lengkap dengan pengingat",
    icon: <Sun className="w-8 h-8" />,
    link: "#"
  }
];

const prayerRequests = [
  {
    id: 1,
    name: "Ahmad Bakri",
    request: "Mohon doakan kesembuhan ibu saya yang sedang sakit",
    timestamp: "2024-01-15 10:30",
    status: "answered"
  },
  {
    id: 2,
    name: "Siti Aminah",
    request: "Doakan kelancaran usaha bisnis saya",
    timestamp: "2024-01-15 11:15",
    status: "pending"
  }
];

export default function KajianTrustIslam() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("target");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState({ title: "", content: null });
  const modalRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setModalOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const openModal = (title: string, content: React.ReactNode) => {
    setModalData({ title, content });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setTimeout(() => setModalData({ title: "", content: null }), 300);
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "target":
        return (
          <div className="space-y-6">
            <div className="text-center border-2 border-dashed p-8 rounded-lg bg-gray-50">
              <h3 className="text-3xl font-bold font-heading">TRUST</h3>
              <h3 className="text-2xl font-bold font-heading line-through decoration-2 decoration-[#0EA5E9] my-1">ISSUE</h3>
              <h3 className="text-4xl font-bold font-heading text-[#0B6E99]">ISLAM</h3>
              <p className="mt-4 text-sm">Kajian Pemuda Karawang | [Nama Pembicara]</p>
              <p className="text-sm">[Tanggal] | [Waktu] | [Lokasi]</p>
            </div>
            <div className="mt-6">
              <h4 className="font-bold mb-2">Contoh Caption:</h4>
              <p className="text-sm bg-gray-100 p-4 rounded-md">
                Punya banyak pertanyaan tapi bingung harus percaya sama siapa? Ngerasa ada yang salah tapi nggak
                tahu apa? Mungkin ini bukan sekadar <em>trust issue</em> biasa. Yuk, kita bedah dan temukan jawabannya
                bersama di <strong>KAJIAN TRUST <span className="line-through decoration-2 decoration-[#0EA5E9]">ISSUE</span> ISLAM</strong>.
              </p>
            </div>
          </div>
        );

      case "discussion":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <MessageCircle className="w-6 h-6 mr-2 text-blue-600" />
                Diskusi Kajian
              </h3>
              <div className="space-y-4">
                {feedbackData
                  .filter(item => item.category === "discussion")
                  .map((item, index) => (
                    <div key={index} className="border-b pb-4 last:border-b-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-bold text-blue-600">
                              {item.name.charAt(0)}
                            </div>
                            <div className="ml-3">
                              <p className="font-semibold">{item.name}</p>
                              <p className="text-xs text-gray-500">{item.timestamp}</p>
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 mt-2">{item.message}</p>
                        </div>
                        <div className="flex items-center space-x-1 ml-4">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < item.emoji_rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        );

      case "resources":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-green-600" />
                Sumber Belajar
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resourcesData.map((resource, index) => (
                  <Link
                    key={index}
                    href={resource.link}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors block"
                  >
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                        {resource.icon}
                      </div>
                    </div>
                    <h4 className="font-semibold text-sm">{resource.title}</h4>
                    <p className="text-xs text-gray-600 mt-1">{resource.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        );

      case "prayer":
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <FaPray className="w-6 h-6 mr-2 text-purple-600" />
                Permohonan Doa
              </h3>
              <div className="space-y-4">
                {prayerRequests.map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold">{request.name}</p>
                        <p className="text-xs text-gray-500">{request.timestamp}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        request.status === 'answered' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {request.status === 'answered' ? 'Dijawab' : 'Menunggu'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{request.request}</p>
                    {request.status === 'answered' && (
                      <div className="mt-3 p-3 bg-green-50 rounded-md">
                        <p className="text-sm text-green-800">
                          <Check className="w-4 h-4 inline mr-1" />
                          Doa telah dipanjatkan dalam kajian terakhir
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              <div className="mt-6">
                <h4 className="font-bold mb-3">Ajukan Permohonan Doa</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nama Lengkap</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Masukkan nama Anda"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Permohonan Doa</label>
                      <textarea
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        rows={4}
                        placeholder="Tuliskan permohonan doa Anda..."
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Kirim Permohonan
                    </button>
                  </form>
                </div>
              </div>
            </div>
          );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <FaPray className="w-6 h-6 text-white" />
              </div>
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-900">Kajian Trust Islam</h1>
                <p className="text-sm text-gray-500">Platform Kajian Islam Interaktif</p>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              {mobileOpen ? (
                <ChevronLeft className="w-6 h-6" />
              ) : (
                <ChevronRight className="w-6 h-6" />
              )}
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex space-x-8">
              <Link
                href="#"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Beranda
              </Link>
              <Link
                href="#"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Kajian
              </Link>
              <Link
                href="#"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Tentang
              </Link>
            </nav>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="lg:hidden bg-white border-b"
            >
              <div className="px-2 pt-2 pb-3 space-y-1">
                <Link
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  Beranda
                </Link>
                <Link
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  Kajian
                </Link>
                <Link
                  href="#"
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                >
                  Tentang
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar - Navigation */}
          <aside className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h2 className="text-lg font-bold mb-4">Menu</h2>
              <nav className="space-y-2">
                {[
                  { id: "target", label: "Target Kajian", icon: <Target className="w-5 h-5" /> },
                  { id: "discussion", label: "Diskusi", icon: <MessageCircle className="w-5 h-5" /> },
                  { id: "resources", label: "Sumber Belajar", icon: <BookOpen className="w-5 h-5" /> },
                  { id: "prayer", label: "Permohonan Doa", icon: <FaPray className="w-5 h-5" /> }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as TabType)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderTabContent()}
            </motion.div>
          </div>
        </div>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={closeModal}
          >
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold">{modalData.title}</h3>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
              <div className="text-gray-700">
                {modalData.content}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
