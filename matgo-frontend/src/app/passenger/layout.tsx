import React from 'react';
import { SessionProvider } from '../../contexts/SessionContext';

export default function PassengerLayout({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
