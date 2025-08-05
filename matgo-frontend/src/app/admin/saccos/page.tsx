
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, Edit, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Sacco {
  id: string;
  name: string;
  routes: string;
  busCount: number;
  manager: string;
  status: "Active" | "Suspended";
}

export default function SaccosPage() {
    const { language } = useLanguage();
    const [isLoading, setIsLoading] = useState(true);
    const [saccos, setSaccos] = useState<Sacco[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('matgoToken');
            
            try {
                // Fetch SACCOs from backend
                const response = await fetch('/api/saccos', {
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : ''
                    }
                });
                
                if (response.ok) {
                    const saccosData = await response.json();
                    
                    // For each SACCO, fetch additional details like bus count
                    const formattedSaccos = await Promise.all(saccosData.map(async (sacco: any) => {
                        let busCount = 0;
                        
                        // Fetch bus count for this SACCO
                        try {
                            const vehiclesResponse = await fetch('/api/vehicles', {
                                headers: {
                                    'Authorization': token ? `Bearer ${token}` : ''
                                }
                            });
                            
                            if (vehiclesResponse.ok) {
                                const vehicles = await vehiclesResponse.json();
                                busCount = Array.isArray(vehicles) ? 
                                    vehicles.filter((vehicle: any) => 
                                        vehicle.saccoId === sacco.id || 
                                        vehicle.sacco === sacco.name ||
                                        vehicle.saccoName === sacco.name
                                    ).length : 0;
                            }
                        } catch (error) {
                            console.error('Error fetching vehicles for SACCO:', error);
                        }
                        
                        return {
                            id: sacco.id,
                            name: sacco.name || sacco.saccoName || 'Unknown SACCO',
                            routes: sacco.routes || sacco.operatingRoutes || sacco.route || 'Various Routes',
                            busCount: busCount,
                            manager: sacco.manager || sacco.managerName || sacco.contactPerson || 'Unknown Manager',
                            status: sacco.status === 'active' ? 'Active' : 
                                   sacco.status === 'suspended' ? 'Suspended' : 'Active'
                        };
                    }));
                    
                    setSaccos(formattedSaccos);
                } else {
                    console.error('Failed to fetch SACCOs');
                    setSaccos([]);
                }
            } catch (error) {
                console.error('Error fetching SACCOs:', error);
                setSaccos([]);
            }
            
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const content = {
        ENG: {
            pageTitle: "SACCO Management",
            pageDescription: "View, add, and manage all transport SACCOs registered in the system.",
            name: "Name",
            routes: "Routes",
            manager: "Manager",
            status: "Status",
            busCount: "Bus Count",
            actions: "Actions",
            noSaccos: "No SACCOs found.",
        },
        KSW: {
            pageTitle: "Usimamizi wa SACCO",
            pageDescription: "Tazama, ongeza, na dhibiti SACCO zote za usafiri zilizosajiliwa kwenye mfumo.",
            name: "Jina",
            routes: "Njia",
            manager: "Meneja",
            status: "Hali",
            busCount: "Idadi ya Mabasi",
            actions: "Vitendo",
            noSaccos: "Hakuna SACCO zilizopatikana.",
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
                        <Building /> {currentContent.pageTitle}
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
                        <TableHeader><TableRow><TableHead>{currentContent.name}</TableHead><TableHead>{currentContent.routes}</TableHead><TableHead>{currentContent.manager}</TableHead><TableHead>{currentContent.status}</TableHead><TableHead className="text-right">{currentContent.busCount}</TableHead><TableHead className="text-right">{currentContent.actions}</TableHead></TableRow></TableHeader>
                        <TableBody>
                            {saccos.length > 0 ? saccos.map(sacco => (
                            <TableRow key={sacco.id} className="hover:bg-primary/5">
                                <TableCell className="font-medium text-base">{sacco.name}</TableCell>
                                <TableCell className="text-sm">{sacco.routes}</TableCell>
                                <TableCell className="text-sm">{sacco.manager}</TableCell>
                                <TableCell><Badge variant={sacco.status === "Active" ? "default" : "destructive"} className={sacco.status === "Active" ? "bg-green-500/80 text-white" : ""}>{sacco.status}</Badge></TableCell>
                                <TableCell className="text-right text-base font-semibold">{sacco.busCount}</TableCell>
                                <TableCell className="text-right space-x-1">
                                <Button variant="ghost" size="icon" aria-label={`Edit ${sacco.name}`} className="hover:text-primary"><Edit className="h-4 w-4"/></Button>
                                <Button variant="ghost" size="icon" className="hover:text-destructive" aria-label={`Delete ${sacco.name}`}><Trash2 className="h-4 w-4"/></Button>
                                </TableCell>
                            </TableRow>
                            )) : <TableRow><TableCell colSpan={6} className="text-center">{currentContent.noSaccos}</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
