'use client';

import { useEffect, useState } from 'react';
import ArmyHeader from '@/components/ArmyHeader';

export default function SKRTArmyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [username, setUsername] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('user_data');
      if (user) {
        const userData = JSON.parse(user);
        setUsername(userData.name || 'Panitia');
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setUsername('');
      }
    };

    checkAuth();

    // Listen for storage changes (e.g., after login)
    const handleStorageChange = () => {
      checkAuth();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('custom-auth-change', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('custom-auth-change', handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setIsAuthenticated(false);
    setUsername('');
  };

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div>
      <ArmyHeader username={username} onLogout={handleLogout} />
      {children}
    </div>
  );
}
