"use client";

import Header from "@/components/layout/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function TermsPage() {
  const router = useRouter();
  const { language } = useLanguage();

  const content = {
    ENG: {
      pageTitle: "Terms and Conditions",
      pageDescription: "Please read these terms and conditions carefully before using the MatGo service.",
      backButton: "Back to Signup",
      acceptButton: "Accept Terms & Continue",
    },
    KSW: {
      pageTitle: "Sheria na Masharti",
      pageDescription: "Tafadhali soma sheria na masharti haya kwa makini kabla ya kutumia huduma ya MatGo.",
      backButton: "Rudi Kwenye Usajili",
      acceptButton: "Kubali Masharti na Endelea",
    }
  };
  const currentContent = content[language];

  const handleBackToSignup = () => {
    router.push('/signup');
  };

  const handleAcceptTerms = () => {
    router.push('/signup');
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6 md:py-10">
        <Card className="shadow-xl animate-fade-in">
          <CardHeader>
            <div className="flex items-center gap-4 mb-4">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleBackToSignup}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {currentContent.backButton}
              </Button>
            </div>
            <CardTitle className="font-headline text-3xl md:text-4xl text-primary">{currentContent.pageTitle}</CardTitle>
            <CardDescription>{currentContent.pageDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 prose dark:prose-invert max-w-none">
            <h2>1. Acceptance of Terms</h2>
            <p>By accessing or using the MatGo application (the "Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you disagree with any part of the terms, then you may not access the Service.</p>

            <h2>2. Service Description</h2>
            <p>MatGo provides a platform for fare payment, real-time tracking of public service vehicles (PSVs), booking long-distance trips, and planning custom scenic road trips within Kenya.</p>
            
            <h2>3. User Accounts</h2>
            <p>When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
            <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.</p>

            <h2>4. Fares and Payments</h2>
            <p>Fares are determined based on route, time of day, vehicle type, and SACCO regulations. MatGo facilitates payment through integrated mobile money services. All payments are processed securely. Digital receipts will be issued for all successful transactions.</p>
            <p>For RoadTrip bookings, a 50% deposit is required to confirm the booking. The balance is payable as per the agreement with the vehicle owner or SACCO.</p>

            <h2>5. Cancellations and Refunds</h2>
            <p>Cancellation and refund policies for long-distance bookings and RoadTrips vary by SACCO and service provider. Please check the specific terms at the time of booking. MatGo is not responsible for refund disputes, but will endeavor to facilitate communication.</p>
            
            <h2>6. User Conduct</h2>
            <p>You agree not to use the Service for any unlawful purpose or in any way that interrupts, damages, or impairs the service. Harassment of drivers, conductors, or other users is strictly prohibited.</p>

            <h2>7. Intellectual Property</h2>
            <p>The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of MatGo and its licensors. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of MatGo.</p>
            
            <h2>8. Limitation of Liability</h2>
            <p>In no event shall MatGo, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.</p>

            <h2>9. Changes to Terms</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will try to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>

            <h2>10. Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us at support@matgo.co.ke.</p>

            <p className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
              <Button 
                variant="outline" 
                onClick={handleBackToSignup}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                {currentContent.backButton}
              </Button>
              <Button 
                onClick={handleAcceptTerms}
                className="flex items-center gap-2 btn-glow-primary flex-1"
              >
                <Check className="h-4 w-4" />
                {currentContent.acceptButton}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
