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

// Content translations
const getContent = (language: string) => ({
  busNotFoundTitle: language === 'KSW' ? 'Basi Halikupatikana' : 'Bus Not Found',
  howItWorksTitle: language === 'KSW' ? 'Jinsi ya Kutumia' : 'How It Works',
  howItWorksSteps: language === 'KSW' ? [
    "Elekeza kamera yako kwenye msimbo wa QR, hakikisha ina mwanga wa kutosha na iko katikati.",
    "Baada ya kuskaniwa, hakiki maelezo ya basi, njia, na taarifa ya nauli inayoonyeshwa kwenye skrini yako.",
    "Chagua njia yako ya malipo (M-Pesa au Airtel Money).",
    "Weka nambari yako ya simu na gusa \"Endelea Kulipa\".",
    "Risiti/tikiti yako ya kielektroniki itatolewa papo hapo baada ya malipo kufaulu. Onyesha kwa kondakta ikiombwa."
  ] : [
    "Point your camera at the QR code, ensure good lighting and center alignment.",
    "After scanning, verify the bus details, route, and fare information displayed on your screen.",
    "Choose your payment method (M-Pesa or Airtel Money).",
    "Enter your phone number and tap \"Proceed to Pay\".",
    "Your e-receipt/ticket will be generated immediately after successful payment. Show it to the conductor when requested."
  ],
  enterBusNumberTitle: language === 'KSW' ? 'Weka Maelezo ya Basi' : 'Enter Bus Details',
  enterBusNumberPlaceholder: language === 'KSW' ? 'k.m., KDA 123X au Monalisa' : 'e.g., KDA 123X or Monalisa',
  searchButton: language === 'KSW' ? 'Tafuta' : 'Search',
  scanQrButton: language === 'KSW' ? 'Skani Msimbo wa QR' : 'Scan QR Code',
  enterManuallyButton: language === 'KSW' ? 'Ingiza Namba ya Basi' : 'Enter Bus Number',
  backButton: language === 'KSW' ? 'Rudi' : 'Back',
  vehicleDetails: (name: string, type: string) => language === 'KSW' ? 
    `${type}: ${name}` : 
    `${type}: ${name}`,
  fareLabel: language === 'KSW' ? 'Nauli:' : 'Fare:',
  payWithMpesa: language === 'KSW' ? 'Lipa na M-Pesa' : 'Pay with M-Pesa',
  payWithAirtel: language === 'KSW' ? 'Lipa na Airtel Money' : 'Pay with Airtel Money',
  payWithCash: language === 'KSW' ? 'Lipa kwa Pesa Taslimu' : 'Pay with Cash',
  seatCountLabel: language === 'KSW' ? 'Idadi ya Viti:' : 'Number of Seats:',
  enterPhoneNumber: language === 'KSW' ? 'Weka Nambari yako ya Simu' : 'Enter your Phone Number',
  proceedToPay: language === 'KSW' ? 'Endelea Kulipa' : 'Proceed to Pay',
  changePaymentMethod: language === 'KSW' ? 'Badilisha Njia' : 'Change Method',
  paymentInitiatedTitle: language === 'KSW' ? 'Malipo Yameanzishwa' : 'Payment Initiated',
  paymentInitiatedDesc: (method: string, fare: string, phone: string) => 
    language === 'KSW' 
      ? `Malipo ya ${method} ya Ksh ${fare} kwenda ${phone} yameanzishwa. Angalia simu yako.`
      : `${method} payment of Ksh ${fare} to ${phone} initiated. Check your phone.`,
  invalidPhoneTitle: language === 'KSW' ? 'Nambari ya Simu Si Sahihi' : 'Invalid Phone Number',
  invalidPhoneDesc: language === 'KSW' 
    ? 'Tafadhali weka nambari sahihi ya simu ya Kenya (ianze na 07 au 01)' 
    : 'Please enter a valid Kenyan phone number (starting with 07 or 01)',
  scanSuccessfulTitle: language === 'KSW' ? 'Skani Imefaulu!' : 'Scan Successful!',
  scanSuccessfulDesc: language === 'KSW' 
    ? 'Maelezo ya basi yamepatikana. Tafadhali hakiki na uchague njia ya malipo.'
    : 'Bus details retrieved. Please verify and choose payment method.',

  // --- Added missing keys for error handling and UI ---
  cameraErrorTitle: language === 'KSW' ? 'Hitilafu ya Kamera' : 'Camera Error',
  cameraErrorDesc: language === 'KSW' ? 'Kamera haikuweza kuanzishwa. Tafadhali hakikisha ruhusa imetolewa na ujaribu tena.' : 'Camera could not be started. Please ensure permission is granted and try again.',
  noCameraTitle: language === 'KSW' ? 'Hakuna Kamera Iliyopatikana' : 'No Camera Found',
  noCameraDesc: language === 'KSW' ? 'Hakuna kamera iliyopatikana kwenye kifaa hiki.' : 'No camera was found on this device.',
  cameraAccessFailedTitle: language === 'KSW' ? 'Imeshindikana Kufikia Kamera' : 'Camera Access Failed',
  cameraAccessFailedDesc: language === 'KSW' ? 'Imeshindikana kufikia kamera. Tafadhali hakikisha ruhusa imetolewa.' : 'Failed to access camera. Please ensure permission is granted.',
  nganyaFoundToast: language === 'KSW' ? 'Basi Limepatikana!' : 'Bus Found!',
  nganyaFoundToastDesc: language === 'KSW' ? 'Maelezo ya basi yamepatikana kutoka kwa QR.' : 'Bus details retrieved from QR.',
  invalidQrTitle: language === 'KSW' ? 'QR Si Sahihi' : 'Invalid QR',
  invalidQrDesc: language === 'KSW' ? 'Msimbo wa QR haukueleweka. Tafadhali jaribu tena.' : 'The QR code could not be understood. Please try again.',
  notMatGoQrTitle: language === 'KSW' ? 'QR Sio ya MatGo' : 'Not a MatGo QR',
  notMatGoQrDesc: language === 'KSW' ? 'Msimbo huu wa QR sio wa MatGo.' : 'This QR code is not a MatGo code.',
  busDetailsFound: language === 'KSW' ? 'Maelezo ya Basi Yamepatikana' : 'Bus Details Found',
  busNotFoundDesc: language === 'KSW' ? 'Basi halikupatikana. Tafadhali hakikisha nambari au jina ni sahihi.' : 'Bus not found. Please ensure the number or name is correct.',
  // UI button/label keys used in the UI
  enterBusOption: language === 'KSW' ? 'Ingiza Nambari ya Basi' : 'Enter Bus Number',
  scanQrOption: language === 'KSW' ? 'Skani QR' : 'Scan QR',
  findBusButton: language === 'KSW' ? 'Tafuta Basi' : 'Find Bus',
  routeLabel: language === 'KSW' ? 'Njia:' : 'Route:',
  saccoLabel: language === 'KSW' ? 'Sacco:' : 'Sacco:',
  pageTitle: language === 'KSW' ? 'Lipa Nauli' : 'Pay Fare',
  pageDescription: language === 'KSW' ? 'Lipa nauli yako kwa urahisi kwa kutumia QR au nambari ya basi.' : 'Easily pay your fare using QR or bus number.',
  alignQrHelpText: language === 'KSW' ? 'Lenga QR katikati ya fremu' : 'Align QR in the center of the frame',
  cancelScan: language === 'KSW' ? 'Ghairi' : 'Cancel',
  cameraAccessProblemTitle: language === 'KSW' ? 'Tatizo la Kamera' : 'Camera Problem',
  cameraAccessProblemDesc: language === 'KSW' ? 'Kamera haipatikani au haijaruhusiwa.' : 'Camera is unavailable or not permitted.',
  invalidQrScannedTitle: language === 'KSW' ? 'QR Si Sahihi' : 'Invalid QR',
  invalidQrScannedDesc: language === 'KSW' ? 'Msimbo wa QR haukueleweka. Tafadhali jaribu tena.' : 'The QR code could not be understood. Please try again.',
  scanAgainButton: language === 'KSW' ? 'Jaribu Tena' : 'Scan Again',
  // ...add more as needed
});

