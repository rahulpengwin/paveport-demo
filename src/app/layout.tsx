import type { Metadata } from 'next';
import './globals.css';
import { DemoHeader } from '@/components/common/DemoHeader';
import { GuidedTourDrawer } from '@/components/common/GuidedTourDrawer';

export const metadata: Metadata = {
  title: 'PavePort — Construction Commerce & Delivery Operations Platform',
  description:
    'Full-scale digital marketplace and operations platform for construction materials, connecting suppliers, contractors, customers, and heavy delivery logistics.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-charcoal-950 text-slate-100 antialiased selection:bg-construction-500 selection:text-charcoal-950">
        <DemoHeader />
        <GuidedTourDrawer />
        {children}
      </body>
    </html>
  );
}

