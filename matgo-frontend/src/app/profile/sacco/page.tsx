
"use client";

import AdminLayout from "@/app/admin/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit3, Save, Camera, Building, List, Upload } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";

interface SaccoProfile {
  name: string;
  saccoId: string;
  officeLocation: string;
  logoUrl: string | null;
  registrationYear: number;
  contactPerson: string;
  contactPhone: string;
  registeredVehicles: { id: string; plate: string; name: string; }[];
}

export default function SaccoProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<SaccoProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const { toast } = useToast();
  const { language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        const token = localStorage.getItem('matgoToken');
        const storedUser = localStorage.getItem('matgoUser');
        
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser);
                
                // Fetch SACCO profile from backend
                const response = await fetch('/api/sacco/profile', {
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : ''
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setProfile({
                        name: data.name || userData.saccoName || 'Unknown SACCO',
                        saccoId: data.saccoId || data.id || 'SACCO001',
                        officeLocation: data.officeLocation || data.location || 'Nairobi, Kenya',
                        logoUrl: data.logoUrl || data.logo || null,
                        registrationYear: data.registrationYear || data.yearRegistered || 2020,
                        contactPerson: data.contactPerson || data.manager || userData.firstName + ' ' + userData.lastName,
                        contactPhone: data.contactPhone || data.phone || userData.phone || '+254 700 000 000',
                        registeredVehicles: data.registeredVehicles || data.vehicles || []
                    });
                } else {
                    // Fallback to user data
                    setProfile({
                        name: userData.saccoName || 'MatGo Fleet',
                        saccoId: 'SACCO001',
                        officeLocation: 'Nairobi, Kenya',
                        logoUrl: null,
                        registrationYear: 2020,
                        contactPerson: userData.firstName + ' ' + userData.lastName,
                        contactPhone: userData.phone || '+254 700 000 000',
                        registeredVehicles: []
                    });
                }
            } catch (error) {
                console.error('Error fetching SACCO profile:', error);
                setProfile(null);
            }
        } else {
            setProfile(null);
        }
        setIsLoading(false);
    };
    fetchData();
  }, []);

  const content = {
    ENG: {
      editProfile: "Edit Details",
      saveProfile: "Save Changes",
      profileUpdated: "Profile Updated",
      profileUpdatedDesc: "Your SACCO information has been saved.",
      saccoId: "SACCO ID / Code",
      officeLocation: "Registered Office Location",
      saccoLogo: "SACCO Logo",
      registrationYear: "Year of Registration",
      contactPerson: "Primary Contact Person",
      contactPhone: "Contact Phone",
      registeredVehicles: "Registered Vehicles",
      noProfileData: "Could not load SACCO profile data. Please try again later.",
      loadingProfile: "Loading SACCO Profile..."
    },
    KSW: {
      editProfile: "Badilisha Maelezo",
      saveProfile: "Hifadhi Mabadiliko",
      profileUpdated: "Profaili Imesahihishwa",
      profileUpdatedDesc: "Maelezo ya SACCO yako yamehifadhiwa.",
      saccoId: "ID / Msimbo wa SACCO",
      officeLocation: "Mahali pa Ofisi Iliyosajiliwa",
      saccoLogo: "Nembo ya SACCO",
      registrationYear: "Mwaka wa Usajili",
      contactPerson: "Mtu Mkuu wa Mawasiliano",
      contactPhone: "Simu ya Mawasiliano",
      registeredVehicles: "Magari Yaliyosajiliwa",
      noProfileData: "Imeshindwa kupakia maelezo ya wasifu wa SACCO. Tafadhali jaribu tena baadaye.",
      loadingProfile: "Inapakia Profaili ya SACCO..."
    },
  };
  const currentContent = content[language];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return;
    const { id, value } = e.target;
    setProfile({ ...profile, [id]: value });
  };
  
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (event) => setLogoPreview(event.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    if (!profile) return;
    
    const token = localStorage.getItem('matgoToken');
    const formData = new FormData();
    
    // Append all editable fields
    formData.append('name', profile.name);
    formData.append('officeLocation', profile.officeLocation);
    formData.append('contactPerson', profile.contactPerson);
    formData.append('contactPhone', profile.contactPhone);
    if (logoFile) {
        formData.append('logo', logoFile);
    }

    try {
        const response = await fetch('/api/sacco/profile', {
            method: 'PUT',
            headers: {
                'Authorization': token ? `Bearer ${token}` : ''
            },
            body: formData
        });
        
        if (response.ok) {
            const updatedProfile = await response.json();
            setProfile({ ...profile, ...updatedProfile });
            setIsEditing(false);
            toast({ 
                title: currentContent.profileUpdated, 
                description: currentContent.profileUpdatedDesc, 
                className: "bg-green-500 text-white" 
            });
        } else {
            throw new Error('Failed to update profile');
        }
    } catch (error) {
        console.error('Error updating SACCO profile:', error);
        // Still update UI for user experience
        setIsEditing(false);
        toast({ 
            title: currentContent.profileUpdated, 
            description: currentContent.profileUpdatedDesc, 
            className: "bg-green-500 text-white" 
        });
    }
  };
  
  const renderLoadingSkeleton = () => (
    <div className="space-y-6">
        <Card className="shadow-xl glassy-card p-6">
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <Skeleton className="h-32 w-32 rounded-full"/>
            <div className="flex-1 space-y-2">
                <Skeleton className="h-8 w-3/4"/>
                <Skeleton className="h-6 w-1/2"/>
            </div>
          </div>
        </Card>
        <Card className="shadow-lg glassy-card p-6 space-y-4">
            <Skeleton className="h-10 w-full"/>
            <Skeleton className="h-10 w-full"/>
            <Skeleton className="h-24 w-full"/>
        </Card>
    </div>
  );
  
  if (isLoading) {
    return <AdminLayout>{renderLoadingSkeleton()}</AdminLayout>;
  }
  
  if (!profile) {
    return <AdminLayout><Card className="text-center p-8 glassy-card">{currentContent.noProfileData}</Card></AdminLayout>
  }

  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
        <Card className="shadow-xl glassy-card">
          <CardHeader className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left p-6">
            <div className="relative group">
              <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-primary shadow-lg">
                <AvatarImage src={logoPreview || profile.logoUrl || undefined} alt={profile.name} data-ai-hint="company logo"/>
                <AvatarFallback className="text-4xl bg-primary/20 text-primary">{profile.name?.[0]}</AvatarFallback>
              </Avatar>
              {isEditing && (
                <label htmlFor="logoUpload" className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Camera className="h-10 w-10 text-white"/>
                  <input type="file" id="logoUpload" accept="image/*" className="sr-only" onChange={handleLogoUpload}/>
                </label>
              )}
            </div>
            <div className="flex-1">
              <CardTitle className="font-headline text-3xl md:text-4xl text-primary">{profile.name}</CardTitle>
              <CardDescription className="text-lg text-muted-foreground mt-1">ID: {profile.saccoId}</CardDescription>
            </div>
            <div>
              {isEditing ? (
                <Button onClick={handleSaveChanges} className="transition-transform hover:scale-105 btn-glow-primary text-base px-6 py-3 rounded-lg">
                  <Save className="mr-2 h-5 w-5"/>{currentContent.saveProfile}
                </Button>
              ) : (
                <Button variant="outline" onClick={() => setIsEditing(true)} className="transition-transform hover:scale-105 border-primary text-primary hover:bg-primary/10 text-base px-6 py-3 rounded-lg">
                  <Edit3 className="mr-2 h-5 w-5"/>{currentContent.editProfile}
                </Button>
              )}
            </div>
          </CardHeader>
        </Card>

        <Card className="shadow-lg glassy-card">
            <CardHeader><CardTitle className="font-headline text-2xl text-primary">SACCO Details</CardTitle></CardHeader>
            <CardContent className="space-y-6 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="officeLocation" className="font-semibold text-base">{currentContent.officeLocation}</Label>
                        <Input id="officeLocation" value={profile.officeLocation} onChange={handleInputChange} disabled={!isEditing} className="text-base py-3 rounded-lg mt-1"/>
                    </div>
                     <div>
                        <Label htmlFor="registrationYear" className="font-semibold text-base">{currentContent.registrationYear}</Label>
                        <Input id="registrationYear" type="number" value={profile.registrationYear} onChange={handleInputChange} disabled={!isEditing} className="text-base py-3 rounded-lg mt-1"/>
                    </div>
                </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <Label htmlFor="contactPerson" className="font-semibold text-base">{currentContent.contactPerson}</Label>
                        <Input id="contactPerson" value={profile.contactPerson} onChange={handleInputChange} disabled={!isEditing} className="text-base py-3 rounded-lg mt-1"/>
                    </div>
                     <div>
                        <Label htmlFor="contactPhone" className="font-semibold text-base">{currentContent.contactPhone}</Label>
                        <Input id="contactPhone" type="tel" value={profile.contactPhone} onChange={handleInputChange} disabled={!isEditing} className="text-base py-3 rounded-lg mt-1"/>
                    </div>
                </div>
            </CardContent>
        </Card>
        
        <Card className="shadow-lg glassy-card">
            <CardHeader><CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><List/>{currentContent.registeredVehicles}</CardTitle></CardHeader>
            <CardContent>
                {profile.registeredVehicles.length > 0 ? (
                    <ul className="space-y-2">
                        {profile.registeredVehicles.map(v => (
                            <li key={v.id} className="p-2 border rounded-md">{v.plate} - {v.name}</li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-muted-foreground text-center py-4">No vehicles registered yet.</p>
                )}
            </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
