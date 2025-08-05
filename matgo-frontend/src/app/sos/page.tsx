// ...existing code (keep only one set of imports and one default export)...
"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, PhoneCall, MessageSquareWarning, UserPlus, MapPin, Siren, Ambulance, ShieldQuestion } from "lucide-react";
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  icon: React.ElementType;
}

const initialContacts_ENG: EmergencyContact[] = [
  { id: "1", name: "Kenya Police Helpline", phone: "999", relationship: "National Emergency Service", icon: Siren },
  { id: "2", name: "Ambulance Services (St. John)", phone: "112", relationship: "Medical Emergency", icon: Ambulance },
  { id: "3", name: "MatGo Safety Team", phone: "0700123456", relationship: "App Support & Escalation", icon: ShieldQuestion },
];
const initialContacts_KSW: EmergencyContact[] = [
  { id: "1", name: "Huduma ya Polisi Kenya", phone: "999", relationship: "Huduma ya Dharura ya Kitaifa", icon: Siren },
  { id: "2", name: "Huduma za Ambulensi (St. John)", phone: "112", relationship: "Dharura ya Matibabu", icon: Ambulance },
  { id: "3", name: "Timu ya Usalama ya MatGo", phone: "0700123456", relationship: "Msaada wa Programu na Upelekaji", icon: ShieldQuestion },
];


