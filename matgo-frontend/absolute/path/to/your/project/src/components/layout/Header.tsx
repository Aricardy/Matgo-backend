
"use client";

import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import MatGoIcon from '@/components/icons/MatGoIcon';
import { Button } from '@/components/ui/button';
import { Bell, ShieldAlert, UserCircle, Menu, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet";
import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const storedUser = localStorage.getItem('matgoUser');
    if (storedUser) {
      setIsLoggedIn(true);
      try {
        const userData = JSON.parse(storedUser);
        setUserName(userData.firstName || "User");
        setUserRole(userData.role || "passenger");
        // Simulate fetching unread notification count
        setUnreadNotifications(Math.floor(Math.random() * 5));
      } catch {
        setUserName("User");
        setUserRole("passenger");
      }
    } else {
      setIsLoggedIn(false);
      setUserName(null);
      setUserRole(null);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('matgoUser');
    window.location.href = "/login";
  };

  const getProfileLink = () => {
    switch (userRole) {
      case 'admin':
      case 'sacco_admin':
        return '/admin/profile';
      case 'driver':
      case 'conductor':
        return '/crew/profile';
      case 'passenger':
      default:
        return '/passenger/profile';
    }
  };
  
  const getNotificationsLink = () => {
     switch (userRole) {
      case 'admin':
      case 'sacco_admin':
        return '/admin/notifications';
      case 'driver':
      case 'conductor':
        return '/crew/notifications';
      case 'passenger':
      default:
        return '/passenger/notifications';
    }
  }

  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password' || pathname === '/reset-password' || pathname === '/terms';
  const isAdminPage = pathname.startsWith('/admin') || pathname.startsWith('/dashboard/sacco');
  const logoHref = isLoggedIn ? "/dashboard" : "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/85 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 print:hidden">
      <div className="container flex h-16 items-center justify-between">
        <Link href={logoHref} className="flex items-center gap-2 group">
          <MatGoIcon className="h-9 w-9 text-primary transition-transform duration-300 group-hover:scale-110 nganya-flash" style={{animationDuration: '2.5s'}} />
          <span className="font-headline text-3xl font-bold text-primary transition-colors duration-300 group-hover:text-primary/80">MatGo</span>
        </Link>
        
        {isLoggedIn && !isAdminPage && !isAuthPage && (
           <div className="hidden md:block text-sm text-muted-foreground">
             {language === 'KSW' ? 'Habari, ' : 'Hello, '} <span className="font-semibold text-primary">{userName}</span>
           </div>
        )}
        
        <div className="flex items-center gap-1 sm:gap-2">
            <LanguageToggle />
            <ThemeToggle />

            {isLoggedIn && !isAuthPage && (
              <>
                <Button variant="ghost" size="icon" asChild title={language === 'KSW' ? 'Arifa' : "Notifications"} className="relative">
                  <Link href={getNotificationsLink()}>
                    <Bell className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                        <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold">
                            {unreadNotifications}
                        </span>
                    )}
                    <span className="sr-only">{language === 'KSW' ? 'Arifa' : "Notifications"}</span>
                  </Link>
                </Button>

                <Button variant="ghost" size="icon" asChild title={isLoggedIn ? (language === 'KSW' ? 'Profaili Yangu' : "My Profile") : ""}>
                    <Link href={getProfileLink()}>
                        <UserCircle className="h-6 w-6" />
                        <span className="sr-only">{language === 'KSW' ? 'Profaili Yangu' : "My Profile"}</span>
                    </Link>
                </Button>
                
                {!isAdminPage && (
                    <div className="md:hidden">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Menu className="h-6 w-6" />
                          <span className="sr-only">{language === 'KSW' ? 'Fungua menyu' : 'Open menu'}</span>
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="right" className="w-[280px] bg-background p-4 flex flex-col">
                        <SheetHeader className="mb-4 text-left">
                          <SheetTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                             <MatGoIcon className="h-7 w-7 text-primary"/> MatGo Menu
                          </SheetTitle>
                          {userName && <SheetDescription>{language === 'KSW' ? 'Habari, ' : 'Hello, '} {userName}</SheetDescription>}
                        </SheetHeader>
                        
                        <div className="mt-auto border-t pt-4 space-y-2">
                            <SheetClose asChild>
                                <Button variant="ghost" className="w-full justify-start text-base py-3 text-destructive" asChild>
                                    <Link href="/sos"><ShieldAlert className="mr-2 h-5 w-5"/>{language === 'KSW' ? 'SOS / Dharura' : 'SOS / Emergency'}</Link>
                                </Button>
                            </SheetClose>
                            <SheetClose asChild>
                                <Button variant="outline" className="w-full justify-start text-base py-3" onClick={handleLogout}>
                                    <LogOut className="mr-2 h-5 w-5"/>{language === 'KSW' ? 'Ondoka' : 'Logout'}
                                </Button>
                            </SheetClose>
                        </div>
                      </SheetContent>
                    </Sheet>
                    </div>
                )}
              </>
            )}

            {!isLoggedIn && isAuthPage && (
                <Button variant="outline" asChild>
                    <Link href={pathname === '/login' ? '/signup' : '/login'}>
                        {pathname === '/login' ? (language === 'KSW' ? 'Jisajili' : 'Sign Up') : (language === 'KSW' ? 'Ingia' : 'Login')}
                    </Link>
                </Button>
            )}
        </div>
      </div>
    </header>
  );
}
