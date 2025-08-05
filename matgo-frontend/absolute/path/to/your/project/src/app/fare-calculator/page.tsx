
"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Coins, ArrowRight, Clock, Users, Palette, Bus } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface VehicleType {
    value: string;
    label: string;
    baseFareFactor: number;
    icon: React.ElementType;
}

export default function FareCalculatorPage() {
  const { language } = useLanguage();
  const [fromLocation, setFromLocation] = useState("");
  const [toLocation, setToLocation] = useState("");
  const [vehicleType, setVehicleType] = useState<string | undefined>();
  const [timeOfDay, setTimeOfDay] = useState("off_peak"); // 'peak', 'off_peak'
  const [calculatedFare, setCalculatedFare] = useState<number | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [sampleRoutes, setSampleRoutes] = useState<string[]>([]);
  
  useEffect(() => {
    // Simulate fetching data
    setIsLoading(true);
    setTimeout(() => {
        // In a real app, this would be an API call
        // For now, set to empty arrays as requested
        setVehicleTypes([]);
        setSampleRoutes([]);
        setIsLoading(false);
    }, 1000);
  }, []);

  const content = {
    ENG: {
      pageTitle: "Fare Estimator",
      pageDescription: "Get an estimated fare for your MatGo trip. Fares may vary based on real-time conditions.",
      fromLabel: "From (Origin)",
      fromPlaceholder: "e.g., Ngong Town",
      toLabel: "To (Destination)",
      toPlaceholder: "e.g., Nairobi CBD",
      vehicleTypeLabel: "Vehicle Type",
      vehicleTypePlaceholder: "Select vehicle type",
      timeOfDayLabel: "Time of Day",
      peakTime: "Peak Hours (e.g., 7-9AM, 4-7PM)",
      offPeakTime: "Off-Peak Hours",
      calculateButton: "Estimate Fare",
      estimatedFareTitle: "Estimated Fare:",
      bookThisTrip: "Book This Trip",
      disclaimer: "Disclaimer: This is an estimate. Actual fare may vary due to traffic, demand, and specific SACCO pricing. For exact fare, please check in-app or with conductor.",
      selectRoutePlaceholder: "Or select a common route",
      noDataAvailable: "Calculation data is currently unavailable. Please check back later."
    },
    KSW: {
      pageTitle: "Makadirio ya Nauli",
      pageDescription: "Pata makadirio ya nauli kwa safari yako ya MatGo. Nauli zinaweza kutofautiana kulingana na hali halisi.",
      fromLabel: "Kutoka (Mwanzo)",
      fromPlaceholder: "k.m., Mji wa Ngong",
      toLabel: "Kwenda (Mwisho)",
      toPlaceholder: "k.m., Nairobi CBD",
      vehicleTypeLabel: "Aina ya Gari",
      vehicleTypePlaceholder: "Chagua aina ya gari",
      timeOfDayLabel: "Wakati wa Siku",
      peakTime: "Saa za Msongamano (k.m., 1-3 Asubuhi, 10-1 Jioni)",
      offPeakTime: "Saa Zisizo na Msongamano",
      calculateButton: "Kadiria Nauli",
      estimatedFareTitle: "Nauli Iliyokadiriwa:",
      bookThisTrip: "Agiza Safari Hii",
      disclaimer: "Kanusho: Hii ni makadirio. Nauli halisi inaweza kutofautiana kutokana na trafiki, mahitaji, na bei maalum za SACCO. Kwa nauli kamili, tafadhali angalia ndani ya programu au na kondakta.",
      selectRoutePlaceholder: "Au chagua njia ya kawaida",
      noDataAvailable: "Data ya makadirio haipatikani kwa sasa. Tafadhali jaribu tena baadaye."
    }
  };
  const currentContent = content[language];

  const handleCalculateFare = () => {
    if (!fromLocation || !toLocation || !vehicleType) {
      setCalculatedFare(null);
      return;
    }
    // Super simplified mock calculation
    let baseFare = 50 + (fromLocation.length + toLocation.length) * 2;
    const vehicleFactor = vehicleTypes.find(v => v.value === vehicleType)?.baseFareFactor || 1;
    const timeFactor = timeOfDay === 'peak' ? 1.3 : 1.0;
    
    const estimated = Math.round((baseFare * vehicleFactor * timeFactor) / 10) * 10;
    setCalculatedFare(estimated);
  };
  
  const renderLoadingSkeleton = () => (
    <Card className="shadow-lg glassy-card p-6">
      <div className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Skeleton className="h-12 w-full"/>
            <Skeleton className="h-12 w-full"/>
        </div>
        <Skeleton className="h-12 w-full"/>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <Skeleton className="h-12 w-full"/>
            <Skeleton className="h-12 w-full"/>
        </div>
        <Skeleton className="h-14 w-full"/>
      </div>
    </Card>
  );

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <Card className="shadow-xl glassy-card">
          <CardHeader className="p-6">
            <CardTitle className="font-headline text-3xl md:text-4xl text-primary flex items-center gap-3">
              <Coins className="h-10 w-10" /> {currentContent.pageTitle}
            </CardTitle>
            <CardDescription className="text-base mt-1">
              {currentContent.pageDescription}
            </CardDescription>
          </CardHeader>
        </Card>

        {isLoading ? renderLoadingSkeleton() : vehicleTypes.length === 0 ? (
          <Card className="shadow-lg glassy-card text-center py-10">
            <p className="text-muted-foreground">{currentContent.noDataAvailable}</p>
          </Card>
        ) : (
        <Card className="shadow-lg glassy-card">
          <CardContent className="pt-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="fromLocation" className="font-semibold text-base">{currentContent.fromLabel}</Label>
                <Input id="fromLocation" value={fromLocation} onChange={e => setFromLocation(e.target.value)} placeholder={currentContent.fromPlaceholder} className="mt-1 text-base py-3 rounded-lg"/>
              </div>
              <div>
                <Label htmlFor="toLocation" className="font-semibold text-base">{currentContent.toLabel}</Label>
                <Input id="toLocation" value={toLocation} onChange={e => setToLocation(e.target.value)} placeholder={currentContent.toPlaceholder} className="mt-1 text-base py-3 rounded-lg"/>
              </div>
            </div>
            
            <div>
                <Label htmlFor="commonRoute" className="font-semibold text-base">{currentContent.selectRoutePlaceholder}</Label>
                <Select onValueChange={(value) => {
                    const parts = value.split(' - ');
                    if (parts.length === 2) {
                        setFromLocation(parts[0]);
                        setToLocation(parts[1]);
                    } else if (parts.length === 1 && value !== "") {
                        setFromLocation(value);
                        setToLocation("");
                    }
                }}>
                    <SelectTrigger id="commonRoute" className="mt-1 text-base py-3 rounded-lg">
                        <SelectValue placeholder={currentContent.selectRoutePlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {sampleRoutes.map(route => (
                            <SelectItem key={route} value={route} className="text-base py-2">{route}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <Label htmlFor="vehicleType" className="font-semibold text-base">{currentContent.vehicleTypeLabel}</Label>
                <Select value={vehicleType} onValueChange={setVehicleType}>
                  <SelectTrigger id="vehicleType" className="mt-1 text-base py-3 rounded-lg">
                    <SelectValue placeholder={currentContent.vehicleTypePlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map(v => (
                      <SelectItem key={v.value} value={v.value} className="text-base py-2 flex items-center gap-2">
                         {React.createElement(v.icon, {className: "h-5 w-5 mr-2 text-primary/80"})} {v.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="timeOfDay" className="font-semibold text-base">{currentContent.timeOfDayLabel}</Label>
                <Select value={timeOfDay} onValueChange={setTimeOfDay}>
                  <SelectTrigger id="timeOfDay" className="mt-1 text-base py-3 rounded-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="peak" className="text-base py-2">{currentContent.peakTime}</SelectItem>
                    <SelectItem value="off_peak" className="text-base py-2">{currentContent.offPeakTime}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button onClick={handleCalculateFare} size="lg" className="w-full text-lg py-3 rounded-lg btn-glow-primary">
              <Coins className="mr-2 h-5 w-5" /> {currentContent.calculateButton}
            </Button>

            {calculatedFare !== null && (
              <Card className="mt-6 bg-primary/10 border-primary/30 p-6 text-center glassy-card">
                <CardTitle className="font-headline text-xl text-primary">{currentContent.estimatedFareTitle}</CardTitle>
                <p className="text-4xl font-bold text-accent my-2">Ksh {calculatedFare.toLocaleString()}</p>
                <Button asChild size="lg" className="mt-3 btn-glow-accent">
                  <Link href="/booking">
                    {currentContent.bookThisTrip} <ArrowRight className="ml-2 h-5 w-5"/>
                  </Link>
                </Button>
              </Card>
            )}
            <p className="text-xs text-muted-foreground text-center mt-4">{currentContent.disclaimer}</p>
          </CardContent>
        </Card>
        )}
      </div>
    </AppLayout>
  );
}
