// app/home/simpleLayout.tsx
import Navbar from '@/components/layout/navbar';
import React from 'react';
import NavigationBarFooter from './navigation-bar-footer';
import MobileNavigation from './mobile-navigation';
// import { MobileSidebar } from './mobile-sidebar';
// import { cn } from '@/lib/utils';

export default function SimpleLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#E5E4DB]">
      <main className="w-full flex-1 overflow-auto">
        <Navbar />
        <div className="p-4">{children}</div>
        <NavigationBarFooter />
        <MobileNavigation />
      </main>
    </div>
  );
}
