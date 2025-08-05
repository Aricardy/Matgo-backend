
"use client";

import { Button } from "@/components/ui/button";
import Header from "@/components/layout/Header";
import MatGoIcon from "@/components/icons/MatGoIcon";
import Link from "next/link";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown, User, Briefcase, Building } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const backgroundImages = [
  { src: "/images/landing/bg_1.png", alt: "Nganya Art 1", hint: "matatu graffiti" },
  { src: "/images/landing/bg_2.png", alt: "Matatu Vibes 1", hint: "bus side" },
  { src: "/images/landing/bg_3.png", alt: "City Bus 1", hint: "urban transport" },
  { src: "/images/landing/bg_4.png", alt: "Nganya Interior 1", hint: "matatu interior" },
  { src: "/images/landing/bg_5.png", alt: "Matatu Route 1", hint: "street scene" },
  { src: "/images/landing/bg_6.png", alt: "Nganya Art 2", hint: "matatu colorful" },
  { src: "/images/landing/bg_7.png", alt: "Matatu Vibes 2", hint: "bus front" },
  { src: "/images/landing/bg_8.png", alt: "City Bus 2", hint: "public transport" },
  { src: "/images/landing/bg_9.png", alt: "Nganya Interior 2", hint: "bus seats" },
  { src: "/images/landing/bg_10.png", alt: "Matatu Route 2", hint: "kenya road" },
  { src: "/images/landing/bg_11.png", alt: "Nganya Art 3", hint: "graffiti bus" },
  { src: "/images/landing/bg_12.png", alt: "Matatu Vibes 3", hint: "urban matatu" },
  { src: "/images/landing/bg_13.png", alt: "City Bus 3", hint: "city transport" },
  { src: "/images/landing/bg_14.png", alt: "Nganya Interior 3", hint: "colorful seats" },
  { src: "/images/landing/bg_15.png", alt: "Matatu Route 3", hint: "nairobi street" },
];

// Looping multiple times to ensure enough images for a long scroll effect
const loopedImages = [...backgroundImages, ...backgroundImages, ...backgroundImages, ...backgroundImages, ...backgroundImages, ...backgroundImages];


export default function LandingPage() {
  const { language } = useLanguage();

  const content = {
    ENG: {
      title: "MatGo",
      headline: "Pay for your trip & track on the go",
      tagline: "Experience Kenya's matatu culture like never before. Real-time tracking, seamless payments, and nganya vibes!",
      feature1Title: "Vibrant Tracking",
      feature1Desc: "Pinpoint your matatu in real-time. No more guessing!",
      feature2Title: "Easy Payments",
      feature2Desc: "Tap to pay with M-Pesa. Secure, fast, and digital receipts.",
      feature3Title: "Nganya Culture",
      feature3Desc: "Immerse yourself in the unique, bold style of Kenya's iconic matatus.",
      signUp: "Sign Up",
      login: "Login",
      passenger: "Passenger",
      crew: "Driver / Conductor",
      sacco: "SACCO Admin",
      footer: `© ${new Date().getFullYear()} MatGo. Safari Salama! Ride with Style.`
    },
    KSW: {
      title: "MatGo",
      headline: "Lipa nauli & fuatilia gari lako popote",
      tagline: "Furahia utamaduni wa matatu Kenya kama hujawahi ona. Ufuatiliaji wa moja kwa moja, malipo rahisi, na vibe za nganya!",
      feature1Title: "Ufuatiliaji Murwa",
      feature1Desc: "Jua gari lako lilipo kwa wakati halisi. Hakuna kubahatisha!",
      feature2Title: "Malipo Rahisi",
      feature2Desc: "Gusa kulipa na M-Pesa. Salama, haraka, na risiti dijitali.",
      feature3Title: "Utamaduni wa Nganya",
      feature3Desc: "Jitumbukize katika mtindo wa kipekee na wa kijasiri wa nganya za Kenya.",
      signUp: "Jisajili",
      login: "Ingia",
      passenger: "Abiria",
      crew: "Dereva / Kondakta",
      sacco: "Msimamizi wa SACCO",
      footer: `© ${new Date().getFullYear()} MatGo. Safari Salama! Endesha kwa Mtindo.`
    }
  };

  const currentContent = content[language];


  return (
    <div className="flex min-h-screen flex-col">
      <div className="animated-bg-container">
        <div className="animated-bg-collage">
          {loopedImages.map((image, index) => (
            <Image
              key={`${image.alt}-${index}`}
              src={image.src}
              alt={image.alt}
              data-ai-hint={image.hint}
              width={300} 
              height={200}
              className="object-cover" 
              priority={index < 15} 
            />
          ))}
        </div>
        <div className="bg-overlay"></div> 
      </div>
      
      <Header /> 

      <main className="flex flex-1 flex-col items-center justify-center p-6 text-center relative z-10">
        <div className="relative mb-8 animate-fade-in animation-delay-[500ms]">
          <MatGoIcon className="mx-auto h-32 w-32 text-primary nganya-flash" style={{ animationDuration: '2s' }}/>
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-48 w-48 animate-ping rounded-full bg-primary/20 opacity-75"></div>
          </div>
        </div>
        
        <h1 className="font-headline text-5xl font-extrabold tracking-tight text-primary sm:text-6xl md:text-7xl lg:text-8xl animate-fade-in animation-delay-[700ms]">
          {currentContent.title}
        </h1>
        <p className="mt-6 max-w-3xl text-xl text-white sm:text-2xl md:text-3xl font-headline animate-fade-in animation-delay-[900ms]">
          {currentContent.headline}
        </p>
        <p className="mt-4 max-w-2xl text-md text-gray-200 sm:text-lg animate-fade-in animation-delay-[1100ms]">
          {currentContent.tagline}
        </p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:justify-center animate-fade-in animation-delay-[1300ms]">
          <Button asChild size="lg" className="font-bold text-lg px-10 py-7 transition-transform hover:scale-105 btn-glow-primary">
            <Link href="/signup">{currentContent.signUp}</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="font-bold text-lg px-10 py-7 transition-transform hover:scale-105 border-primary text-primary hover:bg-primary/10 hover:text-primary btn-glow-primary">
            <Link href="/login">{currentContent.login}</Link>
          </Button>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full animate-fade-in animation-delay-[1500ms]">
          {[
            { title: currentContent.feature1Title, desc: currentContent.feature1Desc, hint: "map location" },
            { title: currentContent.feature2Title, desc: currentContent.feature2Desc, hint: "mobile payment" },
            { title: currentContent.feature3Title, desc: currentContent.feature3Desc, hint: "matatu art" }
          ].map(feature => (
            <div
              key={feature.title}
              className="p-6 rounded-xl transform transition-all hover:shadow-primary/30 hover:shadow-2xl hover:-translate-y-1.5"
              style={{
                background: 'rgba(0,0,0,0.4)',
                color: '#fff',
                boxShadow: '0 2px 16px 0 rgba(0,0,0,0.10)',
                backdropFilter: 'blur(2px)',
              }}
            >
              <h3 className="font-headline text-2xl mb-2" style={{ color: '#fff' }}>{feature.title}</h3>
              <p className="text-sm" style={{ color: '#fff' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </main>
      <footer className="py-6 text-center text-sm text-muted-foreground/80 relative z-10">
        {currentContent.footer}
      </footer>
    </div>
  );
}
