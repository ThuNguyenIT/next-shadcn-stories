// app/home/simpleLayout.tsx
import Navbar from '@/components/navbar';
import React from 'react';
import NavigationBarFooter from './navigation-bar-footer';

export default function SimpleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-[#E5E4DB]">
            <main className="w-full flex-1 overflow-auto">
                <Navbar />
                <div className="p-4">
                    {children} {/* Display the content of the child pages */}
                </div>
                <NavigationBarFooter />
            </main>
        </div>
    );
}
