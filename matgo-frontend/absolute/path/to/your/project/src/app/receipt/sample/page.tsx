
"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MatGoIcon from "@/components/icons/MatGoIcon";
import { Printer, Download, Share2, Ticket, User, Star, MapPin, CalendarDays, ClockIcon, Bus, Sparkles, MessageCircle } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/contexts/LanguageContext";

interface ReceiptDetails {
  tripId: string;
  routeDisplayName: string;
  date: string;
  time: string;
  seats: string;
  price: string;
  passengerNames: string[];
  paymentMethod: string;
  vehicleInfo: string;
  vehicleImage: string;
  vehicleImageHint: string;
  boardingCode: string;
  saccoContact: string;
  emergencyContacts: { name: string; phone: string }[];
  tripType: string;
  driver: { name: string; photoUrl: string; rating: number; sacco: string };
  conductor: { name: string; photoUrl: string; rating: number; sacco: string };
}

export default function ReceiptPage() {
  const searchParams = useSearchParams();
  const [receipt, setReceipt] = useState<ReceiptDetails | null>(null);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const { toast } = useToast();
  const { language } = useLanguage();

  const content = {
    ENG: {
        eTicketTitle: "MatGo E-Ticket & Receipt",
        thankYouMessage: "Thank you for choosing MatGo! Safiri Salama.",
        roadtripDepositConfirmed: "Your Roadtrip Deposit is Confirmed!",
        tripIdLabel: "Trip ID:",
        tripTypeBadge: "Trip Type:",
        passengerLabel: "Passenger(s)",
        routeLabel: "Route",
        dateTimeLabel: "Date & Time",
        seatLabel: "Seat(s)",
        vehicleLabel: "Vehicle / Matatu",
        paymentMethodLabel: "Payment Method",
        boardingInfoTitle: "Boarding Information",
        boardingCodeLabel: "Boarding Code",
        qrHelpText: "Present this QR code or the code above to the conductor for boarding.",
        crewInfoTitle: "Crew Information",
        driverLabel: "Driver",
        conductorLabel: "Conductor",
        viewProfileLink: "View Profile",
        totalPaidLabel: "Total Amount Paid",
        depositPaidLabel: "Deposit Amount Paid",
        depositBalanceNote: "Balance payable as per agreement.",
        rateTripTitle: "Rate Your Trip!",
        rateTripDescription: (tripId: string) => `Help us improve by sharing your experience for trip ${tripId}.`,
        feedbackPlaceholder: "Add comments about your trip, the crew, or the vehicle...",
        submitFeedbackButton: "Submit Feedback",
        feedbackSubmittedToast: "Rating Submitted!",
        feedbackSubmittedToastDesc: (tripId: string) => `Thank you for your feedback on trip ${tripId}.`,
        receiptFooterText1: "This is an official digital receipt. Keep it for your records.",
        receiptFooterIssued: "Issued:",
        receiptFooterContact: "For inquiries, contact MatGo support at",
        receiptFooterOrCall: "or call",
        saccoContactLabel: "SACCO Contact:",
        emergencyContactsLabel: "Emergency Contacts:",
        printButton: "Print Receipt",
        downloadButton: "Download PDF",
        shareButton: "Share E-Ticket",
        downloadStartedToast: "Download Started",
        downloadStartedToastDesc: "Your PDF receipt is being generated (simulated).",
        sharedSuccessToast: "Shared Successfully!",
        shareFailedToast: "Share Failed",
        shareFailedToastDesc: "Could not share the receipt.",
        shareNotSupportedToast: "Share Not Supported",
        shareNotSupportedToastDesc: "Your browser doesn't support sharing, or no receipt data.",
        loadingText: "Loading Your E-Ticket...",
    },
    KSW: {
        eTicketTitle: "Tikiti ya Kielektroniki na Risiti ya MatGo",
        thankYouMessage: "Asante kwa kuchagua MatGo! Safiri Salama.",
        roadtripDepositConfirmed: "Amana yako ya Roadtrip Imethibitishwa!",
        tripIdLabel: "Kitambulisho cha Safari:",
        tripTypeBadge: "Aina ya Safari:",
        passengerLabel: "Abiria",
        routeLabel: "Njia",
        dateTimeLabel: "Tarehe na Wakati",
        seatLabel: "Kiti/Viti",
        vehicleLabel: "Gari / Matatu",
        paymentMethodLabel: "Njia ya Malipo",
        boardingInfoTitle: "Taarifa za Kupanda",
        boardingCodeLabel: "Msimbo wa Kupanda",
        qrHelpText: "Onyesha msimbo huu wa QR au msimbo hapo juu kwa kondakta ili kupanda.",
        crewInfoTitle: "Taarifa za Wahudumu",
        driverLabel: "Dereva",
        conductorLabel: "Kondakta",
        viewProfileLink: "Tazama Profaili",
        totalPaidLabel: "Jumla Iliyolipwa",
        depositPaidLabel: "Amana Iliyolipwa",
        depositBalanceNote: "Salio linalosalia litalipwa kulingana na makubaliano.",
        rateTripTitle: "Kadiria Safari Yako!",
        rateTripDescription: (tripId: string) => `Tusaidie kuboresha kwa kushiriki uzoefu wako kwa safari ${tripId}.`,
        feedbackPlaceholder: "Ongeza maoni kuhusu safari yako, wahudumu, au gari...",
        submitFeedbackButton: "Tuma Maoni",
        feedbackSubmittedToast: "Ukadiriaji Umetumwa!",
        feedbackSubmittedToastDesc: (tripId: string) => `Asante kwa maoni yako kuhusu safari ${tripId}.`,
        receiptFooterText1: "Hii ni risiti rasmi ya kidijitali. Itunze kwa kumbukumbu zako.",
        receiptFooterIssued: "Imetolewa:",
        receiptFooterContact: "Kwa maswali, wasiliana na usaidizi wa MatGo kwa",
        receiptFooterOrCall: "au piga simu",
        saccoContactLabel: "Anwani ya SACCO:",
        emergencyContactsLabel: "Anwani za Dharura:",
        printButton: "Chapisha Risiti",
        downloadButton: "Pakua PDF",
        shareButton: "Shiriki Tikiti ya Kielektroniki",
        downloadStartedToast: "Upakuaji Umeanza",
        downloadStartedToastDesc: "Risiti yako ya PDF inatayarishwa (mfumo).",
        sharedSuccessToast: "Imeshirikiwa kwa Mafanikio!",
        shareFailedToast: "Kushiriki Kumeshindwa",
        shareFailedToastDesc: "Haikuweza kushiriki risiti.",
        shareNotSupportedToast: "Kushiriki Hakutumiki",
        shareNotSupportedToastDesc: "Kivinjari chako hakitumii kushiriki, au hakuna data ya risiti.",
        loadingText: "Inapakia Tikiti Yako ya Kielektroniki...",
    }
  };
  const currentContent = content[language];


  useEffect(() => {
    const routeParam = searchParams.get('route') || "custom-route";
    const dateParam = searchParams.get('date');
    const timeParam = searchParams.get('time');
    const seatsParam = searchParams.get('seats') || "N/A";
    const priceParam = searchParams.get('price');
    const passengersParam = searchParams.get('passengers')?.split(',') || [language === 'KSW' ? "Abiria" : "Passenger"];
    const paymentMethodParam = searchParams.get('paymentMethod') || (language === 'KSW' ? "M-Pesa (Mfumo)" : "M-Pesa (Simulated)");
    const vehicleInfoParam = searchParams.get('vehicleInfo') || (language === 'KSW' ? "Taarifa ya Gari" : "Vehicle Info");
    const vehicleImageParam = searchParams.get('vehicleImage') || "/images/receipt/default_bus.png";
    const vehicleImageHintParam = searchParams.get('vehicleImageHint') || "bus image";
    const saccoNameParam = searchParams.get('sacco') || "MatGo SACCO";
    const tripTypeParam = searchParams.get('tripType') || (language === 'KSW' ? "Safari ya Kila Siku" : "Daily Commute");
    
    setReceipt({
        tripId: `MG-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`,
        routeDisplayName: routeParam.replace(/-/g, ' '),
        date: dateParam ? new Date(dateParam).toLocaleDateString(language === 'KSW' ? 'sw-KE' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : "N/A",
        time: timeParam || "N/A",
        seats: seatsParam,
        price: `Ksh ${parseFloat(priceParam || "0").toLocaleString()}`,
        passengerNames: passengersParam,
        paymentMethod: paymentMethodParam, 
        vehicleInfo: vehicleInfoParam,
        vehicleImage: vehicleImageParam,
        vehicleImageHint: vehicleImageHintParam,
        boardingCode: `QR-${Math.random().toString(16).substring(2, 8).toUpperCase()}`,
        saccoContact: `${saccoNameParam} Support: 0712 345 678`,
        emergencyContacts: [ 
            {name: language === 'KSW' ? "Polisi" : "Police", phone: "999"}, 
            {name: language === 'KSW' ? "Ambulensi" : "Ambulance", phone: "112"}
        ],
        tripType: tripTypeParam.split("_").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" "),
        driver: { name: `${language === 'KSW' ? "John 'Mwendokasi'" : "John 'Flash'"} Driver`, photoUrl: "/avatars/crew_driver.png", rating: 4.7, sacco: saccoNameParam},
        conductor: { name: `${language === 'KSW' ? "Jane 'Tabasamu'" : "Jane 'Smiles'"} Conductor`, photoUrl: "/avatars/crew_conductor.png", rating: 4.5, sacco: saccoNameParam},
    });
  }, [searchParams, language]);

  const handlePrint = () => window.print();
  const handleDownload = () => toast({title: currentContent.downloadStartedToast, description: currentContent.downloadStartedToastDesc});
  const handleShare = async () => {
    if (navigator.share && receipt) {
        try {
            await navigator.share({
                title: `MatGo E-Ticket: ${receipt.routeDisplayName}`,
                text: `My MatGo E-Ticket for ${receipt.routeDisplayName} on ${receipt.date}. Trip ID: ${receipt.tripId}`,
                url: window.location.href,
            });
            toast({title: currentContent.sharedSuccessToast});
        } catch (error) {
            toast({title: currentContent.shareFailedToast, description: currentContent.shareFailedToastDesc, variant: "destructive"});
        }
    } else {
        toast({title: currentContent.shareNotSupportedToast, description: currentContent.shareNotSupportedToastDesc});
    }
  };

  const handleRatingSubmit = () => {
    if (!receipt) return;
    toast({title: currentContent.feedbackSubmittedToast, description: currentContent.feedbackSubmittedToastDesc(receipt.tripId), className: "bg-green-500 text-white"});
  };

  if (!receipt) {
    return <AppLayout><div className="text-center p-10 font-headline text-2xl text-primary animate-pulse">{currentContent.loadingText}</div></AppLayout>;
  }

  const isRoadtripDeposit = receipt.tripType.toLowerCase().includes("roadtrip") && receipt.price.toLowerCase().includes("deposit");

  return (
    <AppLayout>
      <div className="space-y-6 md:space-y-8 animate-fade-in max-w-3xl mx-auto print:mx-0 print:max-w-none pb-10">
        <Card className="shadow-xl print:shadow-none print:border-none glassy-card overflow-hidden">
          <CardHeader className="text-center border-b border-primary/20 pb-6 bg-gradient-to-br from-primary/10 to-accent/10 dark:from-primary/5 dark:to-accent/5 p-6 relative">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <Sparkles className="h-24 w-24 text-yellow-400 confetti-burst opacity-80" />
                <Sparkles className="h-32 w-32 text-primary confetti-burst opacity-70 animation-delay-[200ms]" />
                <Sparkles className="h-16 w-16 text-accent confetti-burst opacity-90 animation-delay-[400ms]" />
            </div>
            <MatGoIcon className="mx-auto h-16 w-16 text-primary mb-2 nganya-flash" />
            <CardTitle className="font-headline text-3xl md:text-4xl text-primary">{currentContent.eTicketTitle}</CardTitle>
            <CardDescription className="text-base">
              {isRoadtripDeposit ? currentContent.roadtripDepositConfirmed : currentContent.thankYouMessage}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6 p-4 md:p-6">
            <div className="text-center mb-6 relative">
                <Ticket className="mx-auto h-16 w-16 text-primary opacity-30 absolute -top-2 -left-2 transform -rotate-12" />
                <p className="font-mono text-lg text-muted-foreground mt-1">{currentContent.tripIdLabel} <span className="font-bold text-accent">{receipt.tripId}</span></p>
                <Badge variant="outline" className="mt-2 text-sm border-primary text-primary">{receipt.tripType}</Badge>
            </div>

            <div className="border-2 border-primary/30 rounded-xl p-4 md:p-6 space-y-4 bg-background/30 shadow-inner">
                <Image src={receipt.vehicleImage} alt={receipt.vehicleInfo} data-ai-hint={receipt.vehicleImageHint} width={700} height={200} className="w-full h-40 md:h-48 object-cover rounded-lg shadow-md mb-4"/>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-base">
                  <div><Label className="text-sm text-muted-foreground">{currentContent.passengerLabel}</Label><p className="font-semibold text-lg">{receipt.passengerNames.join(", ")}</p></div>
                  <div><Label className="text-sm text-muted-foreground">{currentContent.routeLabel}</Label><p className="font-semibold text-lg">{receipt.routeDisplayName}</p></div>
                  <div><Label className="text-sm text-muted-foreground">{currentContent.dateTimeLabel}</Label><p className="font-semibold"><CalendarDays className="inline h-4 w-4 mr-1 text-primary"/>{receipt.date} {language === 'KSW' ? 'saa' : 'at'} <ClockIcon className="inline h-4 w-4 mr-1 text-primary"/>{receipt.time}</p></div>
                  <div><Label className="text-sm text-muted-foreground">{currentContent.seatLabel}</Label><p className="font-semibold text-lg text-primary">{receipt.seats}</p></div>
                  <div><Label className="text-sm text-muted-foreground">{currentContent.vehicleLabel}</Label><p className="font-semibold"><Bus className="inline h-4 w-4 mr-1 text-primary"/>{receipt.vehicleInfo}</p></div>
                  <div><Label className="text-sm text-muted-foreground">{currentContent.paymentMethodLabel}</Label><p className="font-semibold">{receipt.paymentMethod}</p></div>
                </div>
            </div>

            <div className="border-t border-primary/20 pt-6 mt-6">
              <h3 className="font-headline text-xl md:text-2xl mb-4 text-primary">{currentContent.boardingInfoTitle}</h3>
              <div className="flex flex-col sm:flex-row items-center gap-6 p-4 border-2 border-accent/50 rounded-xl bg-accent/10 shadow-md">
                <Image src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(receipt.boardingCode + '|' + receipt.tripId)}`} alt="Boarding QR Code" width={150} height={150} data-ai-hint="qr code ticket" className="rounded-md border-2 border-white shadow-lg" />
                <div className="text-center sm:text-left">
                  <Label className="text-sm text-muted-foreground">{currentContent.boardingCodeLabel}</Label>
                  <p className="font-bold text-3xl text-accent tracking-wider">{receipt.boardingCode}</p>
                  <p className="text-xs text-muted-foreground mt-1">{currentContent.qrHelpText}</p>
                </div>
              </div>
            </div>

            <div className="border-t border-primary/20 pt-6 mt-6">
                <h3 className="font-headline text-xl md:text-2xl mb-4 text-primary">{currentContent.crewInfoTitle}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[receipt.driver, receipt.conductor].map((person, idx) => (
                        <Card key={idx} className="p-3 md:p-4 glassy-card border-transparent hover:border-primary/50 transition-all">
                            <CardHeader className="flex flex-row items-center gap-3 p-0">
                                <Avatar className="h-16 w-16 md:h-20 md:w-20 border-2 border-primary">
                                    <AvatarImage src={person.photoUrl} alt={person.name} data-ai-hint="profile person" />
                                    <AvatarFallback className="text-2xl bg-primary/20 text-primary">{person.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-lg md:text-xl font-semibold">{person.name} <span className="text-sm font-normal text-muted-foreground">({idx === 0 ? currentContent.driverLabel : currentContent.conductorLabel})</span></CardTitle>
                                    <CardDescription className="text-xs">{person.sacco}</CardDescription>
                                </div>
                            </CardHeader>
                            <CardContent className="p-0 mt-2">
                               <div className="flex items-center text-sm">
                                <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" /> {person.rating}/5.0
                                <Button variant="link" size="sm" className="ml-auto text-xs p-0 h-auto text-primary">{currentContent.viewProfileLink}</Button>
                               </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="border-t-2 border-primary/30 pt-6 mt-8 text-center bg-primary/5 p-6 rounded-xl shadow-inner">
              <Label className="text-lg text-muted-foreground">{isRoadtripDeposit ? currentContent.depositPaidLabel : currentContent.totalPaidLabel}</Label>
              <p className="font-bold text-4xl md:text-5xl text-primary mt-1 drop-shadow-md">{receipt.price}</p>
              {isRoadtripDeposit && <p className="text-sm text-muted-foreground mt-1">{currentContent.depositBalanceNote}</p>}
            </div>

            {!isRoadtripDeposit && (
              <Card className="mt-8 glassy-card border-accent/50">
                <CardHeader>
                  <CardTitle className="font-headline text-xl text-accent flex items-center gap-2"><MessageCircle className="h-5 w-5"/>{currentContent.rateTripTitle}</CardTitle>
                  <CardDescription>{currentContent.rateTripDescription(receipt.tripId)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-center gap-1">
                      {[1,2,3,4,5].map(star => (
                        <Star key={star} className={cn("h-8 w-8 cursor-pointer transition-all duration-150 ease-in-out hover:scale-125", rating >= star ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground hover:text-yellow-300")} onClick={() => setRating(star)}/>
                      ))}
                  </div>
                  <Textarea placeholder={currentContent.feedbackPlaceholder} value={feedback} onChange={(e) => setFeedback(e.target.value)} rows={3} className="rounded-lg text-base"/>
                  <Button onClick={handleRatingSubmit} className="w-full md:w-auto btn-glow-accent">{currentContent.submitFeedbackButton}</Button>
                </CardContent>
              </Card>
            )}
            
            <div className="mt-6 text-xs text-muted-foreground text-center border-t border-primary/20 pt-4">
              <p>{currentContent.receiptFooterText1} {currentContent.receiptFooterIssued} {new Date().toLocaleString(language === 'KSW' ? 'sw-KE' : 'en-GB')}</p>
              <p>{currentContent.receiptFooterContact} <a href="mailto:support@matgo.co.ke" className="text-primary hover:underline">support@matgo.co.ke</a> {currentContent.receiptFooterOrCall} <a href="tel:+254700000000"  className="text-primary hover:underline">+254 700 000 000</a>.</p>
              <p className="mt-2 font-semibold">{currentContent.saccoContactLabel} {receipt.saccoContact}</p>
              <p className="font-semibold">{currentContent.emergencyContactsLabel} {receipt.emergencyContacts.map(c => `${c.name} (${c.phone})`).join(', ')}</p>
            </div>

          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row justify-center gap-3 md:gap-4 mt-8 print:hidden">
          <Button onClick={handlePrint} variant="outline" size="lg" className="transition-transform hover:scale-105 text-base py-3 rounded-lg border-primary text-primary hover:bg-primary/10">
            <Printer className="mr-2 h-5 w-5" /> {currentContent.printButton}
          </Button>
          <Button onClick={handleDownload} size="lg" className="transition-transform hover:scale-105 text-base py-3 rounded-lg btn-glow-primary">
            <Download className="mr-2 h-5 w-5" /> {currentContent.downloadButton}
          </Button>
          <Button onClick={handleShare} variant="secondary" size="lg" className="transition-transform hover:scale-105 text-base py-3 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90">
            <Share2 className="mr-2 h-5 w-5" /> {currentContent.shareButton}
          </Button>
        </div>
      </div>
    </AppLayout>
  );
}
