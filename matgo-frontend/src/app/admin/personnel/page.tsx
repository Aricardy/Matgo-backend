
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
            const token = localStorage.getItem('matgoToken');
            
            try {
                // Fetch drivers and conductors from backend
                const [driversResponse, conductorsResponse] = await Promise.all([
                    fetch('/api/drivers', {
                        headers: {
                            'Authorization': token ? `Bearer ${token}` : ''
                        }
                    }),
                    fetch('/api/conductors', {
                        headers: {
                            'Authorization': token ? `Bearer ${token}` : ''
                        }
                    })
                ]);
                
                const allPersonnel: Personnel[] = [];
                
                // Process drivers
                if (driversResponse.ok) {
                    const drivers = await driversResponse.json();
                    const formattedDrivers = drivers.map((driver: any) => ({
                        id: driver.id,
                        name: driver.name || `${driver.firstName || ''} ${driver.lastName || ''}`.trim() || 'Unknown Driver',
                        role: 'Driver' as const,
                        sacco: driver.sacco || driver.saccoName || 'Unknown SACCO',
                        status: driver.status === 'active' ? 'Active' as const : 'Suspended' as const,
                        phone: driver.phone || driver.phoneNumber || 'N/A',
                        nationalId: driver.nationalId || driver.idNumber || 'N/A',
                        licenseNo: driver.licenseNo || driver.licenseNumber || driver.drivingLicense || 'N/A'
                    }));
                    allPersonnel.push(...formattedDrivers);
                }
                
                // Process conductors
                if (conductorsResponse.ok) {
                    const conductors = await conductorsResponse.json();
                    const formattedConductors = conductors.map((conductor: any) => ({
                        id: conductor.id,
                        name: conductor.name || `${conductor.firstName || ''} ${conductor.lastName || ''}`.trim() || 'Unknown Conductor',
                        role: 'Conductor' as const,
                        sacco: conductor.sacco || conductor.saccoName || 'Unknown SACCO',
                        status: conductor.status === 'active' ? 'Active' as const : 'Suspended' as const,
                        phone: conductor.phone || conductor.phoneNumber || 'N/A',
                        nationalId: conductor.nationalId || conductor.idNumber || 'N/A',
                        licenseNo: conductor.licenseNo || conductor.licenseNumber || 'N/A'
                    }));
                    allPersonnel.push(...formattedConductors);
                }
                
                // Fetch SACCO managers/admins
                try {
                    const usersResponse = await fetch('/api/users', {
                        headers: {
                            'Authorization': token ? `Bearer ${token}` : ''
                        }
                    });
                    
                    if (usersResponse.ok) {
                        const users = await usersResponse.json();
                        const managers = users.filter((user: any) => user.role === 'sacco_admin').map((manager: any) => ({
                            id: manager.id,
                            name: manager.name || `${manager.firstName || ''} ${manager.lastName || ''}`.trim() || 'Unknown Manager',
                            role: 'Manager' as const,
                            sacco: manager.saccoName || manager.sacco || 'Unknown SACCO',
                            status: manager.status === 'active' ? 'Active' as const : 'Suspended' as const,
                            phone: manager.phone || manager.phoneNumber || 'N/A',
                            nationalId: manager.nationalId || manager.idNumber || 'N/A',
                            licenseNo: 'N/A' // Managers don't need driving licenses
                        }));
                        allPersonnel.push(...managers);
                    }
                } catch (error) {
                    console.error('Error fetching managers:', error);
                }
                
                setPersonnel(allPersonnel);
            } catch (error) {
                console.error('Error fetching personnel:', error);
                setPersonnel([]);
            }
            
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
