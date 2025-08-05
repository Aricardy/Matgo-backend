
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/layout/Header";
import MatGoIcon from "@/components/icons/MatGoIcon";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, User, Briefcase, Users, Camera, Building } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserRole = "passenger" | "driver" | "conductor" | "sacco";

// Sample Saccos for the dropdown
const sampleSaccos = [
  { id: "s1", name: "Super Metro" },
  { id: "s2", name: "Explicit United" },
  { id: "s3", name: "ROG Sacco" },
  { id: "s4", name: "Citi Hoppa" },
  { id: "s5", name: "NTVRS Sacco" },
];

export default function SignupPage() {
  const searchParams = useSearchParams();
  const initialRole = (searchParams.get('role') as UserRole) || 'passenger';

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<UserRole>(initialRole);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(null);
  
  // State for role-specific fields
  const [sacco, setSacco] = useState<string | undefined>();
  const [busIdentifier, setBusIdentifier] = useState("");
  const [busType, setBusType] = useState<string | undefined>();
  const [busPicPreview, setBusPicPreview] = useState<string | null>(null);
  const [saccoName, setSaccoName] = useState("");

  const { toast } = useToast();
  const { language } = useLanguage();

  useEffect(() => {
    setRole(initialRole);
  }, [initialRole]);

  const content = {
    ENG: {
      pageTitle: "Join MatGo Today!",
      pageDescription: "Create your account to start your vibrant journey.",
      firstNameLabel: "First Name",
      firstNamePlaceholder: "Juma",
      lastNameLabel: "Last Name",
      lastNamePlaceholder: "Otieno",
      phoneLabel: "Phone Number",
      phonePlaceholder: "0712 345 678",
      emailLabel: "Email (Optional for Passengers)",
      emailPlaceholder: "your.email@example.com",
      passwordLabel: "Password",
      passwordPlaceholder: "Create a strong password",
      confirmPasswordLabel: "Confirm Password",
      confirmPasswordPlaceholder: "Re-enter your password",
      roleLabel: "I am a...",
      rolePassenger: "Passenger",
      roleDriver: "Driver",
      roleConductor: "Conductor",
      roleSacco: "SACCO Admin",
      termsLabel: (
        <>
          I agree to the MatGo{" "}
          <Link href="/terms" className="text-primary hover:underline font-medium">
            Terms and Conditions
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-primary hover:underline font-medium">
            Privacy Policy
          </Link>.
        </>
      ),
      createAccountButton: "Create Account",
      alreadyHaveAccount: "Already have an account?",
      loginInstead: "Login Instead",
      signupSuccessTitle: "Account Created!",
      signupSuccessDesc: (name: string, selectedRole: string) => `Welcome, ${name}! Your ${selectedRole} account is ready. Redirecting...`,
      passwordMismatch: "Passwords do not match.",
      missingFields: "Please fill all required fields and agree to terms.",
      profilePhotoLabel: "Profile Photo",
      uploadOr: "Take or Upload Photo",
      crewInfoTitle: "Crew & Bus Information",
      saccoAdminInfoTitle: "SACCO Information",
      busIdentifierLabel: "Bus Plate / Fleet Name*",
      busIdentifierPlaceholder: "e.g., KDA 123X or Monalisa",
      busTypeLabel: "Bus Type*",
      busTypePlaceholder: "Select bus type",
      saccoLabel: "Your SACCO*",
      saccoPlaceholder: "Select your SACCO",
      busPhotoLabel: "Bus Photo*",
      saccoNameLabel: "Official SACCO Name*",
      saccoNamePlaceholder: "Enter the full SACCO name",
      accountApprovalNotice: "Driver, Conductor, and SACCO Admin accounts require approval before activation.",
    },
    KSW: {
      pageTitle: "Jiunge na MatGo Leo!",
      pageDescription: "Fungua akaunti yako kuanza safari yako ya kusisimua.",
      firstNameLabel: "Jina la Kwanza",
      firstNamePlaceholder: "Juma",
      lastNameLabel: "Jina la Ukoo",
      lastNamePlaceholder: "Otieno",
      phoneLabel: "Nambari ya Simu",
      phonePlaceholder: "0712 345 678",
      emailLabel: "Barua Pepe (Si lazima kwa Abiria)",
      emailPlaceholder: "barua.pepe@mfano.com",
      passwordLabel: "Nenosiri",
      passwordPlaceholder: "Tengeneza nenosiri dhabiti",
      confirmPasswordLabel: "Thibitisha Nenosiri",
      confirmPasswordPlaceholder: "Andika nenosiri lako tena",
      roleLabel: "Mimi ni...",
      rolePassenger: "Abiria",
      roleDriver: "Dereva",
      roleConductor: "Kondakta",
      roleSacco: "Msimamizi wa SACCO",
      termsLabel: (
        <>
          Ninakubaliana na MatGo{" "}
          <Link href="/terms" className="text-primary hover:underline font-medium">
            Sheria na Masharti
          </Link>{" "}
          na{" "}
          <Link href="/privacy" className="text-primary hover:underline font-medium">
            Sera ya Faragha
          </Link>.
        </>
      ),
      createAccountButton: "Fungua Akaunti",
      alreadyHaveAccount: "Tayari una akaunti?",
      loginInstead: "Ingia Badala Yake",
      signupSuccessTitle: "Akaunti Imefunguliwa!",
      signupSuccessDesc: (name: string, selectedRole: string) => `Karibu, ${name}! Akaunti yako ya ${selectedRole} iko tayari. Inaelekeza...`,
      passwordMismatch: "Manenosiri hayafanani.",
      missingFields: "Tafadhali jaza sehemu zote zinazohitajika na ukubali masharti.",
      profilePhotoLabel: "Picha ya Profaili",
      uploadOr: "Piga au Pakia Picha",
      crewInfoTitle: "Taarifa za Wahudumu na Basi",
      saccoAdminInfoTitle: "Taarifa za SACCO",
      busIdentifierLabel: "Namba ya Gari / Jina la Meli*",
      busIdentifierPlaceholder: "k.m., KDA 123X au Monalisa",
      busTypeLabel: "Aina ya Basi*",
      busTypePlaceholder: "Chagua aina ya basi",
      saccoLabel: "SACCO Yako*",
      saccoPlaceholder: "Chagua SACCO yako",
      busPhotoLabel: "Picha ya Basi*",
      saccoNameLabel: "Jina Rasmi la SACCO*",
      saccoNamePlaceholder: "Weka jina kamili la SACCO",
      accountApprovalNotice: "Akaunti za Madereva, Makondakta, na Wasimamizi wa SACCO zinahitaji idhini kabla ya kuwashwa.",
    },
  };
  const currentContent = content[language];


  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let isFormValid = true;
    if (!firstName || !lastName || !phone || !password || !confirmPassword || !termsAgreed) {
        isFormValid = false;
    }
    if (role === 'driver' || role === 'conductor') {
        if (!sacco || !busIdentifier || !busType || !busPicPreview) isFormValid = false;
    }
    if (role === 'sacco') {
        if (!saccoName) isFormValid = false;
    }

    if (!isFormValid) {
        toast({ variant: "destructive", title: currentContent.missingFields });
        return;
    }
    if (password !== confirmPassword) {
      toast({ variant: "destructive", title: currentContent.passwordMismatch });
      return;
    }

    const userData = {
      firstName,
      lastName,
      phone,
      email: email || null,
      role,
    };
    localStorage.setItem('matgoUser', JSON.stringify(userData));

    toast({
      title: currentContent.signupSuccessTitle,
      description: currentContent.signupSuccessDesc(firstName, role),
      className: "bg-green-500 text-white",
    });

    window.location.href = "/dashboard";
  };
  
  const roleOptions = [
    { value: "passenger", label: currentContent.rolePassenger, icon: User },
    { value: "driver", label: currentContent.roleDriver, icon: Briefcase },
    { value: "conductor", label: currentContent.roleConductor, icon: Users },
    { value: "sacco", label: currentContent.roleSacco, icon: Building },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, setImagePreview: React.Dispatch<React.SetStateAction<string | null>>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-muted/30 to-background dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
      <Header />
      <main className="flex flex-1 items-center justify-center p-4 md:p-6">
        <Card className="w-full max-w-lg shadow-2xl animate-fade-in rounded-xl glassy-card">
          <CardHeader className="text-center space-y-3 pt-8">
             <MatGoIcon className="mx-auto h-20 w-20 text-primary nganya-flash" />
            <CardTitle className="font-headline text-4xl text-primary">{currentContent.pageTitle}</CardTitle>
            <CardDescription className="text-muted-foreground text-base">{currentContent.pageDescription}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-8 px-6 md:px-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="flex flex-col items-center space-y-2">
                <Label className="text-base font-semibold">{currentContent.profilePhotoLabel}</Label>
                <div className="relative group">
                    <Avatar className="h-24 w-24 border-4 border-primary/50">
                        <AvatarImage src={profilePicPreview || undefined} alt="Profile preview" data-ai-hint="profile person"/>
                        <AvatarFallback className="text-3xl bg-primary/20 text-primary">{firstName?.[0]}{lastName?.[0]}</AvatarFallback>
                    </Avatar>
                     <label htmlFor="profilePicUpload" className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Camera className="h-8 w-8 text-white"/>
                        <input id="profilePicUpload" type="file" accept="image/*" className="sr-only" onChange={(e) => handleImageUpload(e, setProfilePicPreview)}/>
                     </label>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-base font-semibold">{currentContent.firstNameLabel}*</Label>
                  <Input id="firstName" placeholder={currentContent.firstNamePlaceholder} required value={firstName} onChange={(e) => setFirstName(e.target.value)} className="text-base py-3 px-4 rounded-lg border-2 focus:border-primary focus:ring-primary"/>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-base font-semibold">{currentContent.lastNameLabel}*</Label>
                  <Input id="lastName" placeholder={currentContent.lastNamePlaceholder} required value={lastName} onChange={(e) => setLastName(e.target.value)} className="text-base py-3 px-4 rounded-lg border-2 focus:border-primary focus:ring-primary"/>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-base font-semibold">{currentContent.phoneLabel}*</Label>
                <Input id="phone" type="tel" placeholder={currentContent.phonePlaceholder} required value={phone} onChange={(e) => setPhone(e.target.value)} className="text-base py-3 px-4 rounded-lg border-2 focus:border-primary focus:ring-primary"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold">{currentContent.emailLabel}</Label>
                <Input id="email" type="email" placeholder={currentContent.emailPlaceholder} value={email} onChange={(e) => setEmail(e.target.value)} className="text-base py-3 px-4 rounded-lg border-2 focus:border-primary focus:ring-primary"/>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-base font-semibold">{currentContent.roleLabel}</Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger className="text-base py-3 px-4 rounded-lg border-2 focus:border-primary focus:ring-primary">
                    <SelectValue placeholder="Select your role" />
                  </SelectTrigger>
                  <SelectContent>
                    {roleOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value} className="text-base py-2.5">
                        <div className="flex items-center gap-2">
                          <opt.icon className="h-5 w-5 text-muted-foreground"/>
                          {opt.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                 {(role !== "passenger") && (
                  <p className="text-xs text-muted-foreground mt-1">{currentContent.accountApprovalNotice}</p>
                )}
              </div>
              
              {(role === 'driver' || role === 'conductor') && (
                <Card className="p-4 bg-muted/30 border-primary/30">
                    <CardHeader className="p-0 pb-3"><CardTitle className="text-primary font-headline">{currentContent.crewInfoTitle}</CardTitle></CardHeader>
                    <CardContent className="p-0 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="sacco" className="text-base font-semibold">{currentContent.saccoLabel}</Label>
                            <Select value={sacco} onValueChange={setSacco} required>
                                <SelectTrigger><SelectValue placeholder={currentContent.saccoPlaceholder} /></SelectTrigger>
                                <SelectContent>{sampleSaccos.map(s => <SelectItem key={s.id} value={s.name}>{s.name}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="busIdentifier" className="text-base font-semibold">{currentContent.busIdentifierLabel}</Label>
                            <Input id="busIdentifier" placeholder={currentContent.busIdentifierPlaceholder} required value={busIdentifier} onChange={e => setBusIdentifier(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="busType" className="text-base font-semibold">{currentContent.busTypeLabel}</Label>
                             <Select value={busType} onValueChange={setBusType} required>
                                <SelectTrigger><SelectValue placeholder={currentContent.busTypePlaceholder}/></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Nganya">Nganya (Matatu Art)</SelectItem>
                                    <SelectItem value="Bus">Bus (e.g. Super Metro)</SelectItem>
                                    <SelectItem value="Minibus">Minibus</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="busPhoto" className="text-base font-semibold">{currentContent.busPhotoLabel}</Label>
                            <Input id="busPhoto" type="file" accept="image/*" required onChange={(e) => handleImageUpload(e, setBusPicPreview)} className="text-sm file:mr-2 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
                            {busPicPreview && <img src={busPicPreview} alt="Bus preview" className="w-24 h-16 object-cover rounded-md mt-2" data-ai-hint="bus side"/>}
                        </div>
                    </CardContent>
                </Card>
              )}

              {role === 'sacco' && (
                 <Card className="p-4 bg-muted/30 border-primary/30">
                    <CardHeader className="p-0 pb-3"><CardTitle className="text-primary font-headline">{currentContent.saccoAdminInfoTitle}</CardTitle></CardHeader>
                    <CardContent className="p-0 space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="saccoName" className="text-base font-semibold">{currentContent.saccoNameLabel}</Label>
                            <Input id="saccoName" placeholder={currentContent.saccoNamePlaceholder} required value={saccoName} onChange={e => setSaccoName(e.target.value)}/>
                        </div>
                    </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-base font-semibold">{currentContent.passwordLabel}*</Label>
                    <Input id="password" type="password" placeholder={currentContent.passwordPlaceholder} required value={password} onChange={(e) => setPassword(e.target.value)} className="text-base py-3 px-4 rounded-lg border-2 focus:border-primary focus:ring-primary"/>
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-base font-semibold">{currentContent.confirmPasswordLabel}*</Label>
                    <Input id="confirmPassword" type="password" placeholder={currentContent.confirmPasswordPlaceholder} required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="text-base py-3 px-4 rounded-lg border-2 focus:border-primary focus:ring-primary"/>
                  </div>
              </div>
              <div className="flex items-start space-x-3 pt-2">
                <Checkbox 
                  id="terms" 
                  required 
                  checked={termsAgreed}
                  onCheckedChange={(checked) => setTermsAgreed(checked as boolean)}
                  className="mt-1 border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                />
                <Label htmlFor="terms" className="text-sm font-normal text-muted-foreground leading-relaxed">
                  {currentContent.termsLabel}
                </Label>
              </div>
              <Button type="submit" className="w-full font-bold text-lg py-6 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 ease-in-out transform hover:scale-105 btn-glow-primary">
                {currentContent.createAccountButton} <ArrowRight className="ml-2 h-5 w-5"/>
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center pb-8">
            <p className="text-sm text-muted-foreground">
              {currentContent.alreadyHaveAccount}{" "}
              <Button variant="link" asChild className="text-primary p-0 h-auto font-semibold text-base hover:underline">
                <Link href="/login">{currentContent.loginInstead}</Link>
              </Button>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
