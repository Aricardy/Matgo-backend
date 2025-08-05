
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminRootPage() {
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('matgoUser');
    let userRole = 'passenger'; 
    if (storedUser) {
        try {
            userRole = JSON.parse(storedUser).role;
        } catch (e) { /* default to passenger */ }
    }
    
    if (userRole === 'admin') {
      router.replace('/dashboard/admin');
    } else if (userRole === 'sacco_admin') {
      router.replace('/dashboard/sacco');
    } else {
      router.replace('/login');
    }
  }, [router]);

  return (
    <div className="h-screen w-screen flex items-center justify-center bg-background">
      <div className="space-y-4 w-full p-8">
        <Skeleton className="h-12 w-1/3" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    </div>
  );
}
