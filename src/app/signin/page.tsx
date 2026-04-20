'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";

const SigninPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    phone: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize default admin in localStorage
  useState(() => {
    const savedMembers = JSON.parse(localStorage.getItem('skrt_members') || '[]');
    const adminPhone = '082122451622';
    
    // Check if admin already exists
    const adminExists = savedMembers.some((m: any) => m.phone === adminPhone);
    
    if (!adminExists) {
      const defaultAdmin = {
        id: 1,
        name: 'Admin SKRT',
        phone: adminPhone,
        isAdmin: true,
        createdAt: new Date().toISOString()
      };
      savedMembers.push(defaultAdmin);
      localStorage.setItem('skrt_members', JSON.stringify(savedMembers));
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const normalizePhone = (phone: string) => {
    return phone.replace(/[^0-9]/g, '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Normalize the input phone number
      const normalizedInputPhone = normalizePhone(formData.phone);
      
      // First check against stored members in localStorage
      const savedMembers = JSON.parse(localStorage.getItem('skrt_members') || '[]');
      console.log('Saved members:', savedMembers);
      console.log('Input phone:', formData.phone);
      console.log('Normalized input phone:', normalizedInputPhone);
      
      // Try to find member with exact match first
      let member = savedMembers.find((m: any) => m.phone === formData.phone);
      console.log('Exact match member:', member);
      
      // If not found, try with normalized phone numbers
      if (!member) {
        member = savedMembers.find((m: any) => normalizePhone(m.phone) === normalizedInputPhone);
        console.log('Normalized match member:', member);
      }

      if (member) {
        // Member found - allow login with any password
        const user = {
          id: member.id,
          name: member.name,
          phone: member.phone,
          role: member.isAdmin ? 'admin' : 'member',
          isAdmin: member.isAdmin
        };
        const token = btoa(JSON.stringify({ user, exp: Date.now() + 24 * 60 * 60 * 1000 }));
        localStorage.setItem('auth_token', token);
        localStorage.setItem('user_data', JSON.stringify(user));
        // Dispatch custom event to trigger header update
        window.dispatchEvent(new Event('custom-auth-change'));
        router.push('/skrt-army');
        return;
      }

      // If no member found, show error
      setError('Nomor HP tidak terdaftar sebagai anggota');
      setIsLoading(false);
      return;
    } catch (error) {
      console.error('Login error:', error);
      setError('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
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
                  🛡️ Login Panitia
                </h3>
                <p className="text-body-color mb-11 text-center text-base font-medium">
                  Masuk ke dashboard panitia SKRT MEDIA
                </p>
                
                {error && (
                  <div className="mb-6 rounded-lg bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-400">
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-8">
                    <label
                      htmlFor="phone"
                      className="text-dark mb-3 block text-sm dark:text-white"
                    >
                      Nomor HP
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Contoh: 08123456789"
                      className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden transition-all duration-300 dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
                      required
                    />
                  </div>
                  <div className="mb-8">
                    <label
                      htmlFor="password"
                      className="text-dark mb-3 block text-sm dark:text-white"
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      placeholder="Password bebas untuk anggota"
                      className="border-stroke dark:text-body-color-dark dark:shadow-two text-body-color focus:border-primary dark:focus:border-primary w-full rounded-xs border bg-[#f8f8f8] px-6 py-3 text-base outline-hidden transition-all duration-300 dark:border-transparent dark:bg-[#2C303B] dark:focus:shadow-none"
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="shadow-submit dark:shadow-submit-dark bg-primary hover:bg-primary/90 flex w-full items-center justify-center rounded-xs px-9 py-4 text-base font-medium text-white duration-300 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <svg className="mr-2 h-4 w-4 animate-spin" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Masuk...
                        </>
                      ) : 'Masuk'}
                    </button>
                  </div>
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
