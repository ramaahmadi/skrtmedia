'use client';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { useState } from 'react';

const SigninPage = () => {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setError('');

    // Simple validation - allow any phone number format
    if (!phone || phone.length < 10) {
      setError('Nomor HP tidak valid');
      setIsLoggingIn(false);
      return;
    }

    try {
      // Check if phone number is the admin
      const isAdmin = phone === '082122451622';
      
      // Store phone in localStorage as auth token
      localStorage.setItem('auth_token', phone);
      localStorage.setItem('user_data', JSON.stringify({
        phone: phone,
        name: isAdmin ? 'RAMA' : 'Anggota',
        isAdmin: isAdmin
      }));
      
      console.log('Auth token stored:', localStorage.getItem('auth_token'));
      console.log('User data stored:', localStorage.getItem('user_data'));

      // Redirect to skrt-army after a small delay to ensure localStorage is set
      setTimeout(() => {
        router.push('/skrt-army');
      }, 100);
    } catch (error) {
      console.error('Error storing auth data:', error);
      setError('Terjadi kesalahan saat login. Silakan coba lagi.');
      setIsLoggingIn(false);
    }
  };

  return (
    <>
      <section className="relative z-10 overflow-hidden pt-36 pb-16 md:pb-20 lg:pt-[180px] lg:pb-28">
        <div className="container">
          <div className="-mx-4 flex flex-wrap">
            <div className="w-full px-4">
              <div className="shadow-three dark:bg-dark mx-auto max-w-[500px] rounded-sm bg-white px-6 py-10 sm:p-[60px]">
                <h3 className="mb-3 text-center text-2xl font-bold text-black sm:text-3xl dark:text-white">
                  🛡️ Dashboard Panitia
                </h3>
                <p className="text-body-color mb-11 text-center text-base font-medium">
                  Masuk ke dashboard panitia SKRT MEDIA
                </p>
                
                <form onSubmit={handleLogin} className="mb-6">
                  <div className="mb-4">
                    <label className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nomor Handphone
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Contoh: 08123456789"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-primary focus:outline-none dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                      required
                    />
                  </div>
                  
                  {error && (
                    <p className="mb-4 text-sm text-red-600 dark:text-red-400">
                      {error}
                    </p>
                  )}
                  
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="shadow-submit dark:shadow-submit-dark bg-primary hover:bg-primary/90 flex w-full items-center justify-center rounded-xs px-9 py-4 text-base font-medium text-white duration-300 disabled:opacity-50"
                  >
                    {isLoggingIn ? 'Memproses...' : 'Masuk'}
                  </button>
                </form>
                
                <div className="text-center">
                  <Link
                    href="/"
                    className="text-sm text-gray-500 hover:text-primary dark:text-gray-400"
                  >
                    ← Kembali ke Beranda
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute top-0 left-0 z-[-1]">
          <svg
            width="1440"
            height="969"
            viewBox="0 0 1440 969"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <mask
              id="mask0_95:1005"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="1440"
              height="969"
            >
              <rect width="1440" height="969" fill="#090E34" />
            </mask>
            <g mask="url(#mask0_95:1005)">
              <path
                opacity="0.1"
                d="M1086.96 297.978L632.959 554.978L935.625 535.926L1086.96 297.978Z"
                fill="url(#paint0_linear_95:1005)"
              />
              <path
                opacity="0.1"
                d="M1324.5 755.5L1450 687V886.5L1324.5 967.5L-10 288L1324.5 755.5Z"
                fill="url(#paint1_linear_95:1005)"
              />
            </g>
            <defs>
              <linearGradient
                id="paint0_linear_95:1005"
                x1="1178.4"
                y1="151.853"
                x2="780.959"
                y2="453.581"
                gradientUnits="userSpaceOfUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
              <linearGradient
                id="paint1_linear_95:1005"
                x1="160.5"
                y1="220"
                x2="1099.45"
                y2="1192.04"
                gradientUnits="userSpaceOfUse"
              >
                <stop stopColor="#4A6CF7" />
                <stop offset="1" stopColor="#4A6CF7" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </section>
    </>
  );
};

export default SigninPage;
