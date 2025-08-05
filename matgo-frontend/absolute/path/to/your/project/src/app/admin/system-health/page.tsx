
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Server } from "lucide-react";
import React from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SystemHealthPage() {
    const { language } = useLanguage();

    const content = {
        ENG: {
            pageTitle: "System Health",
            pageDescription: "Monitor real-time system performance, API response times, and database status.",
            apiStatus: "API Status",
            dbStatus: "Database Status",
            placeholder: "Real-time monitoring charts and status indicators would be displayed here.",
        },
        KSW: {
            pageTitle: "Afya ya Mfumo",
            pageDescription: "Fuatilia utendaji wa mfumo kwa wakati halisi, muda wa majibu ya API, na hali ya hifadhidata.",
            apiStatus: "Hali ya API",
            dbStatus: "Hali ya Hifadhidata",
            placeholder: "Chati za ufuatiliaji wa wakati halisi na viashiria vya hali vitaonyeshwa hapa.",
        }
    };
    const currentContent = content[language];

    return (
         <div className="space-y-8 animate-fade-in">
             <Card className="shadow-xl glassy-card">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl md:text-4xl text-primary flex items-center gap-3">
                        <LineChart /> {currentContent.pageTitle}
                    </CardTitle>
                    <CardDescription className="text-base mt-1">
                        {currentContent.pageDescription}
                    </CardDescription>
                </CardHeader>
            </Card>
            <Card className="shadow-lg glassy-card">
                <CardContent className="pt-6 text-center text-muted-foreground">
                    <Server className="mx-auto h-12 w-12 mb-4" />
                    <p>{currentContent.placeholder}</p>
                </CardContent>
            </Card>
        </div>
    );
}
