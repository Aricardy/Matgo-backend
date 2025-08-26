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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
        const response = await fetch(`${apiUrl}/auth/me`, { credentials: "include" });
        if (!response.ok) throw new Error("Not authenticated");

        const payload = await response.json();
        const userData = payload.user || payload; // support both shapes
        const role = userData.role || "passenger";

        setStatus(`Role detected: ${role}. Redirecting...`);

        switch (role) {
          case "admin":
            router.replace("/dashboard/admin");
            break;
          case "sacco_admin":
            router.replace("/dashboard/sacco");
            break;
          case "driver":
            router.replace("/dashboard/driver");
            break;
          case "conductor":
            router.replace("/dashboard/conductor");
            break;
          case "passenger":
          default:
            router.replace("/dashboard/passenger");
            break;
        }
      } catch (error) {
        setStatus("Authentication failed. Redirecting to login...");
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, [router]);

  if (loading) {
    return (
      <AppLayout>
        <div className="space-y-8 animate-fade-in">
          <div className="text-center text-muted-foreground">
            {language === "KSW" ? "Inaelekeza..." : status}
          </div>
          <Skeleton className="h-24 w-full rounded-xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-48 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </AppLayout>
    );
  }

  return null;
}
