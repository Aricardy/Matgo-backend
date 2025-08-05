
"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

export default function PrivacyPage() {
    const { language } = useLanguage();

    const content = {
        ENG: {
            title: "Privacy Policy",
            description: "Your privacy is important to us. This policy explains what information we collect and how we use it.",
            sections: [
                { title: "1. Information We Collect", content: "We collect information you provide directly to us, such as when you create an account, update your profile, use our services, or communicate with us. This information may include your name, email, phone number, payment information, and any other information you choose to provide. We also collect transaction details related to your use of our services, including the type of service requested, date and time the service was provided, amount charged, and other related transaction details." },
                { title: "2. Location Information", content: "To provide our services, we may collect precise location data about the trip from the MatGo app when it is running in the foreground or background. If you permit the MatGo app to access location services through the permission system used by your mobile operating system, we may also collect the precise location of your device when the app is running." },
                { title: "3. Use of Information", content: "We use the information we collect to provide, maintain, and improve our services, including to facilitate payments, send receipts, provide products and services you request, and develop new features. We may also use the information to perform internal operations, including, for example, to prevent fraud and abuse of our services." },
                { title: "4. Sharing of Information", content: "We may share your information with our trusted partners, including SACCOs and vehicle owners, to facilitate your trip and resolve any issues. We do not sell your personal information to third parties." },
                { title: "5. Your Choices", content: "You may opt out of receiving promotional messages from us by following the instructions in those messages. If you opt out, we may still send you non-promotional communications, such as those about your account, about services you have requested, or our ongoing business relations." },
                { title: "6. Security", content: "We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access, disclosure, alteration and destruction." },
                { title: "7. Contact Us", content: "If you have any questions about this Privacy Policy, please contact us at privacy@matgo.co.ke." },
            ],
            lastUpdated: "Last updated"
        },
        KSW: {
            title: "Sera ya Faragha",
            description: "Faragha yako ni muhimu kwetu. Sera hii inaelezea ni taarifa gani tunakusanya na jinsi tunavyozitumia.",
            sections: [
                { title: "1. Taarifa Tunazokusanya", content: "Tunakusanya taarifa unazotupatia moja kwa moja, kama vile unapofungua akaunti, unaposasisha wasifu wako, unapotumia huduma zetu, au unapowasiliana nasi. Taarifa hizi zinaweza kujumuisha jina lako, barua pepe, nambari ya simu, taarifa za malipo, na taarifa nyingine yoyote unayochagua kutoa. Pia tunakusanya maelezo ya miamala inayohusiana na matumizi yako ya huduma zetu, ikiwa ni pamoja na aina ya huduma iliyoombwa, tarehe na wakati huduma ilipotolewa, kiasi kilichotozwa, na maelezo mengine yanayohusiana na muamala." },
                { title: "2. Taarifa za Mahali", content: "Ili kutoa huduma zetu, tunaweza kukusanya data sahihi ya mahali kuhusu safari kutoka kwa programu ya MatGo inapokuwa inatumika mbele au nyuma. Ukiruhusu programu ya MatGo kufikia huduma za mahali kupitia mfumo wa ruhusa unaotumiwa na mfumo wa uendeshaji wa simu yako, tunaweza pia kukusanya mahali sahihi pa kifaa chako programu inapokuwa inatumika." },
                { title: "3. Matumizi ya Taarifa", content: "Tunatumia taarifa tunazokusanya kutoa, kudumisha, na kuboresha huduma zetu, ikiwa ni pamoja na kuwezesha malipo, kutuma risiti, kutoa bidhaa na huduma unazoomba, na kuendeleza vipengele vipya. Tunaweza pia kutumia taarifa hizo kufanya shughuli za ndani, ikiwa ni pamoja na, kwa mfano, kuzuia udanganyifu na matumizi mabaya ya huduma zetu." },
                { title: "4. Kushiriki Taarifa", content: "Tunaweza kushiriki taarifa zako na washirika wetu wanaoaminika, ikiwa ni pamoja na SACCO na wamiliki wa magari, ili kuwezesha safari yako na kutatua masuala yoyote. Hatuuzi taarifa zako za kibinafsi kwa wahusika wengine." },
                { title: "5. Chaguo Zako", content: "Unaweza kujiondoa kupokea ujumbe wa matangazo kutoka kwetu kwa kufuata maagizo katika ujumbe huo. Ukijiondoa, bado tunaweza kukutumia mawasiliano yasiyo ya matangazo, kama yale kuhusu akaunti yako, kuhusu huduma ulizoomba, au uhusiano wetu unaoendelea wa kibiashara." },
                { title: "6. Usalama", content: "Tunachukua hatua za kuridhisha kusaidia kulinda taarifa zako dhidi ya upotevu, wizi, matumizi mabaya na ufikiaji usioidhinishwa, ufichuaji, ubadilishaji na uharibifu." },
                { title: "7. Wasiliana Nasi", content: "Ikiwa una maswali yoyote kuhusu Sera hii ya Faragha, tafadhali wasiliana nasi kwa privacy@matgo.co.ke." },
            ],
            lastUpdated: "Ilisasishwa mwisho"
        }
    }
    const currentContent = content[language];

  return (
    <AppLayout>
      <main className="flex-1 container py-6 md:py-10">
        <Card className="shadow-xl animate-fade-in glassy-card">
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
            <p className="text-sm text-muted-foreground">{currentContent.lastUpdated}: {new Date().toLocaleDateString(language === 'KSW' ? 'sw-KE' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </CardContent>
        </Card>
      </main>
    </AppLayout>
  );
}
