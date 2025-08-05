
"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Waypoints } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
    const { language } = useLanguage();
    const content = {
        ENG: {
            title: "404 - Page Not Found",
            description: "Oops! It seems you've taken a wrong turn. The page you're looking for doesn't exist or has been moved.",
            backButton: "Go Back to Dashboard",
        },
        KSW: {
            title: "404 - Ukurasa Haukupatikana",
            description: "Lo! Inaonekana umeingia njia isiyo sahihi. Ukurasa unaotafuta haupo au umehamishwa.",
            backButton: "Rudi kwenye Dashibodi",
        },
    };
    const currentContent = content[language];

    return (
        <AppLayout>
            <div className="flex items-center justify-center h-full py-16">
                <Card className="w-full max-w-lg text-center shadow-2xl glassy-card animate-fade-in border-destructive">
                    <CardHeader className="pt-8">
                        <Waypoints className="mx-auto h-20 w-20 text-destructive animate-pulse" />
                        <CardTitle className="font-headline text-4xl text-destructive mt-4">{currentContent.title}</CardTitle>
                        <CardDescription className="text-lg text-muted-foreground pt-2">
                           {currentContent.description}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pb-8">
                        <Button asChild size="lg" className="btn-glow-primary">
                            <Link href="/dashboard">
                                <ArrowLeft className="mr-2 h-5 w-5"/>
                                {currentContent.backButton}
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
