
"use client";

import AdminLayout from "@/app/admin/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus, Bus, Users, MessageSquareWarning, ShieldCheck, BarChart2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface SaccoStats {
    busCount: number;
    staffCount: number;
    feedbackCount: number;
    complianceNotices: number;
}

export default function SaccoAdminDashboard() {
  const { language } = useLanguage();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<SaccoStats | null>(null);
  const [saccoName, setSaccoName] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('matgoToken');
      const user = localStorage.getItem('matgoUser');
      
      if (!token || !user) {
        router.push('/login');
        return;
      }

      const userData = JSON.parse(user);
      if (userData.role !== 'sacco_admin') {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('matgoToken');
      const storedUser = localStorage.getItem('matgoUser');
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setSaccoName(userData.saccoName || "Your SACCO");
          
          // Fetch SACCO dashboard stats from backend
          try {
            const response = await fetch('/api/sacco/dashboard-stats', {
              headers: {
                'Authorization': token ? `Bearer ${token}` : ''
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              setStats({
                busCount: data.busCount || data.totalVehicles || 0,
                staffCount: data.staffCount || data.totalStaff || 0,
                feedbackCount: data.feedbackCount || data.totalFeedback || 0,
                complianceNotices: data.complianceNotices || data.totalNotices || 0
              });
            } else {
              // Fallback: fetch individual endpoints
              await fetchIndividualStats(token, userData.saccoId || userData.sacco);
            }
          } catch (error) {
            console.error('Error fetching SACCO stats:', error);
            // Fallback: fetch individual endpoints
            await fetchIndividualStats(token, userData.saccoId || userData.sacco);
          }
        } catch (e) {
          console.error('Error parsing user data:', e);
          setStats({ busCount: 0, staffCount: 0, feedbackCount: 0, complianceNotices: 0 });
        }
      } else {
        setStats({ busCount: 0, staffCount: 0, feedbackCount: 0, complianceNotices: 0 });
      }
      
      setIsLoading(false);
    };

    const fetchIndividualStats = async (token: string | null, saccoId: string) => {
      try {
        // Fetch buses count
        const busesResponse = await fetch('/api/vehicles', {
          headers: { 'Authorization': token ? `Bearer ${token}` : '' }
        });
        let busCount = 0;
        if (busesResponse.ok) {
          const buses = await busesResponse.json();
          busCount = Array.isArray(buses) ? buses.filter((bus: any) => bus.saccoId === saccoId || bus.sacco === saccoId).length : 0;
        }

        // Fetch staff count
        const driversResponse = await fetch('/api/drivers', {
          headers: { 'Authorization': token ? `Bearer ${token}` : '' }
        });
        const conductorsResponse = await fetch('/api/conductors', {
          headers: { 'Authorization': token ? `Bearer ${token}` : '' }
        });
        
        let staffCount = 0;
        if (driversResponse.ok) {
          const drivers = await driversResponse.json();
          staffCount += Array.isArray(drivers) ? drivers.filter((driver: any) => driver.saccoId === saccoId || driver.sacco === saccoId).length : 0;
        }
        if (conductorsResponse.ok) {
          const conductors = await conductorsResponse.json();
          staffCount += Array.isArray(conductors) ? conductors.filter((conductor: any) => conductor.saccoId === saccoId || conductor.sacco === saccoId).length : 0;
        }

        // Fetch feedback count
        const feedbackResponse = await fetch('/api/feedback', {
          headers: { 'Authorization': token ? `Bearer ${token}` : '' }
        });
        let feedbackCount = 0;
        if (feedbackResponse.ok) {
          const feedback = await feedbackResponse.json();
          feedbackCount = Array.isArray(feedback) ? feedback.filter((fb: any) => fb.saccoId === saccoId || fb.sacco === saccoId).length : 0;
        }

        // Fetch compliance notices count
        const noticesResponse = await fetch('/api/compliance-notices', {
          headers: { 'Authorization': token ? `Bearer ${token}` : '' }
        });
        let complianceNotices = 0;
        if (noticesResponse.ok) {
          const notices = await noticesResponse.json();
          complianceNotices = Array.isArray(notices) ? notices.filter((notice: any) => notice.saccoId === saccoId || notice.sacco === saccoId).length : 0;
        }

        setStats({ busCount, staffCount, feedbackCount, complianceNotices });
      } catch (error) {
        console.error('Error fetching individual stats:', error);
        setStats({ busCount: 0, staffCount: 0, feedbackCount: 0, complianceNotices: 0 });
      }
    };

    fetchData();
  }, []);

  const content = {
    ENG: {
        saccoControlPanel: "SACCO Dashboard",
        saccoDescription: (name: string) => `Manage your fleet, crew, and reports for ${name}.`,
        totalBuses: "Total Buses Registered",
        totalStaff: "Total Drivers & Conductors",
        passengerFeedback: "Passenger Feedback",
        complianceNotices: "Compliance Notices",
        applyForSysAdmin: "Apply to Become System Admin",
        viewDetails: "View Details"
    },
    KSW: {
        saccoControlPanel: "Dashibodi ya SACCO",
        saccoDescription: (name: string) => `Simamia meli yako, wahudumu, na ripoti za ${name}.`,
        totalBuses: "Jumla ya Mabasi Yaliyosajiliwa",
        totalStaff: "Jumla ya Madereva na Makondakta",
        passengerFeedback: "Maoni ya Abiria",
        complianceNotices: "Notisi za Uzingatiaji",
        applyForSysAdmin: "Omba Kuwa Msimamizi Mkuu",
        viewDetails: "Tazama Maelezo"
    }
  };
  const currentContent = content[language];

  const statCards = [
    { title: currentContent.totalBuses, value: stats?.busCount ?? 0, Icon: Bus, color: "text-blue-500", href: "/dashboard/sacco/buses" },
    { title: currentContent.totalStaff, value: stats?.staffCount ?? 0, Icon: Users, color: "text-green-500", href: "/dashboard/sacco/personnel" },
    { title: currentContent.passengerFeedback, value: stats?.feedbackCount ?? 0, Icon: MessageSquareWarning, color: "text-purple-500", href: "/dashboard/sacco/feedback" },
    { title: currentContent.complianceNotices, value: stats?.complianceNotices ?? 0, Icon: ShieldCheck, color: "text-red-500", href: "/dashboard/sacco/compliance" },
  ];

  const renderLoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-32 w-full rounded-xl" />)}
      </div>
      <Skeleton className="h-20 w-full rounded-xl" />
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-8">
        <Card className="shadow-xl glassy-card">
          <CardHeader>
            <CardTitle className="font-headline text-3xl md:text-4xl text-primary flex items-center gap-3">
              {currentContent.saccoControlPanel}
            </CardTitle>
            <CardDescription className="text-base">{currentContent.saccoDescription(saccoName || "your SACCO")}</CardDescription>
          </CardHeader>
        </Card>

        {isLoading ? renderLoadingSkeleton() : (
            <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map(item => (
                <Card key={item.title} className="glassy-card border-l-4 hover:shadow-lg transition-shadow" style={{ borderColor: `hsl(var(--${item.color.split('-')[1]}))` }}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
                        <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                        <item.Icon className={cn("h-5 w-5", item.color)} />
                    </CardHeader>
                    <CardContent className="pb-4 px-4">
                        <div className="text-2xl font-bold">{item.value}</div>
                        <Link href={item.href}>
                            <p className="text-xs text-muted-foreground hover:text-primary underline-offset-2 hover:underline">{currentContent.viewDetails}</p>
                        </Link>
                    </CardContent>
                </Card>
                ))}
            </div>

            <Card className="glassy-card border-accent/50">
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="font-headline text-xl text-accent">{currentContent.applyForSysAdmin}</CardTitle>
                        <CardDescription>Request for elevated privileges to manage the entire MatGo system.</CardDescription>
                    </div>
                    <Link href="/apply/admin">
                        <Button className="btn-glow-accent">
                            <FilePlus className="mr-2 h-4 w-4"/>
                            Apply Now
                        </Button>
                    </Link>
                </CardHeader>
            </Card>
          </>
        )}
      </div>
    </AdminLayout>
  );
}
