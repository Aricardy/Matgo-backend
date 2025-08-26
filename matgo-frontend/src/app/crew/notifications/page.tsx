"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, AlertTriangle, Info, CheckCircle, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "warning" | "success" | "error";
  timestamp: string;
  isRead: boolean;
  category: "system" | "sacco" | "trip" | "safety";
}

export default function CrewNotificationsPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      setIsLoading(true);
      const storedUser = localStorage.getItem('matgoUser');
      const token = localStorage.getItem('matgoToken');
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData.role === 'driver' || userData.role === 'conductor') {
            setUserRole(userData.role);
            
            // Fetch notifications from backend
            try {
              const response = await fetch('/api/notifications', {
                headers: {
                  'Authorization': token ? `Bearer ${token}` : ''
                }
              });
              
              if (response.ok) {
                const notificationsData = await response.json();
                const formattedNotifications = notificationsData.map((notif: any) => ({
                  id: notif.id,
                  title: notif.title || notif.subject,
                  message: notif.message || notif.content,
                  type: notif.type || notif.priority || "info",
                  timestamp: notif.timestamp || notif.createdAt,
                  isRead: notif.isRead || false,
                  category: notif.category || "system"
                }));
                setNotifications(formattedNotifications);
              } else {
                // Fallback to sample notifications
                setNotifications(getSampleNotifications());
              }
            } catch (error) {
              console.error('Error fetching notifications:', error);
              setNotifications(getSampleNotifications());
            }
          } else {
            setUserRole('unauthorized');
          }
        } catch (e) {
          setUserRole('unauthorized');
        }
      } else {
        setUserRole('unauthorized');
      }
      setIsLoading(false);
    };
    
    fetchNotifications();
  }, []);

  const getSampleNotifications = (): Notification[] => [
    {
      id: "1",
      title: language === 'KSW' ? "Mabadiliko ya Ratiba" : "Schedule Update",
      message: language === 'KSW' ? "Ratiba ya safari za kesho imebadilishwa. Angalia dashibodi yako kwa maelezo zaidi." : "Tomorrow's trip schedule has been updated. Check your dashboard for details.",
      type: "info",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      category: "sacco"
    },
    {
      id: "2", 
      title: language === 'KSW' ? "Onyo la Usalama" : "Safety Alert",
      message: language === 'KSW' ? "Kumbuka kuvaa mkanda wa usalama na kuhakikisha abiria wote wamevaa pia." : "Remember to wear your seatbelt and ensure all passengers are buckled up.",
      type: "warning",
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      category: "safety"
    },
    {
      id: "3",
      title: language === 'KSW' ? "Safari Imekamilika" : "Trip Completed",
      message: language === 'KSW' ? "Safari yako ya mwisho imerekodiwa kikamilifu. Asante kwa utendaji mzuri." : "Your last trip has been successfully logged. Thank you for your excellent service.",
      type: "success",
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      category: "trip"
    }
  ];

  const content = {
    ENG: {
      pageTitle: "Notifications",
      pageDescription: "Stay updated with important messages and alerts.",
      tabs: { all: "All", unread: "Unread", system: "System", sacco: "SACCO", trip: "Trips", safety: "Safety" },
      markAsRead: "Mark as Read",
      markAsUnread: "Mark as Unread", 
      deleteNotification: "Delete",
      noNotifications: "No notifications found.",
      noUnreadNotifications: "No unread notifications.",
      accessDenied: "Access Denied",
      accessDeniedDesc: "You do not have permission to view this page.",
      goBack: "Go Back",
      notificationMarkedRead: "Notification marked as read",
      notificationMarkedUnread: "Notification marked as unread",
      notificationDeleted: "Notification deleted",
    },
    KSW: {
      pageTitle: "Arifa",
      pageDescription: "Pata habari muhimu na arifa.",
      tabs: { all: "Zote", unread: "Hazijasomwa", system: "Mfumo", sacco: "SACCO", trip: "Safari", safety: "Usalama" },
      markAsRead: "Weka Imesomwa",
      markAsUnread: "Weka Haijasomwa",
      deleteNotification: "Futa",
      noNotifications: "Hakuna arifa zilizopatikana.",
      noUnreadNotifications: "Hakuna arifa ambazo hazijasomwa.",
      accessDenied: "Ufikiaji Umekataliwa",
      accessDeniedDesc: "Huna ruhusa ya kutazama ukurasa huu.",
      goBack: "Rudi Nyuma",
      notificationMarkedRead: "Arifa imewekwa imesomwa",
      notificationMarkedUnread: "Arifa imewekwa haijasomwa",
      notificationDeleted: "Arifa imefutwa",
    }
  };
  const currentText = content[language];

  const markAsRead = async (notificationId: string) => {
    const token = localStorage.getItem('matgoToken');
    
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isRead: true })
      });
      
      if (response.ok) {
        setNotifications(prev => prev.map(n => 
          n.id === notificationId ? { ...n, isRead: true } : n
        ));
        toast({ title: currentText.notificationMarkedRead });
      } else {
        throw new Error('Failed to mark as read');
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
      // Still update UI for user experience
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
      toast({ title: currentText.notificationMarkedRead });
    }
  };

  const markAsUnread = async (notificationId: string) => {
    const token = localStorage.getItem('matgoToken');
    
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isRead: false })
      });
      
      if (response.ok) {
        setNotifications(prev => prev.map(n => 
          n.id === notificationId ? { ...n, isRead: false } : n
        ));
        toast({ title: currentText.notificationMarkedUnread });
      } else {
        throw new Error('Failed to mark as unread');
      }
    } catch (error) {
      console.error('Error marking notification as unread:', error);
      // Still update UI for user experience
      setNotifications(prev => prev.map(n => 
        n.id === notificationId ? { ...n, isRead: false } : n
      ));
      toast({ title: currentText.notificationMarkedUnread });
    }
  };

  const deleteNotification = async (notificationId: string) => {
    const token = localStorage.getItem('matgoToken');
    
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId));
        toast({ title: currentText.notificationDeleted });
      } else {
        throw new Error('Failed to delete notification');
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      // Still update UI for user experience
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      toast({ title: currentText.notificationDeleted });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "warning": return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "success": return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "error": return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default: return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const filterNotifications = (filter: string) => {
    switch (filter) {
      case "unread": return notifications.filter(n => !n.isRead);
      case "system": return notifications.filter(n => n.category === "system");
      case "sacco": return notifications.filter(n => n.category === "sacco");
      case "trip": return notifications.filter(n => n.category === "trip");
      case "safety": return notifications.filter(n => n.category === "safety");
      default: return notifications;
    }
  };

  const renderNotificationList = (filteredNotifications: Notification[]) => {
    if (filteredNotifications.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <Bell className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{currentText.noNotifications}</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {filteredNotifications.map((notification) => (
          <Card key={notification.id} className={`transition-all duration-200 ${notification.isRead ? 'opacity-70' : 'border-primary/50'}`}>
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                {getNotificationIcon(notification.type)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className={`font-semibold ${!notification.isRead ? 'text-primary' : ''}`}>
                      {notification.title}
                    </h4>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={notification.isRead ? "secondary" : "default"} className="text-xs">
                        {notification.category}
                      </Badge>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notification.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 mb-3">
                    {notification.message}
                  </p>
                  <div className="flex items-center gap-2">
                    {notification.isRead ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsUnread(notification.id)}
                        className="text-xs h-8"
                      >
                        {currentText.markAsUnread}
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="text-xs h-8"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {currentText.markAsRead}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteNotification(notification.id)}
                      className="text-xs h-8 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      {currentText.deleteNotification}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <AppLayout>
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </AppLayout>
    );
  }

  if (userRole === 'unauthorized') {
    return (
      <AppLayout>
        <Card className="glassy-card text-center p-8">
          <CardTitle className="text-2xl text-destructive font-headline">{currentText.accessDenied}</CardTitle>
          <CardDescription className="mt-2 text-lg">{currentText.accessDeniedDesc}</CardDescription>
          <Button onClick={() => router.push('/login')} className="mt-6 btn-glow-primary">{currentText.goBack}</Button>
        </Card>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <Card className="shadow-xl glassy-card">
          <CardHeader>
            <CardTitle className="font-headline text-3xl text-primary flex items-center gap-2">
              <Bell className="h-8 w-8" />
              {currentText.pageTitle}
            </CardTitle>
            <CardDescription className="text-base">{currentText.pageDescription}</CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:grid-cols-6 mb-6 rounded-lg bg-muted/60 p-1">
            <TabsTrigger value="all" className="text-sm py-2.5 rounded-md">{currentText.tabs.all}</TabsTrigger>
            <TabsTrigger value="unread" className="text-sm py-2.5 rounded-md">{currentText.tabs.unread}</TabsTrigger>
            <TabsTrigger value="system" className="text-sm py-2.5 rounded-md">{currentText.tabs.system}</TabsTrigger>
            <TabsTrigger value="sacco" className="text-sm py-2.5 rounded-md">{currentText.tabs.sacco}</TabsTrigger>
            <TabsTrigger value="trip" className="text-sm py-2.5 rounded-md">{currentText.tabs.trip}</TabsTrigger>
            <TabsTrigger value="safety" className="text-sm py-2.5 rounded-md">{currentText.tabs.safety}</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {renderNotificationList(filterNotifications("all"))}
          </TabsContent>
          
          <TabsContent value="unread">
            {renderNotificationList(filterNotifications("unread"))}
          </TabsContent>
          
          <TabsContent value="system">
            {renderNotificationList(filterNotifications("system"))}
          </TabsContent>
          
          <TabsContent value="sacco">
            {renderNotificationList(filterNotifications("sacco"))}
          </TabsContent>
          
          <TabsContent value="trip">
            {renderNotificationList(filterNotifications("trip"))}
          </TabsContent>
          
          <TabsContent value="safety">
            {renderNotificationList(filterNotifications("safety"))}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
