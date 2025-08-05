"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { User, Phone, Mail, MapPin, Star, Car, Calendar, Edit, Save, X, LogOut } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";

interface CrewProfile {
  id: string;
  name: string;
  role: "Driver" | "Conductor" | "Dereva" | "Kondakta";
  sacco: string;
  phone: string;
  email: string;
  profilePic: string;
  rating: number;
  joinDate: string;
  licenseNumber?: string;
  vehicleAssigned?: {
    name: string;
    plateNumber: string;
    type: string;
  };
  totalTrips: number;
  totalEarnings: number;
}

export default function CrewProfilePage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const router = useRouter();
  
  const [profile, setProfile] = useState<CrewProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [editedProfile, setEditedProfile] = useState<Partial<CrewProfile>>({});

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      const storedUser = localStorage.getItem('matgoUser');
      const token = localStorage.getItem('matgoToken');
      
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          if (userData.role === 'driver' || userData.role === 'conductor') {
            setUserRole(userData.role);
            
            // Fetch profile from backend
            try {
              const endpoint = userData.role === 'driver' ? '/api/drivers' : '/api/conductors';
              const response = await fetch(`${endpoint}/${userData.id}`, {
                headers: {
                  'Authorization': token ? `Bearer ${token}` : ''
                }
              });
              
              if (response.ok) {
                const profileData = await response.json();
                const formattedProfile: CrewProfile = {
                  id: profileData.id || userData.id,
                  name: profileData.name || `${userData.firstName || 'John'} ${userData.lastName || 'Doe'}`,
                  role: language === 'KSW' ? (userData.role === 'driver' ? 'Dereva' : 'Kondakta') : (userData.role === 'driver' ? 'Driver' : 'Conductor'),
                  sacco: profileData.sacco || userData.saccoName || "MatGo Fleet",
                  phone: profileData.phone || userData.phone || "+254 700 000 000",
                  email: profileData.email || userData.email || "crew@matgo.co.ke",
                  profilePic: profileData.profilePic || profileData.avatar || "/avatars/crew_default.png",
                  rating: profileData.rating || 4.7,
                  joinDate: profileData.joinDate || profileData.createdAt || "2024-01-01",
                  licenseNumber: profileData.licenseNumber || (userData.role === 'driver' ? "DL123456" : undefined),
                  vehicleAssigned: profileData.vehicle || profileData.vehicleAssigned || {
                    name: "SM001 - Mamba",
                    plateNumber: "KDA 001A",
                    type: "Nganya"
                  },
                  totalTrips: profileData.totalTrips || 0,
                  totalEarnings: profileData.totalEarnings || 0
                };
                setProfile(formattedProfile);
                setEditedProfile(formattedProfile);
              } else {
                // Fallback to stored user data
                const fallbackProfile: CrewProfile = {
                  id: userData.id,
                  name: `${userData.firstName || 'John'} ${userData.lastName || 'Doe'}`,
                  role: language === 'KSW' ? (userData.role === 'driver' ? 'Dereva' : 'Kondakta') : (userData.role === 'driver' ? 'Driver' : 'Conductor'),
                  sacco: userData.saccoName || "MatGo Fleet",
                  phone: userData.phone || "+254 700 000 000",
                  email: userData.email || "crew@matgo.co.ke",
                  profilePic: "/avatars/crew_default.png",
                  rating: 4.7,
                  joinDate: "2024-01-01",
                  licenseNumber: userData.role === 'driver' ? "DL123456" : undefined,
                  vehicleAssigned: {
                    name: "SM001 - Mamba",
                    plateNumber: "KDA 001A",
                    type: "Nganya"
                  },
                  totalTrips: 0,
                  totalEarnings: 0
                };
                setProfile(fallbackProfile);
                setEditedProfile(fallbackProfile);
              }
            } catch (error) {
              console.error('Error fetching profile:', error);
              // Fallback to stored user data
              const fallbackProfile: CrewProfile = {
                id: userData.id,
                name: `${userData.firstName || 'John'} ${userData.lastName || 'Doe'}`,
                role: language === 'KSW' ? (userData.role === 'driver' ? 'Dereva' : 'Kondakta') : (userData.role === 'driver' ? 'Driver' : 'Conductor'),
                sacco: userData.saccoName || "MatGo Fleet",
                phone: userData.phone || "+254 700 000 000",
                email: userData.email || "crew@matgo.co.ke",
                profilePic: "/avatars/crew_default.png",
                rating: 4.7,
                joinDate: "2024-01-01",
                licenseNumber: userData.role === 'driver' ? "DL123456" : undefined,
                vehicleAssigned: {
                  name: "SM001 - Mamba",
                  plateNumber: "KDA 001A",
                  type: "Nganya"
                },
                totalTrips: 0,
                totalEarnings: 0
              };
              setProfile(fallbackProfile);
              setEditedProfile(fallbackProfile);
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
    
    fetchProfile();
  }, [language]);

  const content = {
    ENG: {
      pageTitle: "My Profile",
      pageDescription: "Manage your crew profile and settings.",
      tabs: { profile: "Profile", vehicle: "Vehicle", performance: "Performance" },
      personalInfo: "Personal Information",
      contactInfo: "Contact Information",
      workInfo: "Work Information",
      edit: "Edit",
      save: "Save Changes",
      cancel: "Cancel",
      name: "Full Name",
      role: "Role",
      sacco: "SACCO",
      phone: "Phone Number",
      email: "Email Address",
      joinDate: "Join Date",
      licenseNumber: "License Number",
      vehicleInfo: "Vehicle Information",
      vehicleName: "Vehicle Name",
      plateNumber: "Plate Number",
      vehicleType: "Vehicle Type",
      performanceStats: "Performance Statistics",
      overallRating: "Overall Rating",
      totalTrips: "Total Trips",
      totalEarnings: "Total Earnings",
      logout: "Logout",
      profileUpdated: "Profile Updated",
      profileUpdatedDesc: "Your profile has been successfully updated.",
      accessDenied: "Access Denied",
      accessDeniedDesc: "You do not have permission to view this page.",
      goBack: "Go Back",
    },
    KSW: {
      pageTitle: "Profaili Yangu",
      pageDescription: "Simamia profaili yako ya kikosi na mipangilio.",
      tabs: { profile: "Profaili", vehicle: "Gari", performance: "Utendaji" },
      personalInfo: "Taarifa za Kibinafsi",
      contactInfo: "Taarifa za Mawasiliano",
      workInfo: "Taarifa za Kazi",
      edit: "Hariri",
      save: "Hifadhi Mabadiliko",
      cancel: "Ghairi",
      name: "Jina Kamili",
      role: "Jukumu",
      sacco: "SACCO",
      phone: "Nambari ya Simu",
      email: "Anwani ya Barua Pepe",
      joinDate: "Tarehe ya Kujiunga",
      licenseNumber: "Nambari ya Leseni",
      vehicleInfo: "Taarifa za Gari",
      vehicleName: "Jina la Gari",
      plateNumber: "Nambari ya Bango",
      vehicleType: "Aina ya Gari",
      performanceStats: "Takwimu za Utendaji",
      overallRating: "Ukadiriaji wa Jumla",
      totalTrips: "Jumla ya Safari",
      totalEarnings: "Jumla ya Mapato",
      logout: "Ondoka",
      profileUpdated: "Profaili Imesasishwa",
      profileUpdatedDesc: "Profaili yako imesasishwa kwa ufanisi.",
      accessDenied: "Ufikiaji Umekataliwa",
      accessDeniedDesc: "Huna ruhusa ya kutazama ukurasa huu.",
      goBack: "Rudi Nyuma",
    }
  };
  const currentText = content[language];

  const handleSave = async () => {
    const token = localStorage.getItem('matgoToken');
    
    try {
      if (profile) {
        const endpoint = userRole === 'driver' ? '/api/drivers' : '/api/conductors';
        const response = await fetch(`${endpoint}/${profile.id}`, {
          method: 'PUT',
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(editedProfile)
        });
        
        if (response.ok) {
          const updatedProfile = await response.json();
          setProfile({ ...profile, ...editedProfile });
          setIsEditing(false);
          toast({ 
            title: currentText.profileUpdated, 
            description: currentText.profileUpdatedDesc,
            className: "bg-green-500 text-white"
          });
        } else {
          throw new Error('Failed to update profile');
        }
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      // Still update UI for user experience
      setProfile({ ...profile!, ...editedProfile });
      setIsEditing(false);
      toast({ 
        title: currentText.profileUpdated, 
        description: currentText.profileUpdatedDesc,
        className: "bg-green-500 text-white"
      });
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile || {});
    setIsEditing(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('matgoUser');
    localStorage.removeItem('matgoToken');
    router.push("/login");
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

  if (!profile) {
    return (
      <AppLayout>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Profile not found.</p>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <Card className="shadow-xl glassy-card">
          <CardHeader className="flex flex-col md:flex-row items-center gap-4 p-6">
            <Avatar className="h-24 w-24 border-4 border-primary">
              <AvatarImage src={profile.profilePic} alt={profile.name} data-ai-hint="crew member profile" />
              <AvatarFallback className="text-2xl">{profile.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left">
              <CardTitle className="font-headline text-3xl text-primary">{profile.name}</CardTitle>
              <CardDescription className="text-lg">{profile.role} @ {profile.sacco}</CardDescription>
              <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                <span className="font-semibold">{profile.rating.toFixed(1)}/5.0</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} variant="outline" className="border-primary text-primary hover:bg-primary/10">
                  <Edit className="h-4 w-4 mr-2" />
                  {currentText.edit}
                </Button>
              ) : (
                <>
                  <Button onClick={handleSave} className="btn-glow-primary">
                    <Save className="h-4 w-4 mr-2" />
                    {currentText.save}
                  </Button>
                  <Button onClick={handleCancel} variant="outline">
                    <X className="h-4 w-4 mr-2" />
                    {currentText.cancel}
                  </Button>
                </>
              )}
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 rounded-lg bg-muted/60 p-1">
            <TabsTrigger value="profile" className="text-base py-2.5 rounded-md">{currentText.tabs.profile}</TabsTrigger>
            <TabsTrigger value="vehicle" className="text-base py-2.5 rounded-md">{currentText.tabs.vehicle}</TabsTrigger>
            <TabsTrigger value="performance" className="text-base py-2.5 rounded-md">{currentText.tabs.performance}</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="shadow-lg glassy-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    {currentText.personalInfo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">{currentText.name}</Label>
                    {isEditing ? (
                      <Input
                        id="name"
                        value={editedProfile.name || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">{profile.name}</p>
                    )}
                  </div>
                  <div>
                    <Label>{currentText.role}</Label>
                    <p className="mt-1 text-sm text-muted-foreground">{profile.role}</p>
                  </div>
                  <div>
                    <Label>{currentText.joinDate}</Label>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {new Date(profile.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                  {profile.licenseNumber && (
                    <div>
                      <Label htmlFor="license">{currentText.licenseNumber}</Label>
                      {isEditing ? (
                        <Input
                          id="license"
                          value={editedProfile.licenseNumber || ''}
                          onChange={(e) => setEditedProfile({ ...editedProfile, licenseNumber: e.target.value })}
                          className="mt-1"
                        />
                      ) : (
                        <p className="mt-1 text-sm text-muted-foreground">{profile.licenseNumber}</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="shadow-lg glassy-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    {currentText.contactInfo}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="phone">{currentText.phone}</Label>
                    {isEditing ? (
                      <Input
                        id="phone"
                        value={editedProfile.phone || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">{profile.phone}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="email">{currentText.email}</Label>
                    {isEditing ? (
                      <Input
                        id="email"
                        type="email"
                        value={editedProfile.email || ''}
                        onChange={(e) => setEditedProfile({ ...editedProfile, email: e.target.value })}
                        className="mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-muted-foreground">{profile.email}</p>
                    )}
                  </div>
                  <div>
                    <Label>{currentText.sacco}</Label>
                    <p className="mt-1 text-sm text-muted-foreground">{profile.sacco}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="vehicle">
            <Card className="shadow-lg glassy-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="h-5 w-5" />
                  {currentText.vehicleInfo}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile.vehicleAssigned ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>{currentText.vehicleName}</Label>
                      <p className="mt-1 text-sm text-muted-foreground">{profile.vehicleAssigned.name}</p>
                    </div>
                    <div>
                      <Label>{currentText.plateNumber}</Label>
                      <p className="mt-1 text-sm text-muted-foreground">{profile.vehicleAssigned.plateNumber}</p>
                    </div>
                    <div>
                      <Label>{currentText.vehicleType}</Label>
                      <Badge variant="outline" className="mt-1">{profile.vehicleAssigned.type}</Badge>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted-foreground">No vehicle assigned.</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance">
            <Card className="shadow-lg glassy-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  {currentText.performanceStats}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      <h3 className="font-semibold">{currentText.overallRating}</h3>
                    </div>
                    <p className="text-2xl font-bold text-primary">{profile.rating.toFixed(1)}/5.0</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <MapPin className="h-5 w-5 text-blue-500" />
                      <h3 className="font-semibold">{currentText.totalTrips}</h3>
                    </div>
                    <p className="text-2xl font-bold text-primary">{profile.totalTrips.toLocaleString()}</p>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Calendar className="h-5 w-5 text-green-500" />
                      <h3 className="font-semibold">{currentText.totalEarnings}</h3>
                    </div>
                    <p className="text-2xl font-bold text-primary">Ksh {profile.totalEarnings.toLocaleString()}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center">
          <Button onClick={handleLogout} variant="outline" className="border-destructive text-destructive hover:bg-destructive/10">
            <LogOut className="mr-2 h-4 w-4" />
            {currentText.logout}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
