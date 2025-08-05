
"use client";

import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Palette, Search, Filter, Heart, Eye } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface Nganya {
  id: string;
  name: string;
  theme_ENG: string;
  theme_KSW: string;
  sacco_ENG: string;
  sacco_KSW: string;
  route_ENG: string;
  route_KSW: string;
  features_ENG: string[];
  features_KSW: string[];
  image: string;
  imageHint: string;
  artist?: string;
  dj?: string;
  likes: number;
}

export default function NganyaGalleryPage() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [nganyas, setNganyas] = useState<Nganya[]>([]);

  useEffect(() => {
    // Simulate fetching data
    setIsLoading(true);
    setTimeout(() => {
      // In a real app, this would be an API call.
      // For now, we set it to an empty array.
      setNganyas([]);
      setIsLoading(false);
    }, 1000);
  }, []);

  const content = {
    ENG: {
      pageTitle: "Nganya Showcase",
      pageDescription: "Explore the vibrant art, themes, and unique vibes of Kenya's iconic Nganyas.",
      searchPlaceholder: "Search Nganyas by name, route, sacco...",
      filterButton: "Filter",
      likes: "Likes",
      byArtist: "Art by:",
      residentDJ: "Resident DJ:",
      features: "Features:",
      bookThisNganya: "Book This Nganya",
      viewDetails: "View Details",
      noNganyasFound: "No Nganyas match your search. Try different keywords!",
    },
    KSW: {
      pageTitle: "Maonyesho ya Nganya",
      pageDescription: "Gundua sanaa maridadi, mandhari, na vibe za kipekee za Nganya maarufu za Kenya.",
      searchPlaceholder: "Tafuta Nganya kwa jina, njia, sacco...",
      filterButton: "Chuja",
      likes: "Zilizopendwa",
      byArtist: "Sanaa na:",
      residentDJ: "DJ Mkazi:",
      features: "Vipengele:",
      bookThisNganya: "Agiza Nganya Hii",
      viewDetails: "Tazama Maelezo",
      noNganyasFound: "Hakuna Nganya zinazolingana na utafutaji wako. Jaribu maneno mengine!",
    }
  };
  const currentContent = content[language];

  const filteredNganyas = nganyas.filter(nganya => {
    const lowerSearch = searchTerm.toLowerCase();
    return (
      nganya.name.toLowerCase().includes(lowerSearch) ||
      (language === 'ENG' ? nganya.sacco_ENG : nganya.sacco_KSW).toLowerCase().includes(lowerSearch) ||
      (language === 'ENG' ? nganya.route_ENG : nganya.route_KSW).toLowerCase().includes(lowerSearch) ||
      (language === 'ENG' ? nganya.theme_ENG : nganya.theme_KSW).toLowerCase().includes(lowerSearch)
    );
  });

  const renderLoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="shadow-lg glassy-card overflow-hidden">
            <Skeleton className="h-48 w-full"/>
            <CardContent className="p-4 space-y-2">
                <Skeleton className="h-6 w-2/3"/>
                <Skeleton className="h-4 w-1/2"/>
                <Skeleton className="h-4 w-full"/>
                <div className="flex gap-2 pt-2">
                    <Skeleton className="h-8 w-1/2"/>
                    <Skeleton className="h-8 w-1/2"/>
                </div>
            </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <AppLayout>
      <div className="space-y-8 animate-fade-in">
        <Card className="shadow-xl glassy-card overflow-hidden">
          <CardHeader className="p-0 relative">
            <Image src="/images/gallery/banner.png" data-ai-hint="matatu fleet colorful" alt="Nganya Gallery Banner" width={800} height={250} className="w-full h-40 md:h-56 object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6">
              <CardTitle className="font-headline text-3xl md:text-4xl text-white drop-shadow-lg flex items-center gap-2">
                <Palette className="h-8 w-8" /> {currentContent.pageTitle}
              </CardTitle>
              <CardDescription className="text-gray-200 text-lg mt-1">{currentContent.pageDescription}</CardDescription>
            </div>
          </CardHeader>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
            <div className="relative w-full sm:flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    type="search" 
                    placeholder={currentContent.searchPlaceholder}
                    className="pl-11 text-base py-3 rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    aria-label={currentContent.searchPlaceholder}
                />
            </div>
            <Button variant="outline" className="w-full sm:w-auto text-base py-3 rounded-lg border-primary text-primary hover:bg-primary/10"><Filter className="mr-2 h-4 w-4"/> {currentContent.filterButton}</Button>
        </div>

        {isLoading ? renderLoadingSkeleton() : filteredNganyas.length === 0 ? (
          <Card className="glassy-card text-center py-12">
            <Palette className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4"/>
            <p className="text-xl text-muted-foreground">{currentContent.noNganyasFound}</p>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNganyas.map(nganya => (
              <Card key={nganya.id} className="shadow-lg glassy-card overflow-hidden group transform transition-all hover:shadow-2xl hover:-translate-y-1.5 hover:border-primary">
                <CardHeader className="p-0 relative">
                  <Image src={nganya.image} alt={nganya.name} data-ai-hint={nganya.imageHint} width={600} height={400} className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md text-xs font-semibold flex items-center gap-1">
                    <Heart className="h-3 w-3 fill-red-500 text-red-500"/> {nganya.likes.toLocaleString()}
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <CardTitle className="font-headline text-2xl text-primary group-hover:text-accent transition-colors">{nganya.name}</CardTitle>
                  <CardDescription className="text-sm font-semibold">"{language === 'ENG' ? nganya.theme_ENG : nganya.theme_KSW}"</CardDescription>
                  <p className="text-sm text-muted-foreground mt-1">{language === 'ENG' ? nganya.route_ENG : nganya.route_KSW} • {language === 'ENG' ? nganya.sacco_ENG : nganya.sacco_KSW}</p>
                  
                  {nganya.artist && <p className="text-xs text-muted-foreground mt-2">{currentContent.byArtist} <span className="font-medium text-foreground">{nganya.artist}</span></p>}
                  {nganya.dj && <p className="text-xs text-muted-foreground">{currentContent.residentDJ} <span className="font-medium text-foreground">{nganya.dj}</span></p>}

                  <div className="mt-3">
                    <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">{currentContent.features}</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {(language === 'ENG' ? nganya.features_ENG : nganya.features_KSW).map(feature => (
                        <Badge key={feature} variant="secondary" className="text-xs bg-primary/10 text-primary/90 border-primary/20">{feature}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" className="flex-1 btn-glow-primary text-sm">{currentContent.bookThisNganya}</Button>
                    <Button size="sm" variant="outline" className="text-sm border-primary text-primary hover:bg-primary/10"><Eye className="mr-1.5 h-4 w-4"/>{currentContent.viewDetails}</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
