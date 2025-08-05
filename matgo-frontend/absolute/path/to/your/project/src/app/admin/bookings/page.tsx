
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ClipboardList, Eye } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Booking {
  id: string;
  tripId: string;
  seat: string;
  status: "Confirmed" | "Pending";
  paymentStatus: "Paid" | "Unpaid";
  departure: string;
  destination: string;
  busName: string;
}

export default function BookingsPage() {
    const { language } = useLanguage();
    const [isLoading, setIsLoading] = useState(true);
    const [bookings, setBookings] = useState<Booking[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            await new Promise(resolve => setTimeout(resolve, 1000));
            setBookings([]);
            setIsLoading(false);
        };
        fetchData();
    }, []);

    const content = {
        ENG: {
            pageTitle: "Booking Management",
            pageDescription: "View and manage all long-distance trip bookings made through the system.",
            tripId: "Trip ID",
            bus: "Bus",
            seat: "Seat",
            route: "Route",
            status: "Status",
            payment: "Payment",
            actions: "Actions",
            noBookings: "No bookings found.",
        },
        KSW: {
            pageTitle: "Usimamizi wa Uhifadhi",
            pageDescription: "Tazama na udhibiti uhifadhi wote wa safari za masafa marefu uliofanywa kupitia mfumo.",
            tripId: "Kitambulisho cha Safari",
            bus: "Basi",
            seat: "Kiti",
            route: "Njia",
            status: "Hali",
            payment: "Malipo",
            actions: "Vitendo",
            noBookings: "Hakuna uhifadhi uliopatikana.",
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
                        <ClipboardList /> {currentContent.pageTitle}
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
                        <TableHeader><TableRow><TableHead>{currentContent.tripId}</TableHead><TableHead>{currentContent.bus}</TableHead><TableHead>{currentContent.seat}</TableHead><TableHead>{currentContent.route}</TableHead><TableHead>{currentContent.status}</TableHead><TableHead>{currentContent.payment}</TableHead><TableHead className="text-right">{currentContent.actions}</TableHead></TableRow></TableHeader>
                        <TableBody>
                        {bookings.length > 0 ? bookings.map(booking => (
                            <TableRow key={booking.id} className="hover:bg-primary/5">
                            <TableCell className="font-mono text-xs">{booking.tripId}</TableCell>
                            <TableCell>{booking.busName}</TableCell>
                            <TableCell>{booking.seat}</TableCell>
                            <TableCell>{booking.departure} to {booking.destination}</TableCell>
                            <TableCell><Badge variant={booking.status === "Confirmed" ? "default" : "secondary"} className={booking.status === "Confirmed" ? "bg-green-500/80 text-white" : ""}>{booking.status}</Badge></TableCell>
                            <TableCell><Badge variant={booking.paymentStatus === "Paid" ? "default" : "destructive" } className={booking.paymentStatus === "Paid" ? "bg-green-500/80 text-white" : ""}>{booking.paymentStatus}</Badge></TableCell>
                            <TableCell className="text-right space-x-1"><Button variant="ghost" size="icon" className="hover:text-primary"><Eye className="h-4 w-4"/></Button></TableCell>
                            </TableRow>
                        )) : <TableRow><TableCell colSpan={7} className="text-center">{currentContent.noBookings}</TableCell></TableRow>}
                        </TableBody>
                    </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
