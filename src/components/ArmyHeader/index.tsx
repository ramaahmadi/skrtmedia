'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ArmyHeaderProps {
  username?: string;
  onLogout?: () => void;
}

const ArmyHeader = ({ username, onLogout }: ArmyHeaderProps) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    if (onLogout) {
      onLogout();
    } else {
      router.push('/');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 dark:bg-black dark:border-gray-800">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/skrt-army"
              className="text-2xl font-bold text-primary dark:text-white"
            >
              SKRT Army
            </Link>
            <span className="text-gray-400 dark:text-gray-600">|</span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Halo, <span className="font-semibold text-dark dark:text-white">{username}</span>
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-dark hover:text-primary dark:text-white dark:hover:text-primary transition"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default ArmyHeader;