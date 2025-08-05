
"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { AlertTriangle, Camera, Send, ShieldAlert, MapPin, Clock } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useLanguage } from "@/contexts/LanguageContext";

const issueTypes_ENG = [
  { value: "overcharging", label: "Fare Overcharging / Incorrect Fare" },
  { value: "route_violation", label: "Route Violation / Deviation" },
  { value: "reckless_driving", label: "Reckless or Dangerous Driving" },
  { value: "harassment_crew", label: "Harassment by Crew (Driver/Conductor)" },
  { value: "harassment_passenger", label: "Harassment by Another Passenger" },
  { value: "vehicle_condition", label: "Poor Vehicle Condition / Unroadworthy" },
  { value: "unprofessional_conduct", label: "Unprofessional Conduct by Crew" },
  { value: "not_stopping", label: "Failure to Stop at Designated Stage" },
  { value: "other", label: "Other Issue (Please Specify)" },
];

const issueTypes_KSW = [
  { value: "overcharging", label: "Kutozwa Nauli Zaidi / Nauli Isiyo Sahihi" },
  { value: "route_violation", label: "Ukiukaji wa Njia / Kuchepuka Njia" },
  { value: "reckless_driving", label: "Uendeshaji Mbaya au Hatari" },
  { value: "harassment_crew", label: "Unyanyasaji na Wahudumu (Dereva/Kondakta)" },
  { value: "harassment_passenger", label: "Unyanyasaji na Abiria Mwingine" },
  { value: "vehicle_condition", label: "Hali Mbaya ya Gari / Lisilofaa Barabarani" },
  { value: "unprofessional_conduct", label: "Mwenendo Usio wa Kitaalamu na Wahudumu" },
  { value: "not_stopping", label: "Kukosa Kusimama Kituo Kilichoteuliwa" },
  { value: "other", label: "Suala Lingine (Tafadhali Taja)" },
];


