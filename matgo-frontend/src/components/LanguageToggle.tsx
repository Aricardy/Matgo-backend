
"use client";

import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, type Language } from '@/contexts/LanguageContext';

export default function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  const switchLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" aria-label={`Change language, current: ${language}`}>
          <Languages className="h-5 w-5" />
           <span className="sr-only">Change language, current: {language}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => switchLanguage("ENG")}>
          English {language === "ENG" && <span className="ml-2 text-primary">✓</span>}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => switchLanguage("KSW")}>
          Kiswahili {language === "KSW" && <span className="ml-2 text-primary">✓</span>}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