export default function ScanPage() {
  // Hooks
  const router = useRouter();
  const { toast } = useToast();
  const { language } = useLanguage();
  
  // State for scanning modes
  const [mode, setMode] = useState<"options" | "enterBusNumber" | "scanQr">("options");
  const [busNumberInput, setBusNumberInput] = useState<string>("");
  const [foundBusDetails, setFoundBusDetails] = useState<ScannedBusDetails | null>(null);
  const [manualEntryError, setManualEntryError] = useState<string | null>(null);

  // State for QR scanning
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scannedData, setScannedData] = useState<string | null>(null);
  const [qrScannedBusDetails, setQrScannedBusDetails] = useState<ScannedBusDetails | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  // State for payment
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<"mpesa" | "airtel" | "cash" | null>(null);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [seatCount, setSeatCount] = useState<number>(1);
  
  // Refs
  const html5QrCodeInstanceRef = useRef<Html5Qrcode | null>(null);
  const readerContainerRendered = useRef(false);

  // Current bus to pay for
  const currentBusToPay = foundBusDetails || qrScannedBusDetails;
  
  // Get translations based on current language
  const currentContent = getContent(language);

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

    React.useEffect(() => {
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
  
    React.useEffect(() => {
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
            image: `https://placehold.co/600x200.png?text=${parts[0]}`,
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
  const busIdToFind = encodeURIComponent(busNumberInput.trim());
      const token = localStorage.getItem('matgoToken');
    
      try {
        // Try to fetch bus details from backend
        const response = await fetch(`http://localhost:5000/api/matatus/${busIdToFind}`, {
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
    };

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
        phoneNumber: phoneNumber.startsWith('0') ? phoneNumber : `0${phoneNumber}`,
        amount: Math.round(totalFare), // Ensure amount is a whole number
        accountReference: `MATGO-${currentBusToPay.id}`,
        transactionDesc: `Fare payment for ${currentBusToPay.route}`,
        metadata: {
          vehicleId: currentBusToPay.id,
          vehicleName: currentBusToPay.name || currentBusToPay.id,
          route: currentBusToPay.route,
          fare: parseFloat(currentBusToPay.fare),
          totalFare: totalFare,
          seatCount: seatCount,
          sacco: currentBusToPay.sacco,
          paymentMethod: selectedPaymentMethod,
          paymentType: 'instant_fare',
          userInfo: storedUser ? JSON.parse(storedUser) : null
        }
      };

      try {
        // For cash payments, just generate receipt
        if (selectedPaymentMethod === 'cash') {
          toast({
            title: currentContent.paymentInitiatedTitle,
            description: language === 'KSW' 
              ? 'Lipa kwa kondakta na uonyeshe risiti hii'
              : 'Pay the conductor and show this receipt',
            className: "bg-green-500 text-white"
          });
        
          // Generate receipt for cash payment
          const timestamp = typeof window !== 'undefined' ? Date.now() : 0; // Use static value for SSR
          const paymentResult = {
            success: true,
            transactionRef: `CASH-${timestamp}`,
            amount: totalFare
          };
          return navigateToReceipt(paymentResult);
        }

        // Submit M-Pesa payment request
        const response = await fetch('/api/payments', {
          method: 'POST',
          headers: {
            'Authorization': token ? `Bearer ${token}` : '',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(paymentData)
        });

        const paymentResult = await response.json();
        
        if (response.ok && paymentResult.data) {
          // Show STK push notification
          toast({ 
            title: language === 'KSW' ? 'Angalia Simu Yako' : 'Check Your Phone',
            description: language === 'KSW'
              ? `Thibitisha malipo ya Ksh ${totalFare} kwenye simu yako`
              : `Confirm payment of Ksh ${totalFare} on your phone`,
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
            paymentId: paymentResult.data?.CheckoutRequestID || paymentResult.id || '',
            transactionRef: paymentResult.data?.MerchantRequestID || paymentResult.transactionRef || '',
            seatCount: String(seatCount)
          }).toString();

          router.push(`/receipt/sample?${queryParams}`);
        } else {
          // Handle specific M-Pesa error cases
          const errorMessage = paymentResult.message || 'Payment failed';
          throw new Error(errorMessage);
        }
      } catch (error: any) {
        console.error('Error processing payment:', error);
      
        const errorMessage = error.message || (language === 'KSW' 
          ? 'Malipo yameshindikana. Tafadhali jaribu tena.'
          : 'Payment failed. Please try again.');
        
        toast({ 
          variant: "destructive",
          title: language === 'KSW' ? 'Hitilafu ya Malipo' : 'Payment Error',
          description: errorMessage,
        });
      
        // Navigate to receipt page with payment details
        // If paymentResult is not defined due to error, skip navigation
        // (prevents reference error)
        // return navigateToReceipt(paymentResult);
      }
    };

    const navigateToReceipt = (paymentResult: any) => {
      if (!currentBusToPay) return;
    
      // Generate query params for receipt
      const queryParams = new URLSearchParams({
        vehicleName: currentBusToPay.name || currentBusToPay.id || '',
        route: currentBusToPay.route || '',
        sacco: currentBusToPay.sacco || '',
        fare: String(currentBusToPay.fare || 0),
        totalFare: String(parseFloat(currentBusToPay.fare || '0') * seatCount),
        paymentMethod: selectedPaymentMethod || '',
        phoneNumber: phoneNumber || '',
        transactionRef: paymentResult.CheckoutRequestID || paymentResult.transactionRef || '',
        seatCount: String(seatCount)
      }).toString();

      // Navigate to receipt page
      router.push(`/receipt/sample?${queryParams}`);
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
        {/* Payment Method Selection */}
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
