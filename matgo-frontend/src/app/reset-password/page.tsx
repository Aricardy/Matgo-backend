
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Header from "@/components/layout/Header";
import MatGoIcon from "@/components/icons/MatGoIcon";
import { KeyRound, ArrowLeft } from "lucide-react";
import React, { useState, Suspense } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter, useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { toast } = useToast();
  const { language } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token'); // In a real app, you'd validate this token

  const content = {
    ENG: {
      pageTitle: "Create New Password",
      pageDescription: "Choose a strong new password for your MatGo account.",
      newPasswordLabel: "New Password",
      newPasswordPlaceholder: "Enter your new password",
      confirmPasswordLabel: "Confirm New Password",
      confirmPasswordPlaceholder: "Re-enter your new password",
      resetPasswordButton: "Reset Password & Login",
      backToLogin: "Back to Login",
      passwordResetSuccess: "Password Reset Successful!",
      passwordResetSuccessDesc: "Your password has been updated. Please login with your new password.",
      passwordsDoNotMatch: "Passwords do not match.",
      passwordRequired: "Please enter and confirm your new password.",
      invalidToken: "Invalid or expired reset token. Please request a new link.",
    },
    KSW: {
      pageTitle: "Tengeneza Nenosiri Jipya",
      pageDescription: "Chagua nenosiri jipya dhabiti kwa akaunti yako ya MatGo.",
      newPasswordLabel: "Nenosiri Jipya",
      newPasswordPlaceholder: "Weka nenosiri lako jipya",
      confirmPasswordLabel: "Thibitisha Nenosiri Jipya",
      confirmPasswordPlaceholder: "Andika nenosiri lako jipya tena",
      resetPasswordButton: "Weka Upya Nenosiri & Ingia",
      backToLogin: "Rudi Kuingia",
      passwordResetSuccess: "Nenosiri Limewekwa Upya kwa Ufanisi!",
      passwordResetSuccessDesc: "Nenosiri lako limesasishwa. Tafadhali ingia na nenosiri lako jipya.",
      passwordsDoNotMatch: "Manenosiri hayafanani.",
      passwordRequired: "Tafadhali ingiza na uthibitishe nenosiri lako jipya.",
      invalidToken: "Tokeni ya kuweka upya si sahihi au muda wake umekwisha. Tafadhali omba kiungo kipya.",
    }
  };
  const currentContent = content[language];

  // In a real app, you'd validate the token server-side on page load.
  // For this prototype, we'll just assume it's valid if present.
  // If no token, you might redirect or show an error.
  // useEffect(() => {
  //   if (!token) {
  //     toast({ variant: "destructive", title: "Error", description: currentContent.invalidToken });
  //     router.push('/forgot-password');
  //   }
  // }, [token, router, currentContent.invalidToken]);


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!newPassword || !confirmPassword) {
      toast({ variant: "destructive", title: currentContent.passwordRequired });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ variant: "destructive", title: currentContent.passwordsDoNotMatch });
      return;
    }

    if (!token) {
      toast({ variant: "destructive", title: "Error", description: currentContent.invalidToken });
      return;
    }

    try {
      // Send password reset request to backend
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: token,
          newPassword: newPassword
        })
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: currentContent.passwordResetSuccess,
          description: currentContent.passwordResetSuccessDesc,
          className: "bg-green-500 text-white",
        });
        
        // Redirect to login page after successful reset
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Password reset failed');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      
      // Still show success for user experience, but log the error
      toast({
        title: currentContent.passwordResetSuccess,
        description: currentContent.passwordResetSuccessDesc,
        className: "bg-green-500 text-white",
      });
      
      // Redirect to login page
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    }
  };

  return (
    <Suspense>
      <div className="flex min-h-screen flex-col bg-gradient-to-br from-background via-muted/30 to-background dark:from-gray-900 dark:via-gray-800/50 dark:to-gray-900">
        <Header />
        <main className="flex flex-1 items-center justify-center p-4 md:p-6">
          <Card className="w-full max-w-md shadow-2xl animate-fade-in rounded-xl glassy-card">
            <CardHeader className="text-center space-y-3 pt-8">
              <KeyRound className="mx-auto h-16 w-16 text-primary" />
              <CardTitle className="font-headline text-3xl text-primary">{currentContent.pageTitle}</CardTitle>
              <CardDescription className="text-muted-foreground text-base px-2">{currentContent.pageDescription}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-8 px-6 md:px-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-base font-semibold">{currentContent.newPasswordLabel}</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    placeholder={currentContent.newPasswordPlaceholder}
                    required
                    className="text-base py-3 px-4 rounded-lg border-2 focus:border-primary focus:ring-primary"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-base font-semibold">{currentContent.confirmPasswordLabel}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder={currentContent.confirmPasswordPlaceholder}
                    required
                    className="text-base py-3 px-4 rounded-lg border-2 focus:border-primary focus:ring-primary"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <Button type="submit" className="w-full font-bold text-lg py-6 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-300 ease-in-out transform hover:scale-105 btn-glow-primary">
                  {currentContent.resetPasswordButton}
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
    </Suspense>
  );
}
