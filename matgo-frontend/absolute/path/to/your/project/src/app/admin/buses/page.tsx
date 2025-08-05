
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Bus, Edit, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Bus {
  id: string;
  fleetNumber?: string;
  name?: string;
  sacco: string;
  type: string;
  driver: string;
  conductor: string;
  capacity: number;
  status: "Active" | "Under Maintenance";
  registration: string;
}

export default function BusesPage() {
    const { language } = useLanguage();
    const [isLoading, setIsLoading] = useState(true);
    const [buses, setBuses] = useState<Bus[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setBuses([]);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const content = {
        ENG: {
            pageTitle: "Bus Management",
            pageDescription: "View, add, and manage all buses and nganyas in the system.",
            regNo: "Reg. No.",
            fleetName: "Fleet No. / Name",
            sacco: "Sacco",
            type: "Type",
            driver: "Driver",
            conductor: "Conductor",
            status: "Status",
            capacity: "Capacity",
            actions: "Actions",
            noBuses: "No buses found.",
        },
        KSW: {
            pageTitle: "Usimamizi wa Mabasi",
            pageDescription: "Tazama, ongeza, na dhibiti mabasi na nganya zote kwenye mfumo.",
            regNo: "Namba ya Usajili",
            fleetName: "Namba ya Meli / Jina",
            sacco: "Sacco",
            type: "Aina",
            driver: "Dereva",
            conductor: "Kondakta",
            status: "Hali",
            capacity: "Uwezo",
            actions: "Vitendo",
            noBuses: "Hakuna mabasi yaliyopatikana.",
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
                        <Bus /> {currentContent.pageTitle}
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
                      <TableHeader><TableRow><TableHead>{currentContent.regNo}</TableHead><TableHead>{currentContent.fleetName}</TableHead><TableHead>{currentContent.sacco}</TableHead><TableHead>{currentContent.type}</TableHead><TableHead>{currentContent.driver}</TableHead><TableHead>{currentContent.conductor}</TableHead><TableHead>{currentContent.status}</TableHead><TableHead className="text-right">{currentContent.capacity}</TableHead><TableHead className="text-right">{currentContent.actions}</TableHead></TableRow></TableHeader>
                      <TableBody>
                        {buses.length > 0 ? buses.map(bus => (
                          <TableRow key={bus.id} className="hover:bg-primary/5">
                            <TableCell className="font-mono text-xs">{bus.registration}</TableCell>
                            <TableCell className="font-medium text-base">{bus.fleetNumber || bus.name}</TableCell>
                            <TableCell className="text-sm">{bus.sacco}</TableCell>
                            <TableCell><Badge variant={bus.type === "Nganya" ? "secondary" : "outline"} className={bus.type === "Nganya" ? "bg-purple-500/20 text-purple-700 border-purple-500/50" : ""}>{bus.type}</Badge></TableCell>
                            <TableCell className="text-sm">{bus.driver}</TableCell>
                            <TableCell className="text-sm">{bus.conductor}</TableCell>
                            <TableCell>
                               <Badge variant={bus.status === "Active" ? "default" : "secondary"} className={bus.status === "Active" ? "bg-green-500/80 text-white" : "bg-yellow-500/80 text-black"}>{bus.status}</Badge>
                            </TableCell>
                            <TableCell className="text-right text-base font-semibold">{bus.capacity}</TableCell>
                            <TableCell className="text-right space-x-1">
                              <Button variant="ghost" size="icon" aria-label={`Edit ${bus.fleetNumber || bus.name}`} className="hover:text-primary"><Edit className="h-4 w-4"/></Button>
                              <Button variant="ghost" size="icon" className="hover:text-destructive" aria-label={`Delete ${bus.fleetNumber || bus.name}`}><Trash2 className="h-4 w-4"/></Button>
                            </TableCell>
                          </TableRow>
                        )) : <TableRow><TableCell colSpan={9} className="text-center">{currentContent.noBuses}</TableCell></TableRow>}
                      </TableBody>
                    </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
