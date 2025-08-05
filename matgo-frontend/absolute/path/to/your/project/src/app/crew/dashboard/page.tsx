
"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, PlayCircle, StopCircle, AlertTriangle, ClipboardList, MessageSquare, Users, Star, MapPin, Clock, BusFront } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

interface CrewMember {
    name: string;
    role: "Driver" | "Conductor" | "Dereva" | "Kondakta";
    sacco: string;
    busName: string;
    busReg: string;
    profilePic: string;
    rating: number;
}
interface TripLog { id: string; date: string; route: string; startTime: string; endTime: string; passengers: number; fareCollected: number; }
interface Waybill { tripId: string; route: string; departure: string; passengers: { seat: string; name: string; destination: string; }[]; }

export default function CrewDashboardPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [userRole, setUserRole] = useState<string | null>(null);
  const [crewMember, setCrewMember] = useState<CrewMember | null>(null);
  const [tripLog, setTripLog] = useState<TripLog[]>([]);
  const [waybill, setWaybill] = useState<Waybill | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isOnDuty, setIsOnDuty] = useState(false);
  const [isTripActive, setIsTripActive] = useState(false);
  const [currentRoute, setCurrentRoute] = useState("Ngong - Town"); // This would be dynamic
  const [passengerCount, setPassengerCount] = useState(0); 

  useEffect(() => {
    // Simulate fetching data and checking auth
    const fetchData = async () => {
        setIsLoading(true);
        const storedUser = localStorage.getItem('matgoUser');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                if (userData.role === 'driver' || userData.role === 'conductor') {
                    setUserRole(userData.role);
                    // In a real app, fetch crew-specific data from API using user ID/token
                    setCrewMember({
                        name: `${userData.firstName || 'John'} ${userData.lastName || 'Doe'}`,
                        role: language === 'KSW' ? (userData.role === 'driver' ? 'Dereva' : 'Kondakta') : (userData.role === 'driver' ? 'Driver' : 'Conductor'),
                        sacco: userData.saccoName || "MatGo Fleet",
                        busName: "SM001 - Mamba", // Mock
                        busReg: "KDA 001A", // Mock
                        profilePic: userData.profilePic || "/avatars/crew_default.png",
                        rating: 4.7 // Mock
                    });
                    setTripLog([]);
                    setWaybill(null);
                } else {
                    setUserRole('unauthorized');
                }
            } catch (e) {
                setUserRole('unauthorized');
            }
        } else {
            setUserRole('unauthorized');
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsLoading(false);
    };
    fetchData();
  }, [language]);


  const content = {
    ENG: {
      welcome: `Hello, ${crewMember?.name || ''}!`,
      role: crewMember?.role,
      sacco: crewMember?.sacco,
      busInfo: `${crewMember?.busName || ''} (${crewMember?.busReg || ''})`,
      onDutyLabel: "On Duty",
      startTrip: "Start Trip",
      stopTrip: "Stop Trip",
      currentRoute: "Current Route:",
      passengerCount: "Passenger Count:",
      tabs: { dashboard: "Dashboard", tripLog: "Trip Log", waybill: "Waybill/Manifest", saccoComms: "SACCO Comms", feedback: "My Feedback" },
      tripLogTitle: "Recent Trip Log",
      noTripsLogged: "No trips logged for the selected period.",
      digitalWaybillTitle: "Digital Waybill / Manifest",
      noWaybill: "No active waybill. Waybills for long-distance trips will appear here.",
      tripID: "Trip ID:",
      departure: "Departure:",
      passengerList: "Passenger List:",
      seat: "Seat",
      passengerName: "Name",
      destination: "Destination",
      saccoCommsTitle: "SACCO Communications",
      saccoCommsDesc: "Messages and alerts from your SACCO admin.",
      typeMessagePlaceholder: "Type your message to SACCO Admin...",
      sendMessage: "Send",
      noMessages: "No new messages from SACCO.",
      myFeedbackTitle: "Your Performance & Feedback",
      overallRating: "Overall Rating:",
      recentFeedback: "Recent Passenger Feedback:",
      noFeedbackYet: "No feedback received yet.",
      endShiftSummaryTitle: "End of Shift Summary (Mock)",
      tripsCompleted: "Trips Completed:",
      totalPassengers: "Total Passengers:",
      totalFareEst: "Total Fare Est.:",
      viewFullReport: "View Full Report",
      logout: "Logout",
      tripStartedToast: "Trip Started!",
      tripStartedToastDesc: (route: string) => `Current trip on route ${route} is now active.`,
      tripStoppedToast: "Trip Ended.",
      tripStoppedToastDesc: "Trip has been logged. Ready for the next one!",
      dutyStatusChanged: "Duty Status Changed",
      dutyStatusChangedDesc: (status: string) => `You are now ${status}.`,
      accessDenied: "Access Denied",
      accessDeniedDesc: "You do not have permission to view this page.",
      goBack: "Go Back",
    },
    KSW: {
      welcome: `Habari, ${crewMember?.name || ''}!`,
      role: crewMember?.role,
      sacco: crewMember?.sacco,
      busInfo: `${crewMember?.busName || ''} (${crewMember?.busReg || ''})`,
      onDutyLabel: "Kazini",
      startTrip: "Anza Safari",
      stopTrip: "Maliza Safari",
      currentRoute: "Njia ya Sasa:",
      passengerCount: "Idadi ya Abiria:",
      tabs: { dashboard: "Dashibodi", tripLog: "Kumbukumbu za Safari", waybill: "Manifesti/Waybill", saccoComms: "Mawasiliano ya SACCO", feedback: "Maoni Yangu" },
      tripLogTitle: "Kumbukumbu za Safari za Hivi Karibuni",
      noTripsLogged: "Hakuna safari zilizorekodiwa kwa kipindi kilichochaguliwa.",
      digitalWaybillTitle: "Waybill / Manifesti ya Kidijitali",
      noWaybill: "Hakuna manifesti ya sasa. Manifesti za safari ndefu zitaonekana hapa.",
      tripID: "Kitambulisho cha Safari:",
      departure: "Kuondoka:",
      passengerList: "Orodha ya Abiria:",
      seat: "Kiti",
      passengerName: "Jina",
      destination: "Mwisho",
      saccoCommsTitle: "Mawasiliano ya SACCO",
      saccoCommsDesc: "Ujumbe na arifa kutoka kwa msimamizi wako wa SACCO.",
      typeMessagePlaceholder: "Andika ujumbe wako kwa Msimamizi wa SACCO...",
      sendMessage: "Tuma",
      noMessages: "Hakuna ujumbe mpya kutoka SACCO.",
      myFeedbackTitle: "Utendaji na Maoni Yako",
      overallRating: "Ukadiriaji wa Jumla:",
      recentFeedback: "Maoni ya Hivi Karibuni ya Abiria:",
      noFeedbackYet: "Hakuna maoni yaliyopokelewa bado.",
      endShiftSummaryTitle: "Muhtasari wa Mwisho wa Zam (Mfumo)",
      tripsCompleted: "Safari Zilizokamilika:",
      totalPassengers: "Jumla ya Abiria:",
      totalFareEst: "Jumla ya Nauli (Makadirio):",
      viewFullReport: "Tazama Ripoti Kamili",
      logout: "Ondoka",
      tripStartedToast: "Safari Imeanza!",
      tripStartedToastDesc: (route: string) => `Safari ya sasa kwenye njia ya ${route} imeanza.`,
      tripStoppedToast: "Safari Imemalizika.",
      tripStoppedToastDesc: "Safari imerekodiwa. Tayari kwa ijayo!",
      dutyStatusChanged: "Hali ya Kazi Imebadilika",
      dutyStatusChangedDesc: (status: string) => `Sasa uko ${status}.`,
      accessDenied: "Ufikiaji Umekataliwa",
      accessDeniedDesc: "Huna ruhusa ya kutazama ukurasa huu.",
      goBack: "Rudi Nyuma",
    }
  };
  const currentText = content[language];

  const handleDutyToggle = (checked: boolean) => {
    setIsOnDuty(checked);
    toast({ title: currentText.dutyStatusChanged, description: currentText.dutyStatusChangedDesc(checked ? (language === 'KSW' ? 'Kazini' : 'On Duty') : (language === 'KSW' ? 'Nje ya Kazi' : 'Off Duty')) });
    if (!checked) {
      setIsTripActive(false); 
      setPassengerCount(0);
    }
  };

  const handleTripToggle = () => {
    setIsTripActive(!isTripActive);
    if (!isTripActive) { 
        setPassengerCount(Math.floor(Math.random() * 10)); 
        toast({ title: currentText.tripStartedToast, description: currentText.tripStartedToastDesc(currentRoute), className: "bg-green-500 text-white" });
    } else { 
        toast({ title: currentText.tripStoppedToast, description: currentText.tripStoppedToastDesc });
        setPassengerCount(0);
    }
  };
  
  const handleLogout = () => {
    localStorage.removeItem('matgoUser');
    window.location.href = "/login";
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
                <Button onClick={() => window.history.back()} className="mt-6 btn-glow-primary">{currentText.goBack}</Button>
            </Card>
        </AppLayout>
    );
  }


  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <Card className="shadow-xl glassy-card">
          <CardHeader className="flex flex-col md:flex-row items-center gap-4 p-6">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage src={crewMember?.profilePic} alt={crewMember?.name || ''} data-ai-hint="driver conductor profile"/>
              <AvatarFallback>{crewMember?.name?.substring(0,2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <CardTitle className="font-headline text-3xl text-primary">{currentText.welcome}</CardTitle>
              <CardDescription className="text-base">{currentText.role} @ {currentText.sacco}</CardDescription>
              <p className="text-sm text-muted-foreground">{currentText.busInfo}</p>
            </div>
            <div className="flex items-center space-x-2 pt-2 md:pt-0">
                <Switch id="dutyToggle" checked={isOnDuty} onCheckedChange={handleDutyToggle} aria-label={currentText.onDutyLabel}/>
                <Label htmlFor="dutyToggle" className="text-base font-semibold">{currentText.onDutyLabel}</Label>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-6 rounded-lg bg-muted/60 p-1">
            <TabsTrigger value="dashboard" className="text-base py-2.5 rounded-md">{currentText.tabs.dashboard}</TabsTrigger>
            <TabsTrigger value="tripLog" className="text-base py-2.5 rounded-md">{currentText.tabs.tripLog}</TabsTrigger>
            <TabsTrigger value="waybill" className="text-base py-2.5 rounded-md">{currentText.tabs.waybill}</TabsTrigger>
            <TabsTrigger value="saccoComms" className="text-base py-2.5 rounded-md">{currentText.tabs.saccoComms}</TabsTrigger>
            <TabsTrigger value="feedback" className="text-base py-2.5 rounded-md">{currentText.tabs.feedback}</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Card className="shadow-lg glassy-card">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-accent">{currentText.tabs.dashboard}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-around gap-4 p-6 border border-primary/20 rounded-lg bg-primary/5">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{currentText.currentRoute}</p>
                    <p className="text-xl font-semibold text-primary">{currentRoute}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">{currentText.passengerCount}</p>
                    <p className="text-xl font-semibold text-primary">{isTripActive ? passengerCount : "-"}</p>
                  </div>
                  <Button onClick={handleTripToggle} disabled={!isOnDuty} size="lg" className={isTripActive ? "bg-red-500 hover:bg-red-600 btn-glow-accent" : "btn-glow-primary"}>
                    {isTripActive ? <StopCircle className="mr-2 h-5 w-5"/> : <PlayCircle className="mr-2 h-5 w-5"/>}
                    {isTripActive ? currentText.stopTrip : currentText.startTrip}
                  </Button>
                </div>
                <Card>
                    <CardHeader><CardTitle className="font-headline text-lg text-primary">{currentText.endShiftSummaryTitle}</CardTitle></CardHeader>
                    <CardContent className="grid grid-cols-2 gap-4 text-sm">
                        <p><strong>{currentText.tripsCompleted}</strong> 0</p>
                        <p><strong>{currentText.totalPassengers}</strong> 0</p>
                        <p><strong>{currentText.totalFareEst}</strong> Ksh 0</p>
                        <Button variant="link" size="sm" className="p-0 text-primary hover:underline col-span-2 justify-start">{currentText.viewFullReport}</Button>
                    </CardContent>
                </Card>
                <Button onClick={handleLogout} variant="outline" className="w-full md:w-auto border-destructive text-destructive hover:bg-destructive/10"><LogOut className="mr-2 h-4 w-4"/>{currentText.logout}</Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tripLog">
            <Card className="shadow-lg glassy-card"><CardHeader><CardTitle className="font-headline text-2xl text-accent">{currentText.tripLogTitle}</CardTitle></CardHeader><CardContent><p className="text-muted-foreground text-center py-8">{currentText.noTripsLogged}</p></CardContent></Card>
          </TabsContent>
          <TabsContent value="waybill">
             <Card className="shadow-lg glassy-card"><CardHeader><CardTitle className="font-headline text-2xl text-accent flex items-center gap-2"><ClipboardList/> {currentText.digitalWaybillTitle}</CardTitle></CardHeader><CardContent><p className="text-muted-foreground text-center py-8">{currentText.noWaybill}</p></CardContent></Card>
          </TabsContent>
          <TabsContent value="saccoComms">
             <Card className="shadow-lg glassy-card">
                <CardHeader><CardTitle className="font-headline text-2xl text-accent flex items-center gap-2"><MessageSquare/> {currentText.saccoCommsTitle}</CardTitle><CardDescription>{currentText.saccoCommsDesc}</CardDescription></CardHeader>
                <CardContent className="space-y-4">
                    <div className="h-48 border rounded-md p-3 bg-muted/20 overflow-y-auto text-sm flex items-center justify-center"><p className="text-muted-foreground">{currentText.noMessages}</p></div>
                    <div className="flex gap-2"><Input placeholder={currentText.typeMessagePlaceholder} className="flex-1 rounded-lg text-base py-2.5"/><Button className="btn-glow-primary rounded-lg text-base py-2.5">{currentText.sendMessage}</Button></div>
                </CardContent>
             </Card>
          </TabsContent>
          <TabsContent value="feedback">
            <Card className="shadow-lg glassy-card">
                <CardHeader><CardTitle className="font-headline text-2xl text-accent flex items-center gap-2"><Star className="fill-yellow-400 text-yellow-400"/>{currentText.myFeedbackTitle}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center gap-2"><p className="font-semibold">{currentText.overallRating}</p><div className="flex items-center text-yellow-400"><Star className="h-5 w-5 fill-current"/> <span className="ml-1 text-muted-foreground">({crewMember?.rating.toFixed(1)}/5.0)</span></div></div>
                    <h4 className="font-semibold pt-2 border-t">{currentText.recentFeedback}</h4>
                    <p className="text-muted-foreground">{currentText.noFeedbackYet}</p>
                </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </div>
    </AppLayout>
  );
}
