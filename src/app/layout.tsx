import type { Metadata } from 'next';
import { DM_Sans, Bebas_Neue, Permanent_Marker } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/ClientLayout';

const dmSans = DM_Sans({
  variable: '--font-dm-sans',
  subsets: ['latin'],
});

const bebasNeue = Bebas_Neue({
  variable: '--font-bebas-neue',
  weight: '400',
  subsets: ['latin'],
});

const permanentMarker = Permanent_Marker({
  variable: '--font-permanent-marker',
  weight: '400',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'KASHKAT — Stems for the Cool Cats',
  description:
    'The underground marketplace for premium audio stems. Browse, preview, and cop stems crafted by independent producers worldwide.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${dmSans.variable} ${bebasNeue.variable} ${permanentMarker.variable} antialiased bg-background text-foreground`}
      >
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
