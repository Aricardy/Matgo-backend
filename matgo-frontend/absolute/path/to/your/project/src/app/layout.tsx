
import type { Metadata, Viewport } from 'next';
import './globals.css';
import Providers from './providers';

export const metadata: Metadata = {
  title: 'MatGo: Kenyan Matatu & Bus System',
  description: 'MatGo - Pay for your trip & track on the go! Real-time fare payment, seat booking, and tracking for Kenya\'s matatus.',
  manifest: '/manifest.json',
  icons: { 
    apple: '/icons/icon-152x152.png',
    icon: '/favicon.ico',
    shortcut: '/favicon.ico'
  },
  openGraph: {
    title: 'MatGo: Kenyan Matatu & Bus System',
    description: 'The future of Kenyan public transport. Pay, track, and book your rides seamlessly.',
    url: 'https://matgo.example.com',
    siteName: 'MatGo',
    images: [
      {
        url: 'https://matgo.example.com/og-image.png',
        width: 1200,
        height: 630,
        alt: 'MatGo App Showcase',
      },
    ],
    locale: 'en_KE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MatGo: Kenyan Matatu & Bus System',
    description: 'The future of Kenyan public transport. Pay, track, and book your rides seamlessly.',
    images: ['https://matgo.example.com/og-image.png'],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'hsl(195 96% 70%)' },
    { media: '(prefers-color-scheme: dark)', color: 'hsl(240 6% 10%)' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, 
  userScalable: false, 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Belleza&display=swap" rel="stylesheet" />
        <meta name="application-name" content="MatGo" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="MatGo" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#47D1FF" />
        <meta name="msapplication-tap-highlight" content="no" />
      </head>
      <body className="font-body antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
