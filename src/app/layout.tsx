import type { Metadata } from 'next';
import { Inter, Lora } from 'next/font/google';
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
      <body className={`${inter.variable} ${lora.variable} antialiased`}>{children}</body>
    </html>
  );
}
