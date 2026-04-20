import type { Metadata } from "next";
import "./globals.css";
import { SidebarNav, MobileNav } from "@/components/layout/sidebar-nav";
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "PSN - QR Attendance",
  description: "Attendance monitoring system for PSN",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased bg-background" suppressHydrationWarning>
        <div className="h-full relative flex flex-col md:flex-row">
          <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80]">
            <SidebarNav />
          </div>
          <main className="flex-1 md:pl-72 min-h-screen">
            <MobileNav />
            <div className="p-4 md:p-8 max-w-7xl mx-auto pb-20 md:pb-8">
              {children}
            </div>
          </main>
        </div>
        <Toaster />
      </body>
    </html>
  );
}