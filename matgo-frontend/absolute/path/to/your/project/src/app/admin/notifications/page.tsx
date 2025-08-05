
"use client";

import AdminLayout from "@/app/admin/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BellRing, ShieldCheck, FileCheck, Award } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

type AdminNotificationType = "new_sacco_app" | "new_admin_app" | "major_incident_report" | "system_health_alert";

interface AdminNotification {
  id: string;
  type: AdminNotificationType;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
}

const getNotificationStyling = (type: AdminNotificationType) => {
    switch(type) {
        case "new_sacco_app": return { Icon: FileCheck, color: "text-blue-500"};
        case "new_admin_app": return { Icon: FileCheck, color: "text-purple-500"};
        case "major_incident_report": return { Icon: Award, color: "text-yellow-500"};
        case "system_health_alert": return { Icon: ShieldCheck, color: "text-red-500"};
    }
}

export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<AdminNotification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { language } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem('matgoUser');
    if (!storedUser || !['admin', 'sacco_admin'].includes(JSON.parse(storedUser).role)) {
        router.replace('/dashboard');
        return;
    }

    const fetchData = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setNotifications([]);
        setIsLoading(false);
    };
    fetchData();
  }, [router]);

  const content = {
    ENG: {
      pageTitle: "Admin Notifications",
      pageDescription: "System alerts, new applications, and high-priority reports.",
      noNotifications: "The system is quiet. No new admin notifications.",
    },
    KSW: {
      pageTitle: "Arifa za Msimamizi",
      pageDescription: "Tahadhari za mfumo, maombi mapya, na ripoti za kipaumbele cha juu.",
      noNotifications: "Mfumo uko kimya. Hakuna arifa mpya za usimamizi.",
    }
  };
  const currentContent = content[language];

  return (
    <AdminLayout>
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
                const { Icon, color } = getNotificationStyling(notification.type);
                return (
                    <Card key={notification.id} className={cn("glassy-card", !notification.read && "border-primary")}>
                         <CardContent className="p-4 flex items-start gap-4">
                            <Icon className={cn("h-6 w-6 mt-1", color)} />
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{notification.title}</h3>
                                <p className="text-sm text-muted-foreground">{notification.message}</p>
                                <p className="text-xs text-muted-foreground/80 mt-2">{notification.timestamp.toLocaleString()}</p>
                            </div>
                         </CardContent>
                    </Card>
                );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
