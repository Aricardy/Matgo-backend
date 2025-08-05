
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FilePlus, Bus, Users, MessageSquareWarning, ShieldCheck } from "lucide-react";
import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

interface SaccoStats {
    busCount: number;
    staffCount: number;
    feedbackCount: number;
    complianceNotices: number;
}

export default function SaccoAdminDashboard() {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<SaccoStats | null>(null);
  const [saccoName, setSaccoName] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching dashboard data from API
    const fetchData = async () => {
      setIsLoading(true);
      // const response = await fetch('/api/sacco/dashboard-stats');
      // const data = await response.json();
      // setStats(data);
      // setSaccoName(data.saccoName);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStats({ busCount: 0, staffCount: 0, feedbackCount: 0, complianceNotices: 0 });
      // In a real app, this would come from the API/auth context
      const storedUser = localStorage.getItem('matgoUser');
      if (storedUser) {
        setSaccoName(JSON.parse(storedUser).saccoName || "Your SACCO");
      }
      setIsLoading(false);
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
    { title: currentContent.totalBuses, value: stats?.busCount ?? 0, Icon: Bus, color: "text-blue-500", href: "/admin/buses" },
    { title: currentContent.totalStaff, value: stats?.staffCount ?? 0, Icon: Users, color: "text-green-500", href: "/admin/personnel" },
    { title: currentContent.passengerFeedback, value: stats?.feedbackCount ?? 0, Icon: MessageSquareWarning, color: "text-purple-500", href: "/admin/reports" },
    { title: currentContent.complianceNotices, value: stats?.complianceNotices ?? 0, Icon: ShieldCheck, color: "text-red-500", href: "/admin/compliance" },
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
  );
}
