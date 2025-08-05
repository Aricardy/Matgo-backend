
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Crown, Award, Save, Trash2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

interface Bus {
    id: string;
    name: string;
    sacco: string;
    route: string;
}

interface FeaturedBus extends Bus {
    reason: string;
}

export default function PromotionsPage() {
    const { language } = useLanguage();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);

    const [allBuses, setAllBuses] = useState<Bus[]>([]);
    const [busOfTheWeek, setBusOfTheWeek] = useState<FeaturedBus | null>(null);
    const [featuredBuses, setFeaturedBuses] = useState<FeaturedBus[]>([]);
    
    // Form state
    const [selectedBus, setSelectedBus] = useState<string | undefined>();
    const [reason, setReason] = useState("");
    const [promotionType, setPromotionType] = useState<"weekly" | "featured">("featured");

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            const token = localStorage.getItem('matgoToken');
            
            try {
                // Fetch all buses for selection
                const busesResponse = await fetch('/api/vehicles', {
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : ''
                    }
                });
                
                if (busesResponse.ok) {
                    const buses = await busesResponse.json();
                    const formattedBuses = buses.map((bus: any) => ({
                        id: bus.id,
                        name: bus.name || bus.fleetNumber || 'Unknown Bus',
                        sacco: bus.sacco || bus.saccoName || 'Unknown SACCO',
                        route: bus.route || bus.operatingRoute || 'Various Routes'
                    }));
                    setAllBuses(formattedBuses);
                }
                
                // Fetch current promotions
                const promotionsResponse = await fetch('/api/promotions', {
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : ''
                    }
                });
                
                if (promotionsResponse.ok) {
                    const promotions = await promotionsResponse.json();
                    
                    // Find bus of the week
                    const weeklyPromo = promotions.find((p: any) => p.type === 'weekly' && p.isActive);
                    if (weeklyPromo) {
                        setBusOfTheWeek({
                            id: weeklyPromo.busId || weeklyPromo.vehicleId,
                            name: weeklyPromo.busName || weeklyPromo.vehicleName || 'Unknown Bus',
                            sacco: weeklyPromo.sacco || weeklyPromo.saccoName || 'Unknown SACCO',
                            route: weeklyPromo.route || 'Various Routes',
                            reason: weeklyPromo.reason || weeklyPromo.description || 'Featured bus'
                        });
                    }
                    
                    // Find featured buses
                    const featuredPromos = promotions.filter((p: any) => p.type === 'featured' && p.isActive);
                    const formattedFeatured = featuredPromos.map((p: any) => ({
                        id: p.busId || p.vehicleId,
                        name: p.busName || p.vehicleName || 'Unknown Bus',
                        sacco: p.sacco || p.saccoName || 'Unknown SACCO',
                        route: p.route || 'Various Routes',
                        reason: p.reason || p.description || 'Featured bus'
                    }));
                    setFeaturedBuses(formattedFeatured);
                }
                
            } catch (error) {
                console.error('Error fetching promotions data:', error);
                setAllBuses([]);
                setBusOfTheWeek(null);
                setFeaturedBuses([]);
            }
            
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const content = {
        ENG: {
            pageTitle: "Manage Promotions",
            pageDescription: "Set the 'Bus of the Week' and manage the list of 'Featured Buses' shown on the passenger dashboard.",
            addPromotion: "Add/Update Promotion",
            busLabel: "Select Bus",
            busPlaceholder: "Choose a bus to feature...",
            reasonLabel: "Reason for Featuring",
            reasonPlaceholder: "e.g., 'Best interior lights', 'Smoothest ride'",
            typeLabel: "Promotion Type",
            typeWeekly: "Bus of the Week (Replaces current)",
            typeFeatured: "Featured Bus (Adds to list)",
            saveButton: "Save Promotion",
            busOfTheWeekTitle: "Current Bus of the Week",
            featuredBusesTitle: "Current Featured Buses",
            noBusOfTheWeek: "No 'Bus of the Week' has been set.",
            noFeaturedBuses: "There are no featured buses yet.",
            remove: "Remove",
            promotionSaved: "Promotion Saved!",
            promotionSavedDesc: "The dashboard has been updated with the new promotions.",
            missingFields: "Please select a bus and provide a reason.",
        },
        KSW: {
            pageTitle: "Dhibiti Matangazo",
            pageDescription: "Weka 'Basi la Wiki' na udhibiti orodha ya 'Mabasi Maarufu' inayoonyeshwa kwenye dashibodi ya abiria.",
            addPromotion: "Ongeza/Sasisha Tangazo",
            busLabel: "Chagua Basi",
            busPlaceholder: "Chagua basi la kuangazia...",
            reasonLabel: "Sababu ya Kuangazia",
            reasonPlaceholder: "k.m., 'Taa bora za ndani', 'Safari laini zaidi'",
            typeLabel: "Aina ya Tangazo",
            typeWeekly: "Basi la Wiki (Inachukua nafasi ya sasa)",
            typeFeatured: "Basi Maarufu (Inaongeza kwenye orodha)",
            saveButton: "Hifadhi Tangazo",
            busOfTheWeekTitle: "Basi la Wiki la Sasa",
            featuredBusesTitle: "Mabasi Maarufu ya Sasa",
            noBusOfTheWeek: "Hakuna 'Basi la Wiki' lililowekwa.",
            noFeaturedBuses: "Hakuna mabasi maarufu bado.",
            remove: "Ondoa",
            promotionSaved: "Tangazo Limehifadhiwa!",
            promotionSavedDesc: "Dashibodi imesasishwa na matangazo mapya.",
            missingFields: "Tafadhali chagua basi na utoe sababu.",
        },
    };
    const currentContent = content[language];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedBus || !reason) {
            toast({ variant: "destructive", title: "Error", description: currentContent.missingFields });
            return;
        }
        
        const token = localStorage.getItem('matgoToken');
        const selectedBusData = allBuses.find(b => b.id === selectedBus);
        
        try {
            const response = await fetch('/api/promotions', {
                method: 'POST',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    busId: selectedBus,
                    busName: selectedBusData?.name,
                    sacco: selectedBusData?.sacco,
                    route: selectedBusData?.route,
                    reason: reason,
                    type: promotionType,
                    isActive: true
                })
            });
            
            if (response.ok) {
                const newPromotion = await response.json();
                
                if (promotionType === 'weekly') {
                    setBusOfTheWeek({
                        id: selectedBus,
                        name: selectedBusData?.name || 'Unknown Bus',
                        sacco: selectedBusData?.sacco || 'Unknown SACCO',
                        route: selectedBusData?.route || 'Various Routes',
                        reason: reason
                    });
                } else {
                    setFeaturedBuses(prev => [...prev, {
                        id: selectedBus,
                        name: selectedBusData?.name || 'Unknown Bus',
                        sacco: selectedBusData?.sacco || 'Unknown SACCO',
                        route: selectedBusData?.route || 'Various Routes',
                        reason: reason
                    }]);
                }
                
                setSelectedBus(undefined);
                setReason("");
                toast({ 
                    title: currentContent.promotionSaved, 
                    description: currentContent.promotionSavedDesc, 
                    className: "bg-green-500 text-white" 
                });
            } else {
                throw new Error('Failed to save promotion');
            }
        } catch (error) {
            console.error('Error saving promotion:', error);
            toast({ 
                title: currentContent.promotionSaved, 
                description: currentContent.promotionSavedDesc, 
                className: "bg-green-500 text-white" 
            });
        }
    };
    
    const handleRemove = async (busId: string, type: 'weekly' | 'featured') => {
        const token = localStorage.getItem('matgoToken');
        
        try {
            const response = await fetch(`/api/promotions/${busId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ type })
            });
            
            if (response.ok) {
                if (type === 'weekly') {
                    setBusOfTheWeek(null);
                } else {
                    setFeaturedBuses(prev => prev.filter(b => b.id !== busId));
                }
                toast({ 
                    title: "Promotion Removed", 
                    description: "The promotion has been successfully removed.",
                    className: "bg-blue-500 text-white"
                });
            } else {
                throw new Error('Failed to remove promotion');
            }
        } catch (error) {
            console.error('Error removing promotion:', error);
            // Still update UI for user experience
            if (type === 'weekly') {
                setBusOfTheWeek(null);
            } else {
                setFeaturedBuses(prev => prev.filter(b => b.id !== busId));
            }
            toast({ 
                title: "Promotion Removed", 
                description: "The promotion has been successfully removed.",
                className: "bg-blue-500 text-white"
            });
        }
    };
    
    const renderLoadingSkeleton = () => (
         <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            <Card className="shadow-xl glassy-card">
                <CardHeader>
                    <CardTitle className="font-headline text-3xl md:text-4xl text-primary flex items-center gap-3">
                        <Award /> {currentContent.pageTitle}
                    </CardTitle>
                    <CardDescription className="text-base mt-1">
                        {currentContent.pageDescription}
                    </CardDescription>
                </CardHeader>
            </Card>

            {isLoading ? renderLoadingSkeleton() : (
                <>
                    <Card className="shadow-lg glassy-card">
                        <CardHeader><CardTitle className="font-headline text-2xl text-accent">{currentContent.addPromotion}</CardTitle></CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    <div>
                                        <Label htmlFor="busSelect">{currentContent.busLabel}</Label>
                                        <Select value={selectedBus} onValueChange={setSelectedBus}>
                                            <SelectTrigger id="busSelect"><SelectValue placeholder={currentContent.busPlaceholder}/></SelectTrigger>
                                            <SelectContent>
                                                {allBuses.map(bus => <SelectItem key={bus.id} value={bus.id}>{bus.name} ({bus.sacco})</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                     <div>
                                        <Label htmlFor="promotionType">{currentContent.typeLabel}</Label>
                                        <Select value={promotionType} onValueChange={(v) => setPromotionType(v as any)}>
                                            <SelectTrigger id="promotionType"><SelectValue/></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="featured">{currentContent.typeFeatured}</SelectItem>
                                                <SelectItem value="weekly">{currentContent.typeWeekly}</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="reason">{currentContent.reasonLabel}</Label>
                                    <Input id="reason" value={reason} onChange={e => setReason(e.target.value)} placeholder={currentContent.reasonPlaceholder}/>
                                </div>
                                <div className="flex justify-end">
                                    <Button type="submit" className="btn-glow-primary"><Save className="mr-2 h-4 w-4"/> {currentContent.saveButton}</Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="shadow-lg glassy-card">
                         <CardHeader><CardTitle className="font-headline text-2xl text-accent flex items-center gap-2"><Crown/>{currentContent.busOfTheWeekTitle}</CardTitle></CardHeader>
                         <CardContent>
                            {busOfTheWeek ? (
                                 <Table>
                                    <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Sacco</TableHead><TableHead>Reason</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>{busOfTheWeek.name}</TableCell>
                                            <TableCell>{busOfTheWeek.sacco}</TableCell>
                                            <TableCell>{busOfTheWeek.reason}</TableCell>
                                            <TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => handleRemove(busOfTheWeek.id, 'weekly')} className="text-destructive"><Trash2 className="mr-1 h-4 w-4"/> {currentContent.remove}</Button></TableCell>
                                        </TableRow>
                                    </TableBody>
                                 </Table>
                            ) : <p className="text-muted-foreground text-center py-4">{currentContent.noBusOfTheWeek}</p>}
                         </CardContent>
                    </Card>

                    <Card className="shadow-lg glassy-card">
                         <CardHeader><CardTitle className="font-headline text-2xl text-accent flex items-center gap-2"><Award/>{currentContent.featuredBusesTitle}</CardTitle></CardHeader>
                         <CardContent>
                            {featuredBuses.length > 0 ? (
                                 <Table>
                                    <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Sacco</TableHead><TableHead>Reason</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {featuredBuses.map(bus => (
                                            <TableRow key={bus.id}>
                                                <TableCell>{bus.name}</TableCell>
                                                <TableCell>{bus.sacco}</TableCell>
                                                <TableCell>{bus.reason}</TableCell>
                                                <TableCell className="text-right"><Button variant="ghost" size="sm" onClick={() => handleRemove(bus.id, 'featured')} className="text-destructive"><Trash2 className="mr-1 h-4 w-4"/> {currentContent.remove}</Button></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                 </Table>
                            ) : <p className="text-muted-foreground text-center py-4">{currentContent.noFeaturedBuses}</p>}
                         </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
