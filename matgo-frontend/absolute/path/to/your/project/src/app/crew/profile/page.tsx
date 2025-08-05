
"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Star, Edit3, Save, Camera, ShieldCheck, Bus } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface CrewMember {
    name: string;
    role: "Driver" | "Conductor" | "Dereva" | "Kondakta";
    sacco: string;
    busName: string;
    busReg: string;
    profilePic: string;
    rating: number;
    phone: string;
    email: string;
}

export default function CrewProfilePage() {
  const router = useRouter();
  const { language } = useLanguage();
  const { toast } = useToast();
  
  const [crewMember, setCrewMember] = useState<CrewMember | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        const storedUser = localStorage.getItem('matgoUser');
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                if (userData.role !== 'driver' && userData.role !== 'conductor') {
                    router.replace('/dashboard');
                    return;
                }
                // Simulate API fetch for detailed crew data
                await new Promise(resolve => setTimeout(resolve, 1000));
                setCrewMember({
                    name: `${userData.firstName || 'John'} ${userData.lastName || 'Doe'}`,
                    role: language === 'KSW' ? (userData.role === 'driver' ? 'Dereva' : 'Kondakta') : (userData.role === 'driver' ? 'Driver' : 'Conductor'),
                    sacco: userData.saccoName || "MatGo Fleet",
                    busName: "SM001 - Mamba", 
                    busReg: "KDA 001A", 
                    profilePic: userData.profilePic || "/avatars/crew_default.png",
                    rating: 4.7, 
                    phone: userData.phone || "0712345678",
                    email: userData.email || "crew.member@matgo.co.ke"
                });
            } catch (e) {
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
      personalInfoTitle: "Personal Information",
      busInfoTitle: "Assigned Vehicle",
      performanceTitle: "Your Performance",
      overallRating: "Overall Rating",
      sacco: "SACCO",
      busName: "Bus Name / Fleet No.",
      busReg: "Registration No.",
      firstNameLabel: "First Name",
      lastNameLabel: "Last Name",
      phoneLabel: "Phone Number",
      emailLabel: "Email Address",
      securityTitle: "Account Security",
      updatePassword: "Update Password",
      logout: "Logout",
    },
    KSW: {
      editProfile: "Badilisha Profaili",
      saveProfile: "Hifadhi Mabadiliko",
      profileUpdated: "Profaili Imehifadhiwa",
      profileUpdatedDesc: "Taarifa zako zimehifadhiwa.",
      personalInfoTitle: "Taarifa Binafsi",
      busInfoTitle: "Gari Uliyopangiwa",
      performanceTitle: "Utendaji Wako",
      overallRating: "Ukadiriaji wa Jumla",
      sacco: "SACCO",
      busName: "Jina la Basi / Nambari ya Meli",
      busReg: "Nambari ya Usajili",
      firstNameLabel: "Jina la Kwanza",
      lastNameLabel: "Jina la Ukoo",
      phoneLabel: "Nambari ya Simu",
      emailLabel: "Anwani ya Barua Pepe",
      securityTitle: "Usalama wa Akaunti",
      updatePassword: "Sasisha Nenosiri",
      logout: "Ondoka",
    }
  };
  const currentContent = content[language];

  const handleSaveChanges = () => {
    setIsEditing(false);
    toast({ title: currentContent.profileUpdated, description: currentContent.profileUpdatedDesc, className: "bg-green-500 text-white" });
  };
  
  if (isLoading || !crewMember) {
    return <AppLayout><Skeleton className="h-screen w-full" /></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <Card className="shadow-xl glassy-card">
          <CardHeader className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left p-6">
            <div className="relative group">
              <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-primary shadow-lg">
                <AvatarImage src={crewMember.profilePic} alt={crewMember.name} data-ai-hint="crew member profile" />
                <AvatarFallback className="text-4xl bg-primary/20 text-primary">{crewMember.name?.[0]}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <label htmlFor="profilePicUpload" className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Camera className="h-10 w-10 text-white"/>
                  <input type="file" id="profilePicUpload" accept="image/*" className="sr-only" />
                </label>
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="font-headline text-3xl md:text-4xl text-primary">{crewMember.name}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-1">{crewMember.role} @ {crewMember.sacco}</CardDescription>
            </div>
            <div>
              {isEditing ? (
                <Button onClick={handleSaveChanges} className="btn-glow-primary"><Save className="mr-2 h-4 w-4"/>{currentContent.saveProfile}</Button>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)}><Edit3 className="mr-2 h-4 w-4"/>{currentContent.editProfile}</Button>
              )}
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="shadow-lg glassy-card">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-primary">{currentContent.personalInfoTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <Label htmlFor="phone">{currentContent.phoneLabel}</Label>
                        <Input id="phone" value={crewMember.phone} disabled={!isEditing}/>
                    </div>
                     <div>
                        <Label htmlFor="email">{currentContent.emailLabel}</Label>
                        <Input id="email" type="email" value={crewMember.email} disabled={!isEditing}/>
                    </div>
                </CardContent>
            </Card>
             <Card className="shadow-lg glassy-card">
                <CardHeader>
                    <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><Bus className="h-6 w-6"/>{currentContent.busInfoTitle}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-base">
                   <p><strong>{currentContent.sacco}:</strong> {crewMember.sacco}</p>
                   <p><strong>{currentContent.busName}:</strong> {crewMember.busName}</p>
                   <p><strong>{currentContent.busReg}:</strong> {crewMember.busReg}</p>
                </CardContent>
            </Card>
        </div>

        <Card className="shadow-lg glassy-card">
          <CardHeader><CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><Star className="h-6 w-6"/>{currentContent.performanceTitle}</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
                <p className="text-base">{currentContent.overallRating}:</p>
                <p className="text-3xl font-bold text-yellow-400">{crewMember.rating.toFixed(1)}<span className="text-lg text-muted-foreground">/5.0</span></p>
            </div>
            {/* Future: Add more performance metrics or feedback snippets here */}
          </CardContent>
        </Card>

        <Button 
            variant="destructive" 
            className="w-full md:w-auto mt-6 text-base py-3 rounded-lg btn-glow-accent"
            onClick={() => { localStorage.removeItem('matgoUser'); router.push('/login'); }}
        >
            <LogOut className="mr-2 h-5 w-5"/> {currentContent.logout}
        </Button>
      </div>
    </AppLayout>
  );
}

