
"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Camera, AlertCircle, CheckCircle, XCircle, DollarSign, Info, Bus, SmartphoneNfc, ArrowLeft, Edit, Search } from "lucide-react";
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Html5Qrcode, Html5QrcodeSupportedFormats, Html5QrcodeScannerState } from "html5-qrcode";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation"; 

interface ScannedBusDetails {
  id: string; 
  name?: string;
  route: string;
  fare: string;
  sacco: string;
  type: "Nganya" | "Bus" | "Minibus";
  image?: string;
  imageHint?: string;
}

const QR_READER_ELEMENT_ID = "qr-reader-element";

export default function ScanPage() {
  const [mode, setMode] = useState<"options" | "enterBusNumber" | "scanQr">("options");
  const [busNumberInput, setBusNumberInput] = useState<string>("");
  const [foundBusDetails, setFoundBusDetails] = useState<ScannedBusDetails | null>(null);
  const [manualEntryError, setManualEntryError] = useState<string | null>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [qrScannedBusDetails, setQrScannedBusDetails] = useState<ScannedBusDetails | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"mpesa" | "airtel" | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  
  const html5QrCodeInstanceRef = useRef<Html5Qrcode | null>(null);
  const readerContainerRendered = useRef(false);
  const { toast } = useToast();
  const { language } = useLanguage();
  const router = useRouter(); 

  const currentBusToPay = mode === 'enterBusNumber' ? foundBusDetails : qrScannedBusDetails;

  const fetchBusDetailsById = async (id: string): Promise<ScannedBusDetails | null> => {
    // In a real app, this would be an `async` function making a `fetch` request.
    // e.g., const response = await fetch(`/api/buses/${id}`);
    // For this prototype, we'll return null to simulate an empty DB.
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network latency
    return null;
  };

  const content = {
    ENG: {
      pageTitle: "Pay Your Fare",
      pageDescription: "Choose how you want to identify your bus and pay your fare quickly with MatGo!",
      enterBusOption: "Enter Bus Number to Pay",
      scanQrOption: "Scan QR to Pay",
      startScanning: "Start Scanning",
      cancelScan: "Cancel Scan",
      alignQrHelpText: "Align QR code within frame",
      cameraErrorTitle: "Camera Error",
      cameraErrorDesc: "Could not start camera. Please check permissions or try another browser.",
      noCameraTitle: "No Camera Found",
      noCameraDesc: "No camera detected on this device.",
      cameraAccessFailedTitle: "Camera Access Failed",
      cameraAccessFailedDesc: "Could not access camera list.",
      nganyaFoundToast: "Nganya Found!",
      nganyaFoundToastDesc: "Bus details retrieved. Ready to roll!",
      invalidQrTitle: "Invalid MatGo QR",
      invalidQrDesc: "QR code format is incorrect.",
      notMatGoQrTitle: "Not a MatGo QR",
      notMatGoQrDesc: "This QR code is not recognized by MatGo.",
      cameraAccessProblemTitle: "Camera Access Problem",
      cameraAccessProblemDesc: "Camera access was denied or no camera was found. Please check your browser/OS permissions and try again.",
      scanSuccessfulTitle: "Scan Successful!",
      scanSuccessfulDesc: "Details for the scanned Matatu:",
      vehicleDetails: (nameOrId: string, type: string) => `${nameOrId} (${type})`,
      routeLabel: "Route:",
      saccoLabel: "SACCO:",
      fareLabel: "Fare:",
      payWithMpesa: "Pay with M-Pesa",
      payWithAirtel: "Pay with Airtel Money",
      enterPhoneNumber: "Enter your Phone Number",
      proceedToPay: "Proceed to Pay",
      changePaymentMethod: "Change Method",
      paymentInitiatedTitle: "Payment Initiated (Simulated)",
      paymentInitiatedDesc: (method: string, fare: string, phone: string) => `${method} payment for Ksh ${fare} to ${phone} initiated. Check your phone.`,
      invalidPhoneTitle: "Invalid Phone Number",
      invalidPhoneDesc: "Please enter a valid phone number.",
      scanAgainButton: "Scan Again",
      invalidQrScannedTitle: "Invalid QR Code Scanned",
      invalidQrScannedDesc: "The scanned QR code is not a valid MatGo bus identifier. Please try again with an official MatGo QR code found on the bus.",
      howItWorksTitle: "How MatGo QR Scan Works",
      howItWorksSteps: [
        "Locate the MatGo QR code sticker inside or outside the bus/matatu.",
        "Tap \"Start Scanning\" and allow camera access if prompted.",
        "Point your camera at the QR code, ensuring it's well-lit and centered.",
        "Once scanned, verify bus details, route, and fare information shown on your screen.",
        "Choose your payment method (M-Pesa or Airtel Money).",
        "Enter your phone number and tap \"Proceed to Pay\".",
        "Your digital receipt/e-ticket will be generated instantly after successful payment. Show it to the conductor if requested."
      ],
      enterBusNumberTitle: "Enter Bus Details",
      enterBusNumberPlaceholder: "e.g., KDA 123X or Monalisa",
      findBusButton: "Find Bus",
      busNotFoundTitle: "Bus Not Found",
      busNotFoundDesc: "The bus identifier entered was not found in our system. Please check and try again, or scan the QR code.",
      tryAgainButton: "Try Again",
      backButton: "Back to Options",
      busDetailsFound: "Bus Details Found!",
    },
    KSW: {
      pageTitle: "Lipa Nauli Yako",
      pageDescription: "Chagua jinsi unavyotaka kutambua basi lako na ulipe nauli yako haraka na MatGo!",
      enterBusOption: "Weka Nambari ya Basi Kulipa",
      scanQrOption: "Skani QR Kulipa",
      startScanning: "Anza Kuskani",
      cancelScan: "Ghairi Kuskani",
      alignQrHelpText: "Panga msimbo wa QR ndani ya fremu",
      cameraErrorTitle: "Tatizo la Kamera",
      cameraErrorDesc: "Imeshindwa kuanzisha kamera. Tafadhali angalia ruhusa au jaribu kivinjari kingine.",
      noCameraTitle: "Hakuna Kamera Iliyopatikana",
      noCameraDesc: "Hakuna kamera iliyogunduliwa kwenye kifaa hiki.",
      cameraAccessFailedTitle: "Ufikiaji wa Kamera Umeshindwa",
      cameraAccessFailedDesc: "Imeshindwa kupata orodha ya kamera.",
      nganyaFoundToast: "Nganya Imepatikana!",
      nganyaFoundToastDesc: "Maelezo ya basi yamepatikana. Tayari kwa safari!",
      invalidQrTitle: "QR ya MatGo Si Sahihi",
      invalidQrDesc: "Muundo wa msimbo wa QR si sahihi.",
      notMatGoQrTitle: "Si QR ya MatGo",
      notMatGoQrDesc: "Msimbo huu wa QR hautambuliwi na MatGo.",
      cameraAccessProblemTitle: "Tatizo la Ufikiaji wa Kamera",
      cameraAccessProblemDesc: "Ufikiaji wa kamera ulikataliwa au hakuna kamera iliyopatikana. Tafadhali angalia ruhusa za kivinjari/OS yako na ujaribu tena.",
      scanSuccessfulTitle: "Uskani Umefaulu!",
      scanSuccessfulDesc: "Maelezo ya Matatu iliyoskaniwa:",
      vehicleDetails: (nameOrId: string, type: string) => `${nameOrId} (${type})`,
      routeLabel: "Njia:",
      saccoLabel: "SACCO:",
      fareLabel: "Nauli:",
      payWithMpesa: "Lipa na M-Pesa",
      payWithAirtel: "Lipa na Airtel Money",
      enterPhoneNumber: "Weka Nambari yako ya Simu",
      proceedToPay: "Endelea Kulipa",
      changePaymentMethod: "Badilisha Njia",
      paymentInitiatedTitle: "Malipo Yameanzishwa (Mfumo)",
      paymentInitiatedDesc: (method: string, fare: string, phone: string) => `Malipo ya ${method} ya Ksh ${fare} kwenda ${phone} yameanzishwa. Angalia simu yako.`,
      invalidPhoneTitle: "Nambari ya Simu Si Sahihi",
      invalidPhoneDesc: "Tafadhali weka nambari sahihi ya simu.",
      scanAgainButton: "Skani Tena",
      invalidQrScannedTitle: "Msimbo wa QR Ulioskaniwa Si Sahihi",
      invalidQrScannedDesc: "Msimbo wa QR ulioskaniwa si kitambulisho halali cha basi la MatGo. Tafadhali jaribu tena na msimbo rasmi wa QR wa MatGo unaopatikana kwenye basi.",
      howItWorksTitle: "Jinsi Skani ya QR ya MatGo Inavyofanya Kazi",
      howItWorksSteps: [
        "Tafuta kibandiko cha msimbo wa QR wa MatGo ndani au nje ya basi/matatu.",
        "Gusa \"Anza Kuskani\" na uruhusu ufikiaji wa kamera ukiombwa.",
        "Elekeza kamera yako kwenye msimbo wa QR, hakikisha ina mwanga wa kutosha na iko katikati.",
        "Baada ya kuskaniwa, hakiki maelezo ya basi, njia, na taarifa ya nauli inayoonyeshwa kwenye skrini yako.",
        "Chagua njia yako ya malipo (M-Pesa au Airtel Money).",
        "Weka nambari yako ya simu na gusa \"Endelea Kulipa\".",
        "Risiti/tikiti yako ya kielektroniki itatolewa papo hapo baada ya malipo kufaulu. Onyesha kwa kondakta ikiombwa."
      ],
      enterBusNumberTitle: "Weka Maelezo ya Basi",
      enterBusNumberPlaceholder: "k.m., KDA 123X au Monalisa",
      findBusButton: "Tafuta Basi",
      busNotFoundTitle: "Basi Halikupatikana",
      busNotFoundDesc: "Kitambulisho cha basi ulichoweka hakikupatikana kwenye mfumo wetu. Tafadhali angalia na ujaribu tena, au skani msimbo wa QR.",
      tryAgainButton: "Jaribu Tena",
      backButton: "Rudi kwa Chaguo",
      busDetailsFound: "Maelezo ya Basi Yamepatikana!",
    }
  };
  const currentContent = content[language];

  const cleanupScanner = () => {
    if (html5QrCodeInstanceRef.current) {
      try {
        const scannerState = html5QrCodeInstanceRef.current.getState();
        if (scannerState === Html5QrcodeScannerState.SCANNING || scannerState === Html5QrcodeScannerState.PAUSED) {
          html5QrCodeInstanceRef.current.stop();
        }
        html5QrCodeInstanceRef.current.clear();
      } catch (error) {
        console.warn("Error stopping or clearing scanner:", error);
      } finally {
        html5QrCodeInstanceRef.current = null;
      }
    }
  };

  useEffect(() => {
    if (mode === 'scanQr' && isScanning && readerContainerRendered.current) {
      cleanupScanner(); 

      const newScannerInstance = new Html5Qrcode(QR_READER_ELEMENT_ID, {
        formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE],
        verbose: false,
      });
      html5QrCodeInstanceRef.current = newScannerInstance;

      Html5Qrcode.getCameras()
        .then((cameras) => {
          if (cameras && cameras.length) {
            setHasCameraPermission(true);
            newScannerInstance.start(
              { facingMode: "environment" },
              { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
              (decodedText: string) => handleScanSuccess(decodedText),
              (errorMessage: string) => { /* console.log("QR Error:", errorMessage) */ }
            ).catch(err => {
              console.error("Error starting QR scanner:", err);
              setHasCameraPermission(false);
              setIsScanning(false);
              setMode("options"); 
              toast({ variant: "destructive", title: currentContent.cameraErrorTitle, description: currentContent.cameraErrorDesc });
            });
          } else {
            setHasCameraPermission(false);
            setIsScanning(false);
            setMode("options");
            toast({ variant: "destructive", title: currentContent.noCameraTitle, description: currentContent.noCameraDesc });
          }
        })
        .catch(err => {
          console.error("Error getting cameras:", err);
          setHasCameraPermission(false);
          setIsScanning(false);
          setMode("options");
          toast({ variant: "destructive", title: currentContent.cameraAccessFailedTitle, description: currentContent.cameraAccessFailedDesc });
        });
    }
    return () => {
      if (!isScanning && html5QrCodeInstanceRef.current) {
         cleanupScanner();
      }
    };
  }, [isScanning, mode, toast, currentContent]);
  
  useEffect(() => {
    if (mode === 'scanQr' && isScanning) {
        readerContainerRendered.current = true;
    } else {
        readerContainerRendered.current = false;
    }
  }, [isScanning, mode]);


  const triggerStartScanning = () => {
    setScannedData(null);
    setQrScannedBusDetails(null);
    setHasCameraPermission(null);
    setSelectedPaymentMethod(null);
    setPhoneNumber("");
    setIsScanning(true);
    setMode('scanQr');
  };

  const triggerStopScanning = () => {
    setIsScanning(false);
    cleanupScanner();
    setMode('options');
  };

  const handleScanSuccess = (data: string) => {
    setIsScanning(false); 
    cleanupScanner();
    setScannedData(data);
    
    // In a real app, you would fetch details from an API using the scanned data ID.
    // For now, we simulate this by parsing a structured string.
    if (data.startsWith("MATGO_BUS::")) {
      const parts = data.substring(12).split("_");
      if (parts.length >= 6) {
        setQrScannedBusDetails({
          id: parts[0],
          name: parts[1] === "N/A" ? undefined : parts[1].replace(/-/g, " "),
          route: parts[2].replace(/-/g, " "),
          fare: parts[3],
          sacco: parts[4].replace(/-/g, " "),
          type: parts[5] as ScannedBusDetails["type"] || "Bus",
          image: `/images/scan/bus_default.png`,
          imageHint: `${parts[5]} bus`,
        });
        toast({ title: currentContent.nganyaFoundToast, description: currentContent.nganyaFoundToastDesc, className: "bg-primary text-primary-foreground" });
      } else {
        setQrScannedBusDetails(null);
        toast({ variant: "destructive", title: currentContent.invalidQrTitle, description: currentContent.invalidQrDesc });
      }
    } else {
      setQrScannedBusDetails(null);
      toast({ variant: "destructive", title: currentContent.notMatGoQrTitle, description: currentContent.notMatGoQrDesc });
    }
  };

  const handleFindBus = async () => {
    setManualEntryError(null);
    const busIdToFind = busNumberInput.trim().toUpperCase();
    const found = await fetchBusDetailsById(busIdToFind); 
    if (found) {
      setFoundBusDetails(found);
       toast({ title: currentContent.busDetailsFound, description: currentContent.nganyaFoundToastDesc, className: "bg-primary text-primary-foreground" });
    } else {
      setFoundBusDetails(null);
      setManualEntryError(currentContent.busNotFoundDesc);
    }
  };

  const resetManualEntry = () => {
    setBusNumberInput("");
    setFoundBusDetails(null);
    setManualEntryError(null);
    setSelectedPaymentMethod(null);
    setPhoneNumber("");
  }

  const handleProceedToPay = () => {
    if (!currentBusToPay || !selectedPaymentMethod) return;

    if (!phoneNumber || !/^(07|01)\d{8}$/.test(phoneNumber)) {
      toast({ variant: "destructive", title: currentContent.invalidPhoneTitle, description: currentContent.invalidPhoneDesc });
      return;
    }
    
    // BACKEND INTEGRATION POINT
    // This is where you would call your backend API to trigger the STK push.
    // Example: fetch('/api/payments/initiate-booking-payment', { method: 'POST', body: JSON.stringify({ amount: currentBusToPay.fare, phone: phoneNumber }) })
    // The backend would then handle the secure call to the M-Pesa API.
    
    toast({ 
      title: currentContent.paymentInitiatedTitle, 
      description: currentContent.paymentInitiatedDesc(selectedPaymentMethod === "mpesa" ? "M-Pesa" : "Airtel Money", currentBusToPay.fare, phoneNumber),
      className: "bg-green-500 text-white"
    });
    
    const queryParams = new URLSearchParams({
      route: currentBusToPay.route,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(language === 'KSW' ? 'sw-KE' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
      seats: "N/A", 
      price: currentBusToPay.fare,
      passengers: localStorage.getItem('matgoUser') ? JSON.parse(localStorage.getItem('matgoUser')!).firstName : (language === 'KSW' ? "Abiria" : "Passenger"),
      paymentMethod: selectedPaymentMethod === 'mpesa' ? 'M-Pesa' : 'Airtel Money',
      vehicleInfo: currentBusToPay.name || currentBusToPay.id,
      vehicleImage: currentBusToPay.image || `/images/scan/bus_default.png`,
      vehicleImageHint: currentBusToPay.imageHint || `${currentBusToPay.type.toLowerCase()} bus`,
      sacco: currentBusToPay.sacco,
      tripType: language === 'KSW' ? "Nauli ya Moja kwa Moja" : "Instant Fare"
    }).toString();

    router.push(`/receipt/sample?${queryParams}`);
  };

  const renderPaymentFlow = (busToPay: ScannedBusDetails) => (
    <Card className="mt-6 text-left p-4 md:p-6 bg-primary/5 border border-primary/30 rounded-xl glassy-card">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-2xl text-primary flex items-center gap-2"><CheckCircle className="h-7 w-7 text-green-500"/> {currentContent.busDetailsFound}</CardTitle>
        <CardDescription>{currentContent.scanSuccessfulDesc}</CardDescription>
      </CardHeader>
      <CardContent className="p-0 space-y-3">
        <div className="flex items-center gap-2"> <Bus className="h-5 w-5 text-primary"/> <strong>{currentContent.vehicleDetails(busToPay.name || busToPay.id, busToPay.type)}</strong></div>
        <p><strong>{currentContent.routeLabel}</strong> {busToPay.route}</p>
        <p><strong>{currentContent.saccoLabel}</strong> {busToPay.sacco}</p>
        <p className="text-2xl font-bold text-accent"><strong>{currentContent.fareLabel}</strong> Ksh {busToPay.fare}</p>
        
        {!selectedPaymentMethod ? (
          <div className="mt-6 space-y-3">
            <h3 className="font-semibold text-lg text-center text-primary">{language === 'KSW' ? 'Chagua Njia ya Malipo:' : 'Select Payment Method:'}</h3>
            <Button onClick={() => setSelectedPaymentMethod("mpesa")} size="lg" className="w-full text-lg py-3 rounded-lg bg-[#00A34A] hover:bg-[#00A34A]/90 text-white">
              <SmartphoneNfc className="mr-2 h-5 w-5" /> {currentContent.payWithMpesa}
            </Button>
            <Button onClick={() => setSelectedPaymentMethod("airtel")} size="lg" className="w-full text-lg py-3 rounded-lg bg-[#F02D2E] hover:bg-[#F02D2E]/90 text-white">
              <SmartphoneNfc className="mr-2 h-5 w-5" /> {currentContent.payWithAirtel}
            </Button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <div>
              <Label htmlFor="phoneNumber" className="font-semibold text-base">{currentContent.enterPhoneNumber}</Label>
              <Input id="phoneNumber" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} placeholder="07XX XXX XXX or 01XX XXX XXX" className="mt-1 text-base py-3 rounded-lg border-2 focus:border-primary focus:ring-primary"/>
            </div>
            <Button onClick={handleProceedToPay} size="lg" className="w-full text-lg py-3 rounded-lg btn-glow-accent">
              <DollarSign className="mr-2 h-5 w-5"/> {currentContent.proceedToPay}
            </Button>
            <Button variant="outline" onClick={() => {setSelectedPaymentMethod(null); setPhoneNumber("");}} className="w-full text-base py-2.5 rounded-lg border-primary text-primary hover:bg-primary/10">
              <ArrowLeft className="mr-2 h-4 w-4" /> {currentContent.changePaymentMethod}
            </Button>
          </div>
        )}

        <div className="mt-6 border-t border-primary/20 pt-4">
          <Button size="lg" variant="outline" onClick={() => { setMode("options"); resetManualEntry(); setQrScannedBusDetails(null); setScannedData(null); }} className="w-full text-lg py-3 rounded-lg border-primary text-primary hover:bg-primary/10">
            <ArrowLeft className="mr-2 h-5 w-5"/> {currentContent.backButton}
          </Button>
        </div>
      </CardContent>
    </Card>
  );


  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <Card className="shadow-xl glassy-card">
          <CardHeader className="p-6">
            <CardTitle className="font-headline text-3xl md:text-4xl text-primary flex items-center gap-3">
              <DollarSign className="h-10 w-10" /> {currentContent.pageTitle}
            </CardTitle>
            <CardDescription className="text-base mt-1">
              {currentContent.pageDescription}
            </CardDescription>
          </CardHeader>
        </Card>

        {mode === 'options' && (
          <Card className="shadow-lg glassy-card">
            <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <Button size="xl" onClick={() => { resetManualEntry(); setMode('enterBusNumber');}} className="h-auto py-8 md:py-12 text-xl md:text-2xl flex-col gap-2 rounded-lg btn-glow-primary transform hover:scale-105">
                <Edit className="h-8 w-8 mb-2" /> {currentContent.enterBusOption}
              </Button>
              <Button size="xl" onClick={triggerStartScanning} className="h-auto py-8 md:py-12 text-xl md:text-2xl flex-col gap-2 rounded-lg btn-glow-primary transform hover:scale-105">
                <QrCode className="h-8 w-8 mb-2" /> {currentContent.scanQrOption}
              </Button>
            </CardContent>
          </Card>
        )}

        {mode === 'enterBusNumber' && !foundBusDetails && (
          <Card className="shadow-lg glassy-card">
            <CardHeader><CardTitle className="font-headline text-2xl text-primary">{currentContent.enterBusNumberTitle}</CardTitle></CardHeader>
            <CardContent className="pt-2 space-y-4">
              <div>
                <Label htmlFor="busNumberInput" className="font-semibold text-base">{language === 'KSW' ? 'Nambari ya Basi/Jina la Meli' : 'Bus Number Plate / Fleet Name'}</Label>
                <Input id="busNumberInput" value={busNumberInput} onChange={(e) => setBusNumberInput(e.target.value)} placeholder={currentContent.enterBusNumberPlaceholder} className="mt-1 text-base py-3 rounded-lg"/>
              </div>
              {manualEntryError && (<Alert variant="destructive"><AlertCircle className="h-4 w-4" /><AlertTitle>{currentContent.busNotFoundTitle}</AlertTitle><AlertDescription>{manualEntryError}</AlertDescription></Alert>)}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => { setMode("options"); resetManualEntry(); }} variant="outline" className="w-full sm:w-auto text-base py-3 rounded-lg"><ArrowLeft className="mr-2 h-5 w-5"/> {currentContent.backButton}</Button>
                <Button onClick={handleFindBus} className="w-full sm:w-auto text-base py-3 rounded-lg btn-glow-primary"><Search className="mr-2 h-5 w-5"/> {currentContent.findBusButton}</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {mode === 'enterBusNumber' && foundBusDetails && renderPaymentFlow(foundBusDetails)}

        {mode === 'scanQr' && (
          <Card className="shadow-lg glassy-card">
            <CardContent className="pt-6 text-center">
              {isScanning && (
                <div className="flex flex-col items-center">
                  <div id={QR_READER_ELEMENT_ID} className={cn("w-full max-w-md mx-auto aspect-square bg-muted/30 rounded-xl overflow-hidden relative border-2 border-dashed border-primary/30")}>
                    <div className="absolute inset-2 border-4 border-primary/50 rounded-lg pointer-events-none animate-pulse"></div>
                    <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white bg-black/50 px-3 py-1 rounded-md">{currentContent.alignQrHelpText}</p>
                  </div>
                  <Button variant="outline" onClick={triggerStopScanning} className="mt-4 text-base py-2.5 rounded-lg">{currentContent.cancelScan}</Button>
                </div>
              )}
              
              {hasCameraPermission === false && !isScanning && (<Alert variant="destructive" className="mt-4 text-left"><AlertCircle className="h-5 w-5" /><AlertTitle>{currentContent.cameraAccessProblemTitle}</AlertTitle><AlertDescription>{currentContent.cameraAccessProblemDesc}<Button variant="link" onClick={() => setMode("options")} className="p-0 h-auto ml-1 text-destructive hover:underline">{currentContent.backButton}</Button></AlertDescription></Alert>)}
              {qrScannedBusDetails && !isScanning && renderPaymentFlow(qrScannedBusDetails)}
              {scannedData && !qrScannedBusDetails && !isScanning && (<Alert variant="destructive" className="mt-6 text-left"><XCircle className="h-5 w-5" /><AlertTitle>{currentContent.invalidQrScannedTitle}</AlertTitle><AlertDescription>{currentContent.invalidQrScannedDesc}<Button variant="link" onClick={triggerStartScanning} className="p-0 h-auto ml-1 text-destructive hover:underline">{currentContent.scanAgainButton}</Button><Button variant="link" onClick={() => setMode("options")} className="p-0 h-auto ml-2 text-muted-foreground hover:underline">{currentContent.backButton}</Button></AlertDescription></Alert>)}
            </CardContent>
          </Card>
        )}
        
        {mode === 'scanQr' && (
          <Card className="shadow-md border-accent/30 glassy-card">
            <CardHeader><CardTitle className="font-headline text-xl text-accent flex items-center gap-2"><Info className="h-5 w-5"/>{currentContent.howItWorksTitle}</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {currentContent.howItWorksSteps.map((step, index) => <p key={index}>• {step}</p>)}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}

    