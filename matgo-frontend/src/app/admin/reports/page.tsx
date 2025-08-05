
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { MessageSquareWarning, Eye } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface PassengerReport {
  id: string;
  passengerName: string;
  busFleetOrName: string;
  type: string;
  details: string;
  timestamp: string;
  status: "Pending" | "Investigating" | "Resolved" | "Noted" | "Dismissed";
  sacco: string;
  response: string;
}

export default function ReportsPage() {
    const { language } = useLanguage();
    const [isLoading, setIsLoading] = useState(true);
    const [reports, setReports] = useState<PassengerReport[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('matgoToken');
            
            try {
                // Fetch reports from backend
                const response = await fetch('/api/reports', {
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : ''
                    }
                });
                
                if (response.ok) {
                    const reportsData = await response.json();
                    const formattedReports = reportsData.map((report: any) => ({
                        id: report.id,
                        passengerName: report.passengerName || report.reporterName || report.name || 'Anonymous',
                        busFleetOrName: report.busFleetOrName || report.vehicleInfo || report.vehicle || 'Unknown Vehicle',
                        type: report.type || report.category || report.reportType || 'General',
                        details: report.details || report.description || report.message || '',
                        timestamp: report.timestamp || report.createdAt || new Date().toISOString(),
                        status: report.status === 'pending' ? 'Pending' :
                               report.status === 'investigating' ? 'Investigating' :
                               report.status === 'resolved' ? 'Resolved' :
                               report.status === 'noted' ? 'Noted' :
                               report.status === 'dismissed' ? 'Dismissed' : 'Pending',
                        sacco: report.sacco || report.saccoName || 'Unknown SACCO',
                        response: report.response || report.adminResponse || ''
                    }));
                    setReports(formattedReports);
                } else {
                    console.error('Failed to fetch reports');
                    setReports([]);
                }
            } catch (error) {
                console.error('Error fetching reports:', error);
                setReports([]);
            }
            
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const content = {
        ENG: {
            pageTitle: "Passenger Reports & Feedback",
            pageDescription: "Review and manage all incident and feedback reports from passengers.",
            passenger: "Passenger",
            bus: "Bus/Nganya",
            reportType: "Report Type",
            timestamp: "Timestamp",
            sacco: "Sacco",
            status: "Status",
            actions: "Actions",
            noReports: "No passenger reports found.",
        },
        KSW: {
            pageTitle: "Ripoti na Maoni ya Abiria",
            pageDescription: "Kagua na dhibiti ripoti zote za matukio na maoni kutoka kwa abiria.",
            passenger: "Abiria",
            bus: "Basi/Nganya",
            reportType: "Aina ya Ripoti",
            timestamp: "Muda",
            sacco: "Sacco",
            status: "Hali",
            actions: "Vitendo",
            noReports: "Hakuna ripoti za abiria zilizopatikana.",
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
                        <MessageSquareWarning /> {currentContent.pageTitle}
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
                        <TableHeader><TableRow><TableHead>{currentContent.passenger}</TableHead><TableHead>{currentContent.bus}</TableHead><TableHead>{currentContent.reportType}</TableHead><TableHead>{currentContent.timestamp}</TableHead><TableHead>{currentContent.sacco}</TableHead><TableHead>{currentContent.status}</TableHead><TableHead className="text-right">{currentContent.actions}</TableHead></TableRow></TableHeader>
                        <TableBody>
                        {reports.length > 0 ? reports.map(report => (
                            <TableRow key={report.id} className="hover:bg-primary/5">
                                <TableCell className="font-medium text-base">{report.passengerName}</TableCell>
                                <TableCell className="text-sm">{report.busFleetOrName}</TableCell>
                                <TableCell className="text-sm">{report.type}</TableCell>
                                <TableCell className="text-xs">{report.timestamp}</TableCell>
                                <TableCell className="text-sm">{report.sacco}</TableCell>
                                <TableCell>
                                    <Badge variant={
                                        report.status === "Pending" ? "destructive" : 
                                        report.status === "Investigating" ? "secondary" : "default"
                                    } className={cn(
                                        "font-semibold",
                                        report.status === "Pending" && "bg-red-500/80 text-white",
                                        report.status === "Investigating" && "bg-yellow-500/80 text-black",
                                        report.status === "Resolved" && "bg-green-500/80 text-white"
                                    )}>
                                        {report.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <Button variant="ghost" size="icon" aria-label={`View report ${report.id}`} className="hover:text-primary"><Eye className="h-5 w-5"/></Button>
                                </TableCell>
                            </TableRow>
                        )) : <TableRow><TableCell colSpan={7} className="text-center">{currentContent.noReports}</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
