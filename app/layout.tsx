import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Sidebar } from './components/Sidebar';
import { ToastProvider } from './components/ui/toast';
import TopProgress from '@/app/top-progress';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Task Management Dashboard',
  description: 'A modern task management application built with Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-900 text-white`}>
        <ToastProvider>
          <TopProgress />
          <div className="flex h-screen bg-gray-900">
            <Sidebar />
            <main className="flex-1 overflow-auto bg-gray-800">
              <div className="p-8">{children}</div>
            </main>
          </div>
        </ToastProvider>
      </body>
    </html>
  );
}
