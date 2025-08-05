
"use client";

import type { Dispatch, ReactNode, SetStateAction } from 'react';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type Language = 'ENG' | 'KSW';

interface LanguageContextType {
  language: Language;
  setLanguage: Dispatch<SetStateAction<Language>>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ENG'); // Default language

  useEffect(() => {
    // On initial load, try to get language from localStorage
    const storedLanguage = localStorage.getItem('matgo-language') as Language | null;
    if (storedLanguage && (storedLanguage === 'ENG' || storedLanguage === 'KSW')) {
      setLanguage(storedLanguage);
    }
  }, []);

  useEffect(() => {
    // When language changes, update localStorage
    localStorage.setItem('matgo-language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