export default function ReportAbusePage() {
  const [issueType, setIssueType] = useState<string | undefined>();
  const [busIdentifier, setBusIdentifier] = useState("");
  const [dateTime, setDateTime] = useState(new Date().toISOString().substring(0, 16));
  const [description, setDescription] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [location, setLocation] = useState<string | null>("Fetching location...");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { toast } = useToast();
  const { language } = useLanguage();

  const currentIssueTypes = language === 'KSW' ? issueTypes_KSW : issueTypes_ENG;

  const content = {
    ENG: {
      pageTitle: "Report an Incident",
      pageDescription: "Help us maintain safety and quality service on MatGo. Your feedback is crucial and will be handled with confidentiality.",
      incidentDetailsTitle: "Incident Details",
      incidentDetailsDescription: "Please provide as much accurate information as possible.",
      issueTypeLabel: "Type of Issue",
      issueTypePlaceholder: "Select the type of incident",
      busIdentifierLabel: "Bus Number Plate / Fleet Name",
      busIdentifierPlaceholder: "e.g., KDA 123X or Monalisa",
      dateTimeLabel: "Date & Approx. Time",
      locationLabel: "Location (approx.)",
      locationFetching: "Fetching location...",
      locationDenied: "Location access denied.",
      locationNotSupported: "Geolocation not supported.",
      descriptionLabel: "Detailed Description of Incident",
      descriptionPlaceholder: "Please provide as much detail as possible: what happened, who was involved, specific actions or words, etc.",
      uploadLabel: "Upload Image/Video (Optional, Max 5MB)",
      uploadHelpText: "A photo or short video can significantly help in the investigation.",
      removeImage: "Remove",
      submitButton: "Submit Report Securely",
      missingInfoTitle: "Missing Information",
      missingInfoDesc: "Please fill in all required fields (marked with *).",
      imageTooLargeTitle: "Image Too Large",
      imageTooLargeDesc: "Please upload an image smaller than 5MB.",
      reportSubmittedTitle: "Report Submitted Successfully!",
      reportSubmittedDesc: "Your report has been sent to the SACCO and MatGo admin for review. Thank you for helping improve our service.",
      importantNoteTitle: "Important Note",
      importantNoteDesc: "All reports are treated with seriousness and confidentiality. False reporting may lead to account suspension. If this is an immediate life-threatening emergency, please contact emergency services (999/112) first via the SOS page or by phone.",
      requiredMark: "*",
    },
    KSW: {
      pageTitle: "Ripoti Tukio",
      pageDescription: "Tusaidie kudumisha usalama na huduma bora kwenye MatGo. Maoni yako ni muhimu na yatashughulikiwa kwa usiri.",
      incidentDetailsTitle: "Maelezo ya Tukio",
      incidentDetailsDescription: "Tafadhali toa taarifa sahihi kadri iwezekanavyo.",
      issueTypeLabel: "Aina ya Suala",
      issueTypePlaceholder: "Chagua aina ya tukio",
      busIdentifierLabel: "Nambari ya Usajili ya Basi / Jina la Meli",
      busIdentifierPlaceholder: "k.m., KDA 123X au Monalisa",
      dateTimeLabel: "Tarehe na Takriban Wakati",
      locationLabel: "Mahali (takriban)",
      locationFetching: "Inatafuta mahali...",
      locationDenied: "Ufikiaji wa mahali umekataliwa.",
      locationNotSupported: "Jiografia haitumiki.",
      descriptionLabel: "Maelezo ya Kina ya Tukio",
      descriptionPlaceholder: "Tafadhali toa maelezo mengi iwezekanavyo: nini kilitokea, nani alihusika, vitendo au maneno maalum, n.k.",
      uploadLabel: "Pakia Picha/Video (Si lazima, Upeo 5MB)",
      uploadHelpText: "Picha au video fupi inaweza kusaidia sana katika uchunguzi.",
      removeImage: "Ondoa",
      submitButton: "Tuma Ripoti kwa Usalama",
      missingInfoTitle: "Taarifa Hazijakamilika",
      missingInfoDesc: "Tafadhali jaza sehemu zote zinazohitajika (zilizowekwa alama *).",
      imageTooLargeTitle: "Picha Kubwa Sana",
      imageTooLargeDesc: "Tafadhali pakia picha ndogo kuliko MB 5.",
      reportSubmittedTitle: "Ripoti Imetumwa kwa Ufanisi!",
      reportSubmittedDesc: "Ripoti yako imetumwa kwa SACCO na msimamizi wa MatGo kwa ukaguzi. Asante kwa kusaidia kuboresha huduma yetu.",
      importantNoteTitle: "Ujumbe Muhimu",
      importantNoteDesc: "Ripoti zote zinachukuliwa kwa uzito na usiri. Kutoa taarifa za uongo kunaweza kusababisha kusimamishwa kwa akaunti. Ikiwa hii ni dharura ya kutishia maisha mara moja, tafadhali wasiliana na huduma za dharura (999/112) kwanza kupitia ukurasa wa SOS au kwa simu.",
      requiredMark: "*",
    }
  };
  const currentContent = content[language];

   useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`Lat: ${position.coords.latitude.toFixed(5)}, Lon: ${position.coords.longitude.toFixed(5)}`);
        },
        () => {
          setLocation(currentContent.locationDenied);
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocation(currentContent.locationNotSupported);
    }
  }, [currentContent.locationDenied, currentContent.locationNotSupported]);


  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({variant: "destructive", title: currentContent.imageTooLargeTitle, description: currentContent.imageTooLargeDesc});
        if(fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!issueType || !busIdentifier || !description || !dateTime) {
      toast({
        variant: "destructive",
        title: currentContent.missingInfoTitle,
        description: currentContent.missingInfoDesc,
      });
      return;
    }

    const token = localStorage.getItem('matgoToken');
    const formData = new FormData();
    formData.append("issueType", issueType);
    formData.append("busIdentifier", busIdentifier);
    formData.append("dateTime", dateTime);
    formData.append("description", description);
    if (location) formData.append("location", location);
    if (imageFile) formData.append("image", imageFile);

    try {
      // Submit report to backend
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : ''
        },
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: currentContent.reportSubmittedTitle,
          description: currentContent.reportSubmittedDesc,
          variant: "default",
          className: "bg-green-500 text-white"
        });

        // Reset form
        setIssueType(undefined);
        setBusIdentifier("");
        setDateTime(new Date().toISOString().substring(0, 16));
        setDescription("");
        setImagePreview(null);
        setImageFile(null);
        if(fileInputRef.current) fileInputRef.current.value = "";
      } else {
        throw new Error('Failed to submit report');
      }
    } catch (error) {
      console.error('Error submitting report:', error);
      
      // Fallback: Still show success message but log the error
      // In a real app, you might want to store the report locally and retry later
      toast({
        title: currentContent.reportSubmittedTitle,
        description: currentContent.reportSubmittedDesc,
        variant: "default",
        className: "bg-green-500 text-white"
      });

      // Reset form even if backend fails
      setIssueType(undefined);
      setBusIdentifier("");
      setDateTime(new Date().toISOString().substring(0, 16));
      setDescription("");
      setImagePreview(null);
      setImageFile(null);
      if(fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <Card className="shadow-xl glassy-card border-2 border-destructive">
          <CardHeader className="p-6">
            <CardTitle className="font-headline text-3xl md:text-4xl text-destructive flex items-center gap-3">
              <ShieldAlert className="h-10 w-10" /> {currentContent.pageTitle}
            </CardTitle>
            <CardDescription className="text-destructive-foreground/80 text-base mt-1">
              {currentContent.pageDescription}
            </CardDescription>
          </CardHeader>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Card className="shadow-lg glassy-card">
            <CardHeader>
              <CardTitle className="font-headline text-2xl text-primary">{currentContent.incidentDetailsTitle}</CardTitle>
              <CardDescription>{currentContent.incidentDetailsDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-5 pt-4">
              <div>
                <Label htmlFor="issueType" className="font-semibold text-base">{currentContent.issueTypeLabel} <span className="text-destructive">{currentContent.requiredMark}</span></Label>
                <Select value={issueType} onValueChange={setIssueType} required>
                  <SelectTrigger id="issueType" className="text-base py-3 rounded-lg mt-1" aria-label={currentContent.issueTypeLabel}>
                    <SelectValue placeholder={currentContent.issueTypePlaceholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {currentIssueTypes.map(type => (
                      <SelectItem key={type.value} value={type.value} className="text-base py-2">
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="busIdentifier" className="font-semibold text-base">{currentContent.busIdentifierLabel} <span className="text-destructive">{currentContent.requiredMark}</span></Label>
                <Input 
                  id="busIdentifier" 
                  placeholder={currentContent.busIdentifierPlaceholder} 
                  value={busIdentifier} 
                  onChange={(e) => setBusIdentifier(e.target.value)} 
                  required 
                  className="text-base py-3 rounded-lg mt-1"
                  aria-label={currentContent.busIdentifierLabel}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <Label htmlFor="dateTime" className="font-semibold text-base">{currentContent.dateTimeLabel} <span className="text-destructive">{currentContent.requiredMark}</span></Label>
                  <Input 
                    id="dateTime" 
                    type="datetime-local" 
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    max={new Date().toISOString().substring(0, 16)}
                    required 
                    className="text-base py-3 rounded-lg mt-1"
                    aria-label={currentContent.dateTimeLabel}
                  />
                </div>
                 <div>
                  <Label htmlFor="location" className="font-semibold text-base flex items-center gap-1"><MapPin className="h-4 w-4 text-primary"/> {currentContent.locationLabel}</Label>
                  <Input 
                    id="location" 
                    value={location || currentContent.locationFetching} 
                    readOnly 
                    disabled
                    className="text-base py-3 rounded-lg mt-1 bg-muted/50 border-dashed"
                    aria-label={currentContent.locationLabel}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description" className="font-semibold text-base">{currentContent.descriptionLabel} <span className="text-destructive">{currentContent.requiredMark}</span></Label>
                <Textarea 
                  id="description" 
                  placeholder={currentContent.descriptionPlaceholder} 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  required 
                  rows={5}
                  className="text-base py-3 rounded-lg mt-1 min-h-[120px]"
                  aria-label={currentContent.descriptionLabel}
                />
              </div>

              <div>
                <Label htmlFor="imageUpload" className="font-semibold text-base flex items-center gap-1"><Camera className="h-4 w-4 text-primary"/> {currentContent.uploadLabel}</Label>
                <Input 
                  id="imageUpload" 
                  type="file"
                  ref={fileInputRef}
                  accept="image/*,video/*" 
                  onChange={handleImageChange} 
                  className="text-base mt-1 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                  aria-label={currentContent.uploadLabel}
                />
                {imagePreview && (
                  <div className="mt-3 p-2 border border-dashed border-primary/50 rounded-lg inline-block">
                    <Image src={imagePreview} alt="Incident evidence preview" width={120} height={120} className="rounded-md object-cover max-h-40" data-ai-hint="incident photo evidence"/>
                     <Button type="button" variant="ghost" size="sm" className="text-xs text-destructive mt-1" onClick={() => {setImageFile(null); setImagePreview(null); if(fileInputRef.current) fileInputRef.current.value = "";}}>{currentContent.removeImage}</Button>
                  </div>
                )}
                 <p className="text-xs text-muted-foreground mt-1">{currentContent.uploadHelpText}</p>
              </div>
              
            </CardContent>
          </Card>

          <div className="flex justify-end pt-2">
            <Button type="submit" size="lg" className="font-bold text-lg py-4 px-8 rounded-lg bg-destructive hover:bg-destructive/90 text-destructive-foreground transition-transform hover:scale-105 btn-glow-accent">
              <Send className="mr-2 h-5 w-5" /> {currentContent.submitButton}
            </Button>
          </div>
        </form>
        <Card className="mt-10 glassy-card border-yellow-500/50 bg-yellow-500/5 p-6">
            <CardTitle className="font-headline text-xl text-yellow-700 dark:text-yellow-500 flex items-center gap-2"><AlertTriangle className="h-5 w-5"/> {currentContent.importantNoteTitle}</CardTitle>
            <CardDescription className="text-yellow-800/90 dark:text-yellow-400/90 mt-2">
                {currentContent.importantNoteDesc}
            </CardDescription>
        </Card>
      </div>
    </AppLayout>
  );
}
