import Link from "next/link";
import Image from "next/image";
import { FaHandHoldingHeart, FaMicrophone } from "react-icons/fa";

const Beranda = ({ center = true }) => {
  // Data sponsor dan media partner
  return (
    <>
      {/* Beranda min-h-screen */}
      <section id="beranda" className="h-250 flex items-center relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-emerald-50 pt-24">
        
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
        </div>

        <div className="container mx-auto px-0 text-center relative z-10">
          {/* KURBAN Title */}
          <div className={`${center ? "flex items-center justify-center" : ""}`}>
            <div className="flex items-center justify-center gap-6 md:gap-8 px-6">
              <h1
                className="font-black text-6xl md:text-8xl lg:text-9xl"
                style={{ 
                  fontFamily: "Poppins, sans-serif",
                  background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text"
                }}
              >
                KURBAN
              </h1>
            </div>
          </div>

          {/* Subtitle */}
          <p className="text-sm xxs:text-sm sm:text-lg md:text-xl sm:mh-10 mt-6 max-w-2xl mx-auto text-[#0F172A] font-medium px-4">
            Berbagi kebaikan di hari raya, meraih berkah untuk selamanya. Kurban bukan sekadar ritual, melainkan wujud kepedulian dan rasa syukur kita kepada Allah SWT.
          </p>
          <br />
          <br />
          <p className="text-sm text-gray-500 italic sm:text-lg">{`"Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya."`}</p>

          {/* CTA Button */}
          <div className="mt-12">
            <a 
              href="#detail-acara" 
              className="inline-block bg-gradient-to-r from-[#16A34A] to-[#15803D] text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 hover:scale-105"
            >
              Lihat Detail & Daftar
            </a>
          </div>
        </div>
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-[#16A34A] rounded-full flex justify-center">
            <div className="w-1 h-3 bg-[#16A34A] rounded-full"></div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Beranda;
