"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/layout/Header";
import { Mail, ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { language } = useLanguage();
  const router = useRouter();

  const content = {
    ENG: {
      pageTitle: "Forgot Password?",
      pageDescription: "Enter your email address and we'll send you a link to reset your password.",
      emailLabel: "Email Address",
      emailPlaceholder: "Enter your email address",
      sendResetLinkButton: "Send Reset Link",
      backToLogin: "Back to Login",
      resetLinkSent: "Reset Link Sent!",
      resetLinkSentDesc: "Check your email for password reset instructions.",
      emailRequired: "Please enter your email address.",
      invalidEmail: "Please enter a valid email address.",
      emailNotFound: "Email address not found in our system.",
    },
    KSW: {
      pageTitle: "Umesahau Nenosiri?",
      pageDescription: "Weka anwani yako ya barua pepe na tutakutumia kiungo cha kuweka upya nenosiri lako.",
      emailLabel: "Anwani ya Barua Pepe",
      emailPlaceholder: "Weka anwani yako ya barua pepe",
      sendResetLinkButton: "Tuma Kiungo cha Kuweka Upya",
      backToLogin: "Rudi Kuingia",
      resetLinkSent: "Kiungo cha Kuweka Upya Kimetumwa!",
      resetLinkSentDesc: "Angalia barua pepe yako kwa maagizo ya kuweka upya nenosiri.",
      emailRequired: "Tafadhali weka anwani yako ya barua pepe.",
      invalidEmail: "Tafadhali weka anwani sahihi ya barua pepe.",
      emailNotFound: "Anwani ya barua pepe haijapatikana kwenye mfumo wetu.",
    }
  };
  const currentContent = content[language];

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    if (!email) {
      toast({ variant: "destructive", title: currentContent.emailRequired });
      setIsLoading(false);
      return;
    }

    if (!validateEmail(email)) {
      toast({ variant: "destructive", title: currentContent.invalidEmail });
      setIsLoading(false);
      return;
    }

    try {
      // Send forgot password request to backend
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: email
        })
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: currentContent.resetLinkSent,
          description: currentContent.resetLinkSentDesc,
          className: "bg-green-500 text-white",
        });
        
        // Redirect to login page after successful request
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        const errorData = await response.json();
        if (response.status === 404) {
          toast({ variant: "destructive", title: currentContent.emailNotFound });
        } else {
          throw new Error(errorData.message || 'Failed to send reset link');
        }
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      
      // Still show success for security reasons (don't reveal if email exists)
      toast({
        title: currentContent.resetLinkSent,
        description: currentContent.resetLinkSentDesc,
        className: "bg-green-500 text-white",
      });
      
      // Redirect to login page
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-muted/30 to-background dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
      <Header />
      <main className="flex flex-1 items-center justify-center p-4 md:p-6">
        <Card className="w-full max-w-md shadow-2xl animate-fade-in rounded-xl glassy-card">
          <CardHeader className="text-center space-y-3 pt-8">
            <Mail className="mx-auto h-16 w-16 text-primary" />
            <CardTitle className="font-headline text-3xl text-primary">{currentContent.pageTitle}</CardTitle>
            <CardDescription className="text-muted-foreground text-base px-2">{currentContent.pageDescription}</CardDescription>
          </CardHeader>
          <CardContent className="pt-6 pb-8 px-6 md:px-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-base font-semibold">{currentContent.emailLabel}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={currentContent.emailPlaceholder}
                  required
                  className="text-base py-3 px-4 rounded-lg border-2 focus:border-primary focus:ring-primary"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="w-full font-bold text-lg py-6 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 ease-in-out transform hover:scale-105 btn-glow-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (language === 'KSW' ? 'Inatuma...' : 'Sending...') : currentContent.sendResetLinkButton}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col items-center pb-8">
            <Button variant="link" asChild className="text-primary p-0 h-auto font-semibold text-base hover:underline">
              <Link href="/login"><ArrowLeft className="mr-1.5 h-4 w-4"/>{currentContent.backToLogin}</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}