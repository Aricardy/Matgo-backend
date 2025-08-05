
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UserCheck, Edit, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Personnel {
  id: string;
  name: string;
  role: "Driver" | "Conductor" | "Manager";
  sacco: string;
  status: "Active" | "Suspended";
  phone: string;
  nationalId: string;
  licenseNo: string;
}

export default function PersonnelPage() {
    const { language } = useLanguage();
    const [isLoading, setIsLoading] = useState(true);
    const [personnel, setPersonnel] = useState<Personnel[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setPersonnel([]);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const content = {
        ENG: {
            pageTitle: "Personnel Management",
            pageDescription: "View, add, and manage all drivers, conductors, and managers.",
            name: "Name",
            role: "Role",
            sacco: "Sacco",
            phone: "Phone",
            nationalId: "National ID",
            licenseNo: "License No.",
            status: "Status",
            actions: "Actions",
            noPersonnel: "No personnel found.",
        },
        KSW: {
            pageTitle: "Usimamizi wa Wafanyikazi",
            pageDescription: "Tazama, ongeza, na dhibiti madereva, makondakta, na wasimamizi wote.",
            name: "Jina",
            role: "Wadhifa",
            sacco: "Sacco",
            phone: "Simu",
            nationalId: "Kitambulisho cha Taifa",
            licenseNo: "Namba ya Leseni",
            status: "Hali",
            actions: "Vitendo",
            noPersonnel: "Hakuna wafanyikazi waliopatikana.",
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
                        <UserCheck /> {currentContent.pageTitle}
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
                        <TableHeader><TableRow><TableHead>{currentContent.name}</TableHead><TableHead>{currentContent.role}</TableHead><TableHead>{currentContent.sacco}</TableHead><TableHead>{currentContent.phone}</TableHead><TableHead>{currentContent.nationalId}</TableHead><TableHead>{currentContent.licenseNo}</TableHead><TableHead>{currentContent.status}</TableHead><TableHead className="text-right">{currentContent.actions}</TableHead></TableRow></TableHeader>
                        <TableBody>
                        {personnel.length > 0 ? personnel.map(p => (
                            <TableRow key={p.id} className="hover:bg-primary/5">
                            <TableCell className="font-medium text-base">{p.name}</TableCell>
                            <TableCell className="text-sm">{p.role}</TableCell>
                            <TableCell className="text-sm">{p.sacco}</TableCell>
                            <TableCell className="text-sm font-mono">{p.phone}</TableCell>
                            <TableCell className="text-sm font-mono">{p.nationalId}</TableCell>
                            <TableCell className="text-sm font-mono">{p.licenseNo}</TableCell>
                            <TableCell>
                                <Badge variant={p.status === "Active" ? "default" : "destructive"} className={p.status === "Active" ? "bg-green-500/80 text-white" : ""}>
                                    {p.status}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right space-x-1">
                                <Button variant="ghost" size="icon" aria-label={`Edit ${p.name}`} className="hover:text-primary"><Edit className="h-4 w-4"/></Button>
                                <Button variant="ghost" size="icon" className="hover:text-destructive" aria-label={`Remove ${p.name}`}><Trash2 className="h-4 w-4"/></Button>
                            </TableCell>
                            </TableRow>
                        )) : <TableRow><TableCell colSpan={8} className="text-center">{currentContent.noPersonnel}</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
