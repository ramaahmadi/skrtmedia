import Link from "next/link";
import { 
  FaLightbulb, 
  FaArrowUp, 
  FaUsers, 
  FaHeart,
  FaShieldAlt,
  FaHandsHelping,
  FaQuoteLeft,
  FaStar
} from "react-icons/fa";

const Tentang = ({ center = true }) => {
  return (
    <>
      {/* Tentang */}
      <section id="tentang-acara" className="py-20 bg-gradient-to-b from-white to-green-50/30 relative overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-20 h-20 bg-green-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-lime-200 rounded-full mix-blend-multiply filter blur-xl opacity-15"></div>
        </div>

        <div className="container mx-auto xxs:px-0 sm:px-4 md:px-6 relative z-10">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <FaLightbulb className="w-4 h-4" />
              <span>Hikmah Kurban</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Mengapa Kurban <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">Penting?</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {"Kurban adalah ibadah yang sangat mulia, mengajarkan kita tentang kepedulian, kebersamaan, dan rasa syukur. "} 
              {"Melalui kurban, kita tidak hanya mendekatkan diri kepada Allah, tetapi juga membantu sesama yang membutuhkan."}
            </p>
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Latar Belakang Card */}
            <div className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl border border-green-100 transition-all duration-500 transform hover:-translate-y-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 p-3 rounded-2xl">
                  <FaUsers className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Latar Belakang</h3>
                  <div className="w-12 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mt-2"></div>
                </div>
              </div>
              
              <div className="space-y-4">
                <p className="text-gray-700 leading-relaxed text-lg">
                  Ibadah kurban merupakan sunnah muakkad yang sangat dianjurkan bagi umat Muslim yang mampu. 
                  <span className="font-semibold text-green-600"> Ibadah ini mengajarkan kita tentang pengorbanan</span> 
                  , sebagaimana Nabi Ibrahim AS dan Ismail AS yang menunjukkan keteguhan iman yang luar biasa.
                </p>
                
                <div className="bg-green-50 rounded-2xl p-4 border-l-4 border-green-500">
                  <div className="flex items-start gap-3">
                    <FaQuoteLeft className="w-5 h-5 text-green-500 mt-1 flex-shrink-0" />
                    <p className="text-green-800 italic">
                      {`"Tiada amalan yang dilakukan manusia pada hari raya Idul Adha yang lebih dicintai Allah selain menyembelih hewan kurban. Sesungguhnya hewan kurban itu akan datang pada hari Kiamat dengan tanduk, kuku, dan bulunya."`}
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed">
                  Melalui program kurban ini, kami ingin memfasilitasi saudara-saudara kita untuk melaksanakan ibadah kurban dengan mudah, 
                  sekaligus menyalurkan daging kurban kepada yang berhak dan membutuhkan.
                </p>
              </div>
            </div>

            {/* Tujuan Kami Card */}
            <div className="group bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl border border-emerald-100 transition-all duration-500 transform hover:-translate-y-2">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-gradient-to-br from-emerald-500 to-green-500 p-3 rounded-2xl">
                  <FaArrowUp className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Tujuan Kami</h3>
                  <div className="w-12 h-1 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full mt-2"></div>
                </div>
              </div>

              <div className="space-y-6">
                {[
                  {
                    icon: FaShieldAlt,
                    title: "Mempermudah Ibadah Kurban",
                    description: "Menyediakan layanan kurban yang praktis dan terpercaya bagi umat Muslim.",
                    color: "from-green-500 to-emerald-500"
                  },
                  {
                    icon: FaHeart,
                    title: "Menyalurkan Kepada yang Berhak",
                    description: "Memastikan daging kurban sampai kepada fakir miskin dan yang berhak menerimanya.",
                    color: "from-red-500 to-pink-500"
                  },
                  {
                    icon: FaLightbulb,
                    title: "Menebar Kebaikan",
                    description: "Menyebarkan semangat berbagi dan kepedulian sosial di masyarakat.",
                    color: "from-amber-500 to-orange-500"
                  },
                  {
                    icon: FaHandsHelping,
                    title: "Membangun Ukhuwah",
                    description: "Mempererat tali persaudaraan antara sesama Muslim melalui kegiatan kurban bersama.",
                    color: "from-green-500 to-emerald-500"
                  }
                ].map((item, index) => (
                  <div key={index} className="flex items-start gap-4 group/item hover:bg-gray-50 p-3 rounded-2xl transition-all duration-300">
                    <div className={`bg-gradient-to-r ${item.color} p-2 rounded-xl flex-shrink-0 group-hover/item:scale-110 transition-transform duration-300`}>
                      <item.icon className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg mb-1">{item.title}</h4>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                    <FaStar className="w-4 h-4 text-amber-400 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 flex-shrink-0 mt-1" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Bottom */}
          <div className="text-center mt-12">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 text-white max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold mb-4">Siap Berbagi Kebaikan?</h3>
              <p className="text-green-100 mb-6 max-w-2xl mx-auto">
                Bergabunglah bersama kami dalam program kurban tahun ini. Jadikan momen Idul Adha ini sebagai sarana untuk meraih berkah dan membantu sesama.
              </p>
              <a 
                href="#detail-acara" 
                className="inline-flex items-center gap-2 bg-white text-green-600 hover:bg-green-50 font-bold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <FaHeart className="w-5 h-5" />
                <span>Daftar Kurban Sekarang</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Tentang;
