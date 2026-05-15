"use client";
import React, { useState } from "react";
import { HiLocationMarker, HiClipboardList, HiAdjustments } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";

const Detail = () => {
  const [activeTab, setActiveTab] = useState("lokasi");

  return (
    <>
      <section id="detail-acara" className="bg-green-50/30 py-16">
        <div className="container mx-auto xxs:px-0 sm:px-4 md:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-gray-900">
            Semua yang Perlu Kamu Tahu
          </h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              {/* Tab Navigation */}
              <div className="flex flex-wrap justify-center gap-2 mb-8 border-b border-gray-200 pb-4">
                {[
                  { key: "lokasi", label: "Lokasi", icon: HiLocationMarker },
                  { key: "pendaftaran", label: "Pendaftaran", icon: HiClipboardList },
                  { key: "rundown", label: "Rundown", icon: MdDashboard },
                  { key: "tata-tertib", label: "Tata Tertib", icon: HiAdjustments },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                      activeTab === tab.key
                        ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="min-h-[300px]">
                {activeTab === "lokasi" && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                        <HiLocationMarker className="w-6 h-6 text-green-600" />
                        Lokasi Pelaksanaan
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="bg-green-500 text-white p-3 rounded-lg">
                            <HiLocationMarker className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg text-gray-900">Lokasi Pemotongan</h4>
                            <p className="text-gray-600">Masjid Agung Karawang & Lokasi Tersebar di Karawang</p>
                          </div>
                        </div>
                        <div className="flex items-start gap-4">
                          <div className="bg-emerald-500 text-white p-3 rounded-lg">
                            <HiClipboardList className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-lg text-gray-900">Waktu Pelaksanaan</h4>
                            <p className="text-gray-600">10 Dzulhijjah 1446 H (Idul Adha)</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <a
                        href="#pendaftaran"
                        onClick={() => setActiveTab("pendaftaran")}
                        className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold py-3 px-8 rounded-xl hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                      >
                        Daftar Sekarang
                      </a>
                    </div>
                  </div>
                )}

                {activeTab === "pendaftaran" && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <HiClipboardList className="w-6 h-6 text-green-600" />
                        Cara Pendaftaran Kurban
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            step: "1",
                            title: "Pilih Paket Kurban",
                            description: "Pilih jenis hewan kurban yang Anda inginkan (Sapi, Kambing, atau Domba)"
                          },
                          {
                            step: "2",
                            title: "Isi Formulir",
                            description: "Lengkapi data diri Anda pada formulir pendaftaran"
                          },
                          {
                            step: "3",
                            title: "Lakukan Pembayaran",
                            description: "Transfer pembayaran ke rekening yang tersedia"
                          },
                          {
                            step: "4",
                            title: "Konfirmasi",
                            description: "Kirim bukti pembayaran untuk konfirmasi"
                          }
                        ].map((item, index) => (
                          <div key={index} className="flex items-start gap-4">
                            <div className="bg-green-500 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                              {item.step}
                            </div>
                            <div>
                              <h4 className="font-semibold text-lg text-gray-900">{item.title}</h4>
                              <p className="text-gray-600">{item.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Paket Kurban */}
                    <div className="grid md:grid-cols-3 gap-4">
                      {[
                        { name: "Kambing/Domba", price: "Rp 2.500.000", icon: "🐐" },
                        { name: "Sapi Kerbau", price: "Rp 18.000.000", icon: "🐂" },
                        { name: "Sapi Limosin", price: "Rp 25.000.000", icon: "🐄" }
                      ].map((paket, index) => (
                        <div key={index} className="bg-white border-2 border-green-200 rounded-xl p-6 text-center hover:border-green-500 transition-colors">
                          <div className="text-5xl mb-4">{paket.icon}</div>
                          <h4 className="font-bold text-lg text-gray-900 mb-2">{paket.name}</h4>
                          <p className="text-2xl font-bold text-green-600 mb-4">{paket.price}</p>
                          <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors font-semibold">
                            Pilih Paket
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "rundown" && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <MdDashboard className="w-6 h-6 text-green-600" />
                        Rundown Acara
                      </h3>
                      <div className="space-y-4">
                        {[
                          { time: "06:00 - 07:00", activity: "Persiapan & Pengecekan Hewan" },
                          { time: "07:00 - 08:00", activity: "Sholat Idul Adha" },
                          { time: "08:00 - 12:00", activity: "Pelaksanaan Pemotongan Kurban" },
                          { time: "12:00 - 14:00", activity: "Pengolahan & Pembagian Daging" },
                          { time: "14:00 - 16:00", activity: "Distribusi ke Penerima Hak" },
                          { time: "16:00 - 17:00", activity: "Penutupan & Doa" }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                            <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-bold min-w-[120px] text-center">
                              {item.time}
                            </div>
                            <p className="text-gray-700">{item.activity}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "tata-tertib" && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
                      <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <HiAdjustments className="w-6 h-6 text-green-600" />
                        Tata Tertib Kurban
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {[
                          { icon: "🕌", text: "Berniat karena Allah SWT" },
                          { icon: "📋", text: "Mendaftar sesuai ketentuan waktu" },
                          { icon: "💰", text: "Melunasi pembayaran sebelum tanggal kurban" },
                          { icon: "🤝", text: "Mematuhi aturan yang berlaku" },
                          { icon: "📞", text: "Konfirmasi jika ada perubahan" },
                          { icon: "❤️", text: "Berharap pahala dan ridho Allah" }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm">
                            <span className="text-3xl">{item.icon}</span>
                            <p className="text-gray-700 font-medium">{item.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Contact Info */}
                    <div className="bg-white rounded-xl p-6 border border-green-200">
                      <h4 className="font-bold text-lg text-gray-900 mb-4">Informasi Kontak</h4>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-500 text-white p-2 rounded-lg">
                            <HiLocationMarker className="w-5 h-5" />
                          </div>
                          <p className="text-gray-700">Masjid Agung Karawang, Jawa Barat</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-green-500 text-white p-2 rounded-lg">
                            <HiClipboardList className="w-5 h-5" />
                          </div>
                          <p className="text-gray-700">WhatsApp: +62 812-3456-7890</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="bg-green-500 text-white p-2 rounded-lg">
                            <HiClipboardList className="w-5 h-5" />
                          </div>
                          <p className="text-gray-700">Email: kurban@skrtmedia.com</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Detail;
