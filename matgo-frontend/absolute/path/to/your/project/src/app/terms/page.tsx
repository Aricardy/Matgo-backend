
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/Header";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function TermsPage() {
    const { language } = useLanguage();
    const { toast } = useToast();
    const router = useRouter();

    const content = {
        ENG: {
            title: "Terms and Conditions",
            description: "Please read and agree to the terms before completing your registration.",
            agreeButton: "Agree & Continue",
            forfeitButton: "Disagree & Exit",
            forfeitToastTitle: "Registration Cancelled",
            forfeitToastDesc: "You have chosen not to agree to the terms. For more info, contact MatGo at 0105127824 or 0116302317.",
            sections: [
                { title: "1. Acceptance of Terms", content: "By accessing or using the MatGo application (the \"Service\"), you agree to be bound by these Terms and Conditions (\"Terms\"). If you disagree with any part of the terms, then you may not access the Service." },
                { title: "2. Service Description", content: "MatGo provides a platform for fare payment, real-time tracking of public service vehicles (PSVs), booking long-distance trips, and planning custom scenic road trips within Kenya." },
                { title: "3. User Accounts", content: "When you create an account with us, you must provide information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password." },
            ],
        },
        KSW: {
            title: "Sheria na Masharti",
            description: "Tafadhali soma na ukubali masharti kabla ya kukamilisha usajili wako.",
            agreeButton: "Kubali & Endelea",
            forfeitButton: "Sitakubali & Ondoka",
            forfeitToastTitle: "Usajili Umesitishwa",
            forfeitToastDesc: "Umechagua kutokubaliana na masharti. Kwa maelezo zaidi, wasiliana na MatGo kwa 0105127824 au 0116302317.",
            sections: [
                { title: "1. Kukubali Masharti", content: "Kwa kufikia au kutumia programu ya MatGo (\"Huduma\"), unakubali kufungwa na Sheria na Masharti haya (\"Masharti\"). Ikiwa hukubaliani na sehemu yoyote ya masharti, basi huwezi kufikia Huduma." },
                { title: "2. Maelezo ya Huduma", content: "MatGo hutoa jukwaa la malipo ya nauli, ufuatiliaji wa wakati halisi wa magari ya huduma ya umma (PSV), uhifadhi wa safari za masafa marefu, na upangaji wa safari maalum za barabarani nchini Kenya." },
                { title: "3. Akaunti za Watumiaji", content: "Unapofungua akaunti nasi, lazima utoe taarifa sahihi, kamili, na ya sasa wakati wote. Kukosa kufanya hivyo ni ukiukaji wa Masharti, ambayo inaweza kusababisha kusitishwa mara moja kwa akaunti yako kwenye Huduma yetu. Unawajibika kulinda nenosiri unalotumia kufikia Huduma na kwa shughuli zozote chini ya nenosiri lako." },
            ],
        }
    }
    const currentContent = content[language];

    const handleAgree = () => {
        // In a real app, this would likely set a flag in localStorage or a cookie
        // and then redirect back to the signup page to allow submission.
        // For this simulation, we'll just go back.
        router.back();
    };

    const handleForfeit = () => {
        toast({
            title: currentContent.forfeitToastTitle,
            description: currentContent.forfeitToastDesc,
            duration: 8000
        });
        router.push('/');
    };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />
      <main className="flex-1 container py-6 md:py-10">
        <Card className="shadow-xl animate-fade-in glassy-card max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="font-headline text-3xl md:text-4xl text-primary">{currentContent.title}</CardTitle>
            <CardDescription>{currentContent.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 prose dark:prose-invert max-w-none">
            {currentContent.sections.map(section => (
                <div key={section.title}>
                    <h2>{section.title}</h2>
                    <p>{section.content}</p>
                </div>
            ))}
          </CardContent>
          <div className="p-6 flex flex-col sm:flex-row justify-end gap-4 border-t mt-6">
            <Button variant="destructive" size="lg" onClick={handleForfeit}>{currentContent.forfeitButton}</Button>
            <Button size="lg" onClick={handleAgree}>{currentContent.agreeButton}</Button>
          </div>
        </Card>
      </main>
    </div>
  );
}
