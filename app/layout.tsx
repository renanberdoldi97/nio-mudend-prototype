import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';
import { SessionInit } from './session-init';
import { DeadClickTracker } from './dead-click-tracker';
import { OnboardingGate } from '@/components/ui/OnboardingGate';
import './globals.css';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-plus-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Nio',
  description: 'Protótipo de Mudança de Endereço — Nio Internet',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#192B1C',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={plusJakarta.variable}>
      <body className="antialiased">
        <SessionInit />
        <DeadClickTracker />
        <div className="mx-auto w-full max-w-[430px] h-[100dvh] bg-white relative overflow-clip">
          <OnboardingGate>{children}</OnboardingGate>
        </div>
      </body>
    </html>
  );
}
