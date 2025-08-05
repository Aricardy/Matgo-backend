
"use client";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, MapPin, Clock, Star, Edit3, Zap, BusFront, QrCode, BellRing, ShieldCheck, RadioTower, Palette, HelpCircle, Coins } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

interface FavoriteRoute {
  from: string;
  to: string;
  matatu: string;
  eta: string;
  type: string;
  imageHint: string;
}

interface FavoriteMatatu {
  name: string;
  route: string;
  image: string;
  imageHint: string;
  type: string;
}

interface NearbyMatatu {
  name: string;
  route: string;
  distance: string;
  type: string;
  eta: string;
  imageHint: string;
}

export default function DashboardPage() {
  const [userName, setUserName] = useState("User");
  const [userFullName, setUserFullName] = useState("User Passenger");
  const [currentTime, setCurrentTime] = useState("");
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  // State for dynamic data
  const [favoriteRoutes, setFavoriteRoutes] = useState<FavoriteRoute[]>([]);
  const [favoriteMatatus, setFavoriteMatatus] = useState<FavoriteMatatu[]>([]);
  const [nearbyMatatus, setNearbyMatatus] = useState<NearbyMatatu[]>([]);

  useEffect(() => {
    // Simulate fetching all dashboard data
    const fetchData = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Data is now fetched from an API, so we initialize as empty
        setFavoriteRoutes([]);
        setFavoriteMatatus([]);
        setNearbyMatatus([]);

        setIsLoading(false);
    };
    fetchData();

    const storedUser = localStorage.getItem('matgoUser');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUserName(userData.firstName || "User");
        setUserFullName( (userData.firstName && userData.lastName) ? `${userData.firstName} ${userData.lastName}` : userData.firstName || "User");
      } catch (error) {
        console.error("Failed to parse user data from localStorage", error);
        setUserName("User");
        setUserFullName("User Passenger");
      }
    } else {
      setUserName("User"); 
      setUserFullName("User Passenger");
    }

    const updateTime = () => {
      setCurrentTime(new Date().toLocaleTimeString(language === 'KSW' ? 'sw-KE' : 'en-US', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timerId = setInterval(updateTime, 60000);
    return () => clearInterval(timerId);
  }, [language]);


  const content = {
    ENG: {
      greeting: `Hello, ${userName}!`,
      subGreeting: `Ready for your next ride? Let's Go!`,
      quickActions: { scanPay: "Scan & Pay", bookTrip: "Book Trip", reportIssue: "Report Issue", alerts: "Alerts" },
      liveTripStatusTitle: "Live Trip Status",
      liveTripStatusDesc: "Your current trip details or next upcoming trip.",
      noActiveTrip: "No active trip. Ready to start one?",
      favoriteRoutesTitle: "Favorite Routes",
      manageFavorites: "Manage",
      nearbyMatatusTitle: "Nearby Matatus",
      bookNow: "Book Now",
      trackLive: "Track Live",
      planLongDistance: "Plan a Long Distance Trip",
      favoriteMatatusTitle: "Favorite Nganyas & Buses",
      nganyaShowcaseTitle: "Nganya Showcase",
      nganyaShowcaseDesc: "Explore the art & vibe!",
      lostAndFoundTitle: "Lost & Found",
      lostAndFoundDesc: "Report or find items.",
      fareCalculatorTitle: "Quick Fare Calculator",
      calculateFare: "Calculate",
      fromLabel: "From",
      toLabel: "To",
      noFavoriteRoutes: "Add your frequent routes for quick access!",
      noFavoriteMatatus: "Like a Matatu? Add it to your favorites!",
      noNearbyMatatus: "No matatus detected nearby."
    },
    KSW: {
      greeting: `Habari, ${userName}!`,
      subGreeting: `Uko tayari kwa safari ijayo? Twende!`,
      quickActions: { scanPay: "Skani & Lipa", bookTrip: "Agiza Safari", reportIssue: "Ripoti Tatizo", alerts: "Arifa" },
      liveTripStatusTitle: "Hali ya Safari Moja kwa Moja",
      liveTripStatusDesc: "Maelezo ya safari yako ya sasa au ijayo.",
      noActiveTrip: "Hakuna safari inayoendelea. Uko tayari kuanza moja?",
      favoriteRoutesTitle: "Njia Pendwa",
      manageFavorites: "Dhibiti",
      nearbyMatatusTitle: "Matatu Zilizo Karibu",
      bookNow: "Agiza Sasa",
      trackLive: "Fuatilia Moja kwa Moja",
      planLongDistance: "Panga Safari Ndefu",
      favoriteMatatusTitle: "Nganya na Mabasi Pendwa",
      nganyaShowcaseTitle: "Maonyesho ya Nganya",
      nganyaShowcaseDesc: "Gundua sanaa na vibe!",
      lostAndFoundTitle: "Vilivyopotea na Kupatikana",
      lostAndFoundDesc: "Ripoti au pata vitu.",
      fareCalculatorTitle: "Kikokotoo cha Nauli Haraka",
      calculateFare: "Kokotoa",
      fromLabel: "Kutoka",
      toLabel: "Kenda",
      noFavoriteRoutes: "Ongeza njia unazotumia mara kwa mara kwa ufikiaji wa haraka!",
      noFavoriteMatatus: "Umependa Matatu? Iongeze kwenye vipendwa vyako!",
      noNearbyMatatus: "Hakuna matatu zilizoonekana karibu."
    },
  };
  const currentContent = content[language];
  
  const renderLoadingSkeleton = () => (
    <div className="space-y-8">
        <Skeleton className="h-24 w-full rounded-xl"/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-48 w-full rounded-xl"/>
            <Skeleton className="h-48 w-full rounded-xl"/>
        </div>
    </div>
  );


  return (
    <AppLayout>
      <div className="animated-bg-container" aria-hidden="true">
        <div className="animated-bg-collage">
          {/* Background images remain as they are part of the theme, not data */}
          {[...Array(20)].map((_, i) => (
             <Image key={i} src={`/images/dashboard/bg_${(i % 10) + 1}.png`} alt="background collage" width={300} height={200} className="object-cover" priority={i < 10}/>
          ))}
        </div>
        <div className="bg-overlay"></div> 
      </div>
      <div className="space-y-8 animate-fade-in relative z-[1]">
        <section className="p-6 md:p-8 rounded-xl bg-gradient-to-br from-primary via-primary/80 to-accent text-primary-foreground shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
             <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#smallGrid)" /></svg>
          </div>
          <div className="relative z-10">
            <h1 className="font-headline text-4xl md:text-5xl font-bold">{currentContent.greeting.replace(userName, userFullName)}</h1>
            <p className="mt-2 text-lg md:text-xl opacity-90">
              {currentTime ? `${language === 'KSW' ? 'Ni saa ' : "It's "}${currentTime}. ` : ""}
              {currentContent.subGreeting}
            </p>
          </div>
        </section>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <Card className="shadow-lg hover:shadow-primary/20 transition-shadow glassy-card items-center justify-center flex flex-col p-3 md:p-4 text-center">
            <Button asChild variant="ghost" className="h-auto w-full flex flex-col items-center gap-1.5 py-3 group">
              <Link href="/scan" className="flex flex-col items-center text-center">
                <QrCode className="h-7 w-7 md:h-8 md:w-8 text-primary transition-transform group-hover:scale-110" />
                <span className="text-xs md:text-sm font-medium mt-1 text-foreground group-hover:text-primary">{currentContent.quickActions.scanPay}</span>
              </Link>
            </Button>
          </Card>
           <Card className="shadow-lg hover:shadow-primary/20 transition-shadow glassy-card items-center justify-center flex flex-col p-3 md:p-4 text-center">
            <Button asChild variant="ghost" className="h-auto w-full flex flex-col items-center gap-1.5 py-3 group">
              <Link href="/booking" className="flex flex-col items-center text-center">
                <BusFront className="h-7 w-7 md:h-8 md:w-8 text-primary transition-transform group-hover:scale-110" />
                <span className="text-xs md:text-sm font-medium mt-1 text-foreground group-hover:text-primary">{currentContent.quickActions.bookTrip}</span>
              </Link>
            </Button>
          </Card>
          <Card className="shadow-lg hover:shadow-destructive/20 transition-shadow glassy-card items-center justify-center flex flex-col p-3 md:p-4 text-center">
            <Button asChild variant="ghost" className="h-auto w-full flex flex-col items-center gap-1.5 py-3 group">
              <Link href="/report-abuse" className="flex flex-col items-center text-center">
                <ShieldCheck className="h-7 w-7 md:h-8 md:w-8 text-destructive transition-transform group-hover:scale-110" />
                <span className="text-xs md:text-sm font-medium mt-1 text-foreground group-hover:text-destructive">{currentContent.quickActions.reportIssue}</span>
              </Link>
            </Button>
          </Card>
           <Card className="shadow-lg hover:shadow-yellow-400/20 transition-shadow glassy-card items-center justify-center flex flex-col p-3 md:p-4 text-center">
            <Button asChild variant="ghost" className="h-auto w-full flex flex-col items-center gap-1.5 py-3 group">
              <Link href="/notifications" className="flex flex-col items-center text-center">
                <BellRing className="h-7 w-7 md:h-8 md:w-8 text-yellow-500 transition-transform group-hover:scale-110" />
                <span className="text-xs md:text-sm font-medium mt-1 text-foreground group-hover:text-yellow-500">{currentContent.quickActions.alerts}</span>
              </Link>
            </Button>
          </Card>
        </div>
        
        {isLoading ? <Skeleton className="h-40 w-full rounded-xl"/> : (
        <Card className="shadow-lg transform transition-all hover:shadow-primary/20 hover:shadow-xl glassy-card">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><RadioTower className="h-6 w-6 animate-pulse text-green-400"/>{currentContent.liveTripStatusTitle}</CardTitle>
            <CardDescription>{currentContent.liveTripStatusDesc}</CardDescription>
          </CardHeader>
          <CardContent className="text-center py-8 text-muted-foreground">
            <p>{currentContent.noActiveTrip}</p>
          </CardContent>
        </Card>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="shadow-lg glassy-card">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><Coins className="h-6 w-6"/>{currentContent.fareCalculatorTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Input placeholder={currentContent.fromLabel} className="text-base py-2.5"/>
                    <Input placeholder={currentContent.toLabel} className="text-base py-2.5"/>
                    <Button className="w-full btn-glow-primary">{currentContent.calculateFare}</Button>
                    <p className="text-center text-muted-foreground text-sm">{language === 'KSW' ? 'Pata makadirio ya nauli.' : 'Get fare estimates.'}</p>
                </CardContent>
            </Card>
            <Card className="shadow-lg glassy-card group hover:border-primary/50 transition-all">
                 <Link href="/nganya-gallery">
                    <CardHeader className="items-center text-center">
                        <Palette className="h-12 w-12 text-accent mb-2 transition-transform group-hover:scale-110"/>
                        <CardTitle className="font-headline text-2xl text-primary group-hover:text-accent">{currentContent.nganyaShowcaseTitle}</CardTitle>
                        <CardDescription>{currentContent.nganyaShowcaseDesc}</CardDescription>
                    </CardHeader>
                </Link>
            </Card>
             <Card className="shadow-lg glassy-card group hover:border-primary/50 transition-all md:col-span-2">
                 <Link href="/lost-found">
                    <CardHeader className="items-center text-center">
                        <HelpCircle className="h-12 w-12 text-blue-500 mb-2 transition-transform group-hover:scale-110"/>
                        <CardTitle className="font-headline text-2xl text-primary group-hover:text-blue-500">{currentContent.lostAndFoundTitle}</CardTitle>
                        <CardDescription>{currentContent.lostAndFoundDesc}</CardDescription>
                    </CardHeader>
                </Link>
            </Card>
        </div>


        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-headline text-3xl flex items-center gap-2"><Star className="h-7 w-7 text-yellow-400 fill-current"/>{currentContent.favoriteRoutesTitle}</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile#favorites"><Edit3 className="mr-1.5 h-4 w-4"/> {currentContent.manageFavorites}</Link>
            </Button>
          </div>
          {isLoading ? renderLoadingSkeleton() : favoriteRoutes.length === 0 ? (
            <Card className="text-center py-10 glassy-card"><p className="text-muted-foreground">{currentContent.noFavoriteRoutes}</p></Card>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favoriteRoutes.map((route, index) => (
              <Card key={index} className="overflow-hidden transform transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary glassy-card group">
                 <CardHeader className="p-0 relative">
                  <Image 
                    src={`/images/dashboard/fav_route_${index + 1}.png`} 
                    alt={route.matatu}
                    data-ai-hint={route.imageHint}
                    width={600} height={300} 
                    className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <span className="absolute top-2 right-2 text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full font-semibold shadow-md">{route.type}</span>
                  <CardTitle className="font-headline text-xl text-white absolute bottom-3 left-3 drop-shadow-lg">{route.from} → {route.to}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm font-semibold text-foreground">{route.matatu}</p>
                  <div className="mt-2 flex items-center text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1.5 text-primary" /> {language === 'KSW' ? 'ETA:' : 'ETA:'} {route.eta}
                  </div>
                  <Button variant="default" className="w-full mt-4 btn-glow-primary">
                    {currentContent.bookNow}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </section>
        
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-headline text-3xl flex items-center gap-2"><BusFront className="h-7 w-7 text-yellow-400"/>{currentContent.favoriteMatatusTitle}</h2>
            <Button variant="outline" size="sm" asChild>
              <Link href="/profile#favoriteMatatus"><Edit3 className="mr-1.5 h-4 w-4"/> {currentContent.manageFavorites}</Link>
            </Button>
          </div>
          {isLoading ? renderLoadingSkeleton() : favoriteMatatus.length === 0 ? (
            <Card className="text-center py-10 glassy-card"><p className="text-muted-foreground">{currentContent.noFavoriteMatatus}</p></Card>
          ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {favoriteMatatus.map((matatu, index) => (
              <Card key={index} className="overflow-hidden transform transition-all hover:shadow-xl hover:-translate-y-1 hover:border-primary glassy-card group">
                 <CardHeader className="p-0 relative">
                  <Image 
                    src={matatu.image} 
                    alt={matatu.name}
                    data-ai-hint={matatu.imageHint}
                    width={300} height={200} 
                    className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  <span className="absolute top-2 right-2 text-xs bg-accent text-accent-foreground px-2 py-1 rounded-full font-semibold shadow-md">{matatu.type}</span>
                  <CardTitle className="font-headline text-xl text-white absolute bottom-3 left-3 drop-shadow-lg">{matatu.name}</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-sm text-muted-foreground">{matatu.route}</p>
                  <Button variant="default" className="w-full mt-4 btn-glow-primary">
                    {currentContent.bookNow}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </section>


        <section>
          <h2 className="font-headline text-3xl mb-4 flex items-center gap-2"><MapPin className="h-7 w-7 text-accent"/>{currentContent.nearbyMatatusTitle}</h2>
           {isLoading ? renderLoadingSkeleton() : nearbyMatatus.length === 0 ? (
            <Card className="text-center py-10 glassy-card"><p className="text-muted-foreground">{currentContent.noNearbyMatatus}</p></Card>
           ) : (
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {nearbyMatatus.map((matatu, index) => (
              <Card key={index} className="shadow-md transform transition-all hover:shadow-lg hover:-translate-y-0.5 glassy-card group">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="font-headline text-xl flex items-center gap-2"><BusFront className="h-5 w-5 text-primary"/>{matatu.name}</CardTitle>
                    <span className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded-full font-semibold">{matatu.type}</span>
                  </div>
                  <CardDescription>{matatu.route}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>{language === 'KSW' ? 'Umbali:' : 'Distance:'} {matatu.distance}</span>
                    <span>{language === 'KSW' ? 'Makadirio ya Kuwasili:' : 'Est. Arrival:'} {matatu.eta}</span>
                  </div>
                  <div className="mt-3 h-40 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                     <Image src="/images/dashboard/map_placeholder.png" data-ai-hint={matatu.imageHint + " map"} alt="Map placeholder" width={400} height={200} className="object-cover rounded-md w-full h-full transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <Button className="w-full mt-4 btn-glow-primary">{currentContent.trackLive}</Button>
                </CardContent>
              </Card>
            ))}
          </div>
          )}
        </section>
        
        <section className="text-center mt-12">
            <Button size="lg" variant="link" asChild className="font-headline text-xl text-primary hover:text-accent transition-colors duration-300 group">
                <Link href="/booking">{currentContent.planLongDistance} <ArrowRight className="ml-2 transition-transform duration-300 group-hover:translate-x-1"/></Link>
            </Button>
        </section>
      </div>
    </AppLayout>
  );
}
