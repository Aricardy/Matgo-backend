
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Building, Bus, UserCheck, AlertCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart as RechartsBarChart } from 'recharts';
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

type MonthlyAnalytics = { month: string; totalBookings: number; revenue: number; reports: number; };

const chartConfig = {
  totalBookings: { label: "Total Bookings", color: "hsl(var(--chart-1))" },
  revenue: { label: "Revenue (Ksh)", color: "hsl(var(--chart-2))" },
  reports: { label: "Passenger Reports", color: "hsl(var(--chart-3))" }
} satisfies React.ComponentProps<typeof ChartContainer>["config"];

export default function SystemAdminDashboard() {
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  // Data states - should be populated from backend
  const [saccoCount, setSaccoCount] = useState(0);
  const [busCount, setBusCount] = useState(0);
  const [personnelCount, setPersonnelCount] = useState(0);
  const [pendingReportsCount, setPendingReportsCount] = useState(0);
  const [monthlyAnalytics, setMonthlyAnalytics] = useState<MonthlyAnalytics[]>([]);

  useEffect(() => {
    // Simulate fetching dashboard data from API
    const fetchData = async () => {
      setIsLoading(true);
      // const response = await fetch('/api/admin/dashboard-stats');
      // const data = await response.json();
      // setSaccoCount(data.saccoCount);
      // ... etc.
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Set to 0 as no data is fetched
      setSaccoCount(0);
      setBusCount(0);
      setPersonnelCount(0);
      setPendingReportsCount(0);
      setMonthlyAnalytics([]);
      setIsLoading(false);
    };

    fetchData();
  }, []);

  const content = {
    ENG: {
        adminControlPanel: "System Admin Dashboard",
        adminDescription: "Oversee the entire MatGo ecosystem, manage entities, and monitor system health.",
        systemAnalyticsOverview: "System-Wide Analytics Overview",
        totalSaccos: "Total Saccos",
        totalBuses: "Total Buses",
        activePersonnel: "Active Personnel",
        pendingReports: "Pending Reports",
        noData: "No analytics data available to display.",
    },
    KSW: {
        adminControlPanel: "Dashibodi ya Msimamizi Mkuu",
        adminDescription: "Simamia mfumo mzima wa MatGo, dhibiti huluki, na fuatilia afya ya mfumo.",
        systemAnalyticsOverview: "Muhtasari wa Uchanganuzi wa Mfumo Mzima",
        totalSaccos: "Jumla ya Saccos",
        totalBuses: "Jumla ya Mabasi",
        activePersonnel: "Wafanyikazi Hai",
        pendingReports: "Ripoti Zinazosubiri",
        noData: "Hakuna data ya uchanganuzi inayopatikana.",
    }
  };
  const currentContent = content[language];

  const analyticsCards = [
    { title: currentContent.totalSaccos, value: saccoCount, Icon: Building, color: "text-blue-500" },
    { title: currentContent.totalBuses, value: busCount, Icon: Bus, color: "text-green-500" },
    { title: currentContent.activePersonnel, value: personnelCount, Icon: UserCheck, color: "text-purple-500" },
    { title: currentContent.pendingReports, value: pendingReportsCount, Icon: AlertCircle, color: "text-red-500" },
  ];

  const renderLoadingSkeleton = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28 w-full rounded-xl" />)}
      </div>
      <Skeleton className="h-96 w-full rounded-xl" />
    </div>
  );

  return (
      <div className="space-y-8">
        <Card className="shadow-xl glassy-card">
          <CardHeader>
            <CardTitle className="font-headline text-3xl md:text-4xl text-primary flex items-center gap-3">
              {currentContent.adminControlPanel}
            </CardTitle>
            <CardDescription className="text-base">{currentContent.adminDescription}</CardDescription>
          </CardHeader>
        </Card>

        {isLoading ? renderLoadingSkeleton() : (
          <Card className="shadow-lg glassy-card">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2">
                <BarChart2 className="h-6 w-6" />{currentContent.systemAnalyticsOverview}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {analyticsCards.map(item => (
                  <Card key={item.title} className="glassy-card border-l-4" style={{ borderColor: `hsl(var(--${item.color.split('-')[1]}))` }}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 pt-4 px-4">
                      <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                      <item.Icon className={cn("h-5 w-5", item.color)} />
                    </CardHeader>
                    <CardContent className="pb-4 px-4"><div className="text-2xl font-bold">{item.value}</div></CardContent>
                  </Card>
                ))}
              </div>
              {monthlyAnalytics.length > 0 ? (
                <ChartContainer config={chartConfig} className="h-[350px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={monthlyAnalytics} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.3} />
                      <XAxis dataKey="month" tickLine={false} axisLine={false} dy={5} />
                      <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => value.toLocaleString()} dx={-5} />
                      <ChartTooltip content={<ChartTooltipContent indicator="dot" />} cursor={{ fill: "hsl(var(--muted)/0.3)" }} />
                      <ChartLegend content={<ChartLegendContent />} />
                      <Bar dataKey="totalBookings" fill="var(--color-totalBookings)" radius={[4, 4, 0, 0]} stackId="a" />
                      <Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} stackId="a" />
                      <Bar dataKey="reports" fill="var(--color-reports)" radius={[4, 4, 0, 0]} />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              ) : (
                <div className="text-center py-10 text-muted-foreground">{currentContent.noData}</div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
  );
}
