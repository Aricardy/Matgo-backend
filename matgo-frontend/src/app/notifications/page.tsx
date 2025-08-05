
"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BellRing, AlertOctagon, Info, CheckCircle, Trash2, Settings2, Eye, Sparkles } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

type NotificationType = "payment" | "arrival" | "alert" | "info" | "trip_completed" | "emergency_ack";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  link?: string;
  icon?: React.ElementType;
}

const baseNotificationsData: (Omit<Notification, 'timestamp' | 'title' | 'message'> & { timeOffsetMs: number, title_ENG: string, message_ENG: string, title_KSW: string, message_KSW: string })[] = [
  { id: "1", type: "payment", title_ENG: "Payment Successful!", message_ENG: "Your M-Pesa payment of Ksh 2200 for Nairobi-Mombasa trip (Seat A12) was successful.", title_KSW: "Malipo Yamefaulu!", message_KSW: "Malipo yako ya M-Pesa ya Ksh 2200 kwa safari ya Nairobi-Mombasa (Kiti A12) yamefaulu.", timeOffsetMs: 1000 * 60 * 5, read: false, link: "/receipt/sample?id=trip123", icon: CheckCircle },
  { id: "2", type: "arrival", title_ENG: "Matatu Approaching!", message_ENG: "Your matatu (KDA 123X - Explicit) to Town is 5 minutes away from your pickup point.", title_KSW: "Matatu Inakaribia!", message_KSW: "Matatu yako (KDA 123X - Explicit) kuelekea Mjini iko dakika 5 kutoka mahali pako pa kuchukuliwa.", timeOffsetMs: 1000 * 60 * 30, read: false, icon: BellRing },
  { id: "3", type: "alert", title_ENG: "Route Diversion Alert", message_ENG: "Ngong Road route towards Town has heavy traffic due to an incident. Consider using Southern Bypass.", title_KSW: "Tahadhari ya Kubadilisha Njia", message_KSW: "Njia ya Ngong Road kuelekea Mjini ina msongamano mkubwa wa magari kutokana na tukio. Fikiria kutumia Southern Bypass.", timeOffsetMs: 1000 * 60 * 60 * 2, read: true, icon: AlertOctagon },
  { id: "4", type: "trip_completed", title_ENG: "Trip Completed: Nairobi - Town", message_ENG: "Hope you enjoyed your ride with Super Metro! Please rate your trip.", title_KSW: "Safari Imekamilika: Nairobi - Mjini", message_KSW: "Tunatumai ulifurahia safari yako na Super Metro! Tafadhali kadiria safari yako.", timeOffsetMs: 1000 * 60 * 60 * 5, read: false, link: "/profile#tripHistory", icon: Sparkles },
  { id: "5", type: "info", title_ENG: "New Feature: RoadTrip Planner!", message_ENG: "Plan custom scenic trips with your favorite Nganyas or buses! Check it out now in the RoadTrip section.", title_KSW: "Kipengele Kipya: Mpangaji wa RoadTrip!", message_KSW: "Panga safari maalum za kuvutia na Nganya au mabasi unayopenda! Iangalie sasa katika sehemu ya RoadTrip.", timeOffsetMs: 1000 * 60 * 60 * 24, read: true, link: "/roadtrip", icon: Info},
  { id: "6", type: "emergency_ack", title_ENG: "SOS Alert Acknowledged", message_ENG: "Your emergency alert has been received by MatGo Safety Team. Help is being coordinated.", title_KSW: "Arifa ya SOS Imepokelewa", message_KSW: "Arifa yako ya dharura imepokelewa na Timu ya Usalama ya MatGo. Msaada unaratibiwa.", timeOffsetMs: 1000 * 60 * 15, read: true, icon: AlertOctagon },
];


const getNotificationStyling = (type: NotificationType, lang: Language) => {
  switch (type) {
    case "payment": return { Icon: CheckCircle, color: "text-green-500 dark:text-green-400", badge: lang === 'KSW' ? "Malipo" : "Payment" };
    case "arrival": return { Icon: BellRing, color: "text-blue-500 dark:text-blue-400", badge: lang === 'KSW' ? "Ujio" : "Arrival" };
    case "alert": return { Icon: AlertOctagon, color: "text-red-500 dark:text-red-400", badge: lang === 'KSW' ? "Tahadhari" : "Alert" };
    case "trip_completed": return { Icon: Sparkles, color: "text-yellow-500 dark:text-yellow-400", badge: lang === 'KSW' ? "Maoni" : "Feedback" };
    case "emergency_ack": return { Icon: AlertOctagon, color: "text-orange-500 dark:text-orange-400", badge: lang === 'KSW' ? "Sasisho la SOS" : "SOS Update" };
    case "info": return { Icon: Info, color: "text-purple-500 dark:text-purple-400", badge: lang === 'KSW' ? "Taarifa" : "Info" };
    default: return { Icon: BellRing, color: "text-muted-foreground", badge: lang === 'KSW' ? "Jumla" : "General" };
  }
};

