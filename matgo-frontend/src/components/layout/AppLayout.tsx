
import type { ReactNode } from 'react';
import Header from './Header';
import BottomNav from './BottomNav';

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 container py-6 md:py-8 pb-24 md:pb-28">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
