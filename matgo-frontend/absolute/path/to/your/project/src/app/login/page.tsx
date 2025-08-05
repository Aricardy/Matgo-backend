
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/layout/Header";
import MatGoIcon from "@/components/icons/MatGoIcon";
import { ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

// A structured object for special user roles, making it easy to add more.
const mockUsers = {
  // System Admin
  "admin@matgo.co.ke": {
    password: "Admin@12345",
    userData: { firstName: "System", lastName: "Admin", email: "admin@matgo.co.ke", role: "admin", saccoName: "" },
    redirectUrl: "/admin",
    toastMessages: {
      ENG: { success: "Admin Login Successful", redirect: "Redirecting to admin panel..." },
      KSW: { success: "Kuingia kwa Msimamizi Kumefaulu", redirect: "Inaelekeza kwenye paneli ya usimamizi..." },
    }
  },
  // Sacco Admins - All redirect to /admin, which then displays the correct Sacco-specific view
  "supermetro@sacco.co.ke": {
    password: "SuperMetro@123",
    userData: { firstName: "Alice", lastName: "Kesho", email: "supermetro@sacco.co.ke", role: "sacco_admin", saccoName: "Super Metro" },
    redirectUrl: "/admin",
    toastMessages: {
      ENG: { success: "SACCO Admin Login Successful", redirect: "Redirecting to SACCO dashboard..." },
      KSW: { success: "Kuingia kwa Msimamizi wa SACCO Kumefaulu", redirect: "Inaelekeza kwenye dashibodi ya SACCO..." },
    }
  },
  "ntvrs@matgo.co.ke": {
    password: "Ntvrs@12345",
    userData: { firstName: "NTVRS", lastName: "Admin", email: "ntvrs@matgo.co.ke", role: "sacco_admin", saccoName: "NTVRS Sacco" },
    redirectUrl: "/admin",
    toastMessages: {
        ENG: { success: "SACCO Admin Login Successful", redirect: "Redirecting to SACCO dashboard..." },
        KSW: { success: "Kuingia kwa Msimamizi wa SACCO Kumefaulu", redirect: "Inaelekeza kwenye dashibodi ya SACCO..." },
    }
  },
  // Crew Members
  "johndoe@supermetro.co.ke": {
    password: "Driver@123",
    userData: { firstName: "John", lastName: "Doe", email: "johndoe@supermetro.co.ke", role: "driver", saccoName: "Super Metro" },
    redirectUrl: "/crew/dashboard",
    toastMessages: {
        ENG: { success: "Crew Login Successful", redirect: "Redirecting to crew dashboard..." },
        KSW: { success: "Kuingia kwa Wahudumu Kumefaulu", redirect: "Inaelekeza kwenye dashibodi ya wahudumu..." },
    }
  },
  "janesmith@supermetro.co.ke": {
    password: "Conductor@123",
    userData: { firstName: "Jane", lastName: "Smith", email: "janesmith@supermetro.co.ke", role: "conductor", saccoName: "Super Metro" },
    redirectUrl: "/crew/dashboard",
    toastMessages: {
        ENG: { success: "Crew Login Successful", redirect: "Redirecting to crew dashboard..." },
        KSW: { success: "Kuingia kwa Wahudumu Kumefaulu", redirect: "Inaelekeza kwenye dashibodi ya wahudumu..." },
    }
  }
};


export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  const { language } = useLanguage(); 

  const content = {
    ENG: {
      loginFailed: "Login Failed",
      pleaseEnterCredentials: "Please enter both email/phone and password.",
      loginSuccess: "Login Successful",
      loginRedirect: "Redirecting to dashboard...",
      invalidCredentials: "Invalid credentials. Please try again.",
      welcomeBack: "Welcome Back!",
      loginToAccount: "Login to your MatGo account and hit the road.",
      phoneEmailLabel: "Phone / Email",
      phoneEmailPlaceholder: "e.g., 0712345678 or user@matgo.co.ke",
      passwordLabel: "Password",
      forgotPassword: "Forgot password?",
      passwordPlaceholder: "Enter your password",
      loginButton: "Login",
      newToMatGo: "New to MatGo?",
      createAccount: "Create Account",
    },
    KSW: {
      loginFailed: "Kuingia Imeshindwa",
      pleaseEnterCredentials: "Tafadhali ingiza barua pepe/simu na nenosiri.",
      loginSuccess: "Kuingia Kumefaulu",
      loginRedirect: "Inaelekeza kwenye dashibodi...",
      invalidCredentials: "Vitambulisho si sahihi. Tafadhali jaribu tena.",
      welcomeBack: "Karibu Tena!",
      loginToAccount: "Ingia kwenye akaunti yako ya MatGo na uanze safari.",
      phoneEmailLabel: "Simu / Barua Pepe",
      phoneEmailPlaceholder: "k.m., 0712345678 au mtumiaji@matgo.co.ke",
      passwordLabel: "Nenosiri",
      forgotPassword: "Umesahau nenosiri?",
      passwordPlaceholder: "Weka nenosiri lako",
      loginButton: "Ingia",
      newToMatGo: "Mgeni kwa MatGo?",
      createAccount: "Fungua Akaunti",
    }
  };
  const currentContent = content[language];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email || !password) {
      toast({
        variant: "destructive",
        title: currentContent.loginFailed,
        description: currentContent.pleaseEnterCredentials,
      });
      return;
    }

    localStorage.removeItem('matgoUser');
    
    const specialUser = mockUsers[email as keyof typeof mockUsers];

    if (specialUser && specialUser.password === password) {
      // Handle special roles (Admin, Sacco Admin, Crew)
      const toastMessage = specialUser.toastMessages[language];
      toast({ title: toastMessage.success, description: toastMessage.redirect, className: "bg-green-500 text-white"});
      localStorage.setItem('matgoUser', JSON.stringify(specialUser.userData));
      window.location.href = specialUser.redirectUrl;
    } else {
      // Default passenger logic
      if (email.trim() !== "" && password.trim() !== "") { 
        const emailPart = email.split('@')[0];
        const nameParts = emailPart.split(/[._-]/);
        let fName = "User";
        let lName = "Passenger";

        if (nameParts.length > 0 && nameParts[0]) {
          fName = nameParts[0].charAt(0).toUpperCase() + nameParts[0].slice(1).toLowerCase();
          if (nameParts.length > 1 && nameParts[1]) {
            lName = nameParts.slice(1).map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join(" ");
          }
        }
        
        const userData = { firstName: fName, lastName: lName, email: email, role: "passenger", saccoName: "" };
        toast({ title: currentContent.loginSuccess, description: currentContent.loginRedirect, className: "bg-green-500 text-white"});
        localStorage.setItem('matgoUser', JSON.stringify(userData));
        window.location.href = "/dashboard";
      } else {
         toast({ variant: "destructive", title: currentContent.loginFailed, description: currentContent.invalidCredentials });
      }
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-muted/30 to-background dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
      <Header />
      <main className="flex flex-1 items-center justify-center p-4 md:p-6">
        <Card className="w-full max-w-md shadow-2xl animate-fade-in rounded-xl glassy-card">
          <CardHeader className="text-center space-y-3 pt-8">
            <MatGoIcon className="mx-auto h-20 w-20 text-primary nganya-flash" />
            <CardTitle className="font-headline text-4xl text-primary">{currentContent.welcomeBack}</CardTitle>
            <CardDescription className="text-muted-foreground text-base">{currentContent.loginToAccount}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-8 px-6 md:px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold">{currentContent.phoneEmailLabel}</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder={currentContent.phoneEmailPlaceholder}
                  required
                  className="text-base py-3 px-4 rounded-lg border-2 focus:border-primary focus:ring-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-base font-semibold">{currentContent.passwordLabel}</Label>
                  <Link href="/forgot-password" className="text-sm text-primary hover:underline font-medium">
                    {currentContent.forgotPassword}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  placeholder={currentContent.passwordPlaceholder}
                  className="text-base py-3 px-4 rounded-lg border-2 focus:border-primary focus:ring-primary"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full font-bold text-lg py-6 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 ease-in-out transform hover:scale-105 btn-glow-primary">
                {currentContent.loginButton} <ArrowRight className="ml-2 h-5 w-5"/>
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-3 pb-8">
            <p className="text-sm text-muted-foreground">
              {currentContent.newToMatGo}{" "}
              <Button variant="link" asChild className="text-primary p-0 h-auto font-semibold text-base hover:underline">
                <Link href="/signup">{currentContent.createAccount}</Link>
              </Button>
            </p>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
