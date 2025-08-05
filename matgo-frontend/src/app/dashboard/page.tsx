"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";
import AppLayout from "@/components/layout/AppLayout";
import { useLanguage } from "@/contexts/LanguageContext";

export default function DashboardRedirectPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [status, setStatus] = useState("Checking authentication...");

  useEffect(() => {
    const storedUser = localStorage.getItem('matgoUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        const role = userData.role || 'passenger';
        
        setStatus(`Role detected: ${role}. Redirecting...`);

        switch (role) {
          case 'admin':
            router.replace('/dashboard/admin');
            break;
          case 'sacco_admin':
            router.replace('/dashboard/sacco');
            break;
          case 'driver':
            router.replace('/dashboard/driver');
            break;
          case 'conductor':
            router.replace('/dashboard/conductor');
            break;
          case 'passenger':
          default:
            router.replace('/dashboard/passenger');
            break;
        }
      } catch (e) {
        setStatus("Error parsing user data. Redirecting to login...");
        router.replace('/login');
      }
    } else {
      setStatus("No user found. Redirecting to login...");
      router.replace('/login');
    }
  }, [router]);

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <div className="text-center text-muted-foreground">{language === 'KSW' ? 'Inaelekeza...' : status}</div>
        <Skeleton className="h-24 w-full rounded-xl"/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-48 w-full rounded-xl"/>
            <Skeleton className="h-48 w-full rounded-xl"/>
        </div>
      </div>
    </AppLayout>
  );
}
