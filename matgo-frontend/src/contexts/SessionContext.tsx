
"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'passenger' | 'crew' | 'admin';
  [key: string]: any;
}

interface SessionContextType {
  user: User | null;
  role: User['role'] | null;
  token: string | null;
  setSession: (user: User, token: string) => void;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const role = user?.role || null;

  useEffect(() => {
    // Optionally, load session from localStorage
    const stored = localStorage.getItem('matgo-session');
    if (stored) {
      const { user, token } = JSON.parse(stored);
      setUser(user);
      setToken(token);
    }
  }, []);

  const setSession = (user: User, token: string) => {
    setUser(user);
    setToken(token);
    localStorage.setItem('matgo-session', JSON.stringify({ user, token }));
  };

  const clearSession = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('matgo-session');
  };

  return (
    <SessionContext.Provider value={{ user, role, token, setSession, clearSession }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used within a SessionProvider');
  return ctx;
};
