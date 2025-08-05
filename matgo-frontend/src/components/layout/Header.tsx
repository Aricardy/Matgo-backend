
"use client";

import Link from 'next/link';
import ThemeToggle from '@/components/ThemeToggle';
import LanguageToggle from '@/components/LanguageToggle';
import MatGoIcon from '@/components/icons/MatGoIcon';
import { Button } from '@/components/ui/button';
import { Bell, ShieldAlert, UserCircle, Menu, LogOut, Palette, HelpCircle, Coins, UserCog, LineChart, MessageSquareWarning, ClipboardList, Car, BusFront, MapPinned, User } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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
import { api } from '@/lib/api';


export default function Header() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = localStorage.getItem('matgoUser');
      const token = localStorage.getItem('matgoToken');
      
      if (storedUser && token) {
        try {
          // First set from localStorage for immediate display
          const userData = JSON.parse(storedUser);
          setIsLoggedIn(true);
          setUserName(userData.firstName || userData.fullName?.split(' ')[0] || "User");
          setUserRole(userData.role || 'passenger');
          
          // Then fetch fresh data from backend using the API client
          const profile = await api.get('/auth/profile');
          
          // Update state with fresh data
          setUserName(profile.firstName || profile.fullName?.split(' ')[0] || "User");
          setUserRole(profile.role || 'passenger');
          
          // Update localStorage with fresh data
          localStorage.setItem('matgoUser', JSON.stringify(profile));
        } catch (error) {
          console.error('Error fetching user data:', error);
          setIsLoggedIn(false);
        }
      } else {
        setIsLoggedIn(false);
      }
    };
    
    fetchUserData();
  }, [pathname]);

  const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password' || pathname === '/reset-password';
  const showAppNav = !isAuthPage && pathname !== '/';

  const handleLogout = () => {
    localStorage.removeItem('matgoUser');
    localStorage.removeItem('matgoToken');
    setIsLoggedIn(false);
    setUserName(null);
    setUserRole(null);
    
    // Show goodbye message and redirect to landing page
    const goodbyeMessage = language === 'KSW' ? 'Kwaheri! Asante kwa kutumia MatGo.' : 'Goodbye! Thank you for using MatGo.';
    
    // Create a temporary overlay with goodbye message
    const overlay = document.createElement('div');
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      z-index: 9999;
      color: white;
      font-family: system-ui, -apple-system, sans-serif;
    `;
    
    overlay.innerHTML = `
      <div style="text-align: center; animation: fadeIn 0.5s ease-in;">
        <h1 style="font-size: 3rem; margin-bottom: 1rem; font-weight: bold;">MatGo</h1>
        <p style="font-size: 1.5rem; margin-bottom: 2rem;">${goodbyeMessage}</p>
        <div style="width: 50px; height: 50px; border: 3px solid rgba(255,255,255,0.3); border-top: 3px solid white; border-radius: 50%; animation: spin 1s linear infinite;"></div>
      </div>
      <style>
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    `;
    
    document.body.appendChild(overlay);
    
    // Redirect to landing page after 2 seconds
    setTimeout(() => {
      window.location.href = "/";
    }, 2000);
  };
  
  const logoHref = isLoggedIn ? "/dashboard" : "/";

  // Define a type for navigation links that may have an icon
  type NavLink = {
    href: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
  };
  
  const passengerNavLinks: Record<string, NavLink[]> = {
    ENG: [
      { href: "/dashboard", label: "Dashboard" },
      { href: "/booking", label: "Book Trip" },
      { href: "/roadtrip", label: "RoadTrip Planner" },
      { href: "/nganya-gallery", label: "Nganya Gallery", icon: Palette },
      { href: "/fare-calculator", label: "Fare Calculator", icon: Coins },
      { href: "/lost-found", label: "Lost & Found", icon: HelpCircle },
      { href: "/notifications", label: "Notifications", icon: Bell },
      { href: "/profile", label: "My Profile" },
    ],
    KSW: [
      { href: "/dashboard", label: "Dashibodi" },
      { href: "/booking", label: "Agiza Safari" },
      { href: "/roadtrip", label: "Mpangaji wa RoadTrip" },
      { href: "/nganya-gallery", label: "Maonyesho ya Nganya", icon: Palette },
      { href: "/fare-calculator", label: "Kikokotoo cha Nauli", icon: Coins },
      { href: "/lost-found", label: "Vilivyopotea/Kupatikana", icon: HelpCircle },
      { href: "/notifications", label: "Arifa", icon: Bell },
      { href: "/profile", label: "Profaili Yangu" },
    ]
  };
  
  const adminNavLinks: Record<string, NavLink[]> = {
    ENG: [
      { href: "/admin", label: "Admin Dashboard" },
      { href: "/admin#users", label: "All Users", icon: UserCog },
      { href: "/admin#saccos", label: "Saccos", icon: Car },
      { href: "/admin#buses", label: "Buses", icon: BusFront },
      { href: "/admin#system_health", label: "System Health", icon: LineChart },
      { href: "/admin#reports", label: "Passenger Reports", icon: MessageSquareWarning},
      { href: "/admin#audit_logs", label: "Audit Logs", icon: ClipboardList },
      { href: "/profile", label: "My Profile" }, 
    ],
    KSW: [
      { href: "/admin", label: "Dashibodi ya Msimamizi" },
      { href: "/admin#users", label: "Watumiaji Wote", icon: UserCog },
      { href: "/admin#saccos", label: "Saccos", icon: Car },
      { href: "/admin#buses", label: "Mabasi", icon: BusFront },
      { href: "/admin#system_health", label: "Afya ya Mfumo", icon: LineChart },
      { href: "/admin#reports", label: "Ripoti za Abiria", icon: MessageSquareWarning},
      { href: "/admin#audit_logs", label: "Kumbukumbu za Ukaguzi", icon: ClipboardList },
      { href: "/profile", label: "Profaili Yangu" },
    ]
  };
  
  const saccoAdminNavLinks: Record<string, NavLink[]> = {
    ENG: [
      { href: "/admin", label: "Sacco Dashboard" }, 
      { href: "/admin#buses", label: "My Fleet", icon: BusFront }, 
      { href: "/admin#personnel", label: "My Crew", icon: UserCog }, 
      { href: "/admin#reports", label: "SACCO Reports", icon: MessageSquareWarning }, 
      { href: "/profile", label: "My Profile" },
    ],
    KSW: [
      { href: "/admin", label: "Dashibodi ya Sacco" },
      { href: "/admin#buses", label: "Meli Yangu", icon: BusFront },
      { href: "/admin#personnel", label: "Wahudumu Wangu", icon: UserCog },
      { href: "/admin#reports", label: "Ripoti za SACCO", icon: MessageSquareWarning },
      { href: "/profile", label: "Profaili Yangu" },
    ]
  };
  
  const crewNavLinks: Record<string, NavLink[]> = {
    ENG: [
      { href: "/crew/dashboard", label: "Crew Dashboard" },
      { href: "/profile", label: "My Profile" },
    ],
    KSW: [
      { href: "/crew/dashboard", label: "Dashibodi ya Wahudumu" },
      { href: "/profile", label: "Profaili Yangu" },
    ]
  };

  let currentNavLinksSet;
  let greetingName = "User"; // Default greeting
  let roleDisplay = userRole;

  if (isLoggedIn) {
    if (userRole === 'admin') {
      currentNavLinksSet = adminNavLinks;
      greetingName = "Admin";
    } else if (userRole === 'sacco_admin') {
      currentNavLinksSet = saccoAdminNavLinks;
      greetingName = userName || "Sacco Admin";
    } else if (userRole === 'driver' || userRole === 'conductor') {
      currentNavLinksSet = crewNavLinks;
      greetingName = userName || "Crew Member";
    } else { 
      currentNavLinksSet = passengerNavLinks;
      greetingName = userName || "Passenger";
    }
  } else {
    currentNavLinksSet = passengerNavLinks; // Default for non-logged in state
  }
  
  const visibleNavLinks = currentNavLinksSet[language] || currentNavLinksSet.ENG;

  const commonControls = (
    <>
      <LanguageToggle />
      <ThemeToggle />
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-background/85 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 print:hidden">
      <div className="container flex h-16 items-center justify-between">
        <Link href={logoHref} className="flex items-center gap-2 group">
          <MatGoIcon className="h-9 w-9 text-primary transition-transform duration-300 group-hover:scale-110 nganya-flash" style={{animationDuration: '2.5s'}} />
          <span className="font-headline text-3xl font-bold text-primary transition-colors duration-300 group-hover:text-primary/80">MatGo</span>
        </Link>
        
        {isLoggedIn && showAppNav && (
           <div className="hidden md:block text-sm text-muted-foreground">
             {language === 'KSW' ? 'Habari, ' : 'Hello, '} <span className="font-semibold text-primary">{greetingName}</span>
           </div>
        )}
        
        {showAppNav ? (
          <>
          <nav className="hidden md:flex items-center gap-1">
            {/* Dynamic notification icon route */}
            <Button variant="ghost" size="icon" asChild title={language === 'KSW' ? 'Arifa' : "Notifications"}>
              <Link href={
                userRole === 'admin' ? '/admin/notifications'
                : userRole === 'crew' ? '/crew/notifications'
                : userRole === 'sacco_admin' ? '/sacco_admin/notifications'
                : '/passenger/notifications'
              }>
                <Bell className="h-5 w-5" />
                <span className="sr-only">{language === 'KSW' ? 'Arifa' : "Notifications"}</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild title={language === 'KSW' ? 'SOS/Dharura' : "SOS/Emergency"}>
              <Link href="/sos">
                <ShieldAlert className="h-5 w-5 text-destructive" /> 
                <span className="sr-only">SOS</span>
              </Link>
            </Button>
            {commonControls}
             {isLoggedIn && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="ml-1" title={language === 'KSW' ? 'Akaunti Yangu' : "My Account"}>
                      <UserCircle className="h-6 w-6" />
                      <span className="sr-only">{language === 'KSW' ? 'Akaunti Yangu' : "My Account"}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem asChild>
                      <Link href={
                        userRole === 'admin' ? '/admin/profile'
                        : userRole === 'crew' ? '/crew/profile'
                        : userRole === 'sacco_admin' ? '/sacco_admin/profile'
                        : '/profile'
                      } className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        {language === 'KSW' ? 'Akaunti Yangu' : 'My Account'}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="flex items-center text-destructive focus:text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      {language === 'KSW' ? 'Ondoka' : 'Logout'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
             )}
          </nav>
          
          <div className="md:hidden flex items-center gap-0.5">
            {commonControls}
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
                  {isLoggedIn && <SheetDescription>{language === 'KSW' ? 'Habari, ' : 'Hello, '} {greetingName}</SheetDescription>}
                </SheetHeader>
                <nav className="flex flex-col gap-2 flex-1 overflow-y-auto">
                  {visibleNavLinks.map(link => (
                     <SheetClose asChild key={link.href}>
                        <Button variant={pathname === link.href || (pathname.startsWith(link.href + "/")) || (pathname.startsWith(link.href + "#") && link.href !== '/dashboard' && link.href !== '/admin' && link.href !== '/crew/dashboard') ? "default" : "ghost"} className="justify-start text-base py-3" asChild>
                            <Link href={link.href} className="flex items-center gap-2">
                                {link.icon && <link.icon className="h-5 w-5"/>}
                                {link.label}
                            </Link>
                        </Button>
                     </SheetClose>
                  ))}
                </nav>
                <div className="mt-auto border-t pt-4 space-y-2">
                    <SheetClose asChild>
                        <Button variant="ghost" className="w-full justify-start text-base py-3 text-destructive" asChild>
                            <Link href="/sos"><ShieldAlert className="mr-2 h-5 w-5"/>{language === 'KSW' ? 'SOS / Dharura' : 'SOS / Emergency'}</Link>
                        </Button>
                    </SheetClose>
                     {isLoggedIn && (
                        <SheetClose asChild>
                            <Button variant="outline" className="w-full justify-start text-base py-3" onClick={handleLogout}>
                                <LogOut className="mr-2 h-5 w-5"/>{language === 'KSW' ? 'Ondoka' : 'Logout'}
                            </Button>
                        </SheetClose>
                     )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
          </>
        ) : (
           <div className="flex items-center gap-1 sm:gap-2">
            {commonControls}
            {!isLoggedIn && isAuthPage && (
                <Button variant="outline" asChild>
                    <Link href={pathname === '/login' ? '/signup' : '/login'}>
                        {pathname === '/login' ? (language === 'KSW' ? 'Jisajili' : 'Sign Up') : (language === 'KSW' ? 'Ingia' : 'Login')}
                    </Link>
                </Button>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
