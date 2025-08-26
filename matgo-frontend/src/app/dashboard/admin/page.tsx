
"use client";

import AdminLayout from "@/app/admin/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2, Building, Bus, UserCheck, AlertCircle } from "lucide-react";
import React, { useState, useEffect } from "react";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart as RechartsBarChart } from 'recharts';
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { api } from "@/lib/api";
import { getAuthToken, getCurrentUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface StatsResponse {
  totalMatatus?: number;
  totalUsers?: number;
  [key: string]: any;
}

interface MonthlyAnalytics {
  month: string;
  totalBookings: number;
  revenue: number;
  reports: number;
}

interface ApiError {
  response?: {
    status: number;
    data?: any;
  };
  message?: string;
}

const chartConfig = {
  totalBookings: { label: "Total Bookings", color: "hsl(var(--chart-1))" },
  revenue: { label: "Revenue (Ksh)", color: "hsl(var(--chart-2))" },
  reports: { label: "Passenger Reports", color: "hsl(var(--chart-3))" }
} satisfies React.ComponentProps<typeof ChartContainer>["config"];

export default function SystemAdminDashboard() {
  const { language } = useLanguage();
  const router = useRouter();
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Separate useEffect for authentication
  useEffect(() => {
    const checkAuth = async () => {
      const user = getCurrentUser();
      const token = getAuthToken();
      
      if (!user || !token) {
        router.push('/login');
        return;
      }

      if (user.role !== 'system_admin' && user.role !== 'admin') {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          localStorage.removeItem('matgoToken');
          localStorage.removeItem('matgoUser');
          router.push('/login');
          return;
        }

        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth verification failed:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const checkAuth = async () => {
      const user = getCurrentUser();
      const token = getAuthToken();
      
      if (!user || !token) {
        router.push('/login');
        return;
      }

      if (user.role !== 'system_admin' && user.role !== 'admin') {
        router.push('/login');
        return;
      }

      // Verify token with backend
      const response = await fetch('http://localhost:5000/api/auth/verify', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        localStorage.removeItem('matgoToken');
        localStorage.removeItem('matgoUser');
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);
  const [error, setError] = useState<string | null>(null);

  // Data states - should be populated from backend
  const [saccoCount, setSaccoCount] = useState(0);
  const [busCount, setBusCount] = useState(0);
  const [personnelCount, setPersonnelCount] = useState(0);
  const [pendingReportsCount, setPendingReportsCount] = useState(0);
  const [monthlyAnalytics, setMonthlyAnalytics] = useState<MonthlyAnalytics[]>([]);

  useEffect(() => {
    let isComponentMounted = true;
    let timer: NodeJS.Timeout;
    
    const handleApiError = (error: ApiError, context: string) => {
      console.error(`Error in ${context}:`, error);
      if (error.response?.status === 401) {
        // Clear auth data
        localStorage.removeItem('matgoToken');
        localStorage.removeItem('matgoUser');
        
        // Use a timeout to prevent immediate redirect that might interrupt other operations
        timer = setTimeout(() => {
          if (isComponentMounted) {
            router.push('/login');
          }
        }, 100);
        return null;
      }
      return [];
    };

    const fetchData = async () => {
      if (!isAuthenticated) return;
      
      try {
        if (!isComponentMounted) return;
        setIsLoading(true);
        
        const token = getAuthToken();
        const headers = { 
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json'
        };
        
        // Fetch all data in parallel with proper error handling
        const [stats, saccos, reports, bookings] = await Promise.all([
          api.get('/stats', { headers }).catch((error: ApiError) => 
            handleApiError(error, 'stats') || { totalMatatus: 0, totalUsers: 0 }
          ),
          api.get('/saccos', { headers }).catch((error: ApiError) => 
            handleApiError(error, 'saccos')
          ),
          api.get('/reports', { headers }).catch((error: ApiError) => 
            handleApiError(error, 'reports')
          ),
          api.get('/bookings', { headers }).catch((error: ApiError) => 
            handleApiError(error, 'bookings')
          )
        ]);
        
        // Update state with fetched data
        setBusCount(stats?.totalMatatus || 0);
        setPersonnelCount(stats?.totalUsers || 0);
        setSaccoCount(Array.isArray(saccos) ? saccos.length : 0);
        
        // Calculate pending reports with proper type checking
        const pendingReports = Array.isArray(reports) 
          ? reports.filter((report) => report?.status === 'pending' || !report?.resolved).length 
          : 0;
        setPendingReportsCount(pendingReports);
          
        // Process bookings data for monthly analytics
        const monthlyData: { [key: string]: MonthlyAnalytics } = {};
        const now = new Date();
        
        // Initialize last 6 months
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now);
          date.setMonth(now.getMonth() - i);
          const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
          monthlyData[monthKey] = {
            month: monthKey,
            totalBookings: 0,
            revenue: 0,
            reports: 0
          };
        }
        
        // Process bookings data if available with proper type checking
        if (Array.isArray(bookings)) {
          bookings.forEach((booking) => {
            try {
              if (!booking?.createdAt) return;
              
              const bookingDate = new Date(booking.createdAt);
              if (isNaN(bookingDate.getTime())) return; // Skip invalid dates
              
              const monthKey = bookingDate.toLocaleDateString('en-US', { 
                month: 'short', 
                year: '2-digit' 
              });
              
              if (monthlyData[monthKey]) {
                monthlyData[monthKey].totalBookings += 1;
                // Safely add price if it exists and is a number
                const price = typeof booking.price === 'number' ? booking.price : 0;
                monthlyData[monthKey].revenue += price;
              }
            } catch (error) {
              console.error('Error processing booking:', error, booking);
            }
          });
        }
        
        // Convert to array and sort by date
        const analyticsData = Object.values(monthlyData).sort((a, b) => {
          return new Date('01 ' + a.month).getTime() - new Date('01 ' + b.month).getTime();
        });
        
        setMonthlyAnalytics(analyticsData);
        
      } catch (e) {
        const error = e as ApiError;
        console.error('Error fetching dashboard data:', error);
        if (error.response?.status === 401) {
          // Clear auth data and redirect to login
          localStorage.removeItem('matgoToken');
          localStorage.removeItem('matgoUser');
          router.push('/login');
        } else {
          // Set error state for display
          setError('Failed to load dashboard data. Please try again later.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    

    fetchData();

    return () => {
      isComponentMounted = false;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [router, toast]);

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
    <AdminLayout>
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
        {error && (
          <Card className="shadow-lg glassy-card bg-destructive text-destructive-foreground">
            <CardContent className="p-4">
              <p className="text-center">{error}</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
