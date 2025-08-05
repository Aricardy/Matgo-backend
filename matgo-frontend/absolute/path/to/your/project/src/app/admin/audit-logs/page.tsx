
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShieldCheck } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

interface AuditLog {
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

export default function AuditLogsPage() {
    const { language } = useLanguage();
    const [isLoading, setIsLoading] = useState(true);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setAuditLogs([]);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const content = {
        ENG: {
            pageTitle: "Audit Logs",
            pageDescription: "Track all administrative actions and significant events within the system.",
            timestamp: "Timestamp",
            user: "User / System",
            action: "Action",
            details: "Details",
            noLogs: "No audit logs found.",
        },
        KSW: {
            pageTitle: "Kumbukumbu za Ukaguzi",
            pageDescription: "Fuatilia vitendo vyote vya kiutawala na matukio muhimu ndani ya mfumo.",
            timestamp: "Muda",
            user: "Mtumiaji / Mfumo",
            action: "Kitendo",
            details: "Maelezo",
            noLogs: "Hakuna kumbukumbu za ukaguzi zilizopatikana.",
        }
    };
    const currentContent = content[language];
    
     const renderLoadingSkeleton = () => (
         <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-8 w-full" />
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
             <Card className="shadow-xl glassy-card">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl md:text-4xl text-primary flex items-center gap-3">
                        <ShieldCheck /> {currentContent.pageTitle}
                    </CardTitle>
                    <CardDescription className="text-base mt-1">
                        {currentContent.pageDescription}
                    </CardDescription>
                </CardHeader>
            </Card>
            <Card className="shadow-lg glassy-card">
                <CardContent className="pt-6">
                    {isLoading ? renderLoadingSkeleton() : (
                        <Table>
                            <TableHeader><TableRow><TableHead>{currentContent.timestamp}</TableHead><TableHead>{currentContent.user}</TableHead><TableHead>{currentContent.action}</TableHead><TableHead>{currentContent.details}</TableHead></TableRow></TableHeader>
                            <TableBody>
                            {auditLogs.length > 0 ? auditLogs.map((log, index) => (
                                <TableRow key={index} className="hover:bg-primary/5">
                                    <TableCell className="text-xs">{log.timestamp}</TableCell>
                                    <TableCell className="text-sm">{log.user}</TableCell>
                                    <TableCell className="text-sm font-medium">{log.action}</TableCell>
                                    <TableCell className="text-xs text-muted-foreground">{log.details}</TableCell>
                                </TableRow>
                            )) : <TableRow><TableCell colSpan={4} className="text-center">{currentContent.noLogs}</TableCell></TableRow>}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
