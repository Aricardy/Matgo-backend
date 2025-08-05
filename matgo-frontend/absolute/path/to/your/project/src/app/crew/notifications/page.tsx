
"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BellRing, MessageSquare, AlertTriangle, Info, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

type NotificationType = "sacco_comm" | "system_alert" | "info";

interface CrewNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const getNotificationStyling = (type: NotificationType, lang: "ENG" | "KSW") => {
  switch (type) {
    case "sacco_comm": return { Icon: MessageSquare, color: "text-blue-500", badge: lang === 'KSW' ? "SACCO" : "SACCO" };
    case "system_alert": return { Icon: AlertTriangle, color: "text-red-500", badge: lang === 'KSW' ? "Tahadhari" : "Alert" };
    case "info": return { Icon: Info, color: "text-purple-500", badge: lang === 'KSW' ? "Taarifa" : "Info" };
    default: return { Icon: BellRing, color: "text-muted-foreground", badge: lang === 'KSW' ? "Jumla" : "General" };
  }
};

export default function CrewNotificationsPage() {
  const [notifications, setNotifications] = useState<CrewNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('matgoUser');
    if (!storedUser || !['driver', 'conductor'].includes(JSON.parse(storedUser).role)) {
        router.replace('/dashboard');
        return;
    }

    const fetchData = async () => {
        setIsLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNotifications([]);
        setIsLoading(false);
    };
    fetchData();
  }, [router]);

  const content = {
    ENG: {
      pageTitle: "Crew Notifications",
      pageDescription: "Important updates, alerts, and messages from your SACCO and the MatGo system.",
      markAllRead: "Mark All as Read",
      noNotifications: "No notifications for you right now.",
    },
    KSW: {
      pageTitle: "Arifa za Wahudumu",
      pageDescription: "Masasisho muhimu, tahadhari, na ujumbe kutoka kwa SACCO yako na mfumo wa MatGo.",
      markAllRead: "Weka Zote Kama Zimesomwa",
      noNotifications: "Hakuna arifa kwako kwa sasa.",
    }
  };
  const currentContent = content[language];
  
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <Card className="shadow-xl glassy-card">
          <CardHeader>
            <CardTitle className="font-headline text-3xl md:text-4xl text-primary flex items-center gap-3">
              <BellRing /> {currentContent.pageTitle}
            </CardTitle>
            <CardDescription className="text-base mt-1">
              {currentContent.pageDescription}
            </CardDescription>
          </CardHeader>
        </Card>

        {isLoading ? (
            <Skeleton className="h-64 w-full" />
        ) : notifications.length === 0 ? (
            <Card className="text-center py-12 glassy-card">
                <p className="text-muted-foreground">{currentContent.noNotifications}</p>
            </Card>
        ) : (
          <div className="space-y-4">
            {notifications.map(notification => {
                const { Icon, color, badge } = getNotificationStyling(notification.type, language);
                return (
                    <Card key={notification.id} className={cn("glassy-card", !notification.read && "border-primary")}>
                         <CardContent className="p-4 flex items-start gap-4">
                            <Icon className={cn("h-6 w-6 mt-1", color)} />
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{notification.title}</h3>
                                <p className="text-sm text-muted-foreground">{notification.message}</p>
                                <p className="text-xs text-muted-foreground/80 mt-2">{notification.timestamp.toLocaleString()}</p>
                            </div>
                            <Badge variant={!notification.read ? "default" : "secondary"}>{badge}</Badge>
                         </CardContent>
                    </Card>
                );
            })}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
