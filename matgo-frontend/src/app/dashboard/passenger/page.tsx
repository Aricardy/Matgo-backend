// ...existing code (keep only one set of imports and one default export)...
"use client";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, MapPin, Clock, Star, Edit3, BusFront, QrCode, BellRing, ShieldCheck, RadioTower, Palette, HelpCircle, Coins, Crown, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

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

interface FeaturedBus {
    id: string;
    name: string;
    sacco: string;
    route: string;
    image: string;
    imageHint: string;
    reason: string;
}

export default function PassengerDashboardPage() {
  const [userName, setUserName] = useState("User");
  const [userFullName, setUserFullName] = useState("User Passenger");
  const [currentTime, setCurrentTime] = useState("");
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);

  const [favoriteRoutes, setFavoriteRoutes] = useState<FavoriteRoute[]>([]);
  const [favoriteMatatus, setFavoriteMatatus] = useState<FavoriteMatatu[]>([]);
  const [nearbyMatatus, setNearbyMatatus] = useState<NearbyMatatu[]>([]);
  const [busOfTheWeek, setBusOfTheWeek] = useState<FeaturedBus | null>(null);
  const [featuredBuses, setFeaturedBuses] = useState<FeaturedBus[]>([]);


  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('matgoToken');
        
        try {
          // Fetch featured matatus/buses
          const featuredResponse = await fetch('/api/featured-matatus');
          if (featuredResponse.ok) {
            const featured = await featuredResponse.json();
            if (featured.length > 0) {
              // Set the first one as bus of the week
              setBusOfTheWeek({
                id: featured[0].id,
                name: featured[0].name || featured[0].plateNumber,
                sacco: featured[0].sacco || "MatGo Fleet",
                route: featured[0].route || "City Route",
                image: featured[0].image || "/images/matatus/default.png",
                imageHint: featured[0].imageHint || "matatu exterior",
                reason: featured[0].reason || "Popular choice this week!"
              });
              
              // Set the rest as featured buses
              setFeaturedBuses(featured.slice(1, 5).map((bus: any) => ({
                id: bus.id,
                name: bus.name || bus.plateNumber,
                sacco: bus.sacco || "MatGo Fleet",
                route: bus.route || "City Route",
                image: bus.image || "/images/matatus/default.png",
                imageHint: bus.imageHint || "matatu exterior",
                reason: bus.reason || "Highly rated by passengers"
              })));
            }
          }
          
          // Fetch user's favorite routes
          if (token) {
            const favoritesResponse = await fetch('/api/users/favorites/routes', {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (favoritesResponse.ok) {
              const favorites = await favoritesResponse.json();
              setFavoriteRoutes(favorites.map((route: any) => ({
                from: route.from || route.origin,
                to: route.to || route.destination,
                matatu: route.matatu || route.vehicleName || "Matatu",
                eta: route.eta || "15 min",
                type: route.type || "Regular",
                imageHint: route.imageHint || "matatu route"
              })));
            }
          }
          
          // For now, set empty arrays for data not yet available from backend
          setFavoriteMatatus([]);
          setNearbyMatatus([]);
          
        } catch (error) {
          console.error('Error fetching dashboard data:', error);
          // Fallback to empty data
          setFavoriteRoutes([]);
          setFavoriteMatatus([]);
          setNearbyMatatus([]);
          setBusOfTheWeek(null);
          setFeaturedBuses([]);
        }
        
        setIsLoading(false);
    };
    fetchData();

    // Fetch user profile from backend
    const token = localStorage.getItem('matgoToken');
    if (token) {
      fetch('http://localhost:5000/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(response => response.json())
      .then(profile => {
        setUserName(profile.firstName || profile.fullName?.split(' ')[0] || "User");
        setUserFullName(profile.fullName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || "User");
        // Update localStorage with fresh user data
        localStorage.setItem('matgoUser', JSON.stringify(profile));
      })
      .catch(() => {
        // Fallback to stored user data
        const storedUser = localStorage.getItem('matgoUser');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            setUserName(userData.firstName || "User");
            setUserFullName(userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || "User");
          } catch {
            setUserName("User");
            setUserFullName("User");
          }
        }
      });
    } else {
      // No token, use stored data
      const storedUser = localStorage.getItem('matgoUser');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUserName(userData.firstName || "User");
          setUserFullName(userData.fullName || `${userData.firstName || ''} ${userData.lastName || ''}`.trim() || "User");
        } catch {
          setUserName("User");
          setUserFullName("User");
        }
      }
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
      greeting: "Hello",
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
      noNearbyMatatus: "No matatus detected nearby.",
      busOfTheWeek: "Bus of the Week",
      featuredBuses: "Featured Buses"
    },
    KSW: {
      greeting: "Habari",
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
      noNearbyMatatus: "Hakuna matatu zilizoonekana karibu.",
      busOfTheWeek: "Basi la Wiki",
      featuredBuses: "Mabasi Maarufu"
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
        <div className="fixed-collage-grid">
           {/* Static images for the landing page background */}
        </div>
        <div className="bg-overlay"></div> 
      </div>
      <div className="space-y-8 animate-fade-in relative z-[1]">
        <section className="p-6 md:p-8 rounded-xl bg-gradient-to-br from-primary/80 via-primary/70 to-accent/70 text-primary-foreground shadow-2xl relative overflow-hidden glassy-card">
           <div className="relative z-10">
            <h1 className="font-headline text-4xl md:text-5xl font-bold">{currentContent.greeting}, {userName}!</h1>
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
              <Link href="/book" className="flex flex-col items-center text-center">
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

        {isLoading ? <Skeleton className="h-64 w-full rounded-xl"/> : busOfTheWeek && (
            <section>
                <h2 className="font-headline text-3xl mb-4 flex items-center gap-2"><Crown className="h-7 w-7 text-yellow-400"/>{currentContent.busOfTheWeek}</h2>
                <Card className="overflow-hidden transform transition-all hover:shadow-2xl hover:-translate-y-1 glassy-card group border-2 border-yellow-400/50 hover:border-yellow-400">
                    <CardHeader className="p-0 relative">
                        <Image src={busOfTheWeek.image} alt={busOfTheWeek.name} data-ai-hint={busOfTheWeek.imageHint} width={800} height={400} className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"/>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                        <div className="absolute top-3 right-3">
                           <Badge className="bg-yellow-400 text-black hover:bg-yellow-500 text-sm py-1 px-3"><Crown className="mr-1.5 h-4 w-4"/> {currentContent.busOfTheWeek}</Badge>
                        </div>
                        <CardTitle className="font-headline text-3xl text-white absolute bottom-4 left-4 drop-shadow-lg">{busOfTheWeek.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 bg-card/80">
                        <p className="font-semibold text-lg text-foreground">{busOfTheWeek.sacco} - {busOfTheWeek.route}</p>
                        <p className="text-sm text-muted-foreground italic mt-1">"{busOfTheWeek.reason}"</p>
                        <Button className="w-full mt-4 btn-glow-primary">{currentContent.bookNow}</Button>
                    </CardContent>
                </Card>
            </section>
        )}

        {isLoading ? <Skeleton className="h-64 w-full rounded-xl"/> : featuredBuses.length > 0 && (
            <section>
                <h2 className="font-headline text-3xl mb-4 flex items-center gap-2"><Award className="h-7 w-7 text-accent"/>{currentContent.featuredBuses}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {featuredBuses.map(bus => (
                        <Card key={bus.id} className="overflow-hidden transform transition-all hover:shadow-xl hover:-translate-y-1 glassy-card group hover:border-primary/50">
                            <CardHeader className="p-0 relative">
                                <Image src={bus.image} alt={bus.name} data-ai-hint={bus.imageHint} width={600} height={300} className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"/>
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                                <CardTitle className="font-headline text-xl text-white absolute bottom-3 left-3 drop-shadow-lg">{bus.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="p-4">
                                <p className="font-semibold text-foreground">{bus.sacco} - {bus.route}</p>
                                <p className="text-sm text-muted-foreground italic mt-1">"{bus.reason}"</p>
                                <Button variant="default" className="w-full mt-4 btn-glow-primary">{currentContent.bookNow}</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>
        )}

      </div>
    </AppLayout>
  );
}
