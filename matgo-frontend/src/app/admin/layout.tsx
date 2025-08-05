
"use client";

import React, { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Home,
  Building,
  Bus,
  UserCheck,
  Users,
  ClipboardList,
  MessageSquareWarning,
  Award,
  FileCheck,
  ShieldCheck,
  LineChart,
  User,
  LogOut,
  ChevronLeft,
  ChevronRight,
  FilePlus,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useLanguage();
  const [userRole, setUserRole] = useState<string | null>(null);
  const [saccoName, setSaccoName] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedUser = localStorage.getItem('matgoUser');
    if (storedUser) {
        try {
            const userData = JSON.parse(storedUser);
            const role = userData.role;
            if (role !== 'sacco_admin' && role !== 'admin') {
              router.push('/login');
            }
            setUserRole(role);
            if(role === 'sacco_admin') {
                setSaccoName(userData.saccoName);
            }
        } catch(e) {
            router.push('/login');
        }
    } else {
        router.push('/login');
    }
  }, [router]);

  const content = {
    ENG: {
        systemAdmin: "System Admin",
        saccoAdmin: "SACCO Admin",
        dashboard: "Dashboard",
        management: "Management",
        saccos: "Saccos",
        buses: "Buses & Nganyas",
        personnel: "Personnel",
        allUsers: "All Users",
        operations: "Operations",
        bookings: "Bookings",
        reports: "Passenger Reports",
        promotions: "Promotions",
        system: "System",
        approvals: "Approvals",
        auditLogs: "Audit Logs",
        profileSettings: "Profile & Settings",
        logout: "Logout",
        myFleet: "My Fleet",
        myCrew: "My Crew",
        saccoReports: "SACCO Reports",
        saccoProfile: "Sacco Profile",
        applyForSysAdmin: "Become System Admin",
        systemHealth: "System Health",
        maintenance: "Maintenance"
    },
    KSW: {
        systemAdmin: "Msimamizi Mkuu",
        saccoAdmin: "Msimamizi wa SACCO",
        dashboard: "Dashibodi",
        management: "Usimamizi",
        saccos: "Saccos",
        buses: "Mabasi na Nganya",
        personnel: "Wafanyikazi",
        allUsers: "Watumiaji Wote",
        operations: "Operesheni",
        bookings: "Uhifadhi",
        reports: "Ripoti za Abiria",
        promotions: "Matangazo",
        system: "Mfumo",
        approvals: "Idhini",
        auditLogs: "Kumbukumbu",
        profileSettings: "Profaili na Mipangilio",
        logout: "Ondoka",
        myFleet: "Meli Yangu",
        myCrew: "Wahudumu Wangu",
        saccoReports: "Ripoti za SACCO",
        saccoProfile: "Profaili ya Sacco",
        applyForSysAdmin: "Kuwa Msimamizi Mkuu",
        systemHealth: "Afya ya Mfumo",
        maintenance: "Matengenezo"
    }
  };
  const currentContent = content[language];
  
  const systemAdminNav = [
      { href: "/dashboard/admin", label: currentContent.dashboard, icon: Home },
      { type: 'group', label: currentContent.management, items: [
          { href: "/admin/saccos", label: currentContent.saccos, icon: Building },
          { href: "/admin/buses", label: currentContent.buses, icon: Bus },
          { href: "/admin/personnel", label: currentContent.personnel, icon: UserCheck },
          { href: "/admin/users", label: currentContent.allUsers, icon: Users },
      ]},
      { type: 'group', label: currentContent.operations, items: [
          { href: "/admin/bookings", label: currentContent.bookings, icon: ClipboardList },
          { href: "/admin/reports", label: currentContent.reports, icon: MessageSquareWarning },
          { href: "/admin/approvals", label: currentContent.approvals, icon: FileCheck },
          { href: "/dashboard/admin/promotions", label: currentContent.promotions, icon: Award },
      ]},
      { type: 'group', label: currentContent.system, items: [
          { href: "/admin/audit-logs", label: currentContent.auditLogs, icon: ShieldCheck },
          { href: "/admin/system-health", label: currentContent.systemHealth, icon: LineChart },
          { href: "/admin/maintenance", label: currentContent.maintenance, icon: Settings },
      ]}
  ];

  const saccoAdminNav = [
       { href: "/dashboard/sacco", label: currentContent.dashboard, icon: Home },
       { type: 'group', label: currentContent.management, items: [
          { href: "/admin/buses", label: currentContent.myFleet, icon: Bus },
          { href: "/admin/personnel", label: currentContent.myCrew, icon: UserCheck },
      ]},
       { type: 'group', label: currentContent.operations, items: [
          { href: "/admin/reports", label: currentContent.saccoReports, icon: MessageSquareWarning },
      ]},
      { href: "/profile/sacco", label: currentContent.saccoProfile, icon: Building }
  ];

  const navItems = userRole === 'admin' ? systemAdminNav : saccoAdminNav;

  const handleLogout = () => {
    localStorage.removeItem('matgoUser');
    router.push('/login');
  };

  if (!isClient || !userRole) {
    return <div className="h-screen w-screen flex items-center justify-center bg-background"><p>Loading...</p></div>;
  }

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="flex h-screen flex-col bg-muted/20">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <aside className={cn("admin-sidebar", isCollapsed ? "w-20" : "w-64")}>
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
                <div className={cn("flex items-center gap-2", isCollapsed && "hidden")}>
                    <Avatar className="h-10 w-10">
                    <AvatarImage src="/avatars/admin_avatar.png" alt="Admin"/>
                    <AvatarFallback>{saccoName?.[0] || 'A'}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col text-sm">
                        <span className="font-semibold text-foreground">{userRole === 'admin' ? currentContent.systemAdmin : saccoName || currentContent.saccoAdmin}</span>
                        <span className="text-xs text-muted-foreground">{userRole === 'admin' ? "Superuser" : "SACCO Manager"}</span>
                    </div>
                </div>
                <Button variant="ghost" size="icon" onClick={toggleSidebar} className="ml-auto">
                    {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
                </Button>
            </div>
            
            <nav className="flex-1 overflow-y-auto px-2 py-4 space-y-2">
              {navItems.map((item, index) => {
                if (item.type === 'group') {
                  return (
                    <div key={`${item.label}-${index}`} className="space-y-1">
                      {!isCollapsed && (
                        <h3 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{item.label}</h3>
                      )}
                      {item.items.map((subItem) => (
                        <Link href={subItem.href} key={subItem.href} title={subItem.label} className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                          pathname === subItem.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
                          isCollapsed && "justify-center"
                        )}>
                          <subItem.icon className="h-5 w-5 shrink-0" />
                          <span className={cn("truncate", isCollapsed && "hidden")}>{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  );
                }
                return (
                  <Link href={item.href} key={item.href} title={item.label} className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                    pathname === item.href ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
                    isCollapsed && "justify-center"
                  )}>
                    <item.icon className="h-5 w-5 shrink-0" />
                    <span className={cn("truncate", isCollapsed && "hidden")}>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-auto p-2 border-t border-border space-y-1">
                <Link href="/admin/profile" title={currentContent.profileSettings} className={cn("flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted", pathname === '/admin/profile' ? 'text-primary' : 'text-muted-foreground hover:text-foreground', isCollapsed && "justify-center")}>
                    <User className="h-5 w-5 shrink-0" />
                    <span className={cn(isCollapsed && "hidden")}>{currentContent.profileSettings}</span>
                </Link>
                <Button variant="ghost" onClick={handleLogout} title={currentContent.logout} className={cn("w-full flex items-center gap-3 justify-start px-3 py-2 text-sm font-medium transition-colors text-destructive hover:bg-destructive/10", isCollapsed && "justify-center")}>
                    <LogOut className="h-5 w-5 shrink-0" />
                    <span className={cn(isCollapsed && "hidden")}>{currentContent.logout}</span>
                </Button>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
