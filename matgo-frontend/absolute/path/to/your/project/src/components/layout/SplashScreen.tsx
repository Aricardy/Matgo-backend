"use client";

import { useState, useEffect } from 'react';
import MatGoIcon from '@/components/icons/MatGoIcon'; 

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 2800); // Slightly longer splash screen for effect

    return () => clearTimeout(timer);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background animate-fade-out animation-delay-[2200ms]">
      <div className="animate-fade-in text-center">
        <MatGoIcon className="h-28 w-28 md:h-32 md:w-32 text-primary nganya-flash" style={{ animationDuration: '1.5s' }} />
        <h1 className="mt-6 text-5xl md:text-6xl font-headline text-primary nganya-flash" style={{ animationDuration: '2s', animationDelay: '0.2s' }}>MatGo</h1>
        <p className="mt-3 text-lg md:text-xl text-foreground/80 tracking-wider">Loading Your Nganya Adventure...</p>
      </div>
       {/* Optional: Add a subtle loading bar or animation here */}
       <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-1/3 max-w-xs h-1.5 bg-primary/20 rounded-full overflow-hidden">
        <div className="h-full bg-primary animate-pulse" style={{ animationDuration: '2s', width: '70%' }}></div> {/* Simulate loading progress */}
      </div>
    </div>
  );
}
