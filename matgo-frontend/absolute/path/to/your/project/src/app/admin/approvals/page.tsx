
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileCheck, Check, X, Building, User } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

interface SaccoApplication {
    id: string;
    saccoName: string;
    applicantName: string;
    date: string;
}

interface AdminApplication {
    id: string;
    applicantName: string;
    saccoName: string;
    date: string;
}

export default function ApprovalsPage() {
    const { language } = useLanguage();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);

    const [saccoApplications, setSaccoApplications] = useState<SaccoApplication[]>([]);
    const [adminApplications, setAdminApplications] = useState<AdminApplication[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            // Simulate API calls
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSaccoApplications([]);
            setAdminApplications([]);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const content = {
        ENG: {
            pageTitle: "Approvals Management",
            pageDescription: "Review and approve or reject applications for new SACCOs and System Admins.",
            saccoTab: "SACCO Applications",
            adminTab: "System Admin Applications",
            applicant: "Applicant",
            saccoName: "SACCO Name",
            date: "Date Submitted",
            actions: "Actions",
            approve: "Approve",
            reject: "Reject",
            noSaccoApps: "No pending SACCO applications.",
            noAdminApps: "No pending System Admin applications.",
            actionSuccess: "Action Successful",
            saccoApproved: (name: string) => `SACCO application for ${name} has been approved.`,
            saccoRejected: (name: string) => `SACCO application for ${name} has been rejected.`,
            adminApproved: (name: string) => `Admin application for ${name} has been approved.`,
            adminRejected: (name: string) => `Admin application for ${name} has been rejected.`,
        },
        KSW: {
            pageTitle: "Usimamizi wa Idhini",
            pageDescription: "Kagua na uidhinishe au ukatae maombi ya SACCO mpya na Wasimamizi Wakuu.",
            saccoTab: "Maombi ya SACCO",
            adminTab: "Maombi ya Msimamizi Mkuu",
            applicant: "Mwombaji",
            saccoName: "Jina la SACCO",
            date: "Tarehe ya Kuwasilisha",
            actions: "Vitendo",
            approve: "Idhinisha",
            reject: "Kataa",
            noSaccoApps: "Hakuna maombi ya SACCO yanayosubiri.",
            noAdminApps: "Hakuna maombi ya Msimamizi Mkuu yanayosubiri.",
            actionSuccess: "Kitendo Kimefaulu",
            saccoApproved: (name: string) => `Ombi la SACCO la ${name} limeidhinishwa.`,
            saccoRejected: (name: string) => `Ombi la SACCO la ${name} limekataliwa.`,
            adminApproved: (name: string) => `Ombi la Msimamizi la ${name} limeidhinishwa.`,
            adminRejected: (name: string) => `Ombi la Msimamizi la ${name} limekataliwa.`,
        },
    };
    const currentContent = content[language];

    const handleSaccoAction = (id: string, name: string, approve: boolean) => {
        // API call to approve/reject
        setSaccoApplications(prev => prev.filter(app => app.id !== id));
        toast({ title: currentContent.actionSuccess, description: approve ? currentContent.saccoApproved(name) : currentContent.saccoRejected(name) });
    };
    
    const handleAdminAction = (id: string, name: string, approve: boolean) => {
        // API call
        setAdminApplications(prev => prev.filter(app => app.id !== id));
        toast({ title: currentContent.actionSuccess, description: approve ? currentContent.adminApproved(name) : currentContent.adminRejected(name) });
    };
    
     const renderLoadingSkeleton = () => (
         <div className="space-y-6">
            <Skeleton className="h-10 w-1/2" />
            <Skeleton className="h-32 w-full" />
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <Card className="shadow-xl glassy-card">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl md:text-4xl text-primary flex items-center gap-3">
                        <FileCheck /> {currentContent.pageTitle}
                    </CardTitle>
                    <CardDescription className="text-base mt-1">
                        {currentContent.pageDescription}
                    </CardDescription>
                </CardHeader>
            </Card>
            
            <Tabs defaultValue="sacco">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="sacco"><Building className="mr-2 h-4 w-4"/>{currentContent.saccoTab}</TabsTrigger>
                    <TabsTrigger value="admin"><User className="mr-2 h-4 w-4"/>{currentContent.adminTab}</TabsTrigger>
                </TabsList>
                <TabsContent value="sacco">
                    <Card className="shadow-lg glassy-card">
                        <CardContent className="pt-6">
                            {isLoading ? renderLoadingSkeleton() : saccoApplications.length === 0 ? (
                                <p className="text-center py-8 text-muted-foreground">{currentContent.noSaccoApps}</p>
                            ) : (
                                <Table>
                                    <TableHeader><TableRow><TableHead>{currentContent.saccoName}</TableHead><TableHead>{currentContent.applicant}</TableHead><TableHead>{currentContent.date}</TableHead><TableHead className="text-right">{currentContent.actions}</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                    {saccoApplications.map(app => (
                                        <TableRow key={app.id}>
                                            <TableCell>{app.saccoName}</TableCell>
                                            <TableCell>{app.applicantName}</TableCell>
                                            <TableCell>{app.date}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-100" onClick={() => handleSaccoAction(app.id, app.saccoName, true)}><Check className="mr-1 h-4 w-4"/>{currentContent.approve}</Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleSaccoAction(app.id, app.saccoName, false)}><X className="mr-1 h-4 w-4"/>{currentContent.reject}</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="admin">
                    <Card className="shadow-lg glassy-card">
                        <CardContent className="pt-6">
                            {isLoading ? renderLoadingSkeleton() : adminApplications.length === 0 ? (
                                <p className="text-center py-8 text-muted-foreground">{currentContent.noAdminApps}</p>
                            ) : (
                                <Table>
                                    <TableHeader><TableRow><TableHead>{currentContent.applicant}</TableHead><TableHead>{currentContent.saccoName}</TableHead><TableHead>{currentContent.date}</TableHead><TableHead className="text-right">{currentContent.actions}</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                    {adminApplications.map(app => (
                                        <TableRow key={app.id}>
                                            <TableCell>{app.applicantName}</TableCell>
                                            <TableCell>{app.saccoName}</TableCell>
                                            <TableCell>{app.date}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button size="sm" variant="outline" className="text-green-600 border-green-600 hover:bg-green-100" onClick={() => handleAdminAction(app.id, app.applicantName, true)}><Check className="mr-1 h-4 w-4"/>{currentContent.approve}</Button>
                                                <Button size="sm" variant="destructive" onClick={() => handleAdminAction(app.id, app.applicantName, false)}><X className="mr-1 h-4 w-4"/>{currentContent.reject}</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    </TableBody>
                                </Table>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