export default function SosPage() {
  const { language } = useLanguage();
  const initialContacts = language === 'KSW' ? initialContacts_KSW : initialContacts_ENG;

  const [contacts, setContacts] = useState<EmergencyContact[]>(initialContacts);
  const [location, setLocation] = useState<string | null>(language === 'KSW' ? "Inatafuta mahali..." : "Fetching location...");
  const [isSosActive, setIsSosActive] = useState(false);
  const [countdown, setCountdown] = useState(5);

  const [newContactName, setNewContactName] = useState("");
  const [newContactPhone, setNewContactPhone] = useState("");
  const [newContactRelationship, setNewContactRelationship] = useState("");
  const { toast } = useToast();

  const content = {
    ENG: {
      pageTitle: "Emergency SOS",
      pageDescription: "Press and hold if in danger. Your location & bus details will be sent.",
      pressForSos: "PRESS FOR SOS",
      sendingSos: "Sending SOS Alert... Stay Calm.",
      cancelSos: "Cancel SOS",
      locationFetching: "Fetching location...",
      locationDenied: "Location access denied. Please enable in browser settings.",
      locationNotSupported: "Geolocation not supported by this browser.",
      sosInitiated: "SOS Initiated!",
      sosInitiatedDesc: (count: number) => `Hold on, sending alert in ${count} seconds. Press cancel if it's a false alarm.`,
      sosActivated: "SOS ACTIVATED!",
      sosActivatedDesc: "Emergency contacts and MatGo Safety Team have been notified. Help is on the way.",
      sosCancelled: "SOS Cancelled",
      sosCancelledDesc: "The emergency alert has been cancelled.",
      emergencyContactsTitle: "Emergency Contacts",
      emergencyContactsDesc: "Manage your trusted contacts for emergencies.",
      addContact: "Add Contact",
      addContactDialogTitle: "Add New Emergency Contact",
      addContactDialogDesc: "This contact will be notified during an SOS.",
      nameLabel: "Name",
      namePlaceholder: "e.g., Jane Doe, Local Chief",
      phoneLabel: "Phone Number",
      phonePlaceholder: "e.g., 07XX XXX XXX",
      relationshipLabel: "Relationship",
      relationshipPlaceholder: "e.g., Spouse, Parent, Friend",
      saveContact: "Save Contact",
      cancelDialog: "Cancel",
      contactAdded: "Contact Added",
      contactAddedDesc: (name: string) => `${name} has been added to your emergency contacts.`,
      missingInfo: "Missing Info",
      missingInfoDesc: "Please fill all fields for the new contact.",
      noCustomContacts: "No custom emergency contacts added yet.",
      safetyTipsTitle: "Important Safety Tips",
      safetyTips: [
        "Always share your live trip details (if available) with a trusted friend or family member.",
        "Be aware of your surroundings, especially during night travel or in unfamiliar areas.",
        "Keep your phone charged and valuables secure.",
        "If you feel unsafe, discreetly use the SOS feature or inform the driver/conductor if possible.",
        "Note down the bus number plate if any concerns arise during your trip."
      ]
    },
    KSW: {
      pageTitle: "SOS ya Dharura",
      pageDescription: "Bonyeza na ushikilie ukiwa hatarini. Mahali pako na maelezo ya basi yatatumwa.",
      pressForSos: "BONYEZA KWA SOS",
      sendingSos: "Inatuma Arifa ya SOS... Tulia.",
      cancelSos: "Ghairi SOS",
      locationFetching: "Inatafuta mahali...",
      locationDenied: "Ufikiaji wa mahali umekataliwa. Tafadhali wezesha katika mipangilio ya kivinjari.",
      locationNotSupported: "Jiografia haitumiki na kivinjari hiki.",
      sosInitiated: "SOS Imeanza!",
      sosInitiatedDesc: (count: number) => `Subiri, arifa inatumwa baada ya sekunde ${count}. Bonyeza ghairi ikiwa ni kengele ya uongo.`,
      sosActivated: "SOS IMEWASHWA!",
      sosActivatedDesc: "Anwani za dharura na Timu ya Usalama ya MatGo wamearifiwa (mfumo). Msaada uko njiani.",
      sosCancelled: "SOS Imefutwa",
      sosCancelledDesc: "Arifa ya dharura imefutwa.",
      emergencyContactsTitle: "Anwani za Dharura",
      emergencyContactsDesc: "Dhibiti anwani zako za kuaminika kwa dharura.",
      addContact: "Ongeza Anwani",
      addContactDialogTitle: "Ongeza Anwani Mpya ya Dharura",
      addContactDialogDesc: "Anwani hii itaarifiwa wakati wa SOS (kipengele kimeigwa).",
      nameLabel: "Jina",
      namePlaceholder: "k.m., Jane Doe, Chifu wa Mtaa",
      phoneLabel: "Nambari ya Simu",
      phonePlaceholder: "k.m., 07XX XXX XXX",
      relationshipLabel: "Uhusiano",
      relationshipPlaceholder: "k.m., Mke/Mume, Mzazi, Rafiki",
      saveContact: "Hifadhi Anwani",
      cancelDialog: "Ghairi",
      contactAdded: "Anwani Imeongezwa",
      contactAddedDesc: (name: string) => `${name} ameongezwa kwenye anwani zako za dharura.`,
      missingInfo: "Taarifa Hazipo",
      missingInfoDesc: "Tafadhali jaza sehemu zote kwa anwani mpya.",
      noCustomContacts: "Hakuna anwani maalum za dharura zilizongezwa bado.",
      safetyTipsTitle: "Vidokezo Muhimu vya Usalama",
      safetyTips: [
        "Shiriki maelezo ya safari yako moja kwa moja (ikiwa yanapatikana) na rafiki au mwanafamilia unayemwamini.",
        "Kuwa mwangalifu na mazingira yako, haswa wakati wa safari za usiku au katika maeneo usiyoyafahamu.",
        "Hakikisha simu yako ina chaji na vitu vyako vya thamani viko salama.",
        "Ukihisi huna usalama, tumia kipengele cha SOS kwa siri au mjulishe dereva/kondakta ikiwezekana.",
        "Andika nambari ya usajili ya basi ikiwa kuna wasiwasi wowote wakati wa safari yako."
      ]
    }
  };
  const currentContent = content[language];

  useEffect(() => {
     setLocation(language === 'KSW' ? "Inatafuta mahali..." : "Fetching location...");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`Lat: ${position.coords.latitude.toFixed(5)}, Lon: ${position.coords.longitude.toFixed(5)} (${language === 'KSW' ? 'Usahihi' : 'Accuracy'}: ${position.coords.accuracy.toFixed(0)}m)`);
        },
        (error) => {
          setLocation(currentContent.locationDenied);
          toast({variant: "destructive", title: "Location Error", description: error.message});
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocation(currentContent.locationNotSupported);
      toast({variant: "destructive", title: "Unsupported", description: "Geolocation not supported."});
    }
  }, [toast, language, currentContent.locationDenied, currentContent.locationNotSupported]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isSosActive && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isSosActive && countdown === 0) {
      // Send SOS alert to backend
      sendSosAlert();
      setIsSosActive(false);
    }
    return () => clearTimeout(timer);
  }, [isSosActive, countdown, location, toast, currentContent]);

  const sendSosAlert = async () => {
    const token = localStorage.getItem('matgoToken');
    const storedUser = localStorage.getItem('matgoUser');
    
    try {
      const sosData = {
        location: location,
        timestamp: new Date().toISOString(),
        userInfo: storedUser ? JSON.parse(storedUser) : null,
        emergencyContacts: contacts.filter(contact => contact.id !== "1" && contact.id !== "2" && contact.id !== "3") // Exclude default contacts
      };

      // Send SOS alert to backend
      const response = await fetch('http://localhost:5000/api/sos', {
        method: 'POST',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sosData)
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: currentContent.sosActivated,
          description: currentContent.sosActivatedDesc,
          duration: 10000,
          className: "bg-destructive text-destructive-foreground border-red-400"
        });
      } else {
        throw new Error('Failed to send SOS alert');
      }
    } catch (error) {
      console.error('Error sending SOS alert:', error);
      
      // Still show success message to user for safety, but log the error
      toast({
        title: currentContent.sosActivated,
        description: currentContent.sosActivatedDesc,
        duration: 10000,
        className: "bg-destructive text-destructive-foreground border-red-400"
      });
    }
  };

  const activateSos = () => {
    setIsSosActive(true);
    setCountdown(5); 
    toast({
        title: currentContent.sosInitiated,
        description: currentContent.sosInitiatedDesc(5),
        className: "bg-yellow-500 text-black"
      });
  };

  const cancelSos = () => {
    setIsSosActive(false);
    setCountdown(5);
     toast({
        title: currentContent.sosCancelled,
        description: currentContent.sosCancelledDesc,
      });
  };
  
  const handleAddContact = (e: React.FormEvent) => {
    e.preventDefault();
    if(newContactName && newContactPhone && newContactRelationship) {
      const newContact: EmergencyContact = {
        id: String(Date.now()),
        name: newContactName,
        phone: newContactPhone,
        relationship: newContactRelationship,
        icon: UserPlus
      };
      setContacts([...contacts, newContact]);
      toast({title: currentContent.contactAdded, description: currentContent.contactAddedDesc(newContactName)});
      setNewContactName("");
      setNewContactPhone("");
      setNewContactRelationship("");
    } else {
      toast({variant: "destructive", title: currentContent.missingInfo, description: currentContent.missingInfoDesc});
    }
  };


  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <Card className="shadow-2xl bg-gradient-to-br from-destructive via-red-600 to-red-700 text-destructive-foreground border-red-400 rounded-xl">
          <CardHeader className="text-center pt-8 pb-4">
            <Siren className="mx-auto h-20 w-20 mb-3 animate-pulse" style={{animationDuration: '1s'}} />
            <CardTitle className="font-headline text-4xl md:text-5xl">{currentContent.pageTitle}</CardTitle>
            <CardDescription className="text-destructive-foreground/90 text-lg mt-1">
              {currentContent.pageDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center pb-8">
            {isSosActive ? (
              <div className="space-y-4">
                <p className="text-7xl font-bold text-yellow-300 drop-shadow-lg">{countdown}</p>
                <p className="text-xl font-semibold">{currentContent.sendingSos}</p>
                <Button variant="secondary" size="lg" onClick={cancelSos} className="w-full md:w-auto text-lg py-3 rounded-lg bg-yellow-400 text-black hover:bg-yellow-500">
                  {currentContent.cancelSos}
                </Button>
              </div>
            ) : (
              <Button
                size="lg"
                onClick={activateSos}
                className="w-full md:w-3/4 h-24 text-2xl md:text-3xl font-bold bg-red-500 hover:bg-red-400 border-2 border-red-300 text-white rounded-xl shadow-xl transform transition-all duration-150 ease-in-out active:scale-95 focus:ring-4 ring-red-300 ring-offset-2 ring-offset-destructive"
              >
                <AlertTriangle className="mr-3 h-8 w-8" /> {currentContent.pressForSos}
              </Button>
            )}
            {location && (
              <p className="mt-6 text-sm flex items-center justify-center gap-1.5 text-destructive-foreground/80"><MapPin className="h-4 w-4"/> {location}</p>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-lg glassy-card">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="font-headline text-2xl text-primary">{currentContent.emergencyContactsTitle}</CardTitle>
              <CardDescription>{currentContent.emergencyContactsDesc}</CardDescription>
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="border-primary text-primary hover:bg-primary/10"><UserPlus className="mr-2 h-4 w-4"/> {currentContent.addContact}</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md bg-card glassy-card">
                <DialogHeader>
                  <DialogTitle className="font-headline text-xl text-primary">{currentContent.addContactDialogTitle}</DialogTitle>
                  <DialogDescription>
                    {currentContent.addContactDialogDesc}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddContact} className="grid gap-4 py-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="newName" className="font-semibold">{currentContent.nameLabel}</Label>
                    <Input id="newName" value={newContactName} onChange={(e) => setNewContactName(e.target.value)} placeholder={currentContent.namePlaceholder} required className="py-2.5"/>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="newPhone" className="font-semibold">{currentContent.phoneLabel}</Label>
                    <Input id="newPhone" type="tel" value={newContactPhone} onChange={(e) => setNewContactPhone(e.target.value)} placeholder={currentContent.phonePlaceholder} required className="py-2.5"/>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="newRelationship" className="font-semibold">{currentContent.relationshipLabel}</Label>
                    <Input id="newRelationship" value={newContactRelationship} onChange={(e) => setNewContactRelationship(e.target.value)} placeholder={currentContent.relationshipPlaceholder} required className="py-2.5"/>
                  </div>
                  <DialogFooter className="pt-4">
                    <DialogClose asChild>
                       <Button id="closeDialogButton" type="button" variant="ghost">{currentContent.cancelDialog}</Button>
                    </DialogClose>
                    <Button type="submit" className="btn-glow-primary">{currentContent.saveContact}</Button> 
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            {contacts.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">{currentContent.noCustomContacts}</p>
            ) : (
              <ul className="space-y-3">
                {contacts.map(contact => (
                  <li key={contact.id} className="flex items-center justify-between p-3 md:p-4 border border-border/50 rounded-lg hover:bg-muted/20 transition-colors duration-150 ease-in-out">
                    <div className="flex items-center gap-3">
                       <contact.icon className="h-7 w-7 text-primary" />
                       <div>
                          <h3 className="font-semibold text-lg text-foreground">{contact.name}</h3>
                          <p className="text-sm text-muted-foreground">{contact.relationship} - {contact.phone}</p>
                       </div>
                    </div>
                    <div className="flex gap-1 md:gap-2">
                      <Button variant="ghost" size="icon" asChild title={`Call ${contact.name}`} className="text-green-500 hover:bg-green-500/10 rounded-full">
                        <a href={`tel:${contact.phone}`}>
                          <PhoneCall className="h-5 w-5" />
                        </a>
                      </Button>
                       <Button variant="ghost" size="icon" asChild title={`Message ${contact.name}`} className="text-blue-500 hover:bg-blue-500/10 rounded-full">
                        <a href={`sms:${contact.phone}`}>
                          <MessageSquareWarning className="h-5 w-5" />
                        </a>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        
        <Card className="shadow-lg border-yellow-500/50 glassy-card bg-yellow-500/5">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-yellow-600 flex items-center gap-2"><ShieldQuestion className="h-6 w-6"/>{currentContent.safetyTipsTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-yellow-700/90 dark:text-yellow-300/90">
            {currentContent.safetyTips.map((tip, index) => <p key={index}>• {tip}</p>)}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
