// app/home/simpleLayout.tsx
import Navbar from '@/components/navbar';
import React from 'react';
import NavigationBarFooter from './navigation-bar-footer';
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
        {/* <nav className="absolute flex items-center justify-between px-4 py-2">
          <div className={`${cn('block lg:!hidden')} z-50`}>
            <MobileSidebar />
          </div>
        </nav> */}
        <Navbar />
        <div className="p-4">
          {children} {/* Display the content of the child pages */}
        </div>
        <NavigationBarFooter />
      </main>
    </div>
  );
}
