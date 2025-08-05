
"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, MapPinned, Clock, Users, Armchair, AlertCircle, CreditCard, MinusCircle, PlusCircle, Palette, Sparkles, ArrowRight, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import React, { useState, useEffect } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";


interface RouteDetails {
  value: string;
  label: string;
  price: number;
  stops: string[];
  image: string;
  imageHint: string;
  sacco: string;
}

const longDistanceRoutes: RouteDetails[] = [
  { value: "nairobi-mombasa", label: "Nairobi ↔ Mombasa", price: 2500, stops: ["Mtito Andei", "Voi", "Mariakani"], image: "https://placehold.co/800x250.png", imageHint: "mombasa highway bus", sacco: "Modern Coast" },
  { value: "nairobi-kisumu", label: "Nairobi ↔ Kisumu", price: 1800, stops: ["Nakuru", "Kericho"], image: "https://placehold.co/800x250.png", imageHint: "rift valley road", sacco: "Easy Coach" },
];

const timeSlots = ["07:00 AM", "09:00 AM", "11:00 AM", "02:00 PM", "08:00 PM", "10:00 PM"];

interface Seat {
  id: string;
  isBooked: boolean;
  isSelected: boolean;
  passengerName?: string;
}

export default function BookingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedRouteValue, setSelectedRouteValue] = useState<string | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | undefined>();
  const [seats, setSeats] = useState<Seat[]>([]);
  const [numberOfSeatsToBook, setNumberOfSeatsToBook] = useState(1);
  const [selectedSeatsList, setSelectedSeatsList] = useState<string[]>([]);
  const [step, setStep] = useState(1);
  const [showCelebration, setShowCelebration] = useState(false);

  const { toast } = useToast();
  const { language } = useLanguage();
  const router = useRouter();
  const currentRouteDetails = longDistanceRoutes.find(r => r.value === selectedRouteValue);
  const pricePerSeat = currentRouteDetails?.price || 0;
  const totalPrice = pricePerSeat * selectedSeatsList.length;

  useEffect(() => {
    // Simulate initial data loading
    setTimeout(() => {
        setIsLoading(false);
    }, 1000);
  }, []);
  
  // This effect would fetch seat availability for a specific trip
  useEffect(() => {
    if (selectedRouteValue && selectedDate && selectedTime) {
      // In a real app:
      // const fetchSeats = async () => {
      //   const response = await fetch(`/api/trips/${selectedRouteValue}/${format(selectedDate, 'yyyy-MM-dd')}/${selectedTime}/seats`);
      //   const seatData = await response.json();
      //   setSeats(seatData);
      // }
      // fetchSeats();
      
      // For simulation, generate random seats when trip details change
      const generateSeats = () => {
        const regularSeats = Array.from({ length: 12 }, (_, rowIndex) => 
          ['A', 'B', 'C', 'D'].map((seatLetter) => ({
            id: `${rowIndex + 1}${seatLetter}`, isBooked: Math.random() < 0.35, isSelected: false, passengerName: ""
          }))
        ).flat();
        const lastRow = ['E1', 'E2', 'E3', 'E4', 'E5'].map(seatId => ({
          id: seatId, isBooked: Math.random() < 0.2, isSelected: false, passengerName: ""
        }));
        return [...regularSeats, ...lastRow];
      }
      setSeats(generateSeats());
    }
  }, [selectedRouteValue, selectedDate, selectedTime]);

  const content = {
    ENG: {
      pageTitle: "Plan Your Long Distance Journey",
      pageDescription: "Book your seat(s) for Mombasa, Kisumu, and more. Travel in comfort, Nganya style!",
      steps: ['Details', 'Select Seat(s)', 'Payment', 'Confirmation'],
      tripDetailsTitle: "Trip Details",
      selectRouteLabel: "Select Route",
      selectRoutePlaceholder: "Choose your destination",
      selectDateLabel: "Select Date",
      pickDate: "Pick a date",
      selectTimeLabel: "Select Time",
      selectTimePlaceholder: "Departure time",
      numSeatsLabel: "Number of Seats",
      majorStops: "Major Stops:",
      selectSeatsTitle: "Select Your Seat(s)",
      selectSeatsDescription: (num: number, price: number) => `Choose ${num} seat(s). Price per seat: Ksh ${price.toLocaleString()}`,
      seatLegendSelected: "Selected",
      seatLegendAvailable: "Available",
      seatLegendBooked: "Booked",
      youSelectedSeats: "You selected seat(s):",
      enterPassengerNames: "Enter Passenger Names:",
      seatLabel: "Seat",
      passengerNamePlaceholder: "Passenger Full Name",
      actionNeededTitle: "Action Needed",
      actionNeededDescription: (num: number) => `Please select exactly ${num} seat(s) to continue.`,
      seatLimitReachedTitle: "Seat Limit Reached",
      seatLimitReachedDescription: (num: number) => `You can only select ${num} seat(s). Deselect another seat or increase seat count.`,
      missingNamesTitle: "Missing Passenger Names",
      missingNamesDescription: "Please enter names for all selected seats.",
      confirmPayTitle: "Confirm & Pay",
      confirmPayDescription: (price: number) => `Review your booking details. Total: Ksh ${price.toLocaleString()}`,
      route: "Route:",
      date: "Date:",
      time: "Time:",
      seats: "Seat(s):",
      passengers: "Passengers:",
      mpesaPaymentTitle: "M-Pesa Payment",
      mpesaPaymentDescription: (price: number, seat: string) => `To complete your booking, please send Ksh ${price.toLocaleString()} to PayBill MatGo (0105127824 or 0116302317), Account ${seat || "YOUR_SEAT"}. Your seat(s) will be reserved upon payment confirmation. Click "Confirm Payment" after sending.`,
      paymentConfirmedToast: "Payment Confirmed (Simulated)",
      paymentConfirmedToastDesc: "Your booking is successful! Prepare for an awesome trip.",
      back: "Back",
      next: "Next",
      confirmPayButton: "Confirm Payment & Book",
      frontOfBus: "[ Front of Bus / Driver ]",
      backOfBus: "[ Back of Bus ]",
    },
    KSW: {
      pageTitle: "Panga Safari Yako Ndefu",
      pageDescription: "Weka nafasi ya kiti/viti vyako Mombasa, Kisumu, na kwingineko. Safiri kwa raha, mtindo wa Nganya!",
      steps: ['Maelezo', 'Chagua Viti', 'Malipo', 'Uthibitisho'],
      tripDetailsTitle: "Maelezo ya Safari",
      selectRouteLabel: "Chagua Njia",
      selectRoutePlaceholder: "Chagua unakoenda",
      selectDateLabel: "Chagua Tarehe",
      pickDate: "Chagua tarehe",
      selectTimeLabel: "Chagua Wakati",
      selectTimePlaceholder: "Wakati wa kuondoka",
      numSeatsLabel: "Idadi ya Viti",
      majorStops: "Vituo Vikuu:",
      selectSeatsTitle: "Chagua Kiti/Viti Vyako",
      selectSeatsDescription: (num: number, price: number) => `Chagua kiti/viti ${num}. Bei kwa kiti: Ksh ${price.toLocaleString()}`,
      seatLegendSelected: "Umechagua",
      seatLegendAvailable: "Kinapatikana",
      seatLegendBooked: "Kimechukuliwa",
      youSelectedSeats: "Umechagua kiti/viti:",
      enterPassengerNames: "Andika Majina ya Abiria:",
      seatLabel: "Kiti",
      passengerNamePlaceholder: "Jina Kamili la Abiria",
      actionNeededTitle: "Hatua Inahitajika",
      actionNeededDescription: (num: number) => `Tafadhali chagua viti ${num} haswa ili kuendelea.`,
      seatLimitReachedTitle: "Idadi ya Viti Imefikiwa",
      seatLimitReachedDescription: (num: number) => `Unaweza kuchagua viti ${num} pekee. Acha kuchagua kiti kingine au ongeza idadi ya viti.`,
      missingNamesTitle: "Majina ya Abiria Hayajakamilika",
      missingNamesDescription: "Tafadhali andika majina kwa viti vyote vilivyochaguliwa.",
      confirmPayTitle: "Thibitisha na Lipa",
      confirmPayDescription: (price: number) => `Kagua maelezo yako ya kuweka nafasi. Jumla: Ksh ${price.toLocaleString()}`,
      route: "Njia:",
      date: "Tarehe:",
      time: "Wakati:",
      seats: "Kiti/Viti:",
      passengers: "Abiria:",
      mpesaPaymentTitle: "Malipo ya M-Pesa",
      mpesaPaymentDescription: (price: number, seat: string) => `Kukamilisha malipo, tafadhali tuma Ksh ${price.toLocaleString()} kwenda PayBill MatGo (0105127824 au 0116302317), Akaunti ${seat || "KITI_CHAKO"}. Kiti/viti vyako vitahifadhiwa baada ya uthibitisho wa malipo. Bofya "Thibitisha Malipo" baada ya kutuma.`,
      paymentConfirmedToast: "Malipo Yamethibitishwa (Mfumo)",
      paymentConfirmedToastDesc: "Uhifadhi wako umefaulu! Jitayarishe kwa safari nzuri.",
      back: "Rudi Nyuma",
      next: "Endelea",
      confirmPayButton: "Thibitisha Malipo & Weka Nafasi",
      frontOfBus: "[ Mbele ya Basi / Dereva ]",
      backOfBus: "[ Nyuma ya Basi ]",
    }
  };
  const currentContent = content[language];


  useEffect(() => {
    setSelectedSeatsList([]);
    setSeats(prevSeats => prevSeats.map(s => ({ ...s, isSelected: false, passengerName: "" })));
  }, [numberOfSeatsToBook, selectedRouteValue, selectedDate, selectedTime]);


  const handleSeatSelect = (seatId: string) => {
    const seatToToggle = seats.find(s => s.id === seatId);
    if (seatToToggle && !seatToToggle.isBooked) {
      if (seatToToggle.isSelected) {
        setSelectedSeatsList(prev => prev.filter(id => id !== seatId));
        setSeats(prevSeats => prevSeats.map(s => s.id === seatId ? { ...s, isSelected: false, passengerName: "" } : s));
      } else {
        if (selectedSeatsList.length < numberOfSeatsToBook) {
          setSelectedSeatsList(prev => [...prev, seatId]);
          setSeats(prevSeats => prevSeats.map(s => s.id === seatId ? { ...s, isSelected: true } : s));
        } else {
          toast({
            variant: "destructive",
            title: currentContent.seatLimitReachedTitle,
            description: currentContent.seatLimitReachedDescription(numberOfSeatsToBook),
          });
        }
      }
    }
  };
  
  const handlePassengerNameChange = (seatId: string, name: string) => {
    setSeats(prevSeats => prevSeats.map(s => s.id === seatId ? { ...s, passengerName: name } : s));
  };

  const renderSeats = () => {
    if (seats.length === 0) return <div className="text-center py-8 text-muted-foreground">{language === 'KSW' ? 'Chagua safari ili kuona viti...' : 'Select a trip to see seats...'}</div>
    
    const seatGrid: JSX.Element[][] = Array.from({ length: 12 }, () => []);
    seats.slice(0, 48).forEach(seat => {
      const match = seat.id.match(/(\d+)([A-Z])/);
      if (match) {
        const row = parseInt(match[1], 10) - 1;
        seatGrid[row].push(
          <Button
            key={seat.id}
            variant={seat.isBooked ? "ghost" : (seat.isSelected ? "default" : "outline")}
            className={cn(
              "w-10 h-10 md:w-11 md:h-11 text-xs p-0 transition-all duration-200 border-2",
              seat.isBooked && "bg-muted/70 text-muted-foreground/50 line-through cursor-not-allowed opacity-60 blur-[1.5px] border-muted-foreground/30",
              seat.isSelected && "bg-primary text-primary-foreground ring-2 ring-offset-1 ring-primary scale-110 shadow-lg border-primary",
              !seat.isBooked && !seat.isSelected && "hover:bg-primary/10 hover:border-primary border-input",
            )}
            onClick={() => handleSeatSelect(seat.id)}
            disabled={seat.isBooked}
            aria-label={`Seat ${seat.id}${seat.isBooked ? ' (Booked)' : (seat.isSelected ? ' (Selected)' : ' (Available)')}`}
          >
            {seat.id}
          </Button>
        );
      }
    });

    const backRowRender = seats.slice(48).map(seat => (
       <Button
            key={seat.id}
            variant={seat.isBooked ? "ghost" : (seat.isSelected ? "default" : "outline")}
            className={cn(
              "w-10 h-10 md:w-11 md:h-11 text-xs p-0 transition-all duration-200 border-2",
              seat.isBooked && "bg-muted/70 text-muted-foreground/50 line-through cursor-not-allowed opacity-60 blur-[1.5px] border-muted-foreground/30",
              seat.isSelected && "bg-primary text-primary-foreground ring-2 ring-offset-1 ring-primary scale-110 shadow-lg border-primary",
              !seat.isBooked && !seat.isSelected && "hover:bg-primary/10 hover:border-primary border-input",
            )}
            onClick={() => handleSeatSelect(seat.id)}
            disabled={seat.isBooked}
            aria-label={`Seat ${seat.id}${seat.isBooked ? ' (Booked)' : (seat.isSelected ? ' (Selected)' : ' (Available)')}`}
          >
            {seat.id}
          </Button>
    ));

    return (
      <>
        {seatGrid.map((rowSeats, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1 md:gap-1.5">
            {rowSeats.slice(0, 2)}
            <div className="w-6 md:w-8" /> {/* Aisle */}
            {rowSeats.slice(2, 4)}
          </div>
        ))}
        <div className="flex justify-center gap-1 md:gap-1.5 mt-2 pt-2 border-t border-dashed">
          {backRowRender}
        </div>
      </>
    );
  };

  const proceedToNextStep = () => {
    if (step === 1 && selectedRouteValue && selectedDate && selectedTime && numberOfSeatsToBook > 0) {
      setStep(2);
    } else if (step === 2 && selectedSeatsList.length === numberOfSeatsToBook) {
      if (numberOfSeatsToBook >= 1) { 
        const namesMissing = selectedSeatsList.some(seatId => !seats.find(s => s.id === seatId)?.passengerName?.trim());
        if (namesMissing) {
          toast({ variant: "destructive", title: currentContent.missingNamesTitle, description: currentContent.missingNamesDescription});
          return;
        }
      }
      setStep(3);
    } else if (step === 3) {
        toast({ title: currentContent.paymentConfirmedToast, description: currentContent.paymentConfirmedToastDesc, className: "bg-green-500 text-white" });
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
        
        const passengerNamesForReceipt = selectedSeatsList.map(id => seats.find(s => s.id === id)?.passengerName || (language === 'KSW' ? "Mwenyewe" : "Self")).join(',');
        const queryParams = new URLSearchParams({
          route: currentRouteDetails?.value || "unknown-route",
          date: selectedDate ? format(selectedDate, "yyyy-MM-dd") : "N/A",
          time: selectedTime || "N/A",
          seats: selectedSeatsList.join(","),
          price: String(totalPrice),
          passengers: passengerNamesForReceipt,
          paymentMethod: language === 'KSW' ? "M-Pesa (Mfumo)" : "M-Pesa (Simulated)",
          vehicleInfo: `${currentRouteDetails?.label || "Bus"} (${currentRouteDetails?.sacco || "MatGo Fleet"})`,
          vehicleImage: currentRouteDetails?.image || "/images/receipt/default_bus.png",
          vehicleImageHint: currentRouteDetails?.imageHint || "bus exterior",
          sacco: currentRouteDetails?.sacco || "MatGo Fleet",
          tripType: language === 'KSW' ? "Safari Ndefu" : "Long Distance"
        }).toString();
        router.push(`/receipt/sample?${queryParams}`);
    }
  };

  const proceedToPreviousStep = () => {
    if (step > 1) setStep(step - 1);
  };
  
  const renderLoadingSkeleton = () => (
    <Card className="shadow-lg glassy-card p-6">
        <Skeleton className="h-8 w-1/3 mb-4"/>
        <Skeleton className="h-12 w-full mb-4"/>
        <Skeleton className="h-64 w-full"/>
    </Card>
  );

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        {showCelebration && (
          <div className="fixed inset-0 flex items-center justify-center z-[200] pointer-events-none">
            <Sparkles className="h-32 w-32 text-yellow-400 celebration-animation opacity-80" />
            <Sparkles className="h-48 w-48 text-primary celebration-animation opacity-70 animation-delay-[200ms]" />
            <Sparkles className="h-24 w-24 text-accent celebration-animation opacity-90 animation-delay-[400ms]" />
          </div>
        )}
        <Card className="shadow-xl glassy-card overflow-hidden">
          <CardHeader className="p-0">
            {currentRouteDetails?.image && (
              <Image src={currentRouteDetails.image} alt={currentRouteDetails.label} data-ai-hint={currentRouteDetails.imageHint} width={800} height={250} className="w-full h-40 md:h-56 object-cover"/>
            )}
            <div className={cn("p-6", currentRouteDetails?.image && "bg-gradient-to-t from-black/70 to-transparent absolute bottom-0 left-0 right-0")}>
              <CardTitle className={cn("font-headline text-3xl md:text-4xl flex items-center gap-2", currentRouteDetails?.image ? "text-white drop-shadow-lg" : "text-primary")}>
                <MapPinned className="h-8 w-8"/> {currentContent.pageTitle}
              </CardTitle>
              <CardDescription className={cn(currentRouteDetails?.image ? "text-gray-200" : "text-muted-foreground")}>
                {currentContent.pageDescription}
              </CardDescription>
            </div>
          </CardHeader>
        </Card>
        
        {isLoading ? renderLoadingSkeleton() : (
        <>
        <div className="flex justify-between items-center p-3 md:p-4 border rounded-lg bg-card mb-6 shadow-md">
            {currentContent.steps.map((s, i) => (
                <React.Fragment key={s}>
                    <div className={cn("flex flex-col items-center text-center transition-all duration-300", step >= i + 1 ? "text-primary font-semibold" : "text-muted-foreground")}>
                        <div className={cn(
                            "w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center border-2 text-sm md:text-base",
                            step > i + 1 ? "bg-primary text-primary-foreground border-primary" : (step === i + 1 ? "border-primary scale-110" : "border-muted-foreground/50")
                        )}>
                            {step > i + 1 ? <CheckCircle className="h-4 w-4"/> : i + 1}
                        </div>
                        <span className="text-xs mt-1.5">{s}</span>
                    </div>
                    {i < 3 && <div className={cn("flex-1 h-0.5 mx-1 md:mx-2 transition-all duration-500", step > i + 1 ? "bg-primary" : "bg-muted-foreground/20")}></div>}
                </React.Fragment>
            ))}
        </div>

        {step === 1 && (
          <Card className="shadow-lg glassy-card">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><Palette className="h-6 w-6"/>{currentContent.tripDetailsTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div>
                <Label htmlFor="route" className="font-semibold text-base">{currentContent.selectRouteLabel}</Label>
                <Select value={selectedRouteValue} onValueChange={setSelectedRouteValue} required>
                  <SelectTrigger id="route" className="text-base py-3 rounded-lg" aria-label={currentContent.selectRouteLabel}>
                    <SelectValue placeholder={currentContent.selectRoutePlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {longDistanceRoutes.map(route => (
                      <SelectItem key={route.value} value={route.value} className="text-base py-2">
                        {route.label} (Ksh {route.price.toLocaleString()} {language === 'KSW' ? 'kwa kiti' : 'per seat'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="date" className="font-semibold text-base">{currentContent.selectDateLabel}</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal text-base py-3 rounded-lg",
                          !selectedDate && "text-muted-foreground"
                        )}
                        aria-label={`${currentContent.selectDateLabel}: ${selectedDate ? format(selectedDate, "PPP") : currentContent.pickDate}`}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>{currentContent.pickDate}</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-card border-primary" side="bottom" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                        disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="time" className="font-semibold text-base">{currentContent.selectTimeLabel}</Label>
                  <Select value={selectedTime} onValueChange={setSelectedTime} required>
                    <SelectTrigger id="time" className="text-base py-3 rounded-lg" aria-label={currentContent.selectTimeLabel}>
                      <SelectValue placeholder={currentContent.selectTimePlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map(time => (
                        <SelectItem key={time} value={time} className="text-base py-2">{time}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
               <div>
                <Label htmlFor="numSeats" className="font-semibold text-base">{currentContent.numSeatsLabel}</Label>
                <div className="flex items-center gap-2 mt-1">
                    <Button type="button" variant="outline" size="icon" onClick={() => setNumberOfSeatsToBook(Math.max(1, numberOfSeatsToBook - 1))} aria-label="Decrease number of seats" className="rounded-full border-primary text-primary hover:bg-primary/10"><MinusCircle/></Button>
                    <Input id="numSeats" type="number" value={numberOfSeatsToBook} readOnly className="w-16 text-center text-lg font-bold rounded-lg border-2 border-primary bg-transparent focus:ring-0" aria-label={currentContent.numSeatsLabel}/>
                    <Button type="button" variant="outline" size="icon" onClick={() => setNumberOfSeatsToBook(numberOfSeatsToBook + 1)} aria-label="Increase number of seats" className="rounded-full border-primary text-primary hover:bg-primary/10"><PlusCircle/></Button>
                </div>
              </div>
              {currentRouteDetails && currentRouteDetails.stops.length > 0 && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <h4 className="font-semibold mb-1 text-primary">{currentContent.majorStops}</h4>
                  <p className="text-sm text-muted-foreground">{currentRouteDetails.stops.join(' → ')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card className="shadow-lg glassy-card">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><Armchair className="h-6 w-6"/>{currentContent.selectSeatsTitle}</CardTitle>
              <CardDescription>{currentContent.selectSeatsDescription(numberOfSeatsToBook, pricePerSeat)}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 pt-4">
                <div className="p-2 md:p-4 border-2 border-primary/30 rounded-lg bg-background/30 overflow-x-auto shadow-inner">
                    <div className="inline-block min-w-full space-y-1 md:space-y-1.5 py-2">
                      <div className="text-center mb-2 font-semibold text-sm text-muted-foreground">{currentContent.frontOfBus}</div>
                        {renderSeats()}
                      <div className="text-center mt-2 pt-2 border-t border-dashed font-semibold text-sm text-muted-foreground">{currentContent.backOfBus}</div>
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm mt-2">
                    <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm border-2 border-primary bg-primary"></div> {currentContent.seatLegendSelected}</div>
                    <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm border-2 border-input bg-popover"></div> {currentContent.seatLegendAvailable}</div>
                    <div className="flex items-center gap-1.5"><div className="w-4 h-4 rounded-sm border-2 border-muted-foreground/30 bg-muted/70 opacity-60 blur-[1px]"></div> {currentContent.seatLegendBooked}</div>
                </div>
              {selectedSeatsList.length > 0 && <p className="font-semibold text-lg text-center">{currentContent.youSelectedSeats} <span className="text-primary">{selectedSeatsList.join(", ")}</span></p>}
              
              {selectedSeatsList.length > 0 && (
                <div className="space-y-3 mt-4 border-t border-primary/20 pt-4">
                  <h4 className="font-semibold text-lg text-primary">{currentContent.enterPassengerNames}</h4>
                  {selectedSeatsList.map(seatId => {
                    const seat = seats.find(s => s.id === seatId);
                    return (
                      <div key={seatId} className="flex items-center gap-2">
                        <Label htmlFor={`passengerName-${seatId}`} className="w-24 text-base">{currentContent.seatLabel} {seatId}:</Label>
                        <Input 
                          id={`passengerName-${seatId}`} 
                          placeholder={currentContent.passengerNamePlaceholder} 
                          value={seat?.passengerName || ""}
                          onChange={(e) => handlePassengerNameChange(seatId, e.target.value)}
                          className="text-base py-2.5 px-3 rounded-md border-2 focus:border-primary focus:ring-primary"
                          aria-label={`${currentContent.passengerNamePlaceholder} for seat ${seatId}`}
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              {selectedSeatsList.length !== numberOfSeatsToBook && (
                <Alert variant="default" className="border-yellow-500 text-yellow-700 dark:border-yellow-400 dark:text-yellow-300 bg-yellow-500/10">
                  <AlertCircle className="h-5 w-5 !text-yellow-600 dark:!text-yellow-400" />
                  <AlertTitle className="font-semibold">{currentContent.actionNeededTitle}</AlertTitle>
                  <AlertDescription>{currentContent.actionNeededDescription(numberOfSeatsToBook)}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}

        {step === 3 && (
           <Card className="shadow-lg glassy-card">
             <CardHeader>
               <CardTitle className="font-headline text-2xl text-primary flex items-center gap-2"><CreditCard className="h-6 w-6"/>{currentContent.confirmPayTitle}</CardTitle>
               <CardDescription>{currentContent.confirmPayDescription(totalPrice)}</CardDescription>
             </CardHeader>
             <CardContent className="space-y-4 pt-4">
                <div className="p-4 border border-primary/30 rounded-lg bg-background/30 space-y-2">
                    <p><strong>{currentContent.route}</strong> {currentRouteDetails?.label}</p>
                    <p><strong>{currentContent.date}</strong> {selectedDate ? format(selectedDate, "PPP") : 'N/A'}</p>
                    <p><strong>{currentContent.time}</strong> {selectedTime}</p>
                    <p><strong>{currentContent.seats}</strong> <span className="font-bold text-primary">{selectedSeatsList.join(", ")}</span></p>
                    {selectedSeatsList.length > 0 && (
                      <div>
                        <strong>{currentContent.passengers}</strong>
                        <ul className="list-disc list-inside ml-4 text-sm">
                          {selectedSeatsList.map(seatId => {
                            const seat = seats.find(s => s.id === seatId);
                            return <li key={seatId}>{seat?.passengerName || (language === 'KSW' ? "Mwenyewe" : "Self")} ({currentContent.seatLabel} {seatId})</li>;
                          })}
                        </ul>
                      </div>
                    )}
                </div>
                <p className="font-bold text-2xl text-center text-primary mt-4">{language === 'KSW' ? 'Jumla ya Kulipa' : 'Total Amount'}: Ksh {totalPrice.toLocaleString()}</p>
                <Alert className="bg-green-500/10 border-green-500">
                  <AlertCircle className="h-5 w-5 !text-green-600" />
                  <AlertTitle className="font-semibold text-green-700">{currentContent.mpesaPaymentTitle}</AlertTitle>
                  <AlertDescription className="text-green-800/90">
                    {currentContent.mpesaPaymentDescription(totalPrice, selectedSeatsList[0])}
                  </AlertDescription>
                </Alert>
             </CardContent>
           </Card>
        )}

        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={proceedToPreviousStep} 
            className={cn("transition-transform hover:scale-105 py-3 px-6 text-base rounded-lg", (step <= 1 || step >=4) && "invisible")}
          >
            {currentContent.back}
          </Button>
          
          {step < 3 && 
            <Button 
              onClick={proceedToNextStep} 
              disabled={
                isLoading ||
                (step === 1 && (!selectedRouteValue || !selectedDate || !selectedTime || numberOfSeatsToBook <= 0)) || 
                (step === 2 && selectedSeatsList.length !== numberOfSeatsToBook) ||
                (step === 2 && selectedSeatsList.length > 0 && selectedSeatsList.some(id => !seats.find(s=>s.id === id)?.passengerName?.trim()))
              } 
              className="transition-transform hover:scale-105 py-3 px-6 text-base rounded-lg btn-glow-primary ml-auto"
            >
              {currentContent.next} <ArrowRight className="ml-2 h-4 w-4"/>
            </Button>
          }
          {step === 3 && 
            <Button 
              onClick={proceedToNextStep} 
              className="transition-transform hover:scale-105 py-3 px-6 text-base rounded-lg bg-green-600 hover:bg-green-700 text-white btn-glow-accent ml-auto"
            >
              {currentContent.confirmPayButton}
            </Button>
          }
        </div>
        </>
        )}
      </div>
    </AppLayout>
  );
}
