
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
import { Skeleton } from "@/components/ui/skeleton";

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
    // Simulate fetching notifications
    setIsLoading(true);
    setTimeout(() => {
        // In a real app, this would be an API call
        setNotifications([]); // Set to empty array as requested
        setIsLoading(false);
    }, 1000);
  }, [language]);


  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const deleteAllNotifications = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  
  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
            <Card key={i} className="p-4">
                <div className="flex items-start gap-4">
                    <Skeleton className="h-7 w-7 rounded-full mt-1.5"/>
                    <div className="flex-1 space-y-2">
                        <Skeleton className="h-5 w-3/4"/>
                        <Skeleton className="h-4 w-full"/>
                        <Skeleton className="h-3 w-1/3"/>
                    </div>
                </div>
            </Card>
        ))}
    </div>
  );

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
            <Button onClick={markAllAsRead} variant="outline" disabled={unreadCount === 0 || isLoading} className="w-full sm:w-auto text-base py-2.5 rounded-lg border-primary text-primary hover:bg-primary/10">{currentContent.markAllRead}</Button>
            <div className="flex gap-2 w-full sm:w-auto">
                <Button onClick={deleteAllNotifications} variant="destructive" disabled={notifications.length === 0 || isLoading} className="flex-1 sm:flex-none text-base py-2.5 rounded-lg btn-glow-accent">
                    <Trash2 className="mr-2 h-4 w-4"/> {currentContent.clearAll}
                </Button>
                 <Button variant="ghost" size="icon" title={currentContent.notificationSettings} className="rounded-lg">
                    <Settings2 className="h-5 w-5"/>
                </Button>
            </div>
        </div>

        {isLoading ? renderLoadingSkeleton() : notifications.length === 0 ? (
          <Card className="shadow-md glassy-card">
            <CardContent className="py-16 text-center">
              <BellRing className="mx-auto h-20 w-20 text-muted-foreground/50 mb-6" />
              <h3 className="text-2xl font-semibold text-muted-foreground">{currentContent.noNotificationsTitle}</h3>
              <p className="text-muted-foreground mt-2 text-lg">{currentContent.noNotificationsDescription}</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map(notification => {
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
