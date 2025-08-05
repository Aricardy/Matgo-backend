
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit3, Save, ShieldCheck } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";
import AdminLayout from "../layout";

interface AdminUser {
  firstName: string;
  lastName: string;
  email: string;
  profilePic: string;
  role: 'admin' | 'sacco_admin';
}

export default function AdminProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();
  const { language } = useLanguage();

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
        // Simulate fetching user data from an API
        await new Promise(resolve => setTimeout(resolve, 1000));
        const storedUser = localStorage.getItem('matgoUser');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    };
    fetchData();
  }, []);

  const content = {
    ENG: {
      editProfile: "Edit Profile",
      saveProfile: "Save Changes",
      profileUpdated: "Profile Updated",
      profileUpdatedDesc: "Your information has been saved.",
      personalInfoTitle: "Administrator Information",
      firstNameLabel: "First Name",
      lastNameLabel: "Last Name",
      emailLabel: "Email Address",
      securityTitle: "Account Security",
      currentPasswordLabel: "Current Password",
      newPasswordLabel: "New Password",
      confirmNewPasswordLabel: "Confirm New Password",
      updatePassword: "Update Password",
      role: "Role"
    },
    KSW: {
      editProfile: "Badilisha Profaili",
      saveProfile: "Hifadhi Mabadiliko",
      profileUpdated: "Profaili Imehifadhiwa",
      profileUpdatedDesc: "Taarifa zako zimehifadhiwa.",
      personalInfoTitle: "Taarifa za Msimamizi",
      firstNameLabel: "Jina la Kwanza",
      lastNameLabel: "Jina la Ukoo",
      emailLabel: "Anwani ya Barua Pepe",
      securityTitle: "Usalama wa Akaunti",
      currentPasswordLabel: "Nenosiri la Sasa",
      newPasswordLabel: "Nenosiri Jipya",
      confirmNewPasswordLabel: "Thibitisha Nenosiri Jipya",
      updatePassword: "Sasisha Nenosiri",
      role: "Wadhifa"
    },
  };
  const currentContent = content[language];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;
    const { id, value } = e.target;
    setUser({ ...user, [id]: value });
  };
  
  const handleSaveChanges = () => {
    setIsEditing(false);
    // In a real app, send a PUT/PATCH request to '/api/admin/me'
    toast({ title: currentContent.profileUpdated, description: currentContent.profileUpdatedDesc, className: "bg-green-500 text-white" });
  };
  
  const renderLoadingSkeleton = () => (
      <div className="space-y-8">
        <Skeleton className="h-40 w-full rounded-xl"/>
        <Skeleton className="h-64 w-full rounded-xl"/>
      </div>
  );

  if (isLoading) {
    return <AdminLayout>{renderLoadingSkeleton()}</AdminLayout>;
  }

  if (!user) {
    return <AdminLayout><p>Could not load user profile.</p></AdminLayout>;
  }
  
  return (
    <AdminLayout>
      <div className="space-y-8 animate-fade-in">
          <Card className="shadow-xl glassy-card">
            <CardHeader className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left p-6">
              <div className="relative group">
                <Avatar className="h-28 w-28 md:h-32 md:w-32 border-4 border-primary shadow-lg">
                  <AvatarImage src={user.profilePic || "/avatars/admin_avatar.png"} alt={`${user.firstName} ${user.lastName}`} data-ai-hint="admin profile person" />
                  <AvatarFallback className="text-4xl bg-primary/20 text-primary">{user.firstName?.[0]}{user.lastName?.[0]}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex-1">
                <CardTitle className="font-headline text-3xl md:text-4xl text-primary">
                  {user.firstName} {user.lastName}
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground mt-1">{user.email}</CardDescription>
                <p className="text-md font-semibold text-accent">{user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
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

          <Card className="shadow-lg glassy-card">
            <CardHeader><CardTitle className="font-headline text-2xl text-primary">{currentContent.personalInfoTitle}</CardTitle></CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName" className="font-semibold">{currentContent.firstNameLabel}</Label>
                  <Input id="firstName" value={user.firstName} onChange={handleInputChange} disabled={!isEditing} />
                </div>
                <div>
                  <Label htmlFor="lastName" className="font-semibold">{currentContent.lastNameLabel}</Label>
                  <Input id="lastName" value={user.lastName} onChange={handleInputChange} disabled={!isEditing} />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="font-semibold">{currentContent.emailLabel}</Label>
                <Input id="email" type="email" value={user.email} onChange={handleInputChange} disabled={!isEditing} />
              </div>
            </CardContent>
          </Card>

           <Card className="shadow-lg glassy-card">
            <CardHeader><CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><ShieldCheck/>{currentContent.securityTitle}</CardTitle></CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div>
                <Label htmlFor="currentPassword">{currentContent.currentPasswordLabel}</Label>
                <Input id="currentPassword" type="password" placeholder="••••••••" />
              </div>
              <div>
                <Label htmlFor="newPassword">{currentContent.newPasswordLabel}</Label>
                <Input id="newPassword" type="password" placeholder="Choose a strong password" />
              </div>
              <div>
                <Label htmlFor="confirmNewPassword">{currentContent.confirmNewPasswordLabel}</Label>
                <Input id="confirmNewPassword" type="password" placeholder="Re-enter new password" />
              </div>
              <Button className="btn-glow-primary">{currentContent.updatePassword}</Button>
            </CardContent>
          </Card>
      </div>
    </AdminLayout>
  );
}
