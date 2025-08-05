
"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { CalendarIcon, Map, Users, DollarSign, MessageSquare, Edit, Bus, Palette, Sparkles, ArrowRight, PlusCircle, MinusCircle, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { Skeleton } from "@/components/ui/skeleton";

interface NganyaOption {
  name: string;
  available: boolean;
  reason?: string;
  reason_KSW?: string;
}

interface VehicleType {
  value: string;
  label: string;
  basePricePerDay: number;
  capacity: number;
  imageHint: string;
  icon: React.ElementType;
}

interface PopularDestination {
  name: string;
  image: string;
  hint: string;
}


export default function RoadtripPage() {
  const [tripName, setTripName] = useState("");
  const [destination, setDestination] = useState("");
  const [tripDate, setTripDate] = useState<Date | undefined>(new Date(Date.now() + 86400000 * 7));
  const [tripDuration, setTripDuration] = useState(1);
  const [numberOfBuses, setNumberOfBuses] = useState(1);
  const [vehicleTypeValue, setVehicleTypeValue] = useState<string | undefined>();
  
  const [selectedSingleBusName, setSelectedSingleBusName] = useState<string | undefined>();
  const [selectedBusNames, setSelectedBusNames] = useState<string[]>([]);

  const [numPeople, setNumPeople] = useState(10);
  const [notes, setNotes] = useState("");
  const [totalPrice, setTotalPrice] = useState(0);
  const [depositPrice, setDepositPrice] = useState(0);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic Data States
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([]);
  const [popularDestinations, setPopularDestinations] = useState<PopularDestination[]>([]);
  const [availableNganyas, setAvailableNganyas] = useState<NganyaOption[]>([]);

  const { toast } = useToast();
  const { language } = useLanguage();

  const selectedVehicleInfo = vehicleTypes.find(v => v.value === vehicleTypeValue);

  useEffect(() => {
    // Simulate fetching all roadtrip page data
    const fetchData = async () => {
        setIsLoading(true);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // In a real app, you'd fetch this from APIs
        // For now, set to empty arrays as requested
        setVehicleTypes([]);
        setPopularDestinations([]);
        setAvailableNganyas([]);

        setIsLoading(false);
    };
    fetchData();
  }, []);

  const content = {
    ENG: {
      pageTitle: "Create Your Epic RoadTrip",
      pageDescription: "Design your custom adventure. We'll handle the Nganya ride!",
      tripEssentialsTitle: "Trip Essentials",
      tripNameLabel: "Trip Name / Occasion",
      tripNamePlaceholder: "e.g., Magadi Escapade, Team Building '24",
      destinationLabel: "Main Destination",
      destinationPlaceholder: "e.g., Lake Naivasha, Amboseli Park",
      startDateLabel: "Start Date",
      pickDate: "Pick a date",
      durationLabel: "Duration (days)",
      numBusesLabel: "No. of Buses",
      vehiclePassengersTitle: "Vehicle & Passengers",
      vehicleTypeLabel: "Vehicle Type",
      vehicleTypePlaceholder: "Choose vehicle type",
      approxPax: "Approx. {capacity} pax",
      preferredNganyaLabel: "Preferred Nganya(s)",
      selectNganyaPlaceholder: "Select Nganya by name (optional)",
      anyAvailableNganya: "Any Available Nganya",
      unavailableReason: "(Unavailable - {reason})",
      selectUpToNBuses: "Select up to {count} Nganya(s)",
      numPeopleLabel: "Number of People",
      additionalDetailsTitle: "Additional Details",
      notesLabel: "Special Requests or Itinerary Notes",
      notesPlaceholder: "e.g., Specific pickup points, preferred music genre, stopover requests, dietary needs for crew...",
      estimatedCostTitle: "Estimated Cost",
      estimatedCostDesc: "This is an estimate. Final quote after confirmation.",
      totalEstPrice: "Total Estimated Price:",
      requiredDeposit: "Required Deposit (50%):",
      priceVariationNote: "Final price may vary based on specific requests, final route, and any additional services. You will be contacted by the SACCO/owner for confirmation and to discuss details.",
      saveDraft: "Save Draft",
      planRequestQuote: "Plan & Request Quote",
      popularRoadtripIdeas: "Popular RoadTrip Ideas",
      getInspired: "Get Inspired",
      missingDetailsTitle: "Missing Details",
      missingDetailsDesc: "Please fill all required fields for the roadtrip.",
      roadtripSentTitle: "Roadtrip Plan Sent!",
      roadtripSentDesc: (name: string, buses: string, deposit: string) => `Your plan for "${name}" with ${buses || 'selected vehicle(s)'} has been submitted. Driver/SACCO will confirm shortly. Deposit: Ksh ${deposit}`,
      limitReachedTitle: "Limit Reached",
      limitReachedDesc: (count: number) => `You can only select up to ${count} buses.`,
      requiredMark: "*",
      noVehiclesAvailable: "No vehicles available for roadtrips at the moment.",
    },
    KSW: {
      pageTitle: "Tengeneza RoadTrip Yako ya Kifahari",
      pageDescription: "Buni safari yako maalum. Tutashughulikia usafiri wa Nganya!",
      tripEssentialsTitle: "Mambo Muhimu ya Safari",
      tripNameLabel: "Jina la Safari / Tukio",
      tripNamePlaceholder: "k.m., Magadi Escapade, Team Building '24",
      destinationLabel: "Eneo Kuu Linaloendwa",
      destinationPlaceholder: "k.m., Ziwa Naivasha, Hifadhi ya Amboseli",
      startDateLabel: "Tarehe ya Kuanza",
      pickDate: "Chagua tarehe",
      durationLabel: "Muda (siku)",
      numBusesLabel: "Idadi ya Mabasi",
      vehiclePassengersTitle: "Gari na Abiria",
      vehicleTypeLabel: "Aina ya Gari",
      vehicleTypePlaceholder: "Chagua aina ya gari",
      approxPax: "Takriban abiria {capacity}",
      preferredNganyaLabel: "Nganya Unazopendelea",
      selectNganyaPlaceholder: "Chagua Nganya kwa jina (si lazima)",
      anyAvailableNganya: "Nganya Yoyote Inayopatikana",
      unavailableReason: "(Haipatikani - {reason})",
      selectUpToNBuses: "Chagua hadi Nganya {count}",
      numPeopleLabel: "Idadi ya Watu",
      additionalDetailsTitle: "Maelezo ya Ziada",
      notesLabel: "Maombi Maalum au Vidokezo vya Ratiba",
      notesPlaceholder: "k.m., Sehemu maalum za kuchukua, aina ya muziki unaopendelea, maombi ya kusimama njiani, mahitaji ya lishe kwa wahudumu...",
      estimatedCostTitle: "Gharama ya Kukadiria",
      estimatedCostDesc: "Hii ni makadirio. Nukuu ya mwisho baada ya uthibitisho.",
      totalEstPrice: "Jumla ya Bei Iliyokadiriwa:",
      requiredDeposit: "Amana Inayohitajika (50%):",
      priceVariationNote: "Bei ya mwisho inaweza kutofautiana kulingana na maombi maalum, njia ya mwisho, na huduma zozote za ziada. Utawasiliana na SACCO/mmiliki kwa uthibitisho na kujadili maelezo.",
      saveDraft: "Hifadhi Rasimu",
      planRequestQuote: "Panga na Omba Nukuu",
      popularRoadtripIdeas: "Mawazo Maarufu ya RoadTrip",
      getInspired: "Pata Msukumo",
      missingDetailsTitle: "Maelezo Hayajakamilika",
      missingDetailsDesc: "Tafadhali jaza sehemu zote zinazohitajika kwa roadtrip.",
      roadtripSentTitle: "Mpango wa Roadtrip Umetumwa!",
      roadtripSentDesc: (name: string, buses: string, deposit: string) => `Mpango wako wa "${name}" na ${buses || 'gari/magari uliyochagua'} umewasilishwa. Dereva/SACCO watathibitisha hivi karibuni. Amana: Ksh ${deposit}`,
      limitReachedTitle: "Idadi Imefikiwa",
      limitReachedDesc: (count: number) => `Unaweza kuchagua hadi mabasi ${count} pekee.`,
      requiredMark: "*",
      noVehiclesAvailable: "Hakuna magari yanayopatikana kwa safari za barabarani kwa sasa.",
    }
  };
  const currentContent = content[language];

  const handleNumericInputChange = (setter: React.Dispatch<React.SetStateAction<number>>, value: string, minVal = 1) => {
    const parsedValue = parseInt(value, 10);
    if (isNaN(parsedValue) || value.trim() === "") {
      if (value.trim() === "") return;
      setter(s => s); 
    } else {
      setter(Math.max(minVal, parsedValue));
    }
  };
  
  useEffect(() => {
    setSelectedSingleBusName(undefined);
    setSelectedBusNames([]);
  }, [numberOfBuses, vehicleTypeValue]);

  useEffect(() => {
    if (selectedVehicleInfo) {
      let baseVehiclePrice = selectedVehicleInfo.basePricePerDay * numberOfBuses;
      let price = baseVehiclePrice * tripDuration;
      setTotalPrice(price);
      setDepositPrice(price * 0.5);
    } else {
      setTotalPrice(0);
      setDepositPrice(0);
    }
  }, [selectedVehicleInfo, tripDuration, numberOfBuses]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tripName || !destination || !tripDate || !vehicleTypeValue || numPeople <=0 || tripDuration <=0 || numberOfBuses <=0) {
        toast({variant: "destructive", title: currentContent.missingDetailsTitle, description: currentContent.missingDetailsDesc});
        return;
    }
    
    const busSelectionSummary = numberOfBuses <= 1 ? selectedSingleBusName : selectedBusNames.join(', ');

    toast({
      title: currentContent.roadtripSentTitle,
      description: currentContent.roadtripSentDesc(tripName, busSelectionSummary || (language === 'KSW' ? 'gari/magari uliyochagua' : 'selected vehicle(s)'), depositPrice.toLocaleString()),
      className: "bg-primary text-primary-foreground"
    });
    setShowCelebration(true);
    setTimeout(() => setShowCelebration(false), 3500);
  };

  const handleMultiBusSelectChange = (busName: string, isChecked: boolean) => {
    if (isChecked) {
      if (selectedBusNames.length < numberOfBuses) {
        setSelectedBusNames(prev => [...prev, busName]);
      } else {
        toast({ variant: "destructive", title: currentContent.limitReachedTitle, description: currentContent.limitReachedDesc(numberOfBuses) });
      }
    } else {
      setSelectedBusNames(prev => prev.filter(name => name !== busName));
    }
  };
  
  const renderLoadingSkeleton = () => (
    <div className="space-y-8">
        <Skeleton className="h-56 w-full"/>
        <Skeleton className="h-64 w-full"/>
        <Skeleton className="h-48 w-full"/>
    </div>
  );

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
         {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center z-[200] pointer-events-none">
            <Map className="h-32 w-32 text-yellow-400 celebration-animation opacity-80" />
            <Bus className="h-48 w-48 text-primary celebration-animation opacity-70 animation-delay-[200ms]" />
            <Sparkles className="h-24 w-24 text-accent celebration-animation opacity-90 animation-delay-[400ms]" />
          </div>
        )}
        <Card className="shadow-xl glassy-card overflow-hidden">
           <CardHeader className="p-0 relative">
            <Image src="/images/roadtrip/banner.png" data-ai-hint="kenya landscape adventure" alt="Roadtrip adventure banner" width={800} height={300} className="w-full h-40 md:h-56 object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
              <CardTitle className="font-headline text-3xl md:text-4xl text-white drop-shadow-lg flex items-center gap-2">
                <Map className="h-8 w-8" /> {currentContent.pageTitle}
              </CardTitle>
              <CardDescription className="text-gray-200 text-lg mt-1">{currentContent.pageDescription}</CardDescription>
            </div>
          </CardHeader>
        </Card>

        {isLoading ? renderLoadingSkeleton() : (
        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="shadow-lg glassy-card">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><Palette className="h-6 w-6"/>{currentContent.tripEssentialsTitle}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div>
                <Label htmlFor="tripName" className="font-semibold text-base">{currentContent.tripNameLabel} <span className="text-destructive">{currentContent.requiredMark}</span></Label>
                <Input id="tripName" placeholder={currentContent.tripNamePlaceholder} value={tripName} onChange={e => setTripName(e.target.value)} required className="text-base py-3 rounded-lg"/>
              </div>
              <div>
                <Label htmlFor="destination" className="font-semibold text-base">{currentContent.destinationLabel} <span className="text-destructive">{currentContent.requiredMark}</span></Label>
                <Input id="destination" placeholder={currentContent.destinationPlaceholder} value={destination} onChange={e => setDestination(e.target.value)} required className="text-base py-3 rounded-lg"/>
              </div>
              <div>
                <Label htmlFor="tripDate" className="font-semibold text-base">{currentContent.startDateLabel} <span className="text-destructive">{currentContent.requiredMark}</span></Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal text-base py-3 rounded-lg",
                        !tripDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {tripDate ? format(tripDate, "PPP") : <span>{currentContent.pickDate}</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-card border-primary" side="bottom" align="start">
                    <Calendar
                      mode="single"
                      selected={tripDate}
                      onSelect={setTripDate}
                      initialFocus
                      disabled={(date) => date < new Date(new Date().setHours(0,0,0,0) + 86400000 * 2)}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="tripDuration" className="font-semibold text-base">{currentContent.durationLabel} <span className="text-destructive">{currentContent.requiredMark}</span></Label>
                    <Input id="tripDuration" type="number" min="1" value={tripDuration} onChange={e => handleNumericInputChange(setTripDuration, e.target.value)} required className="text-base py-3 rounded-lg"/>
                </div>
                <div>
                    <Label htmlFor="numberOfBuses" className="font-semibold text-base">{currentContent.numBusesLabel} <span className="text-destructive">{currentContent.requiredMark}</span></Label>
                    <Input id="numberOfBuses" type="number" min="1" value={numberOfBuses} onChange={e => handleNumericInputChange(setNumberOfBuses, e.target.value)} required className="text-base py-3 rounded-lg"/>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg glassy-card">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><Bus className="h-6 w-6"/>{currentContent.vehiclePassengersTitle}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
              <div>
                <Label htmlFor="vehicleType" className="font-semibold text-base">{currentContent.vehicleTypeLabel} <span className="text-destructive">{currentContent.requiredMark}</span></Label>
                <Select value={vehicleTypeValue} onValueChange={setVehicleTypeValue} required>
                  <SelectTrigger id="vehicleType" className="text-base py-3 rounded-lg">
                    <SelectValue placeholder={currentContent.vehicleTypePlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {vehicleTypes.map(v => (
                      <SelectItem key={v.value} value={v.value} className="text-base py-2 flex items-center gap-2">
                        {React.createElement(v.icon, {className: "h-5 w-5 mr-2 text-primary/80"})} {v.label} ({currentContent.approxPax.replace('{capacity}', String(v.capacity))})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                 {vehicleTypes.length === 0 && <p className="text-xs text-muted-foreground mt-1">{currentContent.noVehiclesAvailable}</p>}
              </div>
              
              {vehicleTypeValue === "nganya" && (
                <div>
                  <Label htmlFor="busName" className="font-semibold text-base">{currentContent.preferredNganyaLabel}</Label>
                  {numberOfBuses <= 1 ? (
                    <Select value={selectedSingleBusName} onValueChange={setSelectedSingleBusName}>
                      <SelectTrigger id="busNameSingle" className="text-base py-3 rounded-lg">
                        <SelectValue placeholder={currentContent.selectNganyaPlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">{currentContent.anyAvailableNganya}</SelectItem>
                        {availableNganyas.map(nganya => (
                          <SelectItem 
                            key={nganya.name} 
                            value={nganya.name} 
                            disabled={!nganya.available}
                            className="text-base py-2"
                          >
                            {nganya.name} {!nganya.available && currentContent.unavailableReason.replace('{reason}', language === 'KSW' ? (nganya.reason_KSW || nganya.reason || 'iko safarini') : (nganya.reason || 'on trip'))}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="w-full justify-between text-left font-normal text-base py-3 rounded-lg">
                          <span>
                            {selectedBusNames.length > 0 
                              ? (selectedBusNames.length === 1 ? selectedBusNames[0] : `${selectedBusNames.length} ${language === 'KSW' ? 'Nganya zimechaguliwa' : 'Nganyas selected'}`) 
                              : currentContent.selectNganyaPlaceholder}
                          </span>
                          <ChevronDown className="h-4 w-4 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="w-[--radix-dropdown-menu-trigger-width] max-h-60 overflow-y-auto">
                        <DropdownMenuLabel>{currentContent.selectUpToNBuses.replace('{count}', String(numberOfBuses))}</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {availableNganyas.map(nganya => (
                          <DropdownMenuCheckboxItem
                            key={nganya.name}
                            checked={selectedBusNames.includes(nganya.name)}
                            onCheckedChange={(isChecked) => handleMultiBusSelectChange(nganya.name, !!isChecked)}
                            disabled={!nganya.available || (selectedBusNames.length >= numberOfBuses && !selectedBusNames.includes(nganya.name))}
                          >
                            {nganya.name} {!nganya.available && currentContent.unavailableReason.replace('{reason}', language === 'KSW' ? (nganya.reason_KSW || nganya.reason || 'iko safarini') : (nganya.reason || 'on trip'))}
                          </DropdownMenuCheckboxItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{language === 'KSW' ? 'Kulingana na eneo, Nganya zingine zinaweza kupendekezwa. Upatikanaji unaweza kutofautiana.' : 'Based on destination, some Nganyas might be suggested. Availability may vary.'}</p>
                </div>
              )}

              <div>
                <Label htmlFor="numPeople" className="font-semibold text-base">{currentContent.numPeopleLabel} <span className="text-destructive">{currentContent.requiredMark}</span></Label>
                <div className="flex items-center gap-2 mt-1">
                    <Button type="button" variant="outline" size="icon" onClick={() => handleNumericInputChange(setNumPeople, String(numPeople - 1))} aria-label="Decrease number of people" className="rounded-full border-primary text-primary hover:bg-primary/10"><MinusCircle/></Button>
                    <Input id="numPeople" type="number" min="1" value={numPeople} onChange={e => handleNumericInputChange(setNumPeople, e.target.value)} required className="w-20 text-center text-lg font-bold rounded-lg border-2 border-primary bg-transparent focus:ring-0" aria-label={currentContent.numPeopleLabel}/>
                    <Button type="button" variant="outline" size="icon" onClick={() => handleNumericInputChange(setNumPeople, String(numPeople + 1))} aria-label="Increase number of people" className="rounded-full border-primary text-primary hover:bg-primary/10"><PlusCircle/></Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg glassy-card">
             <CardHeader>
                <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><MessageSquare className="h-6 w-6"/>{currentContent.additionalDetailsTitle}</CardTitle>
             </CardHeader>
            <CardContent className="pt-4">
                <Label htmlFor="notes" className="font-semibold text-base">{currentContent.notesLabel}</Label>
                <Textarea id="notes" placeholder={currentContent.notesPlaceholder} value={notes} onChange={e => setNotes(e.target.value)} rows={4} className="text-base py-3 rounded-lg mt-1"/>
            </CardContent>
          </Card>
          
          <Card className="shadow-xl glassy-card bg-gradient-to-r from-primary/20 to-accent/20 dark:from-primary/10 dark:to-accent/10 border-primary/30">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">{currentContent.estimatedCostTitle}</CardTitle>
              <CardDescription>{currentContent.estimatedCostDesc}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 pt-2">
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold">{currentContent.totalEstPrice}</span>
                <span className="font-bold text-primary text-2xl">Ksh {totalPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-lg">
                <span className="font-semibold">{currentContent.requiredDeposit}</span>
                <span className="font-bold text-accent text-2xl">Ksh {depositPrice.toLocaleString()}</span>
              </div>
              <p className="text-sm text-muted-foreground pt-2">{currentContent.priceVariationNote}</p>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row justify-end gap-4 mt-8">
            <Button type="button" variant="outline" size="lg" className="transition-transform hover:scale-105 text-base py-3 px-6 rounded-lg border-primary text-primary hover:bg-primary/10">{currentContent.saveDraft}</Button>
            <Button type="submit" size="lg" className="font-bold text-lg py-3 px-6 rounded-lg btn-glow-primary transition-transform hover:scale-105">
              {currentContent.planRequestQuote} <DollarSign className="ml-2 h-5 w-5"/>
            </Button>
          </div>
        </form>
        )}
         <div className="mt-16 p-6 border-t-2 border-primary/20 border-dashed">
            <h3 className="font-headline text-3xl text-center mb-8 text-primary">{currentContent.popularRoadtripIdeas}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {popularDestinations.map(idea => (
                    <Card key={idea.name} className="overflow-hidden transform transition-all hover:shadow-2xl hover:-translate-y-1.5 glassy-card group border-transparent hover:border-primary">
                        <Image src={idea.image} data-ai-hint={idea.hint} alt={idea.name} width={400} height={225} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"/>
                        <CardContent className="p-4">
                            <CardTitle className="font-headline text-xl text-foreground group-hover:text-primary">{idea.name}</CardTitle>
                            <Button variant="link" className="p-0 mt-1 text-primary group-hover:text-accent font-semibold">
                                {currentContent.getInspired} <ArrowRight className="ml-1 h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"/>
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
      </div>
    </AppLayout>
  );
}

    