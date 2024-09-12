import Header from '@/components/header/header';
import type { Metadata } from 'next';
import Navbar from '@/components/navbar';
import Footer from '@/components/layout/footer';
import Head from 'next/head';

export const metadata: Metadata = {
  title: 'Next Shadcn Dashboard Starter',
  description: 'Basic dashboard with Next.js and Shadcn'
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <Head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;700&display=swap"
        />
      </Head>
      <main className="w-full flex-1 overflow-auto">
        <Header />
        <Navbar />
        <div className="p-4">
          {children} {/* Hiển thị nội dung của các trang con */}
        </div>
        <Footer />
      </main>
    </div>
  );
}
