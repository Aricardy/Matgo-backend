
"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Edit3, Save, Camera, MapPin, CalendarDays, Repeat, ShieldCheck, LogOut, Star, Languages, Palette, Bell, Heart, Bus, Route, ArrowRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Switch } from "@/components/ui/switch";
import ThemeToggle from "@/components/ThemeToggle";
import LanguageToggle from "@/components/LanguageToggle";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface Trip {
  id: string;
  type: "Long Trip" | "RoadTrip" | "Daily Commute";
  route: string;
  date: string;
  price: number;
  status: "Completed" | "Upcoming" | "Cancelled";
  rating?: number;
  feedback?: string;
  image?: string;
  imageHint?: string;
}

interface FavoriteRoute {
  id: string;
  from: string;
  to: string;
  estTime: string;
  typicalFare: string;
}

interface FavoriteMatatu {
    id: string;
    name: string;
    type: string;
    commonRoute: string;
    image: string;
    imageHint: string;
}

const defaultUser = {
  firstName: "Juma",
  lastName: "Otieno",
  phone: "0712345678",
  email: "juma.otieno@matgo.co.ke",
  profilePic: "/avatars/default_avatar.png",
  nationalId: "12345678"
};

export default function PassengerProfilePage() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState(defaultUser);
  const [isLoading, setIsLoading] = useState(true);
  
  const [tripHistory, setTripHistory] = useState<Trip[]>([]);
  const [favoriteRoutes, setFavoriteRoutes] = useState<FavoriteRoute[]>([]);
  const [favoriteMatatus, setFavoriteMatatus] = useState<FavoriteMatatu[]>([]);
  
  const [currentTripToRate, setCurrentTripToRate] = useState<Trip | null>(null);
  const [rating, setRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState("");

  const { toast } = useToast();
  const { language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        
        const storedUser = localStorage.getItem('matgoUser');
        if (storedUser) {
          try {
            const userData = JSON.parse(storedUser);
            if (userData.role !== 'passenger') {
                router.replace('/dashboard'); 
                return;
            }

            await new Promise(resolve => setTimeout(resolve, 1000));
            setTripHistory([]);
            setFavoriteRoutes([]);
            setFavoriteMatatus([]);

            setUser(prev => ({ 
              ...prev, 
              firstName: userData.firstName || defaultUser.firstName,
              lastName: userData.lastName || defaultUser.lastName,
              email: userData.email || defaultUser.email,
              phone: userData.phone || defaultUser.phone,
              profilePic: userData.profilePic || '/avatars/default_avatar.png',
            }));
          } catch (error) {
            console.error("Failed to parse user data from localStorage", error);
            router.replace('/login');
            return;
          }
        } else {
           router.replace('/login');
           return;
        }
        setIsLoading(false);
    };
    fetchData();
  }, [language, router]);


  const content = {
    ENG: {
      editProfile: "Edit Profile",
      saveProfile: "Save Changes",
      profileUpdated: "Profile Updated",
      profileUpdatedDesc: "Your information has been saved.",
      tabs: {
        personalInfo: "Personal Info",
        tripHistory: "Trip History",
        favorites: "My Favorites",
        preferences: "Preferences",
        security: "Security",
      },
      personalInfoTitle: "Personal Information",
      firstNameLabel: "First Name",
      lastNameLabel: "Last Name",
      phoneLabel: "Phone Number",
      emailLabel: "Email Address",
      nationalIdLabel: "National ID (Optional)",
      tripHistoryTitle: "Your Trips & Adventures",
      tripHistoryDesc: "Review your past and upcoming journeys. Rate your experiences!",
      noTrips: "No trips recorded yet. Time for an adventure!",
      bookAgain: "Book Again",
      viewReceipt: "View Receipt",
      rateThisTrip: "Rate this trip:",
      shareExperiencePlaceholder: "Share your experience (optional)...",
      submitFeedback: "Submit Feedback",
      cancel: "Cancel",
      feedbackSubmitted: "Feedback Submitted",
      feedbackSubmittedDesc: (route: string) => `Thanks for rating your trip to ${route}!`,
      rateTripButton: "Rate Trip",
      preferencesTitle: "App Preferences",
      themeLabel: "Theme (Dark/Light)",
      languageLabel: "Language",
      pushNotificationsLabel: "Push Notifications",
      locationAccessLabel: "Precise Location Access",
      logout: "Logout",
      securityTitle: "Account Security",
      currentPasswordLabel: "Current Password",
      newPasswordLabel: "New Password",
      confirmNewPasswordLabel: "Confirm New Password",
      updatePassword: "Update Password",
      twoFactorAuthTitle: "Two-Factor Authentication (2FA)",
      twoFactorAuthDesc: "Add an extra layer of security to your MatGo account. Highly recommended.",
      enable2FA: "Enable 2FA",
      favoritesTitle: "Your Favorites",
      favoriteRoutesTitle: "Favorite Routes",
      addFavoriteRoute: "Add Favorite Route",
      noFavoriteRoutes: "No favorite routes saved yet. Add some for quick booking!",
      favoriteMatatusTitle: "Favorite Matatus & Buses",
      addFavoriteMatatu: "Add Favorite Matatu/Bus",
      noFavoriteMatatus: "No favorite matatus or buses saved. Explore and add your best rides!",
      unfavorite: "Unfavorite",
      bookWithThisMatatu: "Book with this Matatu",
      imageUploadNote: "Image will be saved with a name based on your user ID for easy retrieval.",
    },
    KSW: {
      editProfile: "Badilisha Profaili",
      saveProfile: "Hifadhi Profaili",
      profileUpdated: "Profaili Imehifadhiwa",
      profileUpdatedDesc: "Taarifa zako zimehifadhiwa.",
      tabs: {
        personalInfo: "Taarifa Binafsi",
        tripHistory: "Historia ya Safari",
        favorites: "Vipendwa Vyangu",
        preferences: "Mapendeleo",
        security: "Usalama",
      },
      personalInfoTitle: "Taarifa Binafsi",
      firstNameLabel: "Jina la Kwanza",
      lastNameLabel: "Jina la Ukoo",
      phoneLabel: "Nambari ya Simu",
      emailLabel: "Anwani ya Barua Pepe",
      nationalIdLabel: "Kitambulisho cha Taifa (Si lazima)",
      tripHistoryTitle: "Safari Zako na Matukio",
      tripHistoryDesc: "Kagua safari zako zilizopita na zijazo. Toa maoni kuhusu uzoefu wako!",
      noTrips: "Hakuna safari zilizorekodiwa bado. Wakati wa tukio!",
      bookAgain: "Weka Nafasi Tena",
      viewReceipt: "Tazama Risiti",
      rateThisTrip: "Kadiria safari hii:",
      shareExperiencePlaceholder: "Shiriki uzoefu wako (si lazima)...",
      submitFeedback: "Tuma Maoni",
      cancel: "Ghairi",
      feedbackSubmitted: "Maoni Yametumwa",
      feedbackSubmittedDesc: (route: string) => `Asante kwa kukadiria safari yako ya ${route}!`,
      rateTripButton: "Kadiria Safari",
      preferencesTitle: "Mapendeleo ya Programu",
      themeLabel: "Mandhari (Giza/Mwangaza)",
      languageLabel: "Lugha",
      pushNotificationsLabel: "Arifa za Moja kwa Moja",
      locationAccessLabel: "Ufikiaji Sahihi wa Mahali",
      logout: "Ondoka",
      securityTitle: "Usalama wa Akaunti",
      currentPasswordLabel: "Nenosiri la Sasa",
      newPasswordLabel: "Nenosiri Jipya",
      confirmNewPasswordLabel: "Thibitisha Nenosiri Jipya",
      updatePassword: "Sasisha Nenosiri",
      twoFactorAuthTitle: "Uthibitishaji wa Vipengele Viwili (2FA)",
      twoFactorAuthDesc: "Ongeza safu ya ziada ya usalama kwenye akaunti yako ya MatGo. Inapendekezwa sana.",
      enable2FA: "Wezesha 2FA",
      favoritesTitle: "Vipendwa Vyako",
      favoriteRoutesTitle: "Njia Pendwa",
      addFavoriteRoute: "Ongeza Njia Pendwa",
      noFavoriteRoutes: "Hakuna njia pendwa zilizohifadhiwa. Ongeza baadhi kwa uhifadhi wa haraka!",
      favoriteMatatusTitle: "Matatu na Mabasi Pendwa",
      addFavoriteMatatu: "Ongeza Matatu/Basi Pendwa",
      noFavoriteMatatus: "Hakuna matatu au mabasi pendwa yaliyohifadhiwa. Gundua na uongeze safari zako bora!",
      unfavorite: "Acha Kupenda",
      bookWithThisMatatu: "Weka Nafasi na Matatu Hii",
      imageUploadNote: "Picha itahifadhiwa na jina linalotegemea kitambulisho chako cha mtumiaji kwa urahisi wa kuipata.",
    },
  };
  const currentContent = content[language];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setUser(prev => ({ ...prev, [id]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setUser(prev => ({ ...prev, profilePic: event.target?.result as string }));
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  const saveProfile = () => {
    setIsEditing(false);
    const { profilePic, ...restOfUser } = user;
    localStorage.setItem('matgoUser', JSON.stringify({ ...restOfUser, profilePic: user.profilePic }));
    toast({ title: currentContent.profileUpdated, description: currentContent.profileUpdatedDesc, className: "bg-green-500 text-white" });
  };

  const handleLogout = () => {
    localStorage.removeItem('matgoUser');
    window.location.href = "/login";
  };

  const handleRateTrip = (trip: Trip) => {
    setCurrentTripToRate(trip);
    setRating(trip.rating || 0);
    setFeedbackText(trip.feedback || "");
  };

  const submitRating = () => {
    if (!currentTripToRate) return;
    setTripHistory(prev => prev.map(t => t.id === currentTripToRate.id ? {...t, rating, feedback: feedbackText} : t));
    toast({title: currentContent.feedbackSubmitted, description: currentContent.feedbackSubmittedDesc(currentTripToRate.route)});
    setCurrentTripToRate(null);
    setRating(0);
    setFeedbackText("");
  };
  
  const renderLoadingSkeleton = () => (
    <div className="space-y-8">
        <Skeleton className="h-40 w-full rounded-xl"/>
        <Skeleton className="h-10 w-full rounded-xl"/>
        <Skeleton className="h-64 w-full rounded-xl"/>
    </div>
  );

  if (isLoading) {
    return <AppLayout>{renderLoadingSkeleton()}</AppLayout>;
  }

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <Card className="shadow-xl glassy-card">
          <CardHeader className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left p-6">
            <div className="relative group">
              <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-primary shadow-lg">
                <AvatarImage src={user.profilePic} alt={`${user.firstName} ${user.lastName}`} data-ai-hint="profile person" />
                <AvatarFallback className="text-4xl bg-primary/20 text-primary">{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <label htmlFor="profilePicUpload" className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2">
                  <Camera className="h-10 w-10 text-white" />
                  <span className="text-xs text-center text-white mt-1">{currentContent.imageUploadNote}</span>
                  <input type="file" id="profilePicUpload" accept="image/*" className="sr-only" onChange={handleImageUpload} />
                </label>
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="font-headline text-3xl md:text-4xl text-primary">
                {user.firstName} {user.lastName}
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-1">{user.email}</CardDescription>
              <p className="text-md text-muted-foreground">{user.phone}</p>
            </div>
            <div>
              {isEditing ? (
                <Button onClick={saveProfile} className="transition-transform hover:scale-105 btn-glow-primary text-base px-6 py-3 rounded-lg">
                  <Save className="mr-2 h-5 w-5"/>{currentContent.saveProfile}
                </Button>
              ) : (
                <Button variant="outline" onClick={toggleEdit} className="transition-transform hover:scale-105 border-primary text-primary hover:bg-primary/10 text-base px-6 py-3 rounded-lg">
                  <Edit3 className="mr-2 h-5 w-5"/>{currentContent.editProfile}
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="personalInfo" className="w-full">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 md:grid-cols-5 mb-6 rounded-lg bg-muted/50 p-1">
            <TabsTrigger value="personalInfo" className="text-base py-2.5 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">{currentContent.tabs.personalInfo}</TabsTrigger>
            <TabsTrigger value="tripHistory" className="text-base py-2.5 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">{currentContent.tabs.tripHistory}</TabsTrigger>
             <TabsTrigger value="favorites" id="favorites" className="text-base py-2.5 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">{currentContent.tabs.favorites}</TabsTrigger>
            <TabsTrigger value="settings" className="text-base py-2.5 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">{currentContent.tabs.preferences}</TabsTrigger>
            <TabsTrigger value="security" className="text-base py-2.5 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">{currentContent.tabs.security}</TabsTrigger>
          </TabsList>

          <TabsContent value="personalInfo">
            <Card className="shadow-lg glassy-card">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">{currentContent.personalInfoTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="firstName" className="font-semibold text-base">{currentContent.firstNameLabel}</Label>
                    <Input id="firstName" value={user.firstName} onChange={handleInputChange} disabled={!isEditing} className="text-base py-3 rounded-lg mt-1"/>
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="font-semibold text-base">{currentContent.lastNameLabel}</Label>
                    <Input id="lastName" value={user.lastName} onChange={handleInputChange} disabled={!isEditing} className="text-base py-3 rounded-lg mt-1"/>
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone" className="font-semibold text-base">{currentContent.phoneLabel}</Label>
                  <Input id="phone" type="tel" value={user.phone} onChange={handleInputChange} disabled={!isEditing} className="text-base py-3 rounded-lg mt-1"/>
                </div>
                <div>
                  <Label htmlFor="email" className="font-semibold text-base">{currentContent.emailLabel}</Label>
                  <Input id="email" type="email" value={user.email} onChange={handleInputChange} disabled={!isEditing} className="text-base py-3 rounded-lg mt-1"/>
                </div>
                 <div>
                    <Label htmlFor="nationalId" className="font-semibold text-base">{currentContent.nationalIdLabel}</Label>
                    <Input id="nationalId" value={user.nationalId} onChange={handleInputChange} disabled={!isEditing} className="text-base py-3 rounded-lg mt-1" placeholder="e.g. 12345678"/>
                  </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tripHistory">
            <Card className="shadow-lg glassy-card">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary">{currentContent.tripHistoryTitle}</CardTitle>
                <CardDescription>{currentContent.tripHistoryDesc}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                {tripHistory.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8 text-lg">{currentContent.noTrips}</p>
                ) : (
                  <ul className="space-y-6">
                    {tripHistory.map(trip => (
                      <li key={trip.id} className="p-4 border border-border/70 rounded-xl hover:shadow-xl transition-shadow duration-200 ease-in-out bg-card/50">
                        {trip.image && (
                          <Image src={trip.image} alt={trip.route} data-ai-hint={trip.imageHint || "travel scene"} width={600} height={150} className="w-full h-32 object-cover rounded-t-lg mb-3"/>
                        )}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <div>
                            <h3 className="font-semibold text-xl text-primary">{trip.type}</h3>
                            <p className="text-lg text-foreground">{trip.route}</p>
                          </div>
                          <span className={`text-xs px-3 py-1.5 rounded-full font-semibold shadow-sm
                            ${trip.status === "Completed" ? "bg-green-500/20 text-green-700 dark:bg-green-700/30 dark:text-green-300 border border-green-500/50" : 
                             trip.status === "Upcoming" ? "bg-blue-500/20 text-blue-700 dark:bg-blue-700/30 dark:text-blue-300 border border-blue-500/50" :
                             "bg-red-500/20 text-red-700 dark:bg-red-700/30 dark:text-red-300 border border-red-500/50"}`}>
                            {trip.status}
                          </span>
                        </div>
                        <div className="mt-2 flex flex-col sm:flex-row justify-between text-sm text-muted-foreground">
                          <p className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4"/> {trip.date}</p>
                          <p className="font-semibold">Ksh {trip.price.toLocaleString()}</p>
                        </div>
                        {trip.status === "Completed" && (
                          <div className="mt-4 pt-4 border-t border-border/50">
                            {currentTripToRate?.id === trip.id ? (
                              <div className="space-y-3">
                                <Label className="font-semibold text-base">{currentContent.rateThisTrip}</Label>
                                <div className="flex items-center gap-1">
                                  {[1,2,3,4,5].map(star => (
                                    <Star key={star} className={cn("h-6 w-6 cursor-pointer transition-colors", rating >= star ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground hover:text-yellow-300")} onClick={() => setRating(star)}/>
                                  ))}
                                </div>
                                <Textarea placeholder={currentContent.shareExperiencePlaceholder} value={feedbackText} onChange={(e) => setFeedbackText(e.target.value)} className="rounded-lg text-base"/>
                                <Button onClick={submitRating} size="sm" className="btn-glow-primary">{currentContent.submitFeedback}</Button>
                                <Button variant="ghost" size="sm" onClick={() => setCurrentTripToRate(null)}>{currentContent.cancel}</Button>
                              </div>
                            ) : (
                              <div className="flex flex-wrap gap-2 items-center">
                                <Button variant="outline" size="sm" className="border-primary text-primary hover:bg-primary/10"><Repeat className="mr-1.5 h-4 w-4"/> {currentContent.bookAgain}</Button>
                                <Link href={`/receipt/sample?tripId=${trip.id}&route=${encodeURIComponent(trip.route)}&price=${trip.price}&date=${trip.date}&seats=A1`}>
                                  <Button variant="link" size="sm" className="text-primary p-1 hover:underline">{currentContent.viewReceipt}</Button>
                                </Link>
                                {trip.rating ? (
                                   <div className="flex items-center gap-1 text-yellow-500 ml-auto">
                                      {[...Array(trip.rating)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current"/>)}
                                      <span className="text-sm text-muted-foreground">({trip.rating}/5)</span>
                                   </div>
                                ) : (
                                  <Button onClick={() => handleRateTrip(trip)} size="sm" variant="outline" className="ml-auto border-yellow-500 text-yellow-600 hover:bg-yellow-500/10">
                                    <Star className="mr-1.5 h-4 w-4"/> {currentContent.rateTripButton}
                                  </Button>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="favorites">
             <Card className="shadow-lg glassy-card">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><Heart className="h-6 w-6"/>{currentContent.favoritesTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8 pt-4">
                    <section id="favoriteRoutes">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-headline text-xl text-accent flex items-center gap-2"><Route className="h-5 w-5"/>{currentContent.favoriteRoutesTitle}</h3>
                            <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent/10">{currentContent.addFavoriteRoute}</Button>
                        </div>
                        {favoriteRoutes.length === 0 ? (
                             <p className="text-muted-foreground text-center py-4">{currentContent.noFavoriteRoutes}</p>
                        ) : (
                            <ul className="space-y-3">
                                {favoriteRoutes.map(route => (
                                    <li key={route.id} className="p-3 border border-border/60 rounded-lg flex justify-between items-center hover:bg-muted/20">
                                        <div>
                                            <p className="font-semibold text-base">{route.from} <ArrowRight className="inline h-4 w-4 mx-1"/> {route.to}</p>
                                            <p className="text-xs text-muted-foreground">Est. Time: {route.estTime} | Typical Fare: {route.typicalFare}</p>
                                        </div>
                                        <div className="flex gap-1">
                                            <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10">{currentContent.unfavorite}</Button>
                                            <Button size="sm" className="btn-glow-primary">Book</Button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </section>
                    <section id="favoriteMatatus">
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="font-headline text-xl text-accent flex items-center gap-2"><Bus className="h-5 w-5"/>{currentContent.favoriteMatatusTitle}</h3>
                            <Button variant="outline" size="sm" className="border-accent text-accent hover:bg-accent/10">{currentContent.addFavoriteMatatu}</Button>
                        </div>
                         {favoriteMatatus.length === 0 ? (
                             <p className="text-muted-foreground text-center py-4">{currentContent.noFavoriteMatatus}</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {favoriteMatatus.map(matatu => (
                                    <Card key={matatu.id} className="overflow-hidden group glassy-card border-transparent hover:border-primary/50">
                                        <Image src={matatu.image} alt={matatu.name} data-ai-hint={matatu.imageHint} width={300} height={150} className="w-full h-32 object-cover group-hover:scale-105 transition-transform"/>
                                        <CardContent className="p-3">
                                            <h4 className="font-semibold text-lg group-hover:text-primary">{matatu.name} <span className="text-xs bg-secondary text-secondary-foreground px-1.5 py-0.5 rounded-full ml-1">{matatu.type}</span></h4>
                                            <p className="text-sm text-muted-foreground">{matatu.commonRoute}</p>
                                            <div className="flex gap-2 mt-2">
                                                <Button size="sm" variant="ghost" className="text-xs text-destructive hover:bg-destructive/10">{currentContent.unfavorite}</Button>
                                                <Button size="sm" className="text-xs btn-glow-primary">{currentContent.bookWithThisMatatu}</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>
                </CardContent>
             </Card>
          </TabsContent>
          
          <TabsContent value="settings">
            <Card className="shadow-lg glassy-card">
              <CardHeader><CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><Palette className="h-6 w-6"/>{currentContent.preferencesTitle}</CardTitle></CardHeader>
              <CardContent className="space-y-6 pt-4">
                  <div className="flex items-center justify-between p-4 border border-border/70 rounded-lg">
                      <Label htmlFor="themeToggle" className="text-base font-semibold flex items-center gap-2"><Palette className="h-5 w-5"/>{currentContent.themeLabel}</Label>
                      <ThemeToggle />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border/70 rounded-lg">
                      <Label htmlFor="languageToggle" className="text-base font-semibold flex items-center gap-2"><Languages className="h-5 w-5"/>{currentContent.languageLabel}</Label>
                      <LanguageToggle />
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border/70 rounded-lg">
                      <Label htmlFor="pushNotifications" className="text-base font-semibold flex items-center gap-2"><Bell className="h-5 w-5"/>{currentContent.pushNotificationsLabel}</Label>
                      <Switch id="pushNotifications" defaultChecked aria-label="Toggle push notifications"/>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-border/70 rounded-lg">
                      <Label htmlFor="locationTracking" className="text-base font-semibold flex items-center gap-2"><MapPin className="h-5 w-5"/>{currentContent.locationAccessLabel}</Label>
                      <Switch id="locationTracking" defaultChecked aria-label="Toggle precise location tracking"/>
                  </div>
                  <Button 
                    variant="destructive" 
                    className="w-full md:w-auto mt-6 text-base py-3 rounded-lg btn-glow-accent"
                    onClick={handleLogout}
                  >
                    <LogOut className="mr-2 h-5 w-5"/> {currentContent.logout}
                  </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card className="shadow-lg glassy-card">
              <CardHeader><CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><ShieldCheck className="h-6 w-6"/>{currentContent.securityTitle}</CardTitle></CardHeader>
              <CardContent className="space-y-6 pt-4">
                <div>
                  <Label htmlFor="currentPassword"className="font-semibold text-base">{currentContent.currentPasswordLabel}</Label>
                  <Input id="currentPassword" type="password" placeholder="••••••••" className="text-base py-3 rounded-lg mt-1"/>
                </div>
                <div>
                  <Label htmlFor="newPassword"className="font-semibold text-base">{currentContent.newPasswordLabel}</Label>
                  <Input id="newPassword" type="password" placeholder="Choose a strong password" className="text-base py-3 rounded-lg mt-1"/>
                </div>
                <div>
                  <Label htmlFor="confirmNewPassword"className="font-semibold text-base">{currentContent.confirmNewPasswordLabel}</Label>
                  <Input id="confirmNewPassword" type="password" placeholder="Re-enter new password" className="text-base py-3 rounded-lg mt-1"/>
                </div>
                <Button className="w-full md:w-auto transition-transform hover:scale-105 btn-glow-primary text-base py-3 rounded-lg">{currentContent.updatePassword}</Button>
                <div className="mt-8 border-t border-border/50 pt-6">
                    <h3 className="font-semibold text-lg mb-2">{currentContent.twoFactorAuthTitle}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{currentContent.twoFactorAuthDesc}</p>
                    <Button variant="outline" className="transition-transform hover:scale-105 border-primary text-primary hover:bg-primary/10 text-base py-3 rounded-lg">{currentContent.enable2FA}</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
