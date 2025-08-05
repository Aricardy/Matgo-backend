
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BookUser, MapPinned, UserCircle, ShieldAlert, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLanguage } from '@/contexts/LanguageContext';
import React, { useState, useEffect } from 'react';

const passengerNavItems = {
  ENG: [
    { href: '/dashboard/passenger', label: 'Home', icon: Home },
    { href: '/book', label: 'Book', icon: BookUser },
    { href: '/roadtrip', label: 'Roadtrip', icon: MapPinned },
    { href: '/scan', label: 'Pay', icon: QrCode },
    { href: '/sos', label: 'SOS', icon: ShieldAlert },
    { href: '/passenger/profile', label: 'Profile', icon: UserCircle },
  ],
  KSW: [
    { href: '/dashboard/passenger', label: 'Nyumbani', icon: Home },
    { href: '/book', label: 'Agiza', icon: BookUser },
    { href: '/roadtrip', label: 'Roadtrip', icon: MapPinned },
    { href: '/scan', label: 'Lipa', icon: QrCode },
    { href: '/sos', label: 'SOS', icon: ShieldAlert },
    { href: '/passenger/profile', label: 'Profaili', icon: UserCircle },
  ]
};

const crewNavItems = {
  ENG: [
    { href: '/crew/dashboard', label: 'Dashboard', icon: Home },
    { href: '/scan', label: 'Scan', icon: QrCode },
    { href: '/crew/profile', label: 'Profile', icon: UserCircle },
  ],
  KSW: [
    { href: '/crew/dashboard', label: 'Dashibodi', icon: Home },
    { href: '/scan', label: 'Skani', icon: QrCode },
    { href: '/crew/profile', label: 'Profaili', icon: UserCircle },
  ]
}

export default function BottomNav() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('matgoUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserRole(userData.role || 'passenger'); 
      } catch {
        setUserRole('passenger');
      }
    }
  }, []);

  const noNavPages = ['/', '/login', '/signup', '/terms', '/privacy', '/forgot-password', '/reset-password'];
  const isAdminPage = pathname.startsWith('/admin') || pathname.startsWith('/dashboard/sacco');

  if (noNavPages.includes(pathname) || isAdminPage) {
    return null;
  }
  
  let currentNavConfig;
  if (userRole === 'driver' || userRole === 'conductor') {
    currentNavConfig = crewNavItems;
  } else {
    currentNavConfig = passengerNavItems;
  }
  
  const currentNavItems = currentNavConfig[language] || currentNavConfig.ENG;
  const itemCount = currentNavItems.length;

  return (
    <nav className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg z-40 glassmorphic-nav rounded-2xl shadow-2xl print:hidden">
      <div 
        className="mx-auto grid h-16 items-center justify-around px-1 sm:px-2"
        style={{gridTemplateColumns: `repeat(${itemCount}, 1fr)`}}
      >
        {currentNavItems.map((item) => {
          let isActive;
          if (item.href === '/dashboard/passenger' || item.href === '/crew/dashboard') {
            isActive = pathname === item.href;
          } else {
            isActive = pathname.startsWith(item.href);
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center p-0.5 rounded-md transition-all duration-200 ease-in-out group text-center",
                isActive 
                  ? "text-primary scale-110" 
                  : "text-foreground/70 hover:text-primary hover:scale-105"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className={cn(
                "h-5 w-5 sm:h-[22px] sm:w-[22px] transition-transform duration-200 ease-in-out",
                isActive ? "transform scale-110" : "group-hover:scale-110"
              )} />
              <span className={cn(
                "mt-0.5 text-[9px] sm:text-[10px] font-medium leading-tight transition-opacity duration-200 ease-in-out",
                 isActive ? "opacity-100 font-bold" : "opacity-90 group-hover:opacity-100"
              )}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
