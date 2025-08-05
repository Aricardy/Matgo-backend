
"use client";

import type { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import SplashScreen from '@/components/layout/SplashScreen';
import { LanguageProvider } from '@/contexts/LanguageContext';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <LanguageProvider>
        <SplashScreen />
        {children}
        <Toaster />
      </LanguageProvider>
    </ThemeProvider>
  );
}