export default function NotificationsPage() {
  const [hydratedNotifications, setHydratedNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();

  const content = {
    ENG: {
      pageTitle: "Your Alerts & Updates",
      pageDescription: "Stay updated with payments, arrivals, trip completions, and important system alerts.",
      markAllRead: "Mark All as Read",
      clearAll: "Clear All",
      notificationSettings: "Notification Settings",
      noNotificationsTitle: "No Notifications Yet",
      noNotificationsDescription: "We'll let you know when something important happens on your MatGo journey!",
      markRead: "Mark Read",
      deleteNotification: "Delete notification",
      viewDetails: "View Details",
      newBadge: "New",
    },
    KSW: {
      pageTitle: "Arifa na Masasisho Yako",
      pageDescription: "Pata habari kuhusu malipo, kuwasili, kukamilika kwa safari, na arifa muhimu za mfumo.",
      markAllRead: "Weka Zote Kama Zimesomwa",
      clearAll: "Futa Zote",
      notificationSettings: "Mipangilio ya Arifa",
      noNotificationsTitle: "Hakuna Arifa Bado",
      noNotificationsDescription: "Tutakujulisha jambo muhimu linapotokea katika safari yako ya MatGo!",
      markRead: "Weka Kama Imesomwa",
      deleteNotification: "Futa arifa",
      viewDetails: "Tazama Maelezo",
      newBadge: "Mpya",
    }
  };
  const currentContent = content[language];


  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      const token = localStorage.getItem('matgoToken');
      
      try {
        // Try to fetch notifications from backend
        const response = await fetch('/api/notifications', {
          headers: {
            'Authorization': token ? `Bearer ${token}` : ''
          }
        });
        
        if (response.ok) {
          const backendNotifications = await response.json();
          
          // Transform backend notifications to frontend format
          const processed = backendNotifications.map((n: any) => ({
            id: n.id,
            type: n.type || 'info',
            title: language === 'KSW' ? (n.title_KSW || n.title) : (n.title_ENG || n.title),
            message: language === 'KSW' ? (n.message_KSW || n.message) : (n.message_ENG || n.message),
            timestamp: new Date(n.createdAt || n.timestamp),
            read: n.read || false,
            link: n.link,
            icon: n.icon
          })).sort((a: Notification, b: Notification) => b.timestamp.getTime() - a.timestamp.getTime());
          
          setHydratedNotifications(processed);
        } else {
          // Fallback to mock data if backend is not available
          console.log('Backend notifications not available, using mock data');
          const now = Date.now();
          const processed = baseNotificationsData.map(n => {
            const { timeOffsetMs, title_ENG, message_ENG, title_KSW, message_KSW, ...rest } = n;
            return {
              ...rest,
              title: language === 'KSW' ? title_KSW : title_ENG,
              message: language === 'KSW' ? message_KSW : message_ENG,
              timestamp: new Date(now - timeOffsetMs),
            };
          }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
          setHydratedNotifications(processed);
        }
      } catch (error) {
        console.error('Error fetching notifications:', error);
        // Fallback to mock data
        const now = Date.now();
        const processed = baseNotificationsData.map(n => {
          const { timeOffsetMs, title_ENG, message_ENG, title_KSW, message_KSW, ...rest } = n;
          return {
            ...rest,
            title: language === 'KSW' ? title_KSW : title_ENG,
            message: language === 'KSW' ? message_KSW : message_ENG,
            timestamp: new Date(now - timeOffsetMs),
          };
        }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        setHydratedNotifications(processed);
      }
      
      setIsLoading(false);
    };

    fetchNotifications();
  }, [language]);


  const markAsRead = async (id: string) => {
    // Optimistically update UI
    setHydratedNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    
    // Sync with backend
    const token = localStorage.getItem('matgoToken');
    try {
      await fetch(`/api/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Revert optimistic update on error
      setHydratedNotifications(prev => prev.map(n => n.id === id ? { ...n, read: false } : n));
    }
  };

  const markAllAsRead = async () => {
    // Optimistically update UI
    setHydratedNotifications(prev => prev.map(n => ({ ...n, read: true })));
    
    // Sync with backend
    const token = localStorage.getItem('matgoToken');
    try {
      await fetch('/api/notifications/mark-all-read', {
        method: 'PUT',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        }
      });
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      // Could revert optimistic update here if needed
    }
  };

  const deleteNotification = async (id: string) => {
    // Optimistically update UI
    setHydratedNotifications(prev => prev.filter(n => n.id !== id));
    
    // Sync with backend
    const token = localStorage.getItem('matgoToken');
    try {
      await fetch(`/api/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Could revert optimistic update here if needed
    }
  };

  const deleteAllNotifications = async () => {
    // Store current notifications for potential rollback
    const currentNotifications = hydratedNotifications;
    
    // Optimistically update UI
    setHydratedNotifications([]);
    
    // Sync with backend
    const token = localStorage.getItem('matgoToken');
    try {
      await fetch('/api/notifications', {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
    } catch (error) {
      console.error('Error deleting all notifications:', error);
      // Revert optimistic update on error
      setHydratedNotifications(currentNotifications);
    }
  };

  const unreadCount = hydratedNotifications.filter(n => !n.read).length;

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <Card className="shadow-xl glassy-card">
          <CardHeader className="flex flex-row items-center justify-between p-6">
            <div className="flex items-center gap-3">
              <BellRing className="h-9 w-9 text-primary" />
              <CardTitle className="font-headline text-3xl md:text-4xl text-primary">
                {currentContent.pageTitle}
              </CardTitle>
            </div>
            {unreadCount > 0 && <Badge variant="destructive" className="text-sm px-3 py-1.5 rounded-md">{unreadCount} {currentContent.newBadge}</Badge>}
          </CardHeader>
          <CardDescription className="px-6 pb-4 text-base">
            {currentContent.pageDescription}
          </CardDescription>
        </Card>
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4 mb-6 px-1">
            <Button onClick={markAllAsRead} variant="outline" disabled={unreadCount === 0} className="w-full sm:w-auto text-base py-2.5 rounded-lg border-primary text-primary hover:bg-primary/10">{currentContent.markAllRead}</Button>
            <div className="flex gap-2 w-full sm:w-auto">
                <Button onClick={deleteAllNotifications} variant="destructive" disabled={hydratedNotifications.length === 0} className="flex-1 sm:flex-none text-base py-2.5 rounded-lg btn-glow-accent">
                    <Trash2 className="mr-2 h-4 w-4"/> {currentContent.clearAll}
                </Button>
                 <Button variant="ghost" size="icon" title={currentContent.notificationSettings} className="rounded-lg">
                    <Settings2 className="h-5 w-5"/>
                </Button>
            </div>
        </div>

        {hydratedNotifications.length === 0 ? (
          <Card className="shadow-md glassy-card">
            <CardContent className="py-16 text-center">
              <BellRing className="mx-auto h-20 w-20 text-muted-foreground/50 mb-6" />
              <h3 className="text-2xl font-semibold text-muted-foreground">{currentContent.noNotificationsTitle}</h3>
              <p className="text-muted-foreground mt-2 text-lg">{currentContent.noNotificationsDescription}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {hydratedNotifications.map(notification => {
              const { Icon, color, badge } = getNotificationStyling(notification.type, language);
              return (
                <Card 
                  key={notification.id} 
                  className={cn(
                    "shadow-lg transition-all duration-300 hover:shadow-primary/20 glassy-card overflow-hidden", 
                    !notification.read && "border-l-4 border-primary bg-primary/5 dark:bg-primary/10"
                  )}
                >
                  <CardContent className="p-4 flex items-start gap-4">
                    <div className={cn("pt-1.5", color)}>
                      <Icon className="h-7 w-7" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                          <h3 className={cn("font-semibold text-lg leading-tight", !notification.read && "text-primary")}>{notification.title}</h3>
                          <Badge variant={!notification.read ? "default" : "secondary"} className={cn("text-xs px-2 py-0.5", !notification.read ? "bg-primary/80 text-primary-foreground" : "bg-muted text-muted-foreground")}>{badge}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{notification.message}</p>
                      <div className="flex flex-wrap items-center justify-between mt-2">
                        <p className="text-xs text-muted-foreground/80">
                          {notification.timestamp.toLocaleString(language === 'KSW' ? 'sw-KE' : 'en-GB', {dateStyle: 'medium', timeStyle: 'short'})}
                        </p>
                        {notification.link && (
                         <Button variant="link" size="sm" asChild className="p-0 h-auto text-primary hover:underline text-sm font-semibold">
                             <Link href={notification.link}><Eye className="mr-1 h-4 w-4"/>{currentContent.viewDetails}</Link>
                         </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1.5 items-end">
                      {!notification.read && (
                        <Button variant="ghost" size="sm" onClick={() => markAsRead(notification.id)} title={currentContent.markRead} className="text-xs text-primary hover:bg-primary/10">
                          {currentContent.markRead}
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive rounded-full w-8 h-8" onClick={() => deleteNotification(notification.id)} title={currentContent.deleteNotification}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
