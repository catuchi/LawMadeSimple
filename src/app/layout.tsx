import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
import { AuthProvider } from '@/components/auth/auth-provider';
import { Toaster } from '@/components/ui/sonner';
import { SkipLink } from '@/components/ui/skip-link';
import { CookieConsent } from '@/components/ui/cookie-consent';
import './globals.css';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const lora = Lora({
  variable: '--font-lora',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LawMadeSimple - Nigerian Law Made Easy',
  description:
    'Democratizing Nigerian law by translating legal jargon into plain, easy-to-understand language with practical examples.',
  keywords: ['Nigerian law', 'legal rights', 'law explanation', 'legal help', 'Nigeria'],
  authors: [{ name: 'LawMadeSimple' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  openGraph: {
    title: 'LawMadeSimple - Nigerian Law Made Easy',
    description:
      'Democratizing Nigerian law by translating legal jargon into plain, easy-to-understand language.',
    type: 'website',
    locale: 'en_NG',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${lora.variable} antialiased`}>
        <SkipLink />
        <AuthProvider>{children}</AuthProvider>
        <Toaster position="top-right" />
        <CookieConsent />
      </body>
    </html>
  );
}
