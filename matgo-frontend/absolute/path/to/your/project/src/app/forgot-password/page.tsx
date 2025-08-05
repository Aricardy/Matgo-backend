
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/layout/Header";
import MatGoIcon from "@/components/icons/MatGoIcon";
import { Mail, ArrowLeft } from "lucide-react";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const { language } = useLanguage();

  const content = {
    ENG: {
      pageTitle: "Forgot Your Password?",
      pageDescription: "No worries! Enter your email address below and we'll send you a link to reset your password (simulation).",
      emailLabel: "Email Address",
      emailPlaceholder: "Enter your registered email",
      sendResetLinkButton: "Send Reset Link",
      backToLogin: "Back to Login",
      emailSentTitle: "Check Your Email!",
      emailSentDesc: "If an account exists for this email, a password reset link has been sent (simulated).",
      pleaseEnterEmail: "Please enter your email address.",
    },
    KSW: {
      pageTitle: "Umesahau Nenosiri Lako?",
      pageDescription: "Hakuna wasiwasi! Ingiza anwani yako ya barua pepe hapa chini na tutakutumia kiungo cha kuweka upya nenosiri lako (mfumo wa kuiga).",
      emailLabel: "Anwani ya Barua Pepe",
      emailPlaceholder: "Weka barua pepe yako iliyosajiliwa",
      sendResetLinkButton: "Tuma Kiungo cha Kuweka Upya",
      backToLogin: "Rudi Kuingia",
      emailSentTitle: "Angalia Barua Pepe Yako!",
      emailSentDesc: "Ikiwa akaunti ipo kwa barua pepe hii, kiungo cha kuweka upya nenosiri kimetumwa (mfumo wa kuiga).",
      pleaseEnterEmail: "Tafadhali ingiza anwani yako ya barua pepe.",
    }
  };
  const currentContent = content[language];

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      toast({ variant: "destructive", title: currentContent.pleaseEnterEmail });
      return;
    }
    // Simulate sending email
    toast({
      title: currentContent.emailSentTitle,
      description: currentContent.emailSentDesc,
      className: "bg-green-500 text-white",
    });
    setEmail(""); // Clear field after "sending"
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
              <Button type="submit" className="w-full font-bold text-lg py-6 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 ease-in-out transform hover:scale-105 btn-glow-primary">
                {currentContent.sendResetLinkButton}
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
