
"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HelpCircle, Search, PackageOpen, PackagePlus, Send, PhoneCall } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface FoundItem {
  id: string;
  itemName_ENG: string;
  itemName_KSW: string;
  description_ENG: string;
  description_KSW: string;
  foundDate: string;
  foundLocation_ENG: string;
  foundLocation_KSW: string;
  sacco_ENG: string;
  sacco_KSW: string;
  image?: string;
  imageHint?: string;
  contactInfo: string;
}


export default function LostFoundPage() {
  const { language } = useLanguage();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  // State for found items, initialized to empty
  const [foundItems, setFoundItems] = useState<FoundItem[]>([]);
  
  // State for form
  const [lostItemName, setLostItemName] = useState("");
  const [lostItemDesc, setLostItemDesc] = useState("");
  const [lostDate, setLostDate] = useState("");
  const [lostRouteBus, setLostRouteBus] = useState("");

  useEffect(() => {
    // Simulate fetching found items
    setIsLoading(true);
    setTimeout(() => {
        // In a real app, this would be an API call
        // For now, we set it to an empty array
        setFoundItems([]);
        setIsLoading(false);
    }, 1000);
  }, []);

  const content = {
    ENG: {
      pageTitle: "Lost & Found",
      pageDescription: "Report a lost item or browse items found in MatGo vehicles.",
      reportLostTab: "Report Lost Item",
      viewFoundTab: "View Found Items",
      reportLostTitle: "Report a Lost Item",
      reportLostDesc: "Please provide details about the item you lost.",
      itemNameLabel: "Item Name",
      itemNamePlaceholder: "e.g., Blue Backpack, iPhone 12",
      itemDescLabel: "Description of Item",
      itemDescPlaceholder: "Color, brand, any distinguishing features...",
      dateLostLabel: "Date Lost (Approx.)",
      routeBusLabel: "Route or Bus (if known)",
      routeBusPlaceholder: "e.g., Ngong Road, Matatu 'Explicit'",
      submitReportButton: "Submit Lost Item Report",
      viewFoundTitle: "Items Found in MatGo Vehicles",
      viewFoundDesc: "Check if your item has been reported found. Contact the respective SACCO.",
      searchFoundPlaceholder: "Search found items...",
      contactSacco: "Contact SACCO",
      noItemsFound: "No items currently reported found matching your search.",
      reportSubmitted: "Report Submitted",
      reportSubmittedDesc: "Your lost item report has been logged. Please also check with the SACCO.",
      missingFields: "Missing Fields",
      missingFieldsDesc: "Please fill in all required fields for the report.",
    },
    KSW: {
      pageTitle: "Vilivyopotea na Kupatikana",
      pageDescription: "Ripoti kitu kilichopotea au tazama vitu vilivyopatikana kwenye magari ya MatGo.",
      reportLostTab: "Ripoti Kitu Kilichopotea",
      viewFoundTab: "Tazama Vilivyopatikana",
      reportLostTitle: "Ripoti Kitu Kilichopotea",
      reportLostDesc: "Tafadhali toa maelezo kuhusu kitu ulichopoteza.",
      itemNameLabel: "Jina la Kitu",
      itemNamePlaceholder: "k.m., Mkoba wa Bluu, iPhone 12",
      itemDescLabel: "Maelezo ya Kitu",
      itemDescPlaceholder: "Rangi, chapa, alama zozote za kutofautisha...",
      dateLostLabel: "Tarehe Iliyopotea (Takriban)",
      routeBusLabel: "Njia au Basi (ikiwa inajulikana)",
      routeBusPlaceholder: "k.m., Barabara ya Ngong, Matatu 'Explicit'",
      submitReportButton: "Wasilisha Ripoti ya Kitu Kilichopotea",
      viewFoundTitle: "Vitu Vilivyopatikana Kwenye Magari ya MatGo",
      viewFoundDesc: "Angalia kama kitu chako kimeripotiwa kupatikana. Wasiliana na SACCO husika.",
      searchFoundPlaceholder: "Tafuta vitu vilivyopatikana...",
      contactSacco: "Wasiliana na SACCO",
      noItemsFound: "Hakuna vitu vilivyoripotiwa kupatikana vinavyolingana na utafutaji wako.",
      reportSubmitted: "Ripoti Imewasilishwa",
      reportSubmittedDesc: "Ripoti yako ya kitu kilichopotea imerekodiwa. Tafadhali pia angalia na SACCO.",
      missingFields: "Sehemu Hazijajazwa",
      missingFieldsDesc: "Tafadhali jaza sehemu zote zinazohitajika kwa ripoti.",
    }
  };
  const currentContent = content[language];

  const handleReportLostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lostItemName || !lostItemDesc || !lostDate) {
        toast({ variant: "destructive", title: currentContent.missingFields, description: currentContent.missingFieldsDesc });
        return;
    }
    // Mock submission
    toast({ title: currentContent.reportSubmitted, description: currentContent.reportSubmittedDesc, className: "bg-green-500 text-white" });
    setLostItemName("");
    setLostItemDesc("");
    setLostDate("");
    setLostRouteBus("");
  };

  const renderLoadingSkeleton = () => (
    <div className="space-y-4">
        <Skeleton className="h-40 w-full"/>
        <Skeleton className="h-40 w-full"/>
        <Skeleton className="h-40 w-full"/>
    </div>
  );

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <Card className="shadow-xl glassy-card">
          <CardHeader className="p-6">
            <CardTitle className="font-headline text-3xl md:text-4xl text-primary flex items-center gap-3">
              <HelpCircle className="h-10 w-10" /> {currentContent.pageTitle}
            </CardTitle>
            <CardDescription className="text-base mt-1">
              {currentContent.pageDescription}
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="reportLost" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 rounded-lg bg-muted/60 p-1">
            <TabsTrigger value="reportLost" className="text-base py-2.5 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
                <PackagePlus className="mr-2 h-5 w-5"/> {currentContent.reportLostTab}
            </TabsTrigger>
            <TabsTrigger value="viewFound" className="text-base py-2.5 rounded-md data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-md">
                <PackageOpen className="mr-2 h-5 w-5"/> {currentContent.viewFoundTab}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="reportLost">
            <Card className="shadow-lg glassy-card">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-accent">{currentContent.reportLostTitle}</CardTitle>
                <CardDescription>{currentContent.reportLostDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReportLostSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="lostItemName" className="font-semibold text-base">{currentContent.itemNameLabel}*</Label>
                    <Input id="lostItemName" value={lostItemName} onChange={e => setLostItemName(e.target.value)} placeholder={currentContent.itemNamePlaceholder} required className="mt-1 text-base py-3 rounded-lg"/>
                  </div>
                  <div>
                    <Label htmlFor="lostItemDesc" className="font-semibold text-base">{currentContent.itemDescLabel}*</Label>
                    <Textarea id="lostItemDesc" value={lostItemDesc} onChange={e => setLostItemDesc(e.target.value)} placeholder={currentContent.itemDescPlaceholder} required rows={4} className="mt-1 text-base py-3 rounded-lg"/>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                        <Label htmlFor="lostDate" className="font-semibold text-base">{currentContent.dateLostLabel}*</Label>
                        <Input id="lostDate" type="date" value={lostDate} onChange={e => setLostDate(e.target.value)} required className="mt-1 text-base py-3 rounded-lg"/>
                    </div>
                    <div>
                        <Label htmlFor="lostRouteBus" className="font-semibold text-base">{currentContent.routeBusLabel}</Label>
                        <Input id="lostRouteBus" value={lostRouteBus} onChange={e => setLostRouteBus(e.target.value)} placeholder={currentContent.routeBusPlaceholder} className="mt-1 text-base py-3 rounded-lg"/>
                    </div>
                  </div>
                  <Button type="submit" size="lg" className="w-full text-lg py-3 rounded-lg btn-glow-primary">
                    <Send className="mr-2 h-5 w-5" /> {currentContent.submitReportButton}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="viewFound">
            <Card className="shadow-lg glassy-card">
              <CardHeader>
                <CardTitle className="font-headline text-2xl text-accent">{currentContent.viewFoundTitle}</CardTitle>
                <CardDescription>{currentContent.viewFoundDesc}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                    <Input type="search" placeholder={currentContent.searchFoundPlaceholder} className="text-base py-3 rounded-lg pl-10"/>
                    <Search className="absolute left-3 top-1/2 h-5 w-5 text-muted-foreground -translate-y-1/2 pointer-events-none ml-1 mt-[22px] sm:mt-0"/>
                </div>
                {isLoading ? renderLoadingSkeleton() : foundItems.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">{currentContent.noItemsFound}</p>
                ) : (
                    <div className="space-y-4">
                        {foundItems.map(item => (
                            <Card key={item.id} className="glassy-card border-primary/20 overflow-hidden">
                                <div className="grid grid-cols-1 md:grid-cols-3">
                                    {item.image && (
                                        <div className="md:col-span-1 p-2">
                                            <Image src={item.image} alt={language === 'ENG' ? item.itemName_ENG : item.itemName_KSW} data-ai-hint={item.imageHint || "found item"} width={300} height={200} className="w-full h-32 md:h-full object-cover rounded-md"/>
                                        </div>
                                    )}
                                    <div className={item.image ? "md:col-span-2 p-4" : "col-span-full p-4"}>
                                        <h3 className="font-semibold text-lg text-primary">{language === 'ENG' ? item.itemName_ENG : item.itemName_KSW}</h3>
                                        <p className="text-sm text-muted-foreground">{language === 'ENG' ? item.description_ENG : item.description_KSW}</p>
                                        <p className="text-xs mt-1"><strong>{language === 'ENG' ? "Found:" : "Ilipatikana:"}</strong> {item.foundDate} @ {language === 'ENG' ? item.foundLocation_ENG : item.foundLocation_KSW}</p>
                                        <p className="text-xs"><strong>SACCO:</strong> {language === 'ENG' ? item.sacco_ENG : item.sacco_KSW}</p>
                                        <Button size="sm" variant="outline" className="mt-2 text-xs border-accent text-accent hover:bg-accent/10">
                                            <PhoneCall className="mr-1.5 h-3 w-3"/> {currentContent.contactSacco}: {item.contactInfo.split(':')[1]?.trim() || item.contactInfo}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
