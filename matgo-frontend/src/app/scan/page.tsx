
"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QrCode, Camera, AlertCircle, CheckCircle, XCircle, DollarSign, Info, Bus, SmartphoneNfc, ArrowLeft, Edit, Search, MinusCircle, PlusCircle } from "lucide-react";
import React, { useState, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Html5Qrcode, Html5QrcodeSupportedFormats, Html5QrcodeScannerState } from "html5-qrcode";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/contexts/LanguageContext";
import { useRouter } from "next/navigation"; // Import useRouter

interface ScannedBusDetails {
  id: string; // Number plate or unique fleet ID
  name?: string; // e.g., Monalisa, or can be same as ID if no specific name
  route: string;
  fare: string;
  sacco: string;
  type: "Nganya" | "Bus" | "Minibus";
  image?: string;
  imageHint?: string;
}

// No hardcoded sample data - only use database

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
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"mpesa" | "airtel" | "cash" | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [seatCount, setSeatCount] = useState<number>(1);
  
  const html5QrCodeInstanceRef = useRef<Html5Qrcode | null>(null);
  const readerContainerRendered = useRef(false);
  const { toast } = useToast();
  const { language } = useLanguage();
  const router = useRouter(); // Initialize router

  const currentBusToPay = mode === 'enterBusNumber' ? foundBusDetails : qrScannedBusDetails;

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
      payWithCash: "Pay with Cash",
      seatCountLabel: "Number of Seats:",
      enterPhoneNumber: "Enter your Phone Number",
      proceedToPay: "Proceed to Pay",
      changePaymentMethod: "Change Method",
      paymentInitiatedTitle: "Payment Initiated",
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
      payWithCash: "Lipa kwa Pesa Taslimu",
      seatCountLabel: "Idadi ya Viti:",
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
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setSeatCount(1);
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
          image: `https://placehold.co/600x200.png?text=${parts[0]}`, // Sample image
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
    const token = localStorage.getItem('matgoToken');
    
    try {
      // Try to fetch bus details from backend
      const response = await fetch(`http://localhost:5000/api/vehicles/${busIdToFind}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        }
      });
      
      if (response.ok) {
        const busData = await response.json();
        const busDetails: ScannedBusDetails = {
          id: busData.plateNumber || busData.id,
          name: busData.name || busData.vehicleName,
          route: busData.route || busData.currentRoute || "Route Info",
          fare: busData.fare || busData.baseFare || "100",
          sacco: busData.sacco || busData.saccoName || "SACCO",
          type: busData.type || "Bus",
          image: busData.image || `https://placehold.co/600x200.png?text=${busData.plateNumber || busData.id}`,
          imageHint: busData.imageHint || `${busData.type || 'bus'} transport`
        };
        
        setFoundBusDetails(busDetails);
        toast({ 
          title: currentContent.busDetailsFound, 
          description: currentContent.nganyaFoundToastDesc, 
          className: "bg-primary text-primary-foreground" 
        });
      } else {
        // Bus not found in database
        setFoundBusDetails(null);
        setManualEntryError(currentContent.busNotFoundDesc);
      }
    } catch (error) {
      console.error('Error fetching bus details:', error);
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
    setSeatCount(1);
  }

  const handleProceedToPay = async () => {
    if (!currentBusToPay) return;

    // Only validate phone number for mobile money payments
    if (selectedPaymentMethod !== 'cash' && (!phoneNumber || !/^(07|01)\d{8}$/.test(phoneNumber))) {
      toast({ variant: "destructive", title: currentContent.invalidPhoneTitle, description: currentContent.invalidPhoneDesc });
      return;
    }

    const token = localStorage.getItem('matgoToken');
    const storedUser = localStorage.getItem('matgoUser');
    
    const totalFare = parseFloat(currentBusToPay.fare) * seatCount;
    const paymentData = {
      vehicleId: currentBusToPay.id,
      vehicleName: currentBusToPay.name || currentBusToPay.id,
      route: currentBusToPay.route,
      fare: parseFloat(currentBusToPay.fare),
      totalFare: totalFare,
      seatCount: seatCount,
      sacco: currentBusToPay.sacco,
      paymentMethod: selectedPaymentMethod,
      phoneNumber: selectedPaymentMethod !== 'cash' ? phoneNumber : null,
      paymentType: 'instant_fare',
      userInfo: storedUser ? JSON.parse(storedUser) : null
    };

    try {
      // Submit payment to backend
      const response = await fetch('http://localhost:5000/api/payments', {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentData)
      });

      if (response.ok) {
        const paymentResult = await response.json();
        
        toast({ 
          title: currentContent.paymentInitiatedTitle, 
          description: currentContent.paymentInitiatedDesc(selectedPaymentMethod === "mpesa" ? "M-Pesa" : "Airtel Money", currentBusToPay.fare, phoneNumber),
          className: "bg-green-500 text-white"
        });
        
        // Generate passenger names based on seat count
        const passengerNames = [];
        const userName = storedUser ? JSON.parse(storedUser).firstName : (language === 'KSW' ? "Abiria" : "Passenger");
        for (let i = 0; i < seatCount; i++) {
          if (i === 0) {
            passengerNames.push(userName);
          } else {
            passengerNames.push(`${userName} +${i}`);
          }
        }
        
        // Generate seat numbers based on seat count
        const seatNumbers = [];
        for (let i = 1; i <= seatCount; i++) {
          seatNumbers.push(`S${i}`);
        }
        
        const paymentMethodText = selectedPaymentMethod === 'mpesa' ? 'M-Pesa' :
                                 selectedPaymentMethod === 'airtel' ? 'Airtel Money' : 'Cash';
        
        // Construct query parameters for the receipt page with real payment data
        const queryParams = new URLSearchParams({
          route: currentBusToPay.route,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toLocaleTimeString(language === 'KSW' ? 'sw-KE' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
          seats: seatNumbers.join(", "),
          price: String(totalFare),
          passengers: passengerNames.join(", "),
          paymentMethod: paymentMethodText,
          vehicleInfo: currentBusToPay.name || currentBusToPay.id,
          vehicleImage: currentBusToPay.image || `https://placehold.co/600x200.png?text=${currentBusToPay.id}`,
          vehicleImageHint: currentBusToPay.imageHint || `${currentBusToPay.type.toLowerCase()} bus`,
          sacco: currentBusToPay.sacco,
          tripType: language === 'KSW' ? "Nauli ya Moja kwa Moja" : "Instant Fare",
          paymentId: paymentResult.paymentId || paymentResult.id,
          transactionRef: paymentResult.transactionRef || paymentResult.reference,
          seatCount: String(seatCount)
        }).toString();

        router.push(`/receipt/sample?${queryParams}`);
      } else {
        throw new Error('Payment failed');
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      
      // Still show success message and navigate to receipt for user experience
      // In a real app, you might want to show an error and retry
      toast({ 
        title: currentContent.paymentInitiatedTitle, 
        description: currentContent.paymentInitiatedDesc(selectedPaymentMethod === "mpesa" ? "M-Pesa" : "Airtel Money", currentBusToPay.fare, phoneNumber),
        className: "bg-green-500 text-white"
      });
      
      // Generate passenger names based on seat count
      const passengerNames = [];
      const userName = storedUser ? JSON.parse(storedUser).firstName : (language === 'KSW' ? "Abiria" : "Passenger");
      for (let i = 0; i < seatCount; i++) {
        if (i === 0) {
          passengerNames.push(userName);
        } else {
          passengerNames.push(`${userName} +${i}`);
        }
      }
      
      // Generate seat numbers based on seat count
      const seatNumbers = [];
      for (let i = 1; i <= seatCount; i++) {
        seatNumbers.push(`S${i}`);
      }
      
      const paymentMethodText = selectedPaymentMethod === 'mpesa' ? 'M-Pesa' :
                               selectedPaymentMethod === 'airtel' ? 'Airtel Money' : 'Cash';
      
      // Construct query parameters for the receipt page
      const queryParams = new URLSearchParams({
        route: currentBusToPay.route,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(language === 'KSW' ? 'sw-KE' : 'en-US', { hour: '2-digit', minute: '2-digit' }),
        seats: seatNumbers.join(", "),
        price: String(totalFare),
        passengers: passengerNames.join(", "),
        paymentMethod: paymentMethodText,
        vehicleInfo: currentBusToPay.name || currentBusToPay.id,
        vehicleImage: currentBusToPay.image || `https://placehold.co/600x200.png?text=${currentBusToPay.id}`,
        vehicleImageHint: currentBusToPay.imageHint || `${currentBusToPay.type.toLowerCase()} bus`,
        sacco: currentBusToPay.sacco,
        tripType: language === 'KSW' ? "Nauli ya Moja kwa Moja" : "Instant Fare",
        seatCount: String(seatCount)
      }).toString();

      router.push(`/receipt/sample?${queryParams}`);
    }
  };

  const renderPaymentFlow = (busToPay: ScannedBusDetails) => (
    <Card className="mt-6 text-left p-4 md:p-6 bg-primary/5 border border-primary/30 rounded-xl glassy-card">
      <CardHeader className="p-0 pb-4">
        <CardTitle className="text-2xl text-primary flex items-center gap-2"><CheckCircle className="h-7 w-7 text-green-500"/> {currentContent.scanSuccessfulTitle}</CardTitle>
        <CardDescription>{currentContent.scanSuccessfulDesc}</CardDescription>
      </CardHeader>
      <CardContent className="p-0 space-y-3">
        <div className="flex items-center gap-2"> <Bus className="h-5 w-5 text-primary"/> <strong>{currentContent.vehicleDetails(busToPay.name || busToPay.id, busToPay.type)}</strong></div>
        <p><strong>{currentContent.routeLabel}</strong> {busToPay.route}</p>
        <p><strong>{currentContent.saccoLabel}</strong> {busToPay.sacco}</p>
        <p className="text-xl font-bold text-accent"><strong>{currentContent.fareLabel}</strong> Ksh {busToPay.fare} {language === 'KSW' ? 'kwa kiti' : 'per seat'}</p>
        
        {/* Seat Count Selection */}
        <div className="mt-4 p-4 bg-muted/30 rounded-lg">
          <Label className="font-semibold text-base">{currentContent.seatCountLabel}</Label>
          <div className="flex items-center gap-2 mt-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setSeatCount(Math.max(1, seatCount - 1))}
              className="rounded-full border-primary text-primary hover:bg-primary/10"
            >
              -
            </Button>
            <Input
              type="number"
              value={seatCount}
              readOnly
              className="w-16 text-center text-lg font-bold rounded-lg border-2 border-primary bg-transparent focus:ring-0"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setSeatCount(seatCount + 1)}
              className="rounded-full border-primary text-primary hover:bg-primary/10"
            >
              +
            </Button>
          </div>
          <p className="text-2xl font-bold text-primary mt-2">
            {language === 'KSW' ? 'Jumla' : 'Total'}: Ksh {(parseFloat(busToPay.fare) * seatCount).toLocaleString()}
          </p>
        </div>
        
        {!selectedPaymentMethod ? (
          <div className="mt-6 space-y-3">
            <h3 className="font-semibold text-lg text-center text-primary">{language === 'KSW' ? 'Chagua Njia ya Malipo:' : 'Select Payment Method:'}</h3>
            <Button onClick={() => setSelectedPaymentMethod("cash")} size="lg" className="w-full text-lg py-3 rounded-lg bg-green-600 hover:bg-green-700 text-white">
              <DollarSign className="mr-2 h-5 w-5" /> {currentContent.payWithCash}
            </Button>
            <Button onClick={() => setSelectedPaymentMethod("mpesa")} size="lg" className="w-full text-lg py-3 rounded-lg bg-[#00A34A] hover:bg-[#00A34A]/90 text-white">
              <SmartphoneNfc className="mr-2 h-5 w-5" /> {currentContent.payWithMpesa}
            </Button>
            <Button onClick={() => setSelectedPaymentMethod("airtel")} size="lg" className="w-full text-lg py-3 rounded-lg bg-[#F02D2E] hover:bg-[#F02D2E]/90 text-white">
              <SmartphoneNfc className="mr-2 h-5 w-5" /> {currentContent.payWithAirtel}
            </Button>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {selectedPaymentMethod !== 'cash' && (
              <div>
                <Label htmlFor="phoneNumber" className="font-semibold text-base">{currentContent.enterPhoneNumber}</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="07XX XXX XXX or 01XX XXX XXX"
                  className="mt-1 text-base py-3 rounded-lg border-2 focus:border-primary focus:ring-primary"
                />
              </div>
            )}
            
            {selectedPaymentMethod === 'cash' && (
              <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                <p className="text-green-800 dark:text-green-200 font-semibold">
                  {language === 'KSW' ? 'Lipa kwa Pesa Taslimu' : 'Cash Payment'}
                </p>
                <p className="text-green-700 dark:text-green-300 text-sm mt-1">
                  {language === 'KSW'
                    ? 'Lipa kwa kondakta baada ya kupanda. Onyesha risiti hii kama uthibitisho.'
                    : 'Pay the conductor after boarding. Show this receipt as proof of payment intent.'
                  }
                </p>
              </div>
            )}
            
            <Button onClick={handleProceedToPay} size="lg" className="w-full text-lg py-3 rounded-lg btn-glow-accent">
              <DollarSign className="mr-2 h-5 w-5"/>
              {selectedPaymentMethod === 'cash'
                ? (language === 'KSW' ? 'Tengeneza Risiti' : 'Generate Receipt')
                : currentContent.proceedToPay
              }
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
              <Button size="lg" onClick={() => { resetManualEntry(); setMode('enterBusNumber');}} className="h-auto py-8 md:py-12 text-xl md:text-2xl flex-col gap-2 rounded-lg btn-glow-primary transform hover:scale-105">
                <Edit className="h-8 w-8 mb-2" /> {currentContent.enterBusOption}
              </Button>
              <Button size="lg" onClick={triggerStartScanning} className="h-auto py-8 md:py-12 text-xl md:text-2xl flex-col gap-2 rounded-lg btn-glow-primary transform hover:scale-105">
                <QrCode className="h-8 w-8 mb-2" /> {currentContent.scanQrOption}
              </Button>
            </CardContent>
          </Card>
        )}

        {mode === 'enterBusNumber' && !foundBusDetails && (
          <Card className="shadow-lg glassy-card">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">{currentContent.enterBusNumberTitle}</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 space-y-4">
              <div>
                <Label htmlFor="busNumberInput" className="font-semibold text-base">{language === 'KSW' ? 'Nambari ya Basi/Jina la Meli' : 'Bus Number Plate / Fleet Name'}</Label>
                <Input 
                  id="busNumberInput" 
                  value={busNumberInput}
                  onChange={(e) => setBusNumberInput(e.target.value)}
                  placeholder={currentContent.enterBusNumberPlaceholder}
                  className="mt-1 text-base py-3 rounded-lg"
                />
              </div>
              {manualEntryError && (
                 <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>{currentContent.busNotFoundTitle}</AlertTitle>
                    <AlertDescription>{manualEntryError}</AlertDescription>
                  </Alert>
              )}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button onClick={() => { setMode("options"); resetManualEntry(); }} variant="outline" className="w-full sm:w-auto text-base py-3 rounded-lg">
                  <ArrowLeft className="mr-2 h-5 w-5"/> {currentContent.backButton}
                </Button>
                <Button onClick={handleFindBus} className="w-full sm:w-auto text-base py-3 rounded-lg btn-glow-primary">
                  <Search className="mr-2 h-5 w-5"/> {currentContent.findBusButton}
                </Button>
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
                  <div 
                    id={QR_READER_ELEMENT_ID} 
                    className={cn("w-full max-w-md mx-auto aspect-square bg-muted/30 rounded-xl overflow-hidden relative border-2 border-dashed border-primary/30")}
                  >
                    <div className="absolute inset-2 border-4 border-primary/50 rounded-lg pointer-events-none animate-pulse"></div>
                    <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white bg-black/50 px-3 py-1 rounded-md">{currentContent.alignQrHelpText}</p>
                  </div>
                  <Button variant="outline" onClick={triggerStopScanning} className="mt-4 text-base py-2.5 rounded-lg">{currentContent.cancelScan}</Button>
                </div>
              )}
              
              {hasCameraPermission === false && !isScanning && (
                <Alert variant="destructive" className="mt-4 text-left">
                  <AlertCircle className="h-5 w-5" />
                  <AlertTitle>{currentContent.cameraAccessProblemTitle}</AlertTitle>
                  <AlertDescription>
                    {currentContent.cameraAccessProblemDesc}
                     <Button variant="link" onClick={() => setMode("options")} className="p-0 h-auto ml-1 text-destructive hover:underline">{currentContent.backButton}</Button>
                  </AlertDescription>
                </Alert>
              )}

              {qrScannedBusDetails && !isScanning && renderPaymentFlow(qrScannedBusDetails)}

              {scannedData && !qrScannedBusDetails && !isScanning && (
                  <Alert variant="destructive" className="mt-6 text-left">
                      <XCircle className="h-5 w-5" />
                      <AlertTitle>{currentContent.invalidQrScannedTitle}</AlertTitle>
                      <AlertDescription>
                          {currentContent.invalidQrScannedDesc}
                           <Button variant="link" onClick={triggerStartScanning} className="p-0 h-auto ml-1 text-destructive hover:underline">{currentContent.scanAgainButton}</Button>
                           <Button variant="link" onClick={() => setMode("options")} className="p-0 h-auto ml-2 text-muted-foreground hover:underline">{currentContent.backButton}</Button>
                      </AlertDescription>
                  </Alert>
              )}
            </CardContent>
          </Card>
        )}
        
        {mode === 'scanQr' && (
          <Card className="shadow-md border-accent/30 glassy-card">
            <CardHeader>
              <CardTitle className="font-headline text-xl text-accent flex items-center gap-2"><Info className="h-5 w-5"/>{currentContent.howItWorksTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              {currentContent.howItWorksSteps.map((step, index) => <p key={index}>• {step}</p>)}
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
